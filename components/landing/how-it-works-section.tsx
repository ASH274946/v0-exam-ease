"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Upload, Cpu, FileCheck, Rocket } from "lucide-react"

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Upload Documents",
    description:
      "Drag and drop your notes, previous year papers, assignments, and reference materials in any format.",
  },
  {
    step: "02",
    icon: Cpu,
    title: "AI Processing",
    description:
      "Our intelligent system extracts text, identifies questions, and classifies content by topic and difficulty.",
  },
  {
    step: "03",
    icon: FileCheck,
    title: "Generate Resources",
    description:
      "Get auto-generated question banks, study plans, and comprehensive exam preparation packs.",
  },
  {
    step: "04",
    icon: Rocket,
    title: "Ace Your Exams",
    description:
      "Study smarter with personalized schedules, focused practice, and real-time progress tracking.",
  },
]

export function HowItWorksSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section
      id="how-it-works"
      className="border-t border-border bg-muted/30 py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How it{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              works
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Get started in minutes and transform your exam preparation workflow.
          </p>
        </motion.div>

        <div ref={ref} className="relative mt-16">
          {/* Connection Line */}
          <div className="absolute top-24 right-0 left-0 hidden h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 lg:block" />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative text-center"
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <span className="mb-2 block text-sm font-semibold text-primary">
                  Step {step.step}
                </span>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
