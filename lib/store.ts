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
        {
          id: "4",
          name: "Computer Networks Complete Guide.pdf",
          type: "pdf",
          size: 4200000,
          uploadedAt: new Date("2024-02-10"),
          tags: ["CN", "Networking", "Semester 5"],
          status: "ready",
        },
        {
          id: "5",
          name: "Software Engineering Handbook.docx",
          type: "docx",
          size: 3100000,
          uploadedAt: new Date("2024-02-15"),
          tags: ["SE", "SDLC", "Semester 5"],
          status: "ready",
        },
        {
          id: "6",
          name: "Theory of Computation Notes.pdf",
          type: "pdf",
          size: 1500000,
          uploadedAt: new Date("2024-02-20"),
          tags: ["TOC", "Automata", "Semester 4"],
          status: "ready",
        },
        {
          id: "7",
          name: "Machine Learning Fundamentals.pptx",
          type: "pptx",
          size: 8500000,
          uploadedAt: new Date("2024-03-01"),
          tags: ["ML", "AI", "Semester 6"],
          status: "ready",
        },
        {
          id: "8",
          name: "Artificial Intelligence PYQ 2024.pdf",
          type: "pdf",
          size: 2100000,
          uploadedAt: new Date("2024-03-05"),
          tags: ["AI", "PYQ", "2024"],
          status: "ready",
        },
        {
          id: "9",
          name: "Compiler Design Notes.pdf",
          type: "pdf",
          size: 2800000,
          uploadedAt: new Date("2024-03-10"),
          tags: ["CD", "Compiler", "Semester 6"],
          status: "ready",
        },
        {
          id: "10",
          name: "Discrete Mathematics.pdf",
          type: "pdf",
          size: 1900000,
          uploadedAt: new Date("2024-03-12"),
          tags: ["DM", "Math", "Semester 2"],
          status: "ready",
        },
        {
          id: "11",
          name: "Web Development Basics.docx",
          type: "docx",
          size: 2200000,
          uploadedAt: new Date("2024-03-15"),
          tags: ["Web", "HTML", "CSS", "JS"],
          status: "ready",
        },
        {
          id: "12",
          name: "Cloud Computing Architecture.pptx",
          type: "pptx",
          size: 6700000,
          uploadedAt: new Date("2024-03-18"),
          tags: ["Cloud", "AWS", "Semester 7"],
          status: "ready",
        },
        {
          id: "13",
          name: "Cryptography and Network Security.pdf",
          type: "pdf",
          size: 3400000,
          uploadedAt: new Date("2024-03-20"),
          tags: ["CNS", "Security", "Semester 6"],
          status: "ready",
        },
        {
          id: "14",
          name: "Object Oriented Programming.pdf",
          type: "pdf",
          size: 2600000,
          uploadedAt: new Date("2024-03-22"),
          tags: ["OOP", "Java", "C++", "Semester 3"],
          status: "ready",
        },
        {
          id: "15",
          name: "Digital Electronics Lab Manual.pdf",
          type: "pdf",
          size: 4100000,
          uploadedAt: new Date("2024-03-25"),
          tags: ["DE", "Lab", "Semester 2"],
          status: "ready",
        },
      ],
      
      folders: [
        { id: "f1", name: "Semester 2", createdAt: new Date("2023-08-01") },
        { id: "f2", name: "Semester 3", createdAt: new Date("2024-01-01") },
        { id: "f3", name: "Semester 4", createdAt: new Date("2024-01-15") },
        { id: "f4", name: "Semester 5", createdAt: new Date("2024-02-01") },
        { id: "f5", name: "Semester 6", createdAt: new Date("2024-03-01") },
        { id: "f6", name: "Semester 7", createdAt: new Date("2024-03-15") },
        { id: "f7", name: "Previous Year Papers", createdAt: new Date("2024-02-01") },
        { id: "f8", name: "Lab Manuals", createdAt: new Date("2024-03-20") },
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
        {
          id: "q5",
          text: "Explain the OSI model layers with their functions and protocols.",
          subject: "Computer Networks",
          unit: "Unit 1",
          topic: "Network Models",
          type: "long",
          marks: 10,
          difficulty: "medium",
          year: 2024,
          keywords: ["OSI", "TCP/IP", "layers", "protocols"],
          frequency: 9,
        },
        {
          id: "q6",
          text: "What is TCP/IP? Compare it with OSI model.",
          subject: "Computer Networks",
          unit: "Unit 1",
          topic: "Network Models",
          type: "short",
          marks: 5,
          difficulty: "easy",
          year: 2023,
          keywords: ["TCP/IP", "OSI", "comparison"],
          frequency: 7,
        },
        {
          id: "q7",
          text: "Explain the software development life cycle (SDLC) with different models.",
          subject: "Software Engineering",
          unit: "Unit 1",
          topic: "SDLC Models",
          type: "long",
          marks: 10,
          difficulty: "medium",
          year: 2024,
          keywords: ["SDLC", "waterfall", "agile", "spiral"],
          frequency: 8,
        },
        {
          id: "q8",
          text: "Design a DFA that accepts strings ending with '01' over {0,1}.",
          subject: "Theory of Computation",
          unit: "Unit 2",
          topic: "Finite Automata",
          type: "numerical",
          marks: 8,
          difficulty: "medium",
          year: 2023,
          keywords: ["DFA", "automata", "state diagram"],
          frequency: 6,
        },
        {
          id: "q9",
          text: "Explain supervised and unsupervised learning with examples.",
          subject: "Machine Learning",
          unit: "Unit 1",
          topic: "ML Basics",
          type: "long",
          marks: 10,
          difficulty: "medium",
          year: 2024,
          keywords: ["supervised", "unsupervised", "classification", "clustering"],
          frequency: 7,
        },
        {
          id: "q10",
          text: "Describe the phases of a compiler with block diagram.",
          subject: "Compiler Design",
          unit: "Unit 1",
          topic: "Compiler Phases",
          type: "long",
          marks: 10,
          difficulty: "hard",
          year: 2024,
          keywords: ["lexical analysis", "syntax analysis", "semantic analysis", "code generation"],
          frequency: 8,
        },
        {
          id: "q11",
          text: "Prove that the sum of degrees of all vertices in a graph is twice the number of edges.",
          subject: "Discrete Mathematics",
          unit: "Unit 4",
          topic: "Graph Theory",
          type: "theory",
          marks: 5,
          difficulty: "easy",
          year: 2023,
          keywords: ["graph", "vertices", "edges", "degree"],
          frequency: 5,
        },
        {
          id: "q12",
          text: "Explain public key cryptography with RSA algorithm.",
          subject: "Cryptography",
          unit: "Unit 3",
          topic: "Asymmetric Encryption",
          type: "long",
          marks: 10,
          difficulty: "hard",
          year: 2024,
          keywords: ["RSA", "public key", "private key", "encryption"],
          frequency: 7,
        },
        {
          id: "q13",
          text: "What are the four pillars of OOP? Explain with examples.",
          subject: "Object Oriented Programming",
          unit: "Unit 1",
          topic: "OOP Concepts",
          type: "long",
          marks: 10,
          difficulty: "easy",
          year: 2023,
          keywords: ["encapsulation", "inheritance", "polymorphism", "abstraction"],
          frequency: 9,
        },
        {
          id: "q14",
          text: "Explain cloud computing service models: IaaS, PaaS, and SaaS.",
          subject: "Cloud Computing",
          unit: "Unit 1",
          topic: "Cloud Models",
          type: "short",
          marks: 5,
          difficulty: "easy",
          year: 2024,
          keywords: ["IaaS", "PaaS", "SaaS", "cloud"],
          frequency: 6,
        },
        {
          id: "q15",
          text: "Implement Dijkstra's shortest path algorithm.",
          subject: "Data Structures",
          unit: "Unit 4",
          topic: "Graphs",
          type: "numerical",
          marks: 10,
          difficulty: "hard",
          year: 2024,
          keywords: ["Dijkstra", "shortest path", "graph", "greedy"],
          frequency: 6,
        },
        {
          id: "q16",
          text: "Explain deadlock detection and prevention techniques in OS.",
          subject: "Operating Systems",
          unit: "Unit 3",
          topic: "Deadlocks",
          type: "long",
          marks: 10,
          difficulty: "hard",
          year: 2024,
          keywords: ["deadlock", "banker's algorithm", "prevention", "detection"],
          frequency: 8,
        },
        {
          id: "q17",
          text: "What is a neural network? Explain with a perceptron model.",
          subject: "Artificial Intelligence",
          unit: "Unit 4",
          topic: "Neural Networks",
          type: "long",
          marks: 10,
          difficulty: "hard",
          year: 2024,
          keywords: ["neural network", "perceptron", "activation function", "weights"],
          frequency: 5,
        },
        {
          id: "q18",
          text: "Explain SQL joins with examples.",
          subject: "Database Management",
          unit: "Unit 3",
          topic: "SQL Queries",
          type: "short",
          marks: 5,
          difficulty: "medium",
          year: 2023,
          keywords: ["inner join", "outer join", "left join", "right join"],
          frequency: 7,
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
