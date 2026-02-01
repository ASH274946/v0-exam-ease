"use client"

import { motion } from "framer-motion"
import { FileText, Brain, Target, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function DashboardStats() {
  const { documents, questions, tasks, progress } = useAppStore()

  const stats = [
    {
      label: "Documents",
      value: documents.length.toString(),
      change: "+3 this week",
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Questions",
      value: questions.length.toString(),
      change: "+24 generated",
      icon: Brain,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Tasks Pending",
      value: tasks.filter((t) => t.status !== "completed").length.toString(),
      change: "2 due today",
      icon: Target,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      label: "Study Time",
      value: `${Math.floor(progress.studyTime / 60)}h`,
      change: "This semester",
      icon: Clock,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {stats.map((stat) => (
        <motion.div key={stat.label} variants={itemVariants}>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.change}
                </p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}
              >
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
