"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Filter,
  Brain,
  BookOpen,
  FileQuestion,
  Star,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Tag,
  Clock,
  Flame,
  Download,
  Plus,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore, type Question } from "@/lib/store"
import { cn } from "@/lib/utils"

const difficultyColors: Record<string, string> = {
  easy: "bg-accent/10 text-accent border-accent/20",
  medium: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  hard: "bg-destructive/10 text-destructive border-destructive/20",
}

const typeLabels: Record<string, string> = {
  short: "Short Answer",
  long: "Long Answer",
  numerical: "Numerical",
  theory: "Theory",
  mcq: "MCQ",
  "case-study": "Case Study",
}

const marksColors: Record<number, string> = {
  2: "bg-muted text-muted-foreground",
  5: "bg-primary/10 text-primary",
  10: "bg-accent/10 text-accent",
  15: "bg-chart-4/10 text-chart-4",
}

export default function QuestionsPage() {
  const { questions, addQuestion } = useAppStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [selectedMarks, setSelectedMarks] = useState<string>("all")
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false)

  const subjects = [...new Set(questions.map((q) => q.subject))]
  const markOptions = [...new Set(questions.map((q) => q.marks))].sort(
    (a, b) => a - b
  )

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.text
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesSubject =
      selectedSubject === "all" || q.subject === selectedSubject
    const matchesDifficulty =
      selectedDifficulty === "all" || q.difficulty === selectedDifficulty
    const matchesMarks =
      selectedMarks === "all" || q.marks.toString() === selectedMarks
    return matchesSearch && matchesSubject && matchesDifficulty && matchesMarks
  })

  const groupedBySubject = filteredQuestions.reduce(
    (acc, q) => {
      if (!acc[q.subject]) acc[q.subject] = []
      acc[q.subject].push(q)
      return acc
    },
    {} as Record<string, Question[]>
  )

  const stats = {
    total: questions.length,
    byDifficulty: {
      easy: questions.filter((q) => q.difficulty === "easy").length,
      medium: questions.filter((q) => q.difficulty === "medium").length,
      hard: questions.filter((q) => q.difficulty === "hard").length,
    },
    byMarks: markOptions.reduce(
      (acc, marks) => {
        acc[marks] = questions.filter((q) => q.marks === marks).length
        return acc
      },
      {} as Record<number, number>
    ),
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 pb-24 lg:pb-8">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Question Bank
              </h1>
              <p className="mt-1 text-muted-foreground">
                Browse and practice from your intelligent question collection
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Dialog
                open={generateDialogOpen}
                onOpenChange={setGenerateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Questions
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Generate Questions</DialogTitle>
                    <DialogDescription>
                      AI will analyze your documents and generate questions
                      automatically
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Select Document
                      </label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a document" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dsa">
                            Data Structures Notes.pdf
                          </SelectItem>
                          <SelectItem value="dbms">
                            Database Management Systems.pptx
                          </SelectItem>
                          <SelectItem value="os">
                            Operating Systems PYQ 2023.pdf
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Question Types
                        </label>
                        <Select defaultValue="all">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="short">Short Answer</SelectItem>
                            <SelectItem value="long">Long Answer</SelectItem>
                            <SelectItem value="mcq">MCQ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Number of Questions
                        </label>
                        <Select defaultValue="10">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 questions</SelectItem>
                            <SelectItem value="10">10 questions</SelectItem>
                            <SelectItem value="20">20 questions</SelectItem>
                            <SelectItem value="50">50 questions</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => setGenerateDialogOpen(false)}
                    >
                      <Brain className="mr-2 h-4 w-4" />
                      Generate Questions
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Questions
                    </p>
                    <p className="mt-1 text-3xl font-bold">{stats.total}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Easy</p>
                    <p className="mt-1 text-3xl font-bold">
                      {stats.byDifficulty.easy}
                    </p>
                  </div>
                  <Badge className={cn("text-xs", difficultyColors.easy)}>
                    Beginner
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Medium</p>
                    <p className="mt-1 text-3xl font-bold">
                      {stats.byDifficulty.medium}
                    </p>
                  </div>
                  <Badge className={cn("text-xs", difficultyColors.medium)}>
                    Intermediate
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Hard</p>
                    <p className="mt-1 text-3xl font-bold">
                      {stats.byDifficulty.hard}
                    </p>
                  </div>
                  <Badge className={cn("text-xs", difficultyColors.hard)}>
                    Advanced
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-[160px]">
                  <BookOpen className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedDifficulty}
                onValueChange={setSelectedDifficulty}
              >
                <SelectTrigger className="w-[140px]">
                  <Flame className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedMarks} onValueChange={setSelectedMarks}>
                <SelectTrigger className="w-[130px]">
                  <Star className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Marks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Marks</SelectItem>
                  {markOptions.map((marks) => (
                    <SelectItem key={marks} value={marks.toString()}>
                      {marks} Marks
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Questions List */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Questions</TabsTrigger>
              <TabsTrigger value="subject">By Subject</TabsTrigger>
              <TabsTrigger value="marks">By Marks</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-3">
                {filteredQuestions.map((question, index) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    index={index}
                    isExpanded={expandedQuestion === question.id}
                    onToggle={() =>
                      setExpandedQuestion(
                        expandedQuestion === question.id ? null : question.id
                      )
                    }
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="subject">
              <div className="space-y-8">
                {Object.entries(groupedBySubject).map(
                  ([subject, subjectQuestions]) => (
                    <div key={subject}>
                      <h3 className="mb-4 text-lg font-semibold">{subject}</h3>
                      <div className="space-y-3">
                        {subjectQuestions.map((question, index) => (
                          <QuestionCard
                            key={question.id}
                            question={question}
                            index={index}
                            isExpanded={expandedQuestion === question.id}
                            onToggle={() =>
                              setExpandedQuestion(
                                expandedQuestion === question.id
                                  ? null
                                  : question.id
                              )
                            }
                          />
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </TabsContent>

            <TabsContent value="marks">
              <div className="space-y-8">
                {markOptions.map((marks) => {
                  const marksQuestions = filteredQuestions.filter(
                    (q) => q.marks === marks
                  )
                  if (marksQuestions.length === 0) return null
                  return (
                    <div key={marks}>
                      <h3 className="mb-4 text-lg font-semibold">
                        {marks} Marks Questions
                      </h3>
                      <div className="space-y-3">
                        {marksQuestions.map((question, index) => (
                          <QuestionCard
                            key={question.id}
                            question={question}
                            index={index}
                            isExpanded={expandedQuestion === question.id}
                            onToggle={() =>
                              setExpandedQuestion(
                                expandedQuestion === question.id
                                  ? null
                                  : question.id
                              )
                            }
                          />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>

          {filteredQuestions.length === 0 && (
            <div className="py-12 text-center">
              <FileQuestion className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 font-medium">No questions found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your filters or generate new questions
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function QuestionCard({
  question,
  index,
  isExpanded,
  onToggle,
}: {
  question: Question
  index: number
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Card
        className={cn(
          "cursor-pointer transition-all",
          isExpanded && "ring-2 ring-primary/20"
        )}
        onClick={onToggle}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="font-medium leading-relaxed">{question.text}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {question.subject}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {question.unit}
                </Badge>
                <Badge
                  className={cn(
                    "text-xs",
                    marksColors[question.marks] || marksColors[2]
                  )}
                >
                  {question.marks} Marks
                </Badge>
                <Badge
                  variant="outline"
                  className={cn("text-xs", difficultyColors[question.difficulty])}
                >
                  {question.difficulty}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {typeLabels[question.type]}
                </Badge>
                {question.year && (
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="mr-1 h-3 w-3" />
                    {question.year}
                  </Badge>
                )}
                {question.frequency > 3 && (
                  <Badge
                    variant="secondary"
                    className="bg-chart-5/10 text-xs text-chart-5"
                  >
                    <Flame className="mr-1 h-3 w-3" />
                    Asked {question.frequency}x
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="ghost" size="icon" className="shrink-0">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          <AnimatePresence>
            {isExpanded && question.answer && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-4 border-t border-border pt-4">
                  <p className="mb-2 text-sm font-medium text-muted-foreground">
                    Model Answer
                  </p>
                  <p className="text-sm leading-relaxed">{question.answer}</p>
                  {question.keywords.length > 0 && (
                    <div className="mt-3">
                      <p className="mb-2 text-xs font-medium text-muted-foreground">
                        Keywords
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {question.keywords.map((keyword) => (
                          <Badge
                            key={keyword}
                            variant="outline"
                            className="text-xs"
                          >
                            <Tag className="mr-1 h-3 w-3" />
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}
