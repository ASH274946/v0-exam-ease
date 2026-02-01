import { cookies } from "next/headers"
import { prisma } from "./db"

const SESSION_COOKIE_NAME = "examease_session"
const SESSION_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export async function getOrCreateSession(): Promise<string> {
  const cookieStore = await cookies()
  let sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (sessionId) {
    // Verify session exists and update lastActive
    const session = await prisma.userSession.findUnique({
      where: { id: sessionId },
    })

    if (session) {
      await prisma.userSession.update({
        where: { id: sessionId },
        data: { lastActive: new Date() },
      })
      return sessionId
    }
  }

  // Create new session
  const newSession = await prisma.userSession.create({
    data: {},
  })

  // Set cookie
  cookieStore.set(SESSION_COOKIE_NAME, newSession.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  })

  return newSession.id
}

export async function getSessionId(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null
}

export async function getSessionStats(sessionId: string) {
  const [documents, questions, prepPacks, focusSessions] = await Promise.all([
    prisma.document.count({ where: { sessionId } }),
    prisma.question.count({ where: { sessionId } }),
    prisma.prepPack.count({ where: { sessionId } }),
    prisma.focusSession.aggregate({
      where: { sessionId, completed: true },
      _sum: { duration: true },
    }),
  ])

  return {
    documentsCount: documents,
    questionsCount: questions,
    prepPacksCount: prepPacks,
    totalFocusTime: focusSessions._sum.duration ?? 0,
  }
}
