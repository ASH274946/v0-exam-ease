"use client"

import React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  TrendingDown,
  Clock,
  BookOpen,
  Target,
  Brain,
  Calendar,
  Award,
  Flame,
  BarChart3,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart as RePieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"

const studyTimeData = [
  { day: "Mon", hours: 4.5, target: 5 },
  { day: "Tue", hours: 5.2, target: 5 },
  { day: "Wed", hours: 3.8, target: 5 },
  { day: "Thu", hours: 6.1, target: 5 },
  { day: "Fri", hours: 4.9, target: 5 },
  { day: "Sat", hours: 7.2, target: 5 },
  { day: "Sun", hours: 3.5, target: 5 },
]

const weeklyProgressData = [
  { week: "W1", questions: 45, accuracy: 72 },
  { week: "W2", questions: 62, accuracy: 76 },
  { week: "W3", questions: 78, accuracy: 81 },
  { week: "W4", questions: 94, accuracy: 85 },
]

const subjectDistribution = [
  { name: "Data Structures", value: 28, color: "#6366f1" },
  { name: "Algorithms", value: 22, color: "#22c55e" },
  { name: "Computer Networks", value: 18, color: "#f59e0b" },
  { name: "Database", value: 15, color: "#ec4899" },
  { name: "Operating Systems", value: 17, color: "#8b5cf6" },
]

const performanceByDifficulty = [
  { difficulty: "Easy", correct: 85, incorrect: 15 },
  { difficulty: "Medium", correct: 72, incorrect: 28 },
  { difficulty: "Hard", correct: 58, incorrect: 42 },
]

const monthlyTrend = [
  { month: "Sep", studyHours: 45, questionsAttempted: 120, accuracy: 65 },
  { month: "Oct", studyHours: 52, questionsAttempted: 180, accuracy: 70 },
  { month: "Nov", studyHours: 68, questionsAttempted: 250, accuracy: 75 },
  { month: "Dec", studyHours: 72, questionsAttempted: 320, accuracy: 78 },
  { month: "Jan", studyHours: 85, questionsAttempted: 420, accuracy: 82 },
]

const recentAchievements = [
  {
    id: 1,
    title: "7-Day Streak",
    description: "Studied for 7 consecutive days",
    icon: Flame,
    date: "Today",
    color: "text-orange-500",
  },
  {
    id: 2,
    title: "100 Questions",
    description: "Completed 100 practice questions",
    icon: Target,
    date: "2 days ago",
    color: "text-primary",
  },
  {
    id: 3,
    title: "Perfect Score",
    description: "Got 100% on a practice test",
    icon: Award,
    date: "5 days ago",
    color: "text-yellow-500",
  },
]

const weakAreas = [
  { topic: "Graph Algorithms", accuracy: 45, attempts: 20 },
  { topic: "Dynamic Programming", accuracy: 52, attempts: 15 },
  { topic: "Network Protocols", accuracy: 58, attempts: 18 },
]

const strongAreas = [
  { topic: "Array Operations", accuracy: 92, attempts: 25 },
  { topic: "SQL Queries", accuracy: 88, attempts: 30 },
  { topic: "Sorting Algorithms", accuracy: 85, attempts: 22 },
]

