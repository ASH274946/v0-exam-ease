"use client"

import { motion } from "framer-motion"
import { Flame } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export function StudyStreak() {
  const { progress } = useAppStore()

  // Mock weekly data - in a real app this would come from the store
  const weeklyActivity = [true, true, true, true, true, true, true]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-chart-5" />
          Study Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Current Streak */}
        <div className="mb-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 rounded-full bg-chart-5/10 px-4 py-2"
          >
            <Flame className="h-6 w-6 text-chart-5" />
            <span className="text-2xl font-bold">{progress.streak}</span>
            <span className="text-sm text-muted-foreground">days</span>
          </motion.div>
          <p className="mt-2 text-sm text-muted-foreground">
            {"Keep it going! You're on fire!"}
          </p>
        </div>

        {/* Weekly View */}
        <div className="flex justify-between">
          {days.map((day, index) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  weeklyActivity[index]
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {weeklyActivity[index] ? (
                  <Flame className="h-5 w-5" />
                ) : (
                  <span className="text-xs">-</span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">{day}</span>
            </motion.div>
          ))}
        </div>

        {/* Motivational Message */}
        <div className="mt-6 rounded-lg bg-muted/50 p-3 text-center">
          <p className="text-sm text-muted-foreground">
            Study for at least 30 minutes today to keep your streak alive!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
