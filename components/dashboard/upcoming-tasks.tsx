"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, ArrowRight, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

const priorityColors: Record<string, string> = {
  urgent: "text-destructive border-destructive",
  high: "text-chart-5 border-chart-5",
  medium: "text-chart-3 border-chart-3",
  low: "text-muted-foreground border-muted-foreground",
}

const priorityBg: Record<string, string> = {
  urgent: "bg-destructive/10",
  high: "bg-chart-5/10",
  medium: "bg-chart-3/10",
  low: "bg-muted",
}

function formatDueDate(date: Date) {
  const d = new Date(date)
  const now = new Date()
  const diffTime = d.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Due today"
  if (diffDays === 1) return "Due tomorrow"
  if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`
  return `Due in ${diffDays} days`
}

export function UpcomingTasks() {
  const { tasks, updateTask } = useAppStore()
  const pendingTasks = tasks
    .filter((t) => t.status !== "completed")
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )
    .slice(0, 4)

  const handleToggle = (taskId: string, currentStatus: string) => {
    updateTask(taskId, {
      status: currentStatus === "completed" ? "pending" : "completed",
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Tasks</CardTitle>
        <Link href="/planner">
          <Button variant="ghost" size="sm" className="gap-1">
            View planner
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pendingTasks.map((task, index) => {
            const dueDate = new Date(task.dueDate)
            const isOverdue = dueDate < new Date()

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 rounded-lg border border-border p-3"
              >
                <Checkbox
                  checked={task.status === "completed"}
                  onCheckedChange={() => handleToggle(task.id, task.status)}
                  className="mt-0.5"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        "font-medium",
                        task.status === "completed" &&
                          "text-muted-foreground line-through"
                      )}
                    >
                      {task.title}
                    </p>
                    {isOverdue && (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <Badge variant="secondary" className="text-xs">
                      {task.subject}
                    </Badge>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDueDate(task.dueDate)}
                    </span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    priorityColors[task.priority],
                    priorityBg[task.priority]
                  )}
                >
                  {task.priority}
                </Badge>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
