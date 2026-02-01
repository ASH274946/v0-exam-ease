"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Upload, Brain, Package, Timer, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const actions = [
  {
    icon: Upload,
    title: "Upload Documents",
    description: "Add notes, papers, or assignments",
    href: "/documents",
    color: "text-primary",
    bgColor: "bg-primary/10",
    hoverBg: "hover:bg-primary/5",
  },
  {
    icon: Brain,
    title: "Generate Questions",
    description: "Create smart question bank",
    href: "/questions",
    color: "text-accent",
    bgColor: "bg-accent/10",
    hoverBg: "hover:bg-accent/5",
  },
  {
    icon: Package,
    title: "Create Prep Pack",
    description: "Build exam-ready materials",
    href: "/prep-pack",
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
    hoverBg: "hover:bg-chart-3/5",
  },
  {
    icon: Timer,
    title: "Start Focus Session",
    description: "Begin a Pomodoro session",
    href: "/focus",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
    hoverBg: "hover:bg-chart-4/5",
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {actions.map((action, index) => (
            <Link key={action.title} href={action.href}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`group flex items-center gap-4 rounded-xl border border-border p-4 transition-colors ${action.hoverBg}`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.bgColor}`}
                >
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{action.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
