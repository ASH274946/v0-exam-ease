"use server"

import { readFile } from "fs/promises"
import path from "path"
import { prisma } from "@/lib/db"
import { getOrCreateSession } from "@/lib/session"
import { revalidatePath } from "next/cache"

// Text extraction utilities
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import for pdf-parse
    const pdfParse = (await import("pdf-parse")).default
    const data = await pdfParse(buffer)
    return data.text || ""
  } catch (error) {
    console.error("PDF extraction error:", error)
    return ""
  }
}

async function extractTextFromTXT(buffer: Buffer): Promise<string> {
  return buffer.toString("utf-8")
}

async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import for mammoth
    const mammoth = await import("mammoth")
    const result = await mammoth.extractRawText({ buffer })
    return result.value || ""
  } catch (error) {
    console.error("DOCX extraction error:", error)
    return ""
  }
}

// Clean and normalize extracted text
function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\t/g, " ")
    .replace(/ {2,}/g, " ")
    .trim()
}

// Extract questions from text using pattern matching
function extractQuestionsFromText(text: string): Array<{
  text: string
  marks?: number
  type: string
  difficulty: string
}> {
  const questions: Array<{
    text: string
    marks?: number
    type: string
    difficulty: string
  }> = []

  // Common question patterns
  const patterns = [
    // "Q1." or "Q.1" or "Question 1"
    /(?:Q(?:uestion)?\.?\s*)?(\d+)[\.\)]\s*(.+?)(?=(?:Q(?:uestion)?\.?\s*)?\d+[\.\)]|$)/gis,
    // "1." or "1)" format
    /^(\d+)[\.\)]\s*(.+?)(?=^\d+[\.\)]|$)/gm,
    // Lines ending with "?" are likely questions
    /^(.+\?)\s*$/gm,
    // Lines with marks pattern like "[5 marks]" or "(5M)"
    /^(.+?)[\[\(]\s*(\d+)\s*(?:marks?|M)\s*[\]\)]/gim,
  ]

  // Extract using marks pattern first (most reliable)
  const marksPattern = /^(.+?)[\[\(]\s*(\d+)\s*(?:marks?|M)\s*[\]\)]/gim
  let match
  while ((match = marksPattern.exec(text)) !== null) {
    const questionText = match[1].trim()
    const marks = parseInt(match[2], 10)
    
    if (questionText.length > 10) {
      questions.push({
        text: questionText,
        marks,
        type: determineQuestionType(questionText, marks),
        difficulty: determineDifficulty(marks),
      })
    }
  }

  // Extract questions by number pattern if no marks-based questions found
  if (questions.length === 0) {
    const numberPattern = /(?:^|\n)(?:Q(?:uestion)?\.?\s*)?(\d+)[\.\)]\s*([^\n]+(?:\n(?!\d+[\.\)]).*)*)/gi
    while ((match = numberPattern.exec(text)) !== null) {
      const questionText = match[2].trim()
      if (questionText.length > 10 && !questionText.match(/^(Answer|Solution|Ans)/i)) {
        questions.push({
          text: questionText,
          type: determineQuestionType(questionText),
          difficulty: "medium",
        })
      }
    }
  }

  // Extract questions ending with "?"
  if (questions.length === 0) {
    const questionMarkPattern = /([A-Z][^.!?\n]*\?)/g
    while ((match = questionMarkPattern.exec(text)) !== null) {
      const questionText = match[1].trim()
      if (questionText.length > 15) {
        questions.push({
          text: questionText,
          type: "short",
          difficulty: "medium",
        })
      }
    }
  }

  // Remove duplicates
  const uniqueQuestions = questions.filter(
    (q, index, self) =>
      index === self.findIndex((t) => t.text.toLowerCase() === q.text.toLowerCase())
  )

  return uniqueQuestions.slice(0, 100) // Limit to 100 questions
}

