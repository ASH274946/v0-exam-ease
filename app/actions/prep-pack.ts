"use server"

import { prisma } from "@/lib/db"
import { getOrCreateSession } from "@/lib/session"
import { revalidatePath } from "next/cache"
import { createPrepPackSchema, type CreatePrepPackInput } from "@/lib/validations"

interface PrepPackSection {
  name: string
  marks: number
  questions: Array<{
    id: string
    text: string
    marks?: number
    answer?: string
    type: string
  }>
}

interface PrepPackContent {
  sections: PrepPackSection[]
  formulas?: string[]
  tips?: string[]
  summary?: string
}

export async function getprepPacks() {
  const sessionId = await getOrCreateSession()

  return prisma.prepPack.findMany({
    where: { sessionId },
    orderBy: { createdAt: "desc" },
  })
}

export async function getPrepPack(prepPackId: string) {
  const sessionId = await getOrCreateSession()

  const prepPack = await prisma.prepPack.findFirst({
    where: { id: prepPackId, sessionId },
  })

  if (prepPack) {
    return {
      ...prepPack,
      content: JSON.parse(prepPack.content) as PrepPackContent,
      config: JSON.parse(prepPack.config),
    }
  }

  return null
}

export async function createPrepPack(input: CreatePrepPackInput) {
  const sessionId = await getOrCreateSession()

  const validated = createPrepPackSchema.parse(input)

  // Get available questions
  const questions = await prisma.question.findMany({
    where: { sessionId },
    orderBy: { createdAt: "desc" },
  })

  if (questions.length === 0) {
    return { success: false, error: "No questions available. Upload and process documents first." }
  }

  // Generate prep pack content based on config
  const content = generatePrepPackContent(questions, validated)

  const prepPack = await prisma.prepPack.create({
    data: {
      title: validated.title,
      subject: validated.subject,
      description: validated.description,
      content: JSON.stringify(content),
      config: JSON.stringify(validated.config),
      totalMarks: validated.totalMarks,
      status: "generated",
      sessionId,
    },
  })

  revalidatePath("/prep-pack")
  return { success: true, prepPack }
}

function generatePrepPackContent(
  questions: Array<{
    id: string
    text: string
    marks: number | null
    answer: string | null
    type: string
    difficulty: string
  }>,
  config: CreatePrepPackInput
): PrepPackContent {
  const { totalMarks, config: packConfig } = config
  const sections: PrepPackSection[] = []

  // Filter questions by difficulty if specified
  let filteredQuestions = questions
  if (packConfig.difficulty !== "mixed") {
    filteredQuestions = questions.filter((q) => q.difficulty === packConfig.difficulty)
  }

  // Shuffle questions for variety
  filteredQuestions = shuffleArray([...filteredQuestions])

  if (packConfig.pattern === "standard") {
    // Standard pattern: Section A (2 marks), Section B (5 marks), Section C (10 marks)
    const sectionAMarks = Math.floor(totalMarks * 0.2) // 20%
    const sectionBMarks = Math.floor(totalMarks * 0.4) // 40%
    const sectionCMarks = totalMarks - sectionAMarks - sectionBMarks // 40%

    sections.push(
      createSection("Section A - Short Answer", sectionAMarks, 2, filteredQuestions, ["short", "mcq"]),
      createSection("Section B - Medium Answer", sectionBMarks, 5, filteredQuestions, ["short", "numerical"]),
      createSection("Section C - Long Answer", sectionCMarks, 10, filteredQuestions, ["long"])
    )
  } else if (packConfig.pattern === "competitive") {
    // Competitive pattern: More MCQs and numerical
    const mcqMarks = Math.floor(totalMarks * 0.4)
    const numericalMarks = Math.floor(totalMarks * 0.3)
    const descriptiveMarks = totalMarks - mcqMarks - numericalMarks

    sections.push(
      createSection("Part I - Multiple Choice", mcqMarks, 1, filteredQuestions, ["mcq", "short"]),
      createSection("Part II - Numerical Problems", numericalMarks, 5, filteredQuestions, ["numerical"]),
      createSection("Part III - Descriptive", descriptiveMarks, 8, filteredQuestions, ["long", "short"])
    )
  } else {
    // Custom pattern - use provided sections or default
    const customSections = packConfig.sections || [
      { name: "Questions", marks: totalMarks, questionType: "mixed" },
    ]

    for (const section of customSections) {
      const types = section.questionType === "mixed" 
        ? ["mcq", "short", "long", "numerical"]
        : [section.questionType]
      
      sections.push(
        createSection(section.name, section.marks, 5, filteredQuestions, types)
      )
    }
  }

  // Generate formulas and tips
  const content: PrepPackContent = {
    sections,
  }

  if (packConfig.includeFormulas) {
    content.formulas = generateFormulas(config.subject)
  }

  if (packConfig.includeTips) {
    content.tips = generateTips(config.subject)
  }

  content.summary = `This preparation pack contains ${sections.reduce((acc, s) => acc + s.questions.length, 0)} questions across ${sections.length} sections, totaling ${totalMarks} marks.`

  return content
}