export default function AnalyticsPage() {
  const { user } = useAppStore()
  const [timeRange, setTimeRange] = useState("week")

  const stats = [
    {
      label: "Total Study Hours",
      value: "35.2",
      change: "+12%",
      trend: "up",
      icon: Clock,
      color: "text-primary",
    },
    {
      label: "Questions Practiced",
      value: "248",
      change: "+28%",
      trend: "up",
      icon: BookOpen,
      color: "text-accent",
    },
    {
      label: "Average Accuracy",
      value: "82%",
      change: "+5%",
      trend: "up",
      icon: Target,
      color: "text-success",
    },
    {
      label: "Current Streak",
      value: "7 days",
      change: "+3",
      trend: "up",
      icon: Flame,
      color: "text-orange-500",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
              <p className="text-muted-foreground">
                Track your progress and identify areas for improvement
              </p>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="semester">This Semester</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg bg-muted",
                        stat.color
                      )}
                    >
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        stat.trend === "up"
                          ? "border-success/30 bg-success/10 text-success"
                          : "border-destructive/30 bg-destructive/10 text-destructive"
                      )}
                    >
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="mr-1 h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-3 w-3" />
                      )}
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="subjects" className="gap-2">
              <PieChart className="h-4 w-4" />
              Subjects
            </TabsTrigger>
            <TabsTrigger value="progress" className="gap-2">
              <LineChart className="h-4 w-4" />
              Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Study Time Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Daily Study Time
                    </CardTitle>
                    <CardDescription>
                      Hours studied vs. daily target
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={studyTimeData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="day" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            borderColor: "hsl(var(--border))",
                            borderRadius: "var(--radius)",
                          }}
                        />
                        <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="target" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Performance by Difficulty */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-accent" />
                      Performance by Difficulty
                    </CardTitle>
                    <CardDescription>
                      Correct vs. incorrect by difficulty level
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={performanceByDifficulty} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis type="number" className="text-xs" />
                        <YAxis dataKey="difficulty" type="category" className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            borderColor: "hsl(var(--border))",
                            borderRadius: "var(--radius)",
                          }}
                        />
                        <Bar dataKey="correct" stackId="a" fill="hsl(var(--success))" />
                        <Bar dataKey="incorrect" stackId="a" fill="hsl(var(--destructive))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Strengths and Weaknesses */}
            <div className="grid gap-6 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-success" />
                      Strong Areas
                    </CardTitle>
                    <CardDescription>
                      Topics where you excel
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {strongAreas.map((area) => (
                        <div key={area.topic}>
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <span className="font-medium">{area.topic}</span>
                            <span className="text-success">{area.accuracy}%</span>
                          </div>
                          <Progress value={area.accuracy} className="h-2" />
                          <p className="mt-1 text-xs text-muted-foreground">
                            {area.attempts} questions attempted
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingDown className="h-5 w-5 text-destructive" />
                      Areas to Improve
                    </CardTitle>
                    <CardDescription>
                      Focus on these topics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {weakAreas.map((area) => (
                        <div key={area.topic}>
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <span className="font-medium">{area.topic}</span>
                            <span className="text-destructive">{area.accuracy}%</span>
                          </div>
                          <Progress value={area.accuracy} className="h-2" />
                          <p className="mt-1 text-xs text-muted-foreground">
                            {area.attempts} questions attempted
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Recent Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {recentAchievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex items-start gap-3 rounded-lg border p-4"
                      >
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full bg-muted",
                            achievement.color
                          )}
                        >
                          <achievement.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">{achievement.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {achievement.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Subject Distribution Pie Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Study Time by Subject</CardTitle>
                    <CardDescription>
                      Distribution of your study hours across subjects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RePieChart>
                        <Pie
                          data={subjectDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {subjectDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            borderColor: "hsl(var(--border))",
                            borderRadius: "var(--radius)",
                          }}
                        />
                        <Legend />
                      </RePieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Subject Progress List */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Subject Progress</CardTitle>
                    <CardDescription>
                      Your progress in each subject
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {subjectDistribution.map((subject) => (
                        <div key={subject.name}>
                          <div className="mb-1 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: subject.color }}
                              />
                              <span className="text-sm font-medium">
                                {subject.name}
                              </span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {subject.value}%
                            </span>
                          </div>
                          <Progress
                            value={subject.value}
                            className="h-2"
                            style={
                              {
                                "--progress-color": subject.color,
                              } as React.CSSProperties
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            {/* Monthly Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Monthly Progress Trend
                  </CardTitle>
                  <CardDescription>
                    Your learning journey over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "var(--radius)",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="studyHours"
                        name="Study Hours"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.2}
                      />
                      <Area
                        type="monotone"
                        dataKey="accuracy"
                        name="Accuracy %"
                        stroke="hsl(var(--accent))"
                        fill="hsl(var(--accent))"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Weekly Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Practice Stats</CardTitle>
                  <CardDescription>
                    Questions attempted and accuracy by week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={weeklyProgressData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="week" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "var(--radius)",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="questions"
                        name="Questions"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="accuracy"
                        name="Accuracy %"
                        fill="hsl(var(--accent))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
