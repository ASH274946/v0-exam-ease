"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Package,
  BookOpen,
  FileText,
  Brain,
  Download,
  Eye,
  Sparkles,
  ChevronRight,
  Check,
  Lightbulb,
  Calculator,
  ListChecks,
  FileQuestion,
  Clock,
  Star,
  Loader2,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

const examTypes = [
  { id: "mid", name: "Mid-Term Exam", duration: "1.5 hours" },
  { id: "end", name: "End-Term Exam", duration: "3 hours" },
  { id: "quiz", name: "Quiz/Class Test", duration: "30 mins" },
  { id: "practical", name: "Practical Exam", duration: "2 hours" },
]

const marksPatterns = [
  {
    id: "pattern1",
    name: "Standard Pattern",
    sections: [
      { name: "Section A", marks: 2, count: 10, total: 20 },
      { name: "Section B", marks: 5, count: 6, total: 30 },
      { name: "Section C", marks: 10, count: 3, total: 30 },
    ],
    totalMarks: 80,
  },
  {
    id: "pattern2",
    name: "Long Answer Focus",
    sections: [
      { name: "Section A", marks: 2, count: 5, total: 10 },
      { name: "Section B", marks: 10, count: 4, total: 40 },
      { name: "Section C", marks: 15, count: 2, total: 30 },
    ],
    totalMarks: 80,
  },
  {
    id: "pattern3",
    name: "MCQ Heavy",
    sections: [
      { name: "Section A (MCQ)", marks: 1, count: 30, total: 30 },
      { name: "Section B", marks: 5, count: 6, total: 30 },
      { name: "Section C", marks: 10, count: 2, total: 20 },
    ],
    totalMarks: 80,
  },
]

const mockGeneratedPack = {
  title: "Data Structures & Algorithms - End Term Preparation Pack",
  subject: "Data Structures",
  generatedAt: "2024-03-15T10:30:00Z",
  sections: [
    {
      name: "Section A: 2 Marks Questions (10 x 2 = 20)",
      questions: [
        {
          id: 1,
          text: "Define time complexity and space complexity.",
          marks: 2,
          frequency: 5,
        },
        {
          id: 2,
          text: "What is the difference between stack and queue?",
          marks: 2,
          frequency: 8,
        },
        {
          id: 3,
          text: "Define a complete binary tree.",
          marks: 2,
          frequency: 4,
        },
        {
          id: 4,
          text: "What is a hash collision?",
          marks: 2,
          frequency: 3,
        },
        {
          id: 5,
          text: "State the applications of linked list.",
          marks: 2,
          frequency: 6,
        },
      ],
    },
    {
      name: "Section B: 5 Marks Questions (6 x 5 = 30)",
      questions: [
        {
          id: 6,
          text: "Explain the different types of linked lists with diagrams.",
          marks: 5,
          frequency: 7,
        },
        {
          id: 7,
          text: "Write an algorithm for binary search and analyze its time complexity.",
          marks: 5,
          frequency: 9,
        },
        {
          id: 8,
          text: "Explain BFS and DFS traversal techniques with examples.",
          marks: 5,
          frequency: 6,
        },
      ],
    },
    {
      name: "Section C: 10 Marks Questions (3 x 10 = 30)",
      questions: [
        {
          id: 9,
          text: "Explain Binary Search Tree operations (insertion, deletion, search) with code and time complexity analysis.",
          marks: 10,
          frequency: 8,
          isHighPriority: true,
        },
        {
          id: 10,
          text: "Compare and contrast different sorting algorithms (Quick Sort, Merge Sort, Heap Sort). Write code for any one.",
          marks: 10,
          frequency: 10,
          isHighPriority: true,
        },
      ],
    },
  ],
  revisionNotes: [
    "Focus on tree traversal algorithms - frequently asked",
    "Practice time complexity analysis for all sorting algorithms",
    "Remember the differences between linear and non-linear data structures",
    "Review hash table collision resolution techniques",
  ],
  formulas: [
    "Time Complexity of Binary Search: O(log n)",
    "Space Complexity of Merge Sort: O(n)",
    "Height of Complete Binary Tree: log₂(n+1)",
    "Load Factor (Hash Table): n/m where n = items, m = table size",
  ],
  tips: [
    "Start with 2-mark questions to build confidence",
    "Allocate time proportionally: 2 mins per mark",
    "Draw diagrams wherever possible for better marks",
    "Use proper technical terminology in answers",
  ],
}