function determineQuestionType(text: string, marks?: number): string {
  const lowerText = text.toLowerCase()
  
  if (lowerText.includes("choose") || lowerText.includes("select") || lowerText.includes("which of")) {
    return "mcq"
  }
  if (lowerText.includes("calculate") || lowerText.includes("find the value") || lowerText.includes("solve")) {
    return "numerical"
  }
  if (marks && marks >= 8) {
    return "long"
  }
  if (marks && marks <= 2) {
    return "short"
  }
  if (text.length > 200) {
    return "long"
  }
  
  return "short"
}

function determineDifficulty(marks?: number): string {
  if (!marks) return "medium"
  if (marks <= 2) return "easy"
  if (marks >= 8) return "hard"
  return "medium"
}

// Detect topic/unit from text context
function detectTopic(text: string, fullDocText: string): string | null {
  // Look for common unit/chapter indicators before the question
  const textPosition = fullDocText.indexOf(text)
  if (textPosition === -1) return null

  const precedingText = fullDocText.substring(Math.max(0, textPosition - 500), textPosition)
  
  // Look for unit/chapter headers
  const unitMatch = precedingText.match(/(?:Unit|Chapter|Module|Section)\s*[-:]?\s*(\d+)\s*[-:]?\s*([^\n]+)/i)
  if (unitMatch) {
    return unitMatch[2].trim()
  }

  return null
}

export async function processDocument(documentId: string) {
  const sessionId = await getOrCreateSession()

  try {
    // Get document
    const document = await prisma.document.findFirst({
      where: { id: documentId, sessionId },
    })

    if (!document) {
      return { success: false, error: "Document not found" }
    }

    // Update status to processing
    await prisma.document.update({
      where: { id: documentId },
      data: { status: "processing" },
    })

    // Read file
    const fullPath = path.join(process.cwd(), "public", document.filepath)
    const buffer = await readFile(fullPath)

    // Extract text based on file type
    let extractedText = ""
    switch (document.type) {
      case "pdf":
        extractedText = await extractTextFromPDF(buffer)
        break
      case "txt":
        extractedText = await extractTextFromTXT(buffer)
        break
      case "docx":
        extractedText = await extractTextFromDOCX(buffer)
        break
      case "image":
        // OCR would go here - for now, skip images
        extractedText = "[Image content - OCR not available]"
        break
      default:
        extractedText = ""
    }

    extractedText = cleanText(extractedText)

    // Extract questions
    const questions = extractQuestionsFromText(extractedText)

    // Save questions to database
    if (questions.length > 0) {
      await prisma.question.createMany({
        data: questions.map((q) => ({
          text: q.text,
          marks: q.marks,
          type: q.type,
          difficulty: q.difficulty,
          topic: detectTopic(q.text, extractedText),
          sessionId,
          sourceDocId: documentId,
        })),
      })
    }

    // Update document with extracted text and status
    await prisma.document.update({
      where: { id: documentId },
      data: {
        extractedText: extractedText.substring(0, 50000), // Limit storage
        status: "completed",
        processedAt: new Date(),
      },
    })

    revalidatePath("/documents")
    revalidatePath("/questions")

    return {
      success: true,
      extractedText: extractedText.substring(0, 1000),
      questionsFound: questions.length,
    }
  } catch (error) {
    console.error("Processing error:", error)

    // Update document status to failed
    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Processing failed",
      },
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : "Processing failed",
    }
  }
}

export async function processAllPendingDocuments() {
  const sessionId = await getOrCreateSession()

  const pendingDocs = await prisma.document.findMany({
    where: { sessionId, status: "pending" },
  })

  const results = []
  for (const doc of pendingDocs) {
    const result = await processDocument(doc.id)
    results.push({ documentId: doc.id, ...result })
  }

  return results
}

export async function reprocessDocument(documentId: string) {
  const sessionId = await getOrCreateSession()

  // Delete existing questions from this document
  await prisma.question.deleteMany({
    where: { sourceDocId: documentId, sessionId },
  })

  // Reset document status
  await prisma.document.update({
    where: { id: documentId },
    data: {
      status: "pending",
      extractedText: null,
      errorMessage: null,
    },
  })

  // Process again
  return processDocument(documentId)
}
