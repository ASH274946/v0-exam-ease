"use server"

import { prisma } from "@/lib/db"
import { getOrCreateSession } from "@/lib/session"
import { revalidatePath } from "next/cache"
import { createStudyPlanSchema, type CreateStudyPlanInput } from "@/lib/validations"

interface ScheduleItem {
  date: string
  topics: string[]
  estimatedHours: number
  completed: boolean
}

export async function getStudyPlans() {
  const sessionId = await getOrCreateSession()

  const plans = await prisma.studyPlan.findMany({
    where: { sessionId },
    orderBy: { createdAt: "desc" },
  })

  return plans.map((plan) => ({
    ...plan,
    schedule: JSON.parse(plan.schedule) as ScheduleItem[],
    topics: JSON.parse(plan.topics),
  }))
}

export async function getStudyPlan(planId: string) {
  const sessionId = await getOrCreateSession()

  const plan = await prisma.studyPlan.findFirst({
    where: { id: planId, sessionId },
  })

  if (plan) {
    return {
      ...plan,
      schedule: JSON.parse(plan.schedule) as ScheduleItem[],
      topics: JSON.parse(plan.topics),
    }
  }

  return null
}

export async function createStudyPlan(input: CreateStudyPlanInput) {
  const sessionId = await getOrCreateSession()

  const validated = createStudyPlanSchema.parse(input)

  // Generate schedule based on exam date and topics
  const schedule = generateSchedule(
    validated.topics,
    validated.examDate ? new Date(validated.examDate) : null,
    validated.dailyHours
  )

  const plan = await prisma.studyPlan.create({
    data: {
      title: validated.title,
      subject: validated.subject,
      examDate: validated.examDate ? new Date(validated.examDate) : null,
      dailyHours: validated.dailyHours,
      schedule: JSON.stringify(schedule),
      topics: JSON.stringify(validated.topics),
      sessionId,
    },
  })

  revalidatePath("/planner")
  return { success: true, plan }
}

function generateSchedule(
  topics: CreateStudyPlanInput["topics"],
  examDate: Date | null,
  dailyHours: number
): ScheduleItem[] {
  const schedule: ScheduleItem[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Calculate total hours needed
  const totalHours = topics.reduce((acc, t) => acc + t.estimatedHours, 0)

  // Calculate days available
  let daysAvailable = 30 // Default 30 days
  if (examDate) {
    const timeDiff = examDate.getTime() - today.getTime()
    daysAvailable = Math.max(1, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)))
  }

  // Sort topics by priority
  const sortedTopics = [...topics].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  // Distribute topics across days
  let currentDay = 0
  let remainingHoursToday = dailyHours

  for (const topic of sortedTopics) {
    let topicHours = topic.estimatedHours

    while (topicHours > 0) {
      const date = new Date(today)
      date.setDate(date.getDate() + currentDay)

      // Find or create schedule item for this day
      let daySchedule = schedule.find(
        (s) => s.date === date.toISOString().split("T")[0]
      )

      if (!daySchedule) {
        daySchedule = {
          date: date.toISOString().split("T")[0],
          topics: [],
          estimatedHours: 0,
          completed: false,
        }
        schedule.push(daySchedule)
      }

      // Add topic to this day
      const hoursToAdd = Math.min(topicHours, remainingHoursToday)
      if (!daySchedule.topics.includes(topic.name)) {
        daySchedule.topics.push(topic.name)
      }
      daySchedule.estimatedHours += hoursToAdd
      topicHours -= hoursToAdd
      remainingHoursToday -= hoursToAdd

      // Move to next day if needed
      if (remainingHoursToday <= 0) {
        currentDay++
        remainingHoursToday = dailyHours
      }

      // Safety limit
      if (currentDay > daysAvailable + 30) break
    }
  }

  return schedule.slice(0, Math.min(schedule.length, daysAvailable + 7))
}

export async function updateStudyPlanProgress(
  planId: string,
  date: string,
  completed: boolean
) {
  const sessionId = await getOrCreateSession()

  const plan = await prisma.studyPlan.findFirst({
    where: { id: planId, sessionId },
  })

  if (!plan) {
    return { success: false, error: "Plan not found" }
  }

  const schedule = JSON.parse(plan.schedule) as ScheduleItem[]

  // Update the specific day
  const dayIndex = schedule.findIndex((s) => s.date === date)
  if (dayIndex >= 0) {
    schedule[dayIndex].completed = completed
  }

  // Calculate overall progress
  const completedDays = schedule.filter((s) => s.completed).length
  const progress = schedule.length > 0 ? (completedDays / schedule.length) * 100 : 0

  await prisma.studyPlan.update({
    where: { id: planId },
    data: {
      schedule: JSON.stringify(schedule),
      progress,
      status: progress >= 100 ? "completed" : "active",
    },
  })

  revalidatePath("/planner")
  return { success: true }
}

export async function deleteStudyPlan(planId: string) {
  const sessionId = await getOrCreateSession()

  await prisma.studyPlan.deleteMany({
    where: { id: planId, sessionId },
  })

  revalidatePath("/planner")
  return { success: true }
}

// Focus Session Actions
export async function startFocusSession(data: {
  type: "focus" | "break"
  targetTime: number
  taskName?: string
}) {
  const sessionId = await getOrCreateSession()

  const session = await prisma.focusSession.create({
    data: {
      type: data.type,
      targetTime: data.targetTime,
      duration: 0,
      startTime: new Date(),
      taskName: data.taskName,
      sessionId,
    },
  })

  return { success: true, focusSessionId: session.id }
}

export async function endFocusSession(
  focusSessionId: string,
  data: { completed: boolean; notes?: string }
) {
  const sessionId = await getOrCreateSession()

  const session = await prisma.focusSession.findFirst({
    where: { id: focusSessionId, sessionId },
  })

  if (!session) {
    return { success: false, error: "Session not found" }
  }

  const endTime = new Date()
  const duration = Math.floor(
    (endTime.getTime() - session.startTime.getTime()) / 1000
  )

  await prisma.focusSession.update({
    where: { id: focusSessionId },
    data: {
      endTime,
      duration,
      completed: data.completed,
      notes: data.notes,
    },
  })

  revalidatePath("/focus")
  return { success: true, duration }
}

export async function getFocusSessions(limit = 10) {
  const sessionId = await getOrCreateSession()

  return prisma.focusSession.findMany({
    where: { sessionId },
    orderBy: { startTime: "desc" },
    take: limit,
  })
}

export async function getFocusStats() {
  const sessionId = await getOrCreateSession()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const thisWeek = new Date(today)
  thisWeek.setDate(thisWeek.getDate() - 7)

  const [totalSessions, todaySessions, weekSessions, totalTime] = await Promise.all([
    prisma.focusSession.count({
      where: { sessionId, completed: true },
    }),
    prisma.focusSession.aggregate({
      where: {
        sessionId,
        completed: true,
        startTime: { gte: today },
      },
      _sum: { duration: true },
    }),
    prisma.focusSession.aggregate({
      where: {
        sessionId,
        completed: true,
        startTime: { gte: thisWeek },
      },
      _sum: { duration: true },
    }),
    prisma.focusSession.aggregate({
      where: { sessionId, completed: true },
      _sum: { duration: true },
    }),
  ])

  return {
    totalSessions,
    todayMinutes: Math.floor((todaySessions._sum.duration || 0) / 60),
    weekMinutes: Math.floor((weekSessions._sum.duration || 0) / 60),
    totalMinutes: Math.floor((totalTime._sum.duration || 0) / 60),
  }
}