export default function PrepPackPage() {
  const { questions } = useAppStore()
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPack, setGeneratedPack] = useState<
    typeof mockGeneratedPack | null
  >(null)

  const [config, setConfig] = useState({
    subject: "",
    examType: "",
    semester: "",
    marksPattern: "",
    difficulty: "mixed",
    includeRevisionNotes: true,
    includeFormulas: true,
    includeTips: true,
    focusOnFrequent: true,
  })

  const subjects = [...new Set(questions.map((q) => q.subject))]

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setGeneratedPack(mockGeneratedPack)
    setIsGenerating(false)
    setStep(3)
  }

  const canProceed = () => {
    if (step === 1) return config.subject && config.examType
    if (step === 2) return config.marksPattern
    return true
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 pb-24 lg:pb-8">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Exam Prep Pack Generator
            </h1>
            <p className="mt-1 text-muted-foreground">
              Generate comprehensive exam-ready preparation materials
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 font-medium transition-colors",
                      step >= s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground"
                    )}
                  >
                    {step > s ? <Check className="h-5 w-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={cn(
                        "mx-4 h-0.5 w-24 sm:w-32 md:w-48",
                        step > s ? "bg-primary" : "bg-border"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span
                className={step >= 1 ? "text-primary" : "text-muted-foreground"}
              >
                Configure
              </span>
              <span
                className={step >= 2 ? "text-primary" : "text-muted-foreground"}
              >
                Customize
              </span>
              <span
                className={step >= 3 ? "text-primary" : "text-muted-foreground"}
              >
                Preview
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Basic Configuration */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Basic Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Subject</Label>
                        <Select
                          value={config.subject}
                          onValueChange={(v) =>
                            setConfig({ ...config, subject: v })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects.map((subject) => (
                              <SelectItem key={subject} value={subject}>
                                {subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Semester</Label>
                        <Select
                          value={config.semester}
                          onValueChange={(v) =>
                            setConfig({ ...config, semester: v })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select semester" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                              <SelectItem key={sem} value={sem.toString()}>
                                Semester {sem}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Exam Type</Label>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {examTypes.map((exam) => (
                          <div
                            key={exam.id}
                            onClick={() =>
                              setConfig({ ...config, examType: exam.id })
                            }
                            className={cn(
                              "cursor-pointer rounded-lg border p-4 transition-all hover:border-primary/50",
                              config.examType === exam.id
                                ? "border-primary bg-primary/5"
                                : "border-border"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{exam.name}</p>
                              {config.examType === exam.id && (
                                <Check className="h-4 w-4 text-primary" />
                              )}
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Duration: {exam.duration}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-6 flex justify-end">
                  <Button onClick={() => setStep(2)} disabled={!canProceed()}>
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Customization */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      Customize Your Pack
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label>Marks Pattern</Label>
                      <div className="space-y-3">
                        {marksPatterns.map((pattern) => (
                          <div
                            key={pattern.id}
                            onClick={() =>
                              setConfig({ ...config, marksPattern: pattern.id })
                            }
                            className={cn(
                              "cursor-pointer rounded-lg border p-4 transition-all hover:border-primary/50",
                              config.marksPattern === pattern.id
                                ? "border-primary bg-primary/5"
                                : "border-border"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{pattern.name}</p>
                              <Badge variant="secondary">
                                {pattern.totalMarks} Marks
                              </Badge>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {pattern.sections.map((section) => (
                                <Badge
                                  key={section.name}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {section.name}: {section.count} x{" "}
                                  {section.marks}m = {section.total}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Difficulty Focus</Label>
                      <Select
                        value={config.difficulty}
                        onValueChange={(v) =>
                          setConfig({ ...config, difficulty: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">
                            Easy - Foundation Level
                          </SelectItem>
                          <SelectItem value="mixed">
                            Mixed - Balanced Difficulty
                          </SelectItem>
                          <SelectItem value="hard">
                            Hard - Challenge Mode
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <Label>Include in Pack</Label>
                      <div className="space-y-3">
                        {[
                          {
                            key: "includeRevisionNotes",
                            label: "Revision Notes",
                            icon: FileText,
                          },
                          {
                            key: "includeFormulas",
                            label: "Formula Sheet",
                            icon: Calculator,
                          },
                          {
                            key: "includeTips",
                            label: "Last-Minute Tips",
                            icon: Lightbulb,
                          },
                          {
                            key: "focusOnFrequent",
                            label: "Prioritize Frequently Asked",
                            icon: Star,
                          },
                        ].map((item) => (
                          <div
                            key={item.key}
                            className="flex items-center gap-3"
                          >
                            <Checkbox
                              id={item.key}
                              checked={
                                config[item.key as keyof typeof config] as boolean
                              }
                              onCheckedChange={(checked) =>
                                setConfig({
                                  ...config,
                                  [item.key]: checked,
                                })
                              }
                            />
                            <Label
                              htmlFor={item.key}
                              className="flex items-center gap-2 font-normal"
                            >
                              <item.icon className="h-4 w-4 text-muted-foreground" />
                              {item.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={!canProceed() || isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Pack
                      </>
                    )}
                  </Button>
                </div>

                {/* Generation Progress */}
                {isGenerating && (
                  <Card className="mt-6">
                    <CardContent className="py-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          <span className="font-medium">
                            Generating your exam prep pack...
                          </span>
                        </div>
                        <Progress value={66} className="h-2" />
                        <p className="text-sm text-muted-foreground">
                          Analyzing questions, organizing by marks, and creating
                          revision materials...
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}

            {/* Step 3: Preview */}
            {step === 3 && generatedPack && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {generatedPack.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Generated just now
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline">
                      <Eye className="mr-2 h-4 w-4" />
                      Print Preview
                    </Button>
                    <Button>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                </div>

                <Tabs defaultValue="questions" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="questions">
                      <FileQuestion className="mr-2 h-4 w-4" />
                      Questions
                    </TabsTrigger>
                    <TabsTrigger value="revision">
                      <FileText className="mr-2 h-4 w-4" />
                      Revision Notes
                    </TabsTrigger>
                    <TabsTrigger value="formulas">
                      <Calculator className="mr-2 h-4 w-4" />
                      Formulas
                    </TabsTrigger>
                    <TabsTrigger value="tips">
                      <Lightbulb className="mr-2 h-4 w-4" />
                      Tips
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="questions" className="space-y-6">
                    {generatedPack.sections.map((section, idx) => (
                      <Card key={idx}>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {section.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {section.questions.map((q, qIdx) => (
                              <div
                                key={q.id}
                                className="flex items-start gap-4 rounded-lg border border-border p-4"
                              >
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                                  {qIdx + 1}
                                </span>
                                <div className="flex-1">
                                  <p className="leading-relaxed">{q.text}</p>
                                  <div className="mt-2 flex items-center gap-2">
                                    <Badge variant="secondary" className="text-xs">
                                      {q.marks} Marks
                                    </Badge>
                                    {q.frequency > 5 && (
                                      <Badge
                                        variant="outline"
                                        className="bg-chart-5/10 text-xs text-chart-5"
                                      >
                                        <Star className="mr-1 h-3 w-3" />
                                        High Priority
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="revision">
                    <Card>
                      <CardHeader>
                        <CardTitle>Key Points to Remember</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {generatedPack.revisionNotes.map((note, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 rounded-lg bg-muted/50 p-3"
                            >
                              <ListChecks className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                              <span>{note}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="formulas">
                    <Card>
                      <CardHeader>
                        <CardTitle>Formula Sheet</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {generatedPack.formulas.map((formula, idx) => (
                            <div
                              key={idx}
                              className="rounded-lg border border-border bg-muted/30 p-4 font-mono text-sm"
                            >
                              {formula}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="tips">
                    <Card>
                      <CardHeader>
                        <CardTitle>Last-Minute Tips</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {generatedPack.tips.map((tip, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-3 rounded-lg bg-accent/10 p-4"
                            >
                              <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                              <span>{tip}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStep(1)
                      setGeneratedPack(null)
                    }}
                  >
                    Create New Pack
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
