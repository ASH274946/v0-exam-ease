"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  Plus,
  Clock,
  BookOpen,
  Target,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  Trash2,
  Edit3,
  Bell,
  Repeat,
  AlertCircle,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"

interface StudyTask {
  id: string
  title: string
  subject: string
  date: string
  startTime: string
  endTime: string
  type: "study" | "revision" | "practice" | "exam"
  priority: "low" | "medium" | "high"
  completed: boolean
  notes?: string
  reminder?: boolean
  recurring?: "daily" | "weekly" | "none"
}

const initialTasks: StudyTask[] = [
  {
    id: "1",
    title: "Data Structures - Trees & Graphs",
    subject: "Data Structures",
    date: "2026-02-01",
    startTime: "09:00",
    endTime: "11:00",
    type: "study",
    priority: "high",
    completed: false,
    reminder: true,
  },
  {
    id: "2",
    title: "Digital Electronics - Sequential Circuits",
    subject: "Digital Electronics",
    date: "2026-02-01",
    startTime: "14:00",
    endTime: "16:00",
    type: "revision",
    priority: "medium",
    completed: true,
  },
  {
    id: "3",
    title: "Practice Problems - Algorithms",
    subject: "Algorithms",
    date: "2026-02-02",
    startTime: "10:00",
    endTime: "12:00",
    type: "practice",
    priority: "high",
    completed: false,
    recurring: "daily",
  },
  {
    id: "4",
    title: "Mid-term Exam - Computer Networks",
    subject: "Computer Networks",
    date: "2026-02-05",
    startTime: "09:00",
    endTime: "12:00",
    type: "exam",
    priority: "high",
    completed: false,
    reminder: true,
  },
]

const typeColors = {
  study: "bg-primary/10 text-primary border-primary/20",
  revision: "bg-accent/10 text-accent border-accent/20",
  practice: "bg-warning/10 text-warning-foreground border-warning/20",
  exam: "bg-destructive/10 text-destructive border-destructive/20",
}

