"use server"

import { prisma } from "@/lib/db"
import { getOrCreateSession } from "@/lib/session"
import { revalidatePath } from "next/cache"
import { createQuestionSchema, updateQuestionSchema, type CreateQuestionInput, type UpdateQuestionInput } from "@/lib/validations"

export async function getQuestions(filters?: {
  difficulty?: string
  type?: string
  topic?: string
  search?: string
  sourceDocId?: string
}) {
  const sessionId = await getOrCreateSession()

  const where: Record<string, unknown> = { sessionId }

  if (filters?.difficulty && filters.difficulty !== "all") {
    where.difficulty = filters.difficulty
  }
  if (filters?.type && filters.type !== "all") {
    where.type = filters.type
  }
  if (filters?.topic) {
    where.topic = { contains: filters.topic }
  }
  if (filters?.sourceDocId) {
    where.sourceDocId = filters.sourceDocId
  }
  if (filters?.search) {
    where.OR = [
      { text: { contains: filters.search } },
      { topic: { contains: filters.search } },
    ]
  }

  const questions = await prisma.question.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      sourceDoc: {
        select: { originalName: true },
      },
    },
  })

  return questions
}

export async function getQuestion(questionId: string) {
  const sessionId = await getOrCreateSession()

  return prisma.question.findFirst({
    where: { id: questionId, sessionId },
    include: {
      sourceDoc: true,
    },
  })
}

export async function createQuestion(input: CreateQuestionInput) {
  const sessionId = await getOrCreateSession()

  const validated = createQuestionSchema.parse(input)

  const question = await prisma.question.create({
    data: {
      ...validated,
      tags: validated.topic ? JSON.stringify([validated.topic]) : null,
      sessionId,
    },
  })

  revalidatePath("/questions")
  return question
}

export async function updateQuestion(questionId: string, input: UpdateQuestionInput) {
  const sessionId = await getOrCreateSession()

  const validated = updateQuestionSchema.parse(input)

  const question = await prisma.question.updateMany({
    where: { id: questionId, sessionId },
    data: validated,
  })

  revalidatePath("/questions")
  return question
}

export async function deleteQuestion(questionId: string) {
  const sessionId = await getOrCreateSession()

  await prisma.question.deleteMany({
    where: { id: questionId, sessionId },
  })

  revalidatePath("/questions")
  return { success: true }
}

export async function bulkDeleteQuestions(questionIds: string[]) {
  const sessionId = await getOrCreateSession()

  await prisma.question.deleteMany({
    where: {
      id: { in: questionIds },
      sessionId,
    },
  })

  revalidatePath("/questions")
  return { success: true, deletedCount: questionIds.length }
}

export async function getQuestionStats() {
  const sessionId = await getOrCreateSession()

  const [total, byDifficulty, byType, byTopic] = await Promise.all([
    prisma.question.count({ where: { sessionId } }),
    prisma.question.groupBy({
      by: ["difficulty"],
      where: { sessionId },
      _count: true,
    }),
    prisma.question.groupBy({
      by: ["type"],
      where: { sessionId },
      _count: true,
    }),
    prisma.question.groupBy({
      by: ["topic"],
      where: { sessionId, topic: { not: null } },
      _count: true,
      orderBy: { _count: { topic: "desc" } },
      take: 10,
    }),
  ])

  return {
    total,
    byDifficulty: byDifficulty.reduce((acc, item) => {
      acc[item.difficulty] = item._count
      return acc
    }, {} as Record<string, number>),
    byType: byType.reduce((acc, item) => {
      acc[item.type] = item._count
      return acc
    }, {} as Record<string, number>),
    topTopics: byTopic.map((item) => ({
      topic: item.topic,
      count: item._count,
    })),
  }
}
