"use server"

import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { prisma } from "@/lib/db"
import { getOrCreateSession } from "@/lib/session"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB

const ALLOWED_TYPES = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  "application/vnd.ms-powerpoint": "ppt",
  "text/plain": "txt",
  "image/jpeg": "image",
  "image/jpg": "image",
  "image/png": "image",
  "application/zip": "zip",
} as const

type AllowedMimeType = keyof typeof ALLOWED_TYPES

export interface UploadResult {
  success: boolean
  documentId?: string
  filename?: string
  error?: string
}

export async function uploadDocument(formData: FormData): Promise<UploadResult> {
  try {
    const sessionId = await getOrCreateSession()
    const file = formData.get("file") as File | null

    if (!file) {
      return { success: false, error: "No file provided" }
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: "File size exceeds 20MB limit" }
    }

    // Validate file type
    const mimeType = file.type as AllowedMimeType
    if (!ALLOWED_TYPES[mimeType]) {
      return {
        success: false,
        error: "Invalid file type. Allowed: PDF, DOCX, PPTX, PPT, TXT, JPG, PNG, ZIP",
      }
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public", "uploads", sessionId)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const ext = path.extname(file.name) || `.${ALLOWED_TYPES[mimeType]}`
    const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${timestamp}-${safeFilename}`
    const filepath = path.join(uploadDir, filename)

    // Write file to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Store in database
    const document = await prisma.document.create({
      data: {
        filename,
        originalName: file.name,
        filepath: `/uploads/${sessionId}/${filename}`,
        type: ALLOWED_TYPES[mimeType],
        mimeType: file.type,
        size: file.size,
        status: "pending",
        sessionId,
      },
    })

    revalidatePath("/documents")

    return {
      success: true,
      documentId: document.id,
      filename: document.originalName,
    }
  } catch (error) {
    console.error("Upload error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    }
  }
}

export async function uploadMultipleDocuments(
  formData: FormData
): Promise<{ results: UploadResult[]; totalSuccess: number; totalFailed: number }> {
  const files = formData.getAll("files") as File[]
  const results: UploadResult[] = []

  for (const file of files) {
    const singleFormData = new FormData()
    singleFormData.set("file", file)
    const result = await uploadDocument(singleFormData)
    results.push(result)
  }

  return {
    results,
    totalSuccess: results.filter((r) => r.success).length,
    totalFailed: results.filter((r) => !r.success).length,
  }
}

export async function getDocuments() {
  const sessionId = await getOrCreateSession()

  const documents = await prisma.document.findMany({
    where: { sessionId },
    orderBy: { uploadedAt: "desc" },
    include: {
      _count: {
        select: { questions: true },
      },
    },
  })

  return documents
}

export async function getDocument(documentId: string) {
  const sessionId = await getOrCreateSession()

  const document = await prisma.document.findFirst({
    where: { id: documentId, sessionId },
    include: {
      questions: true,
    },
  })

  return document
}

export async function deleteDocument(documentId: string) {
  const sessionId = await getOrCreateSession()

  try {
    // Get document to find filepath
    const document = await prisma.document.findFirst({
      where: { id: documentId, sessionId },
    })

    if (!document) {
      return { success: false, error: "Document not found" }
    }

    // Delete from database (cascade deletes related questions)
    await prisma.document.delete({
      where: { id: documentId },
    })

    // Try to delete file from disk (non-blocking)
    try {
      const { unlink } = await import("fs/promises")
      const fullPath = path.join(process.cwd(), "public", document.filepath)
      await unlink(fullPath)
    } catch {
      // File might not exist, continue anyway
    }

    revalidatePath("/documents")
    return { success: true }
  } catch (error) {
    console.error("Delete error:", error)
    return { success: false, error: "Failed to delete document" }
  }
}