const priorityColors = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-warning/10 text-warning-foreground",
  high: "bg-destructive/10 text-destructive",
}

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export default function PlannerPage() {
  const { user } = useAppStore()
  const [tasks, setTasks] = useState<StudyTask[]>(initialTasks)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1))
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    new Date(2026, 1, 1)
  )
  const [view, setView] = useState<"week" | "month">("week")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState<Partial<StudyTask>>({
    type: "study",
    priority: "medium",
    recurring: "none",
  })

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days: (Date | null)[] = []
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  const getWeekDays = (date: Date) => {
    const week: Date[] = []
    const start = new Date(date)
    start.setDate(start.getDate() - start.getDay())
    for (let i = 0; i < 7; i++) {
      week.push(new Date(start))
      start.setDate(start.getDate() + 1)
    }
    return week
  }

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  }

  const getTasksForDate = (date: Date) => {
    const dateStr = formatDate(date)
    return tasks.filter((task) => task.date === dateStr)
  }

  const navigatePrev = () => {
    const newDate = new Date(currentDate)
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setDate(newDate.getDate() - 7)
    }
    setCurrentDate(newDate)
  }

  const navigateNext = () => {
    const newDate = new Date(currentDate)
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() + 1)
    } else {
      newDate.setDate(newDate.getDate() + 7)
    }
    setCurrentDate(newDate)
  }

  const toggleTaskCompletion = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const addTask = () => {
    if (newTask.title && selectedDate) {
      const task: StudyTask = {
        id: Date.now().toString(),
        title: newTask.title,
        subject: newTask.subject || "General",
        date: formatDate(selectedDate),
        startTime: newTask.startTime || "09:00",
        endTime: newTask.endTime || "10:00",
        type: (newTask.type as StudyTask["type"]) || "study",
        priority: (newTask.priority as StudyTask["priority"]) || "medium",
        completed: false,
        notes: newTask.notes,
        reminder: newTask.reminder,
        recurring: newTask.recurring as StudyTask["recurring"],
      }
      setTasks((prev) => [...prev, task])
      setNewTask({ type: "study", priority: "medium", recurring: "none" })
      setIsAddDialogOpen(false)
    }
  }

  const weekDays = getWeekDays(currentDate)
  const monthDays = getDaysInMonth(currentDate)
  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : []

  const todayStats = {
    total: selectedDateTasks.length,
    completed: selectedDateTasks.filter((t) => t.completed).length,
    upcoming: selectedDateTasks.filter((t) => !t.completed).length,
    studyHours: selectedDateTasks.reduce((acc, task) => {
      const start = parseInt(task.startTime.split(":")[0])
      const end = parseInt(task.endTime.split(":")[0])
      return acc + (end - start)
    }, 0),
  }

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
              <h1 className="text-3xl font-bold text-foreground">
                Study Planner
              </h1>
              <p className="text-muted-foreground">
                Plan your study sessions and track your progress
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Study Session
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Schedule Study Session</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter session title"
                      value={newTask.title || ""}
                      onChange={(e) =>
                        setNewTask((prev) => ({ ...prev, title: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Enter subject"
                      value={newTask.subject || ""}
                      onChange={(e) =>
                        setNewTask((prev) => ({
                          ...prev,
                          subject: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={newTask.startTime || "09:00"}
                        onChange={(e) =>
                          setNewTask((prev) => ({
                            ...prev,
                            startTime: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={newTask.endTime || "10:00"}
                        onChange={(e) =>
                          setNewTask((prev) => ({
                            ...prev,
                            endTime: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Type</Label>
                      <Select
                        value={newTask.type}
                        onValueChange={(value) =>
                          setNewTask((prev) => ({ ...prev, type: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="study">Study</SelectItem>
                          <SelectItem value="revision">Revision</SelectItem>
                          <SelectItem value="practice">Practice</SelectItem>
                          <SelectItem value="exam">Exam</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value) =>
                          setNewTask((prev) => ({ ...prev, priority: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add notes..."
                      value={newTask.notes || ""}
                      onChange={(e) =>
                        setNewTask((prev) => ({ ...prev, notes: e.target.value }))
                      }
                    />
                  </div>
                  <Button onClick={addTask} className="w-full">
                    Add Session
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            {
              label: "Total Sessions",
              value: todayStats.total,
              icon: Calendar,
              color: "text-primary",
            },
            {
              label: "Completed",
              value: todayStats.completed,
              icon: CheckCircle2,
              color: "text-accent",
            },
            {
              label: "Upcoming",
              value: todayStats.upcoming,
              icon: Clock,
              color: "text-warning-foreground",
            },
            {
              label: "Study Hours",
              value: `${todayStats.studyHours}h`,
              icon: BookOpen,
              color: "text-primary",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg bg-muted",
                        stat.color
                      )}
                    >
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={navigatePrev}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <CardTitle>
                      {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={navigateNext}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={view === "week" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setView("week")}
                    >
                      Week
                    </Button>
                    <Button
                      variant={view === "month" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setView("month")}
                    >
                      Month
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Day Headers */}
                <div className="mb-2 grid grid-cols-7 gap-1">
                  {daysOfWeek.map((day) => (
                    <div
                      key={day}
                      className="py-2 text-center text-sm font-medium text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                {view === "week" ? (
                  <div className="grid grid-cols-7 gap-1">
                    {weekDays.map((day, index) => {
                      const dayTasks = getTasksForDate(day)
                      const isSelected =
                        selectedDate &&
                        formatDate(day) === formatDate(selectedDate)
                      const isToday =
                        formatDate(day) === formatDate(new Date(2026, 1, 1))

                      return (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedDate(day)}
                          className={cn(
                            "flex min-h-[120px] flex-col rounded-lg border p-2 text-left transition-colors",
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50",
                            isToday && "ring-2 ring-primary/30"
                          )}
                        >
                          <span
                            className={cn(
                              "mb-2 flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
                              isToday && "bg-primary text-primary-foreground",
                              isSelected &&
                                !isToday &&
                                "bg-secondary text-secondary-foreground"
                            )}
                          >
                            {day.getDate()}
                          </span>
                          <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                            {dayTasks.slice(0, 3).map((task) => (
                              <div
                                key={task.id}
                                className={cn(
                                  "truncate rounded px-1.5 py-0.5 text-xs",
                                  typeColors[task.type],
                                  task.completed && "opacity-50 line-through"
                                )}
                              >
                                {task.title}
                              </div>
                            ))}
                            {dayTasks.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{dayTasks.length - 3} more
                              </span>
                            )}
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-7 gap-1">
                    {monthDays.map((day, index) => {
                      if (!day) {
                        return <div key={index} className="min-h-[80px]" />
                      }
                      const dayTasks = getTasksForDate(day)
                      const isSelected =
                        selectedDate &&
                        formatDate(day) === formatDate(selectedDate)
                      const isToday =
                        formatDate(day) === formatDate(new Date(2026, 1, 1))

                      return (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedDate(day)}
                          className={cn(
                            "flex min-h-[80px] flex-col rounded-lg border p-1.5 text-left transition-colors",
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50",
                            isToday && "ring-2 ring-primary/30"
                          )}
                        >
                          <span
                            className={cn(
                              "mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                              isToday && "bg-primary text-primary-foreground",
                              isSelected &&
                                !isToday &&
                                "bg-secondary text-secondary-foreground"
                            )}
                          >
                            {day.getDate()}
                          </span>
                          <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                            {dayTasks.slice(0, 2).map((task) => (
                              <div
                                key={task.id}
                                className={cn(
                                  "truncate rounded px-1 py-0.5 text-[10px]",
                                  typeColors[task.type],
                                  task.completed && "opacity-50 line-through"
                                )}
                              >
                                {task.title}
                              </div>
                            ))}
                            {dayTasks.length > 2 && (
                              <span className="text-[10px] text-muted-foreground">
                                +{dayTasks.length - 2}
                              </span>
                            )}
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Tasks for Selected Date */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  {selectedDate
                    ? `${months[selectedDate.getMonth()]} ${selectedDate.getDate()}`
                    : "Select a Date"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {selectedDateTasks.length > 0 ? (
                    <motion.div
                      key="tasks"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      {selectedDateTasks.map((task) => (
                        <motion.div
                          key={task.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={cn(
                            "rounded-lg border p-3 transition-all",
                            task.completed && "opacity-60"
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => toggleTaskCompletion(task.id)}
                                className="mt-0.5 text-muted-foreground transition-colors hover:text-primary"
                              >
                                {task.completed ? (
                                  <CheckCircle2 className="h-5 w-5 text-accent" />
                                ) : (
                                  <Circle className="h-5 w-5" />
                                )}
                              </button>
                              <div className="flex-1">
                                <h4
                                  className={cn(
                                    "font-medium",
                                    task.completed && "line-through"
                                  )}
                                >
                                  {task.title}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {task.subject}
                                </p>
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className={typeColors[task.type]}
                                  >
                                    {task.type}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={priorityColors[task.priority]}
                                  >
                                    {task.priority}
                                  </Badge>
                                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {task.startTime} - {task.endTime}
                                  </span>
                                </div>
                                {task.recurring && task.recurring !== "none" && (
                                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                                    <Repeat className="h-3 w-3" />
                                    Repeats {task.recurring}
                                  </div>
                                )}
                                {task.reminder && (
                                  <div className="mt-1 flex items-center gap-1 text-xs text-primary">
                                    <Bell className="h-3 w-3" />
                                    Reminder set
                                  </div>
                                )}
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit3 className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => deleteTask(task.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <Calendar className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h4 className="mb-2 font-medium">No sessions scheduled</h4>
                      <p className="mb-4 text-sm text-muted-foreground">
                        Add a study session for this day
                      </p>
                      <Button
                        size="sm"
                        onClick={() => setIsAddDialogOpen(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Session
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
