import { create } from "zustand"
import { persist } from "zustand/middleware"

// Types
export interface Document {
  id: string
  name: string
  type: "pdf" | "docx" | "pptx" | "txt" | "image" | "zip"
  size: number
  uploadedAt: Date
  folderId?: string
  tags: string[]
  status: "processing" | "ready" | "error"
  content?: string
}

export interface Folder {
  id: string
  name: string
  parentId?: string
  createdAt: Date
}

export interface Question {
  id: string
  text: string
  subject: string
  unit: string
  topic: string
  type: "short" | "long" | "numerical" | "theory" | "mcq" | "case-study"
  marks: number
  difficulty: "easy" | "medium" | "hard"
  year?: number
  answer?: string
  keywords: string[]
  frequency: number
}

export interface StudyTask {
  id: string
  title: string
  subject: string
  dueDate: Date
  priority: "low" | "medium" | "high" | "urgent"
  difficulty: "easy" | "medium" | "hard"
  status: "pending" | "in-progress" | "completed"
  estimatedTime: number
  actualTime?: number
}

export interface FocusSession {
  id: string
  taskId?: string
  startTime: Date
  endTime?: Date
  duration: number
  type: "work" | "break"
}

export interface UserProgress {
  xp: number
  level: number
  streak: number
  badges: string[]
  studyTime: number
  questionsAnswered: number
  documentsUploaded: number
}

interface AppState {
  // Documents
  documents: Document[]
  folders: Folder[]
  addDocument: (doc: Omit<Document, "id" | "uploadedAt">) => void
  removeDocument: (id: string) => void
  addFolder: (folder: Omit<Folder, "id" | "createdAt">) => void
  
  // Questions
  questions: Question[]
  addQuestion: (q: Omit<Question, "id">) => void
  addQuestions: (questions: Omit<Question, "id">[]) => void
  
  // Study Tasks
  tasks: StudyTask[]
  addTask: (task: Omit<StudyTask, "id">) => void
  updateTask: (id: string, updates: Partial<StudyTask>) => void
  removeTask: (id: string) => void
  
  // Focus Sessions
  sessions: FocusSession[]
  addSession: (session: Omit<FocusSession, "id">) => void
  
  // User Progress
  progress: UserProgress
  addXp: (amount: number) => void
  incrementStreak: () => void
  addBadge: (badge: string) => void
  
  // UI State
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const generateId = () => Math.random().toString(36).substring(2, 15)

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial Documents with mock data
      documents: [
        {
          id: "1",
          name: "Data Structures Notes.pdf",
          type: "pdf",
          size: 2500000,
          uploadedAt: new Date("2024-01-15"),
          tags: ["DSA", "CS", "Semester 3"],
          status: "ready",
        },
        {
          id: "2",
          name: "Database Management Systems.pptx",
          type: "pptx",
          size: 5200000,
          uploadedAt: new Date("2024-01-20"),
          tags: ["DBMS", "CS", "Semester 4"],
          status: "ready",
        },
        {
          id: "3",
          name: "Operating Systems PYQ 2023.pdf",
          type: "pdf",
          size: 1800000,
          uploadedAt: new Date("2024-02-01"),
          tags: ["OS", "PYQ", "2023"],
          status: "ready",
        },
      ],
      
      folders: [
        { id: "f1", name: "Semester 3", createdAt: new Date("2024-01-01") },
        { id: "f2", name: "Semester 4", createdAt: new Date("2024-01-15") },
        { id: "f3", name: "Previous Year Papers", createdAt: new Date("2024-02-01") },
      ],
      
      addDocument: (doc) =>
        set((state) => ({
          documents: [
            ...state.documents,
            { ...doc, id: generateId(), uploadedAt: new Date() },
          ],
        })),
      
      removeDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((d) => d.id !== id),
        })),
      
      addFolder: (folder) =>
        set((state) => ({
          folders: [
            ...state.folders,
            { ...folder, id: generateId(), createdAt: new Date() },
          ],
        })),
      
      // Questions with mock data
      questions: [
        {
          id: "q1",
          text: "Explain the concept of Binary Search Tree and its operations with time complexity.",
          subject: "Data Structures",
          unit: "Unit 3",
          topic: "Trees",
          type: "long",
          marks: 10,
          difficulty: "medium",
          year: 2023,
          keywords: ["BST", "binary tree", "search", "insert", "delete"],
          frequency: 5,
          answer: "A Binary Search Tree (BST) is a node-based binary tree data structure where each node has a key greater than all keys in its left subtree and less than all keys in its right subtree...",
        },
        {
          id: "q2",
          text: "What is normalization in DBMS? Explain with examples up to 3NF.",
          subject: "Database Management",
          unit: "Unit 2",
          topic: "Normalization",
          type: "long",
          marks: 10,
          difficulty: "hard",
          year: 2023,
          keywords: ["normalization", "1NF", "2NF", "3NF", "functional dependency"],
          frequency: 8,
        },
        {
          id: "q3",
          text: "Define process. Differentiate between process and thread.",
          subject: "Operating Systems",
          unit: "Unit 1",
          topic: "Process Management",
          type: "short",
          marks: 5,
          difficulty: "easy",
          year: 2022,
          keywords: ["process", "thread", "PCB", "scheduling"],
          frequency: 6,
        },
        {
          id: "q4",
          text: "Implement a stack using two queues.",
          subject: "Data Structures",
          unit: "Unit 2",
          topic: "Stacks and Queues",
          type: "numerical",
          marks: 5,
          difficulty: "medium",
          year: 2023,
          keywords: ["stack", "queue", "implementation"],
          frequency: 4,
        },
      ],
      
      addQuestion: (q) =>
        set((state) => ({
          questions: [...state.questions, { ...q, id: generateId() }],
        })),
      
      addQuestions: (questions) =>
        set((state) => ({
          questions: [
            ...state.questions,
            ...questions.map((q) => ({ ...q, id: generateId() })),
          ],
        })),
      
      // Tasks with mock data
      tasks: [
        {
          id: "t1",
          title: "Complete DSA Tree Problems",
          subject: "Data Structures",
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          priority: "high",
          difficulty: "medium",
          status: "in-progress",
          estimatedTime: 120,
        },
        {
          id: "t2",
          title: "Review DBMS Normalization",
          subject: "Database Management",
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          priority: "medium",
          difficulty: "hard",
          status: "pending",
          estimatedTime: 90,
        },
        {
          id: "t3",
          title: "OS Process Scheduling Notes",
          subject: "Operating Systems",
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          priority: "urgent",
          difficulty: "easy",
          status: "pending",
          estimatedTime: 60,
        },
      ],
      
      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, { ...task, id: generateId() }],
        })),
      
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      
      removeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
      
      // Focus Sessions
      sessions: [],
      
      addSession: (session) =>
        set((state) => ({
          sessions: [...state.sessions, { ...session, id: generateId() }],
        })),
      
      // User Progress
      progress: {
        xp: 2450,
        level: 12,
        streak: 7,
        badges: ["early-bird", "consistent", "document-master"],
        studyTime: 4520,
        questionsAnswered: 156,
        documentsUploaded: 23,
      },
      
      addXp: (amount) =>
        set((state) => {
          const newXp = state.progress.xp + amount
          const newLevel = Math.floor(newXp / 500) + 1
          return {
            progress: { ...state.progress, xp: newXp, level: newLevel },
          }
        }),
      
      incrementStreak: () =>
        set((state) => ({
          progress: { ...state.progress, streak: state.progress.streak + 1 },
        })),
      
      addBadge: (badge) =>
        set((state) => ({
          progress: {
            ...state.progress,
            badges: [...state.progress.badges, badge],
          },
        })),
      
      // UI State
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: "examease-storage",
    }
  )
)
