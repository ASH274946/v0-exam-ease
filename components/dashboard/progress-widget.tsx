"use client"

import React from "react"

import { motion } from "framer-motion"
import { Trophy, Star, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAppStore } from "@/lib/store"

const badgeIcons: Record<string, React.ElementType> = {
  "early-bird": Star,
  consistent: Zap,
  "document-master": Trophy,
}

const badgeLabels: Record<string, string> = {
  "early-bird": "Early Bird",
  consistent: "Consistent",
  "document-master": "Doc Master",
}

export function ProgressWidget() {
  const { progress } = useAppStore()
  const xpToNextLevel = 500
  const currentLevelXp = progress.xp % xpToNextLevel
  const progressPercent = (currentLevelXp / xpToNextLevel) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-chart-3" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Level Progress */}
        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Level {progress.level}</span>
            <span className="text-muted-foreground">
              {currentLevelXp}/{xpToNextLevel} XP
            </span>
          </div>
          <Progress value={progressPercent} className="mt-2 h-2" />
          <p className="mt-1 text-xs text-muted-foreground">
            {xpToNextLevel - currentLevelXp} XP to next level
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-2xl font-bold">{progress.questionsAnswered}</p>
            <p className="text-xs text-muted-foreground">Questions Done</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-2xl font-bold">{progress.documentsUploaded}</p>
            <p className="text-xs text-muted-foreground">Docs Uploaded</p>
          </div>
        </div>

        {/* Badges */}
        <div>
          <p className="mb-3 text-sm font-medium">Badges Earned</p>
          <div className="flex flex-wrap gap-2">
            {progress.badges.map((badge, index) => {
              const Icon = badgeIcons[badge] || Star
              return (
                <motion.div
                  key={badge}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-1.5 rounded-full bg-chart-3/10 px-3 py-1.5"
                >
                  <Icon className="h-3.5 w-3.5 text-chart-3" />
                  <span className="text-xs font-medium">
                    {badgeLabels[badge] || badge}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
