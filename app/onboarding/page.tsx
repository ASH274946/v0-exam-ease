"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  FileText,
  Target,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const steps = [
  {
    id: 1,
    title: "Select Your Subjects",
    description: "Choose the subjects you want to focus on this semester",
    icon: BookOpen,
  },
  {
    id: 2,
    title: "Set Your Goals",
    description: "Tell us about your exam schedule and target grades",
    icon: Target,
  },
  {
    id: 3,
    title: "Upload Materials",
    description: "Add your notes, previous papers, and reference materials",
    icon: FileText,
  },
]

const subjects = [
  { id: "dsa", name: "Data Structures & Algorithms", semester: "3-4" },
  { id: "dbms", name: "Database Management Systems", semester: "4-5" },
  { id: "os", name: "Operating Systems", semester: "4-5" },
  { id: "cn", name: "Computer Networks", semester: "5-6" },
  { id: "se", name: "Software Engineering", semester: "5-6" },
  { id: "ai", name: "Artificial Intelligence", semester: "6-7" },
  { id: "ml", name: "Machine Learning", semester: "6-7" },
  { id: "cd", name: "Compiler Design", semester: "5-6" },
]

const goals = [
  { id: "ace", label: "Ace the exam (90%+)", description: "Comprehensive preparation" },
  { id: "pass", label: "Pass comfortably (70-89%)", description: "Focused on key topics" },
  { id: "clear", label: "Clear the subject (50-69%)", description: "Minimum viable prep" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [selectedGoal, setSelectedGoal] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    )
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsComplete(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    if (currentStep === 1) return selectedSubjects.length > 0
    if (currentStep === 2) return selectedGoal !== ""
    return true
  }

  if (isComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10"
          >
            <CheckCircle2 className="h-10 w-10 text-accent" />
          </motion.div>
          <h2 className="text-2xl font-bold">All set!</h2>
          <p className="mt-2 text-muted-foreground">
            Redirecting you to your dashboard...
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">ExamEase</span>
          </div>
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                    currentStep >= step.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {currentStep > step.id ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "mx-2 h-0.5 w-8",
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step Header */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  {(() => {
                    const StepIcon = steps[currentStep - 1].icon
                    return <StepIcon className="h-7 w-7 text-primary" />
                  })()}
                </div>
                <h1 className="text-2xl font-bold">
                  {steps[currentStep - 1].title}
                </h1>
                <p className="mt-2 text-muted-foreground">
                  {steps[currentStep - 1].description}
                </p>
              </div>

              {/* Step Content */}
              {currentStep === 1 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {subjects.map((subject) => (
                    <motion.button
                      key={subject.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSubjectToggle(subject.id)}
                      className={cn(
                        "flex items-center justify-between rounded-xl border p-4 text-left transition-colors",
                        selectedSubjects.includes(subject.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div>
                        <p className="font-medium">{subject.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Semester {subject.semester}
                        </p>
                      </div>
                      {selectedSubjects.includes(subject.id) && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                    </motion.button>
                  ))}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-3">
                  {goals.map((goal) => (
                    <motion.button
                      key={goal.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedGoal(goal.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border p-5 text-left transition-colors",
                        selectedGoal === goal.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div>
                        <p className="font-medium">{goal.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {goal.description}
                        </p>
                      </div>
                      {selectedGoal === goal.id && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                    </motion.button>
                  ))}
                </div>
              )}

              {currentStep === 3 && (
                <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">
                    Drop your files here or click to browse
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Support for PDF, DOCX, PPTX, TXT, and images
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    <Badge variant="secondary">Previous Year Papers</Badge>
                    <Badge variant="secondary">Class Notes</Badge>
                    <Badge variant="secondary">Assignments</Badge>
                    <Badge variant="secondary">Reference Books</Badge>
                  </div>
                  <Button variant="outline" className="mt-6 bg-transparent">
                    Select Files
                  </Button>
                  <p className="mt-4 text-xs text-muted-foreground">
                    <Sparkles className="mr-1 inline h-3 w-3" />
                    You can skip this step and upload files later
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleNext} disabled={!canProceed()}>
              {currentStep === 3 ? "Complete Setup" : "Continue"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
