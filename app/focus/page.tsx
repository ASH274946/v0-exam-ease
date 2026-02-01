"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Volume2,
  VolumeX,
  Coffee,
  BookOpen,
  Target,
  Flame,
  Clock,
  CheckCircle2,
  Plus,
  X,
  Maximize2,
  Minimize2,
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
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"

type TimerMode = "focus" | "shortBreak" | "longBreak"

interface Task {
  id: string
  title: string
  completed: boolean
  pomodoros: number
  completedPomodoros: number
}

const defaultSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: true,
  autoStartPomodoros: false,
  soundEnabled: true,
}

export default function FocusPage() {
  const { user } = useAppStore()
  const [settings, setSettings] = useState(defaultSettings)
  const [mode, setMode] = useState<TimerMode>("focus")
  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [totalFocusTime, setTotalFocusTime] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Review Data Structures Notes",
      completed: false,
      pomodoros: 3,
      completedPomodoros: 1,
    },
    {
      id: "2",
      title: "Practice Sorting Algorithms",
      completed: false,
      pomodoros: 2,
      completedPomodoros: 0,
    },
    {
      id: "3",
      title: "Complete Database Assignment",
      completed: true,
      pomodoros: 4,
      completedPomodoros: 4,
    },
  ])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [activeTaskId, setActiveTaskId] = useState<string | null>("1")

  const getDuration = useCallback(
    (timerMode: TimerMode) => {
      switch (timerMode) {
        case "focus":
          return settings.focusDuration * 60
        case "shortBreak":
          return settings.shortBreakDuration * 60
        case "longBreak":
          return settings.longBreakDuration * 60
      }
    },
    [settings]
  )

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  const progress =
    ((getDuration(mode) - timeLeft) / getDuration(mode)) * 100

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode)
    setTimeLeft(getDuration(newMode))
    setIsRunning(false)
  }

  const handleStart = () => {
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(getDuration(mode))
  }

  const handleComplete = useCallback(() => {
    setIsRunning(false)

    if (mode === "focus") {
      const newCompletedPomodoros = completedPomodoros + 1
      setCompletedPomodoros(newCompletedPomodoros)
      setTotalFocusTime((prev) => prev + settings.focusDuration)

      // Update active task
      if (activeTaskId) {
        setTasks((prev) =>
          prev.map((task) => {
            if (task.id === activeTaskId) {
              const newCompleted = task.completedPomodoros + 1
              return {
                ...task,
                completedPomodoros: newCompleted,
                completed: newCompleted >= task.pomodoros,
              }
            }
            return task
          })
        )
      }

      // Determine next break type
      if (newCompletedPomodoros % settings.longBreakInterval === 0) {
        setMode("longBreak")
        setTimeLeft(settings.longBreakDuration * 60)
      } else {
        setMode("shortBreak")
        setTimeLeft(settings.shortBreakDuration * 60)
      }

      if (settings.autoStartBreaks) {
        setIsRunning(true)
      }
    } else {
      setMode("focus")
      setTimeLeft(settings.focusDuration * 60)
      if (settings.autoStartPomodoros) {
        setIsRunning(true)
      }
    }

    // Play sound
    if (settings.soundEnabled) {
      const audio = new Audio("/notification.mp3")
      audio.play().catch(() => {})
    }
  }, [
    mode,
    completedPomodoros,
    settings,
    activeTaskId,
  ])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleComplete()
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, handleComplete])

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        completed: false,
        pomodoros: 2,
        completedPomodoros: 0,
      }
      setTasks((prev) => [...prev, newTask])
      setNewTaskTitle("")
    }
  }

  const removeTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
    if (activeTaskId === taskId) {
      setActiveTaskId(null)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const modeConfig = {
    focus: {
      label: "Focus",
      color: "text-primary",
      bgColor: "bg-primary/10",
      ringColor: "ring-primary",
      icon: Target,
    },
    shortBreak: {
      label: "Short Break",
      color: "text-accent",
      bgColor: "bg-accent/10",
      ringColor: "ring-accent",
      icon: Coffee,
    },
    longBreak: {
      label: "Long Break",
      color: "text-success",
      bgColor: "bg-success/10",
      ringColor: "ring-success",
      icon: Coffee,
    },
  }

  const currentConfig = modeConfig[mode]
  const activeTask = tasks.find((t) => t.id === activeTaskId)

  return (
    <div
      className={cn(
        "min-h-screen bg-background transition-colors",
        isFullscreen && "bg-background"
      )}
    >
      {!isFullscreen && <Navbar />}

      <main
        className={cn(
          "container mx-auto px-4 py-8",
          !isFullscreen && "pt-24"
        )}
      >
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Timer Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("lg:col-span-2", isFullscreen && "lg:col-span-3")}
          >
            <Card
              className={cn(
                "relative overflow-hidden",
                isFullscreen && "h-full border-0 shadow-none"
              )}
            >
              <CardContent
                className={cn(
                  "flex flex-col items-center justify-center p-8",
                  isFullscreen && "h-screen"
                )}
              >
                {/* Mode Selector */}
                <div className="mb-8 flex gap-2 rounded-full bg-muted p-1">
                  {(["focus", "shortBreak", "longBreak"] as TimerMode[]).map(
                    (timerMode) => (
                      <button
                        key={timerMode}
                        onClick={() => handleModeChange(timerMode)}
                        className={cn(
                          "rounded-full px-4 py-2 text-sm font-medium transition-all",
                          mode === timerMode
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {modeConfig[timerMode].label}
                      </button>
                    )
                  )}
                </div>

                {/* Timer Display */}
                <div className="relative mb-8">
                  <svg className="h-64 w-64" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-muted"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      className={currentConfig.color}
                      strokeDasharray={283}
                      strokeDashoffset={283 - (progress / 100) * 283}
                      transform="rotate(-90 50 50)"
                      initial={false}
                      animate={{ strokeDashoffset: 283 - (progress / 100) * 283 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className={cn(
                        "text-6xl font-light tracking-tight",
                        currentConfig.color
                      )}
                    >
                      {formatTime(timeLeft)}
                    </span>
                    <span className="mt-2 text-sm text-muted-foreground">
                      {currentConfig.label}
                    </span>
                  </div>
                </div>

                {/* Active Task */}
                {activeTask && mode === "focus" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 flex items-center gap-2 rounded-full bg-muted px-4 py-2"
                  >
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{activeTask.title}</span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {activeTask.completedPomodoros}/{activeTask.pomodoros}
                    </Badge>
                  </motion.div>
                )}

                {/* Controls */}
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReset}
                    className="h-12 w-12 rounded-full"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </Button>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      onClick={isRunning ? handlePause : handleStart}
                      className={cn(
                        "h-16 w-16 rounded-full text-lg",
                        currentConfig.bgColor,
                        currentConfig.color,
                        "border-2",
                        currentConfig.ringColor.replace("ring-", "border-")
                      )}
                      variant="outline"
                    >
                      {isRunning ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6 ml-0.5" />
                      )}
                    </Button>
                  </motion.div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setSettings((prev) => ({
                          ...prev,
                          soundEnabled: !prev.soundEnabled,
                        }))
                      }
                      className="h-12 w-12 rounded-full"
                    >
                      {settings.soundEnabled ? (
                        <Volume2 className="h-5 w-5" />
                      ) : (
                        <VolumeX className="h-5 w-5" />
                      )}
                    </Button>
                    <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-12 w-12 rounded-full"
                        >
                          <Settings className="h-5 w-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Timer Settings</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 pt-4">
                          <div>
                            <Label className="mb-2 block">
                              Focus Duration: {settings.focusDuration} min
                            </Label>
                            <Slider
                              value={[settings.focusDuration]}
                              onValueChange={([value]) =>
                                setSettings((prev) => ({
                                  ...prev,
                                  focusDuration: value,
                                }))
                              }
                              min={5}
                              max={60}
                              step={5}
                            />
                          </div>
                          <div>
                            <Label className="mb-2 block">
                              Short Break: {settings.shortBreakDuration} min
                            </Label>
                            <Slider
                              value={[settings.shortBreakDuration]}
                              onValueChange={([value]) =>
                                setSettings((prev) => ({
                                  ...prev,
                                  shortBreakDuration: value,
                                }))
                              }
                              min={1}
                              max={15}
                              step={1}
                            />
                          </div>
                          <div>
                            <Label className="mb-2 block">
                              Long Break: {settings.longBreakDuration} min
                            </Label>
                            <Slider
                              value={[settings.longBreakDuration]}
                              onValueChange={([value]) =>
                                setSettings((prev) => ({
                                  ...prev,
                                  longBreakDuration: value,
                                }))
                              }
                              min={5}
                              max={30}
                              step={5}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Auto-start Breaks</Label>
                            <Switch
                              checked={settings.autoStartBreaks}
                              onCheckedChange={(checked) =>
                                setSettings((prev) => ({
                                  ...prev,
                                  autoStartBreaks: checked,
                                }))
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Auto-start Focus</Label>
                            <Switch
                              checked={settings.autoStartPomodoros}
                              onCheckedChange={(checked) =>
                                setSettings((prev) => ({
                                  ...prev,
                                  autoStartPomodoros: checked,
                                }))
                              }
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleFullscreen}
                      className="h-12 w-12 rounded-full"
                    >
                      {isFullscreen ? (
                        <Minimize2 className="h-5 w-5" />
                      ) : (
                        <Maximize2 className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-8 flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Flame className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{completedPomodoros}</p>
                      <p className="text-xs text-muted-foreground">Pomodoros</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                      <Clock className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{totalFocusTime}</p>
                      <p className="text-xs text-muted-foreground">Minutes</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tasks Panel */}
          {!isFullscreen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Focus Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Add Task */}
                  <div className="mb-4 flex gap-2">
                    <Input
                      placeholder="Add a task..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addTask()}
                    />
                    <Button size="icon" onClick={addTask}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-2">
                    <AnimatePresence>
                      {tasks.map((task) => (
                        <motion.div
                          key={task.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          onClick={() =>
                            !task.completed && setActiveTaskId(task.id)
                          }
                          className={cn(
                            "group flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all",
                            activeTaskId === task.id
                              ? "border-primary bg-primary/5"
                              : "hover:border-primary/50",
                            task.completed && "cursor-default opacity-50"
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-5 w-5 items-center justify-center rounded-full border-2",
                              task.completed
                                ? "border-accent bg-accent text-accent-foreground"
                                : "border-muted-foreground"
                            )}
                          >
                            {task.completed && (
                              <CheckCircle2 className="h-3 w-3" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p
                              className={cn(
                                "text-sm font-medium",
                                task.completed && "line-through"
                              )}
                            >
                              {task.title}
                            </p>
                            <div className="mt-1 flex items-center gap-1">
                              {Array.from({ length: task.pomodoros }).map(
                                (_, i) => (
                                  <div
                                    key={i}
                                    className={cn(
                                      "h-2 w-2 rounded-full",
                                      i < task.completedPomodoros
                                        ? "bg-primary"
                                        : "bg-muted"
                                    )}
                                  />
                                )
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeTask(task.id)
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Progress Summary */}
                  <div className="mt-6 rounded-lg bg-muted p-4">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Today&apos;s Progress
                      </span>
                      <span className="font-medium">
                        {tasks.filter((t) => t.completed).length}/{tasks.length}
                      </span>
                    </div>
                    <Progress
                      value={
                        (tasks.filter((t) => t.completed).length / tasks.length) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
