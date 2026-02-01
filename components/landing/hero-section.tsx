"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  FileText,
  Brain,
  Sparkles,
  Play,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const floatingVariants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="text-center lg:text-left"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Smart Study Companion for Engineers
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
            >
              Ace Your Exams with{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Intelligent
              </span>{" "}
              Preparation
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty"
            >
              Upload your documents, generate smart question banks, and create
              exam-ready preparation packs. ExamEase transforms how engineering
              students study and succeed.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
            >
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 rounded-full px-8">
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 rounded-full px-8 bg-transparent"
              >
                <Play className="h-4 w-4" />
                Watch Demo
              </Button>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-10 flex items-center justify-center gap-8 lg:justify-start"
            >
              <div className="text-center">
                <p className="text-2xl font-bold">50K+</p>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold">1M+</p>
                <p className="text-sm text-muted-foreground">Questions</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold">98%</p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Floating UI Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative h-[500px]">
              {/* Main Card */}
              <motion.div
                variants={floatingVariants}
                initial="initial"
                animate="animate"
                className="absolute top-1/2 left-1/2 w-80 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 shadow-2xl"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Question Bank</h3>
                    <p className="text-sm text-muted-foreground">
                      Auto-generated from docs
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-sm font-medium">
                      Data Structures - Unit 3
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        10 Marks
                      </span>
                      <span className="rounded bg-accent/10 px-2 py-0.5 text-xs text-accent">
                        High Priority
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-sm font-medium">DBMS - Normalization</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        5 Marks
                      </span>
                      <span className="rounded bg-warning/10 px-2 py-0.5 text-xs text-warning">
                        Frequently Asked
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Document Card */}
              <motion.div
                variants={floatingVariants}
                initial="initial"
                animate="animate"
                style={{ animationDelay: "0.5s" }}
                className="absolute top-8 left-0 w-48 rounded-xl border border-border bg-card p-4 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
                    <FileText className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">OS Notes.pdf</p>
                    <p className="text-xs text-muted-foreground">Processing...</p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>

              {/* Study Plan Card */}
              <motion.div
                variants={floatingVariants}
                initial="initial"
                animate="animate"
                style={{ animationDelay: "1s" }}
                className="absolute right-0 bottom-12 w-56 rounded-xl border border-border bg-card p-4 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                    <BookOpen className="h-4 w-4 text-accent" />
                  </div>
                  <p className="text-sm font-medium">Study Plan Ready</p>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">68%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-[68%] bg-accent" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
