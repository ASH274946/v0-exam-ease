import { z } from "zod"

// Document schemas
export const uploadDocumentSchema = z.object({
  file: z.instanceof(File).refine((file) => file.size <= 20 * 1024 * 1024, {
    message: "File size must be less than 20MB",
  }),
})

// Question schemas
export const createQuestionSchema = z.object({
  text: z.string().min(10, "Question must be at least 10 characters"),
  answer: z.string().optional(),
  marks: z.number().min(1).max(20).optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  type: z.enum(["mcq", "short", "long", "numerical"]).default("short"),
  topic: z.string().optional(),
  unit: z.string().optional(),
  sourceDocId: z.string().optional(),
})

export const updateQuestionSchema = createQuestionSchema.partial()

// PrepPack schemas
export const createPrepPackSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  subject: z.string().min(2, "Subject is required"),
  description: z.string().optional(),
  totalMarks: z.number().min(10).max(500).default(100),
  config: z.object({
    pattern: z.enum(["standard", "competitive", "custom"]).default("standard"),
    difficulty: z.enum(["easy", "medium", "hard", "mixed"]).default("mixed"),
    sections: z.array(z.object({
      name: z.string(),
      marks: z.number(),
      questionType: z.string(),
    })).optional(),
    includeAnswers: z.boolean().default(true),
    includeFormulas: z.boolean().default(true),
    includeTips: z.boolean().default(true),
  }),
})

// Study Plan schemas
export const createStudyPlanSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  subject: z.string().optional(),
  examDate: z.string().optional(), // ISO date string
  dailyHours: z.number().min(0.5).max(12).default(2),
  topics: z.array(z.object({
    name: z.string(),
    priority: z.enum(["high", "medium", "low"]).default("medium"),
    estimatedHours: z.number().default(2),
    completed: z.boolean().default(false),
  })),
})

// Focus Session schemas
export const startFocusSessionSchema = z.object({
  type: z.enum(["focus", "break"]).default("focus"),
  targetTime: z.number().min(60).max(7200), // 1 min to 2 hours in seconds
  taskName: z.string().optional(),
})

export const endFocusSessionSchema = z.object({
  sessionId: z.string(),
  completed: z.boolean().default(false),
  notes: z.string().optional(),
})

// Export types
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>
export type CreatePrepPackInput = z.infer<typeof createPrepPackSchema>
export type CreateStudyPlanInput = z.infer<typeof createStudyPlanSchema>
export type StartFocusSessionInput = z.infer<typeof startFocusSessionSchema>
export type EndFocusSessionInput = z.infer<typeof endFocusSessionSchema>
