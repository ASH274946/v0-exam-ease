"use server"

import { prisma } from "@/lib/db"
import { getOrCreateSession } from "@/lib/session"

export async function getDashboardStats() {
  const sessionId = await getOrCreateSession()

  const [
    documentsCount,
    questionsCount,
    prepPacksCount,
    totalFocusTime,
    recentDocuments,
    studyPlans,
  ] = await Promise.all([
    prisma.document.count({ where: { sessionId } }),
    prisma.question.count({ where: { sessionId } }),
    prisma.prepPack.count({ where: { sessionId } }),
    prisma.focusSession.aggregate({
      where: { sessionId, completed: true },
      _sum: { duration: true },
    }),
    prisma.document.findMany({
      where: { sessionId },
      orderBy: { uploadedAt: "desc" },
      take: 5,
      select: {
        id: true,
        originalName: true,
        type: true,
        status: true,
        uploadedAt: true,
        _count: { select: { questions: true } },
      },
    }),
    prisma.studyPlan.findMany({
      where: { sessionId, status: "active" },
      take: 3,
      select: {
        id: true,
        title: true,
        progress: true,
        examDate: true,
      },
    }),
  ])

  // Calculate streak
  const streak = await calculateStreak(sessionId)

  return {
    documentsCount,
    questionsCount,
    prepPacksCount,
    totalStudyHours: Math.floor((totalFocusTime._sum.duration || 0) / 3600),
    recentDocuments,
    activePlans: studyPlans,
    currentStreak: streak,
  }
}

async function calculateStreak(sessionId: string): Promise<number> {
  const sessions = await prisma.focusSession.findMany({
    where: { sessionId, completed: true },
    orderBy: { startTime: "desc" },
    select: { startTime: true },
  })

  if (sessions.length === 0) return 0

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Create a set of dates with activity
  const activeDates = new Set(
    sessions.map((s) => s.startTime.toISOString().split("T")[0])
  )

  // Count consecutive days
  for (let i = 0; i <= 365; i++) {
    const checkDate = new Date(today)
    checkDate.setDate(checkDate.getDate() - i)
    const dateStr = checkDate.toISOString().split("T")[0]

    if (activeDates.has(dateStr)) {
      streak++
    } else if (i > 0) {
      // Allow for today not having activity yet
      break
    }
  }

  return streak
}

export async function getAnalyticsData() {
  const sessionId = await getOrCreateSession()

  // Get data for last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [
    questionsByDifficulty,
    questionsByType,
    focusByDay,
    documentsByType,
    topTopics,
  ] = await Promise.all([
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
    prisma.focusSession.findMany({
      where: {
        sessionId,
        completed: true,
        startTime: { gte: thirtyDaysAgo },
      },
      select: {
        startTime: true,
        duration: true,
      },
    }),
    prisma.document.groupBy({
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

  // Process focus data by day
  const focusDataByDay: Record<string, number> = {}
  for (const session of focusByDay) {
    const date = session.startTime.toISOString().split("T")[0]
    focusDataByDay[date] = (focusDataByDay[date] || 0) + (session.duration || 0)
  }

  // Create chart data for last 7 days
  const studyTimeChart = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" })
    
    studyTimeChart.push({
      day: dayName,
      minutes: Math.round((focusDataByDay[dateStr] || 0) / 60),
    })
  }

  return {
    questionsByDifficulty: questionsByDifficulty.map((q) => ({
      difficulty: q.difficulty,
      count: q._count,
    })),
    questionsByType: questionsByType.map((q) => ({
      type: q.type,
      count: q._count,
    })),
    documentsByType: documentsByType.map((d) => ({
      type: d.type,
      count: d._count,
    })),
    topTopics: topTopics.map((t) => ({
      topic: t.topic,
      count: t._count,
    })),
    studyTimeChart,
  }
}

export async function getWeeklyProgress() {
  const sessionId = await getOrCreateSession()

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const [
    newDocuments,
    newQuestions,
    completedFocus,
    planProgress,
  ] = await Promise.all([
    prisma.document.count({
      where: { sessionId, uploadedAt: { gte: weekAgo } },
    }),
    prisma.question.count({
      where: { sessionId, createdAt: { gte: weekAgo } },
    }),
    prisma.focusSession.aggregate({
      where: {
        sessionId,
        completed: true,
        startTime: { gte: weekAgo },
      },
      _sum: { duration: true },
      _count: true,
    }),
    prisma.studyPlan.aggregate({
      where: { sessionId },
      _avg: { progress: true },
    }),
  ])

  return {
    newDocuments,
    newQuestions,
    focusSessions: completedFocus._count,
    focusMinutes: Math.floor((completedFocus._sum.duration || 0) / 60),
    avgPlanProgress: Math.round(planProgress._avg.progress || 0),
  }
}
