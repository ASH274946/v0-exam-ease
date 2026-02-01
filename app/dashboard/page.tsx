"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentDocuments } from "@/components/dashboard/recent-documents"
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks"
import { ProgressWidget } from "@/components/dashboard/progress-widget"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { StudyStreak } from "@/components/dashboard/study-streak"

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

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 pb-24 lg:pb-8">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, Student
            </h1>
            <p className="mt-1 text-muted-foreground">
              {"Here's what's happening with your study progress today."}
            </p>
          </motion.div>

          {/* Stats */}
          <DashboardStats />

          {/* Main Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="mt-8 grid gap-6 lg:grid-cols-3"
          >
            {/* Left Column - 2/3 width */}
            <div className="space-y-6 lg:col-span-2">
              <motion.div variants={itemVariants}>
                <QuickActions />
              </motion.div>
              <motion.div variants={itemVariants}>
                <RecentDocuments />
              </motion.div>
              <motion.div variants={itemVariants}>
                <UpcomingTasks />
              </motion.div>
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              <motion.div variants={itemVariants}>
                <ProgressWidget />
              </motion.div>
              <motion.div variants={itemVariants}>
                <StudyStreak />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