function createSection(
  name: string,
  targetMarks: number,
  marksPerQuestion: number,
  questions: Array<{
    id: string
    text: string
    marks: number | null
    answer: string | null
    type: string
  }>,
  preferredTypes: string[]
): PrepPackSection {
  const sectionQuestions: PrepPackSection["questions"] = []
  let currentMarks = 0
  const usedIds = new Set<string>()

  // First, try to find questions matching preferred types
  for (const q of questions) {
    if (currentMarks >= targetMarks) break
    if (usedIds.has(q.id)) continue
    
    if (preferredTypes.includes(q.type)) {
      const qMarks = q.marks || marksPerQuestion
      if (currentMarks + qMarks <= targetMarks + marksPerQuestion) {
        sectionQuestions.push({
          id: q.id,
          text: q.text,
          marks: qMarks,
          answer: q.answer || undefined,
          type: q.type,
        })
        currentMarks += qMarks
        usedIds.add(q.id)
      }
    }
  }

  // Fill remaining with any available questions
  if (currentMarks < targetMarks) {
    for (const q of questions) {
      if (currentMarks >= targetMarks) break
      if (usedIds.has(q.id)) continue
      
      const qMarks = q.marks || marksPerQuestion
      if (currentMarks + qMarks <= targetMarks + marksPerQuestion) {
        sectionQuestions.push({
          id: q.id,
          text: q.text,
          marks: qMarks,
          answer: q.answer || undefined,
          type: q.type,
        })
        currentMarks += qMarks
        usedIds.add(q.id)
      }
    }
  }

  return {
    name,
    marks: currentMarks,
    questions: sectionQuestions,
  }
}

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

function generateFormulas(subject: string): string[] {
  // Generic formulas - in a real app, these would be subject-specific
  const commonFormulas = [
    "Important: Review all formulas from your course material",
    "Focus on derivations that appear frequently in exams",
    "Practice applying formulas to different problem types",
  ]

  const subjectFormulas: Record<string, string[]> = {
    mathematics: [
      "Quadratic Formula: x = (-b ± √(b² - 4ac)) / 2a",
      "Area of Circle: A = πr²",
      "Pythagorean Theorem: a² + b² = c²",
    ],
    physics: [
      "Newton's Second Law: F = ma",
      "Kinetic Energy: KE = ½mv²",
      "Ohm's Law: V = IR",
    ],
    chemistry: [
      "Ideal Gas Law: PV = nRT",
      "Molarity: M = moles of solute / liters of solution",
      "pH = -log[H⁺]",
    ],
  }

  return [...commonFormulas, ...(subjectFormulas[subject.toLowerCase()] || [])]
}

function generateTips(subject: string): string[] {
  return [
    "Read all questions carefully before starting",
    "Allocate time proportionally based on marks",
    "Start with questions you're most confident about",
    "Show all working for numerical problems",
    "Review your answers if time permits",
    "Don't leave any question unanswered",
    `Focus on key concepts from ${subject}`,
  ]
}

export async function deletePrepPack(prepPackId: string) {
  const sessionId = await getOrCreateSession()

  await prisma.prepPack.deleteMany({
    where: { id: prepPackId, sessionId },
  })

  revalidatePath("/prep-pack")
  return { success: true }
}

export async function updatePrepPackStatus(prepPackId: string, status: string) {
  const sessionId = await getOrCreateSession()

  await prisma.prepPack.updateMany({
    where: { id: prepPackId, sessionId },
    data: { status },
  })

  revalidatePath("/prep-pack")
  return { success: true }
}
