"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import {
  FileUp,
  Brain,
  Package,
  Calendar,
  Timer,
  BarChart3,
  Sparkles,
  BookOpen,
} from "lucide-react"

const features = [
  {
    icon: FileUp,
    title: "Smart Document Hub",
    description:
      "Upload PDF, DOCX, PPTX, and more. Automatic parsing extracts key concepts, definitions, and important topics.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Brain,
    title: "Intelligent Question Bank",
    description:
      "Auto-generate questions from your materials. Classify by difficulty, marks, and topic for targeted practice.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Package,
    title: "Exam Prep Pack Generator",
    description:
      "Create comprehensive exam-ready documents with unit-wise questions, model answers, and revision notes.",
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    icon: Calendar,
    title: "Study Planner",
    description:
      "AI-powered scheduling with priority-based task management. Spaced repetition for better retention.",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
  {
    icon: Timer,
    title: "Focus Mode",
    description:
      "Pomodoro timer with ambient UI. Track sessions, set goals, and minimize distractions during study time.",
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
  },
  {
    icon: BarChart3,
    title: "Analytics Engine",
    description:
      "Track progress, identify weak areas, and get personalized insights to optimize your study strategy.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Powerful Features
          </span>
          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              excel
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            A complete toolkit designed specifically for engineering students to
            maximize study efficiency and exam performance.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
            >
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bgColor}`}
              >
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
              <div className="absolute right-4 bottom-4 opacity-0 transition-opacity group-hover:opacity-100">
                <BookOpen className="h-5 w-5 text-muted-foreground/50" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
