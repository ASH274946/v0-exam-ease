"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  User,
  Mail,
  School,
  BookOpen,
  Calendar,
  Bell,
  Shield,
  Moon,
  Sun,
  Globe,
  LogOut,
  Camera,
  Save,
  Award,
  Flame,
  Target,
  Clock,
  CheckCircle2,
  Settings,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"

const achievements = [
  {
    id: 1,
    title: "Early Bird",
    description: "Complete 10 study sessions before 8 AM",
    icon: Sun,
    progress: 70,
    unlocked: false,
    color: "text-yellow-500",
  },
  {
    id: 2,
    title: "Night Owl",
    description: "Complete 10 study sessions after 10 PM",
    icon: Moon,
    progress: 100,
    unlocked: true,
    color: "text-indigo-500",
  },
  {
    id: 3,
    title: "Streak Master",
    description: "Maintain a 30-day study streak",
    icon: Flame,
    progress: 45,
    unlocked: false,
    color: "text-orange-500",
  },
  {
    id: 4,
    title: "Question Conqueror",
    description: "Answer 500 questions correctly",
    icon: Target,
    progress: 100,
    unlocked: true,
    color: "text-primary",
  },
  {
    id: 5,
    title: "Time Warrior",
    description: "Study for 100 hours total",
    icon: Clock,
    progress: 82,
    unlocked: false,
    color: "text-accent",
  },
  {
    id: 6,
    title: "Perfect Score",
    description: "Get 100% on 10 practice tests",
    icon: Award,
    progress: 100,
    unlocked: true,
    color: "text-yellow-500",
  },
]

const stats = [
  { label: "Total Study Hours", value: "156", icon: Clock },
  { label: "Questions Answered", value: "1,248", icon: CheckCircle2 },
  { label: "Current Streak", value: "14 days", icon: Flame },
  { label: "Documents Uploaded", value: "47", icon: BookOpen },
]

export default function ProfilePage() {
  const { user, updateUser } = useAppStore()
  const { theme, setTheme } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "Alex Johnson",
    email: user?.email || "alex.johnson@university.edu",
    institution: "State Engineering University",
    department: "Computer Science",
    semester: "5th Semester",
    targetExam: "GATE 2026",
  })
  const [notifications, setNotifications] = useState({
    studyReminders: true,
    examAlerts: true,
    weeklyReports: true,
    achievementAlerts: true,
    emailDigest: false,
  })

  const handleSave = () => {
    updateUser({ name: formData.name, email: formData.email })
    setIsEditing(false)
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
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={formData.name} />
                      <AvatarFallback className="text-2xl">
                        {formData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <h2 className="text-xl font-semibold">{formData.name}</h2>
                  <p className="text-sm text-muted-foreground">{formData.email}</p>
                  <div className="mt-2 flex flex-wrap justify-center gap-2">
                    <Badge variant="secondary">{formData.department}</Badge>
                    <Badge variant="outline">{formData.semester}</Badge>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <stat.icon className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-lg font-semibold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Settings Tabs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="preferences" className="gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Preferences</span>
                </TabsTrigger>
                <TabsTrigger value="achievements" className="gap-2">
                  <Award className="h-4 w-4" />
                  <span className="hidden sm:inline">Achievements</span>
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                          Update your profile details
                        </CardDescription>
                      </div>
                      <Button
                        variant={isEditing ? "default" : "outline"}
                        onClick={() =>
                          isEditing ? handleSave() : setIsEditing(true)
                        }
                        className="gap-2"
                      >
                        {isEditing ? (
                          <>
                            <Save className="h-4 w-4" />
                            Save
                          </>
                        ) : (
                          "Edit"
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <div className="mt-1.5 flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <div className="mt-1.5 flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="institution">Institution</Label>
                        <div className="mt-1.5 flex items-center gap-2">
                          <School className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="institution"
                            value={formData.institution}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                institution: e.target.value,
                              }))
                            }
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <div className="mt-1.5 flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="department"
                            value={formData.department}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                department: e.target.value,
                              }))
                            }
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="semester">Current Semester</Label>
                        <Select
                          value={formData.semester}
                          onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, semester: value }))
                          }
                          disabled={!isEditing}
                        >
                          <SelectTrigger className="mt-1.5">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                              <SelectItem key={sem} value={`${sem}th Semester`}>
                                {sem}th Semester
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="targetExam">Target Exam</Label>
                        <div className="mt-1.5 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="targetExam"
                            value={formData.targetExam}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                targetExam: e.target.value,
                              }))
                            }
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Control how you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {[
                      {
                        key: "studyReminders",
                        label: "Study Reminders",
                        description:
                          "Get reminders for scheduled study sessions",
                      },
                      {
                        key: "examAlerts",
                        label: "Exam Alerts",
                        description:
                          "Receive alerts for upcoming exams and deadlines",
                      },
                      {
                        key: "weeklyReports",
                        label: "Weekly Progress Reports",
                        description:
                          "Get a summary of your weekly progress",
                      },
                      {
                        key: "achievementAlerts",
                        label: "Achievement Alerts",
                        description:
                          "Be notified when you unlock new achievements",
                      },
                      {
                        key: "emailDigest",
                        label: "Email Digest",
                        description:
                          "Receive a daily email summary of your activity",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                        <Switch
                          checked={
                            notifications[
                              item.key as keyof typeof notifications
                            ]
                          }
                          onCheckedChange={(checked) =>
                            setNotifications((prev) => ({
                              ...prev,
                              [item.key]: checked,
                            }))
                          }
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>App Preferences</CardTitle>
                    <CardDescription>
                      Customize your app experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {theme === "dark" ? (
                          <Moon className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Sun className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div>
                          <p className="font-medium">Theme</p>
                          <p className="text-sm text-muted-foreground">
                            Choose your preferred theme
                          </p>
                        </div>
                      </div>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Language</p>
                          <p className="text-sm text-muted-foreground">
                            Select your preferred language
                          </p>
                        </div>
                      </div>
                      <Select defaultValue="en">
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                          <SelectItem value="ta">Tamil</SelectItem>
                          <SelectItem value="te">Telugu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Privacy</p>
                          <p className="text-sm text-muted-foreground">
                            Manage your data and privacy settings
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">Manage</Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <LogOut className="h-5 w-5 text-destructive" />
                        <div>
                          <p className="font-medium text-destructive">
                            Sign Out
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Sign out of your account
                          </p>
                        </div>
                      </div>
                      <Button variant="destructive">Sign Out</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Achievements Tab */}
              <TabsContent value="achievements">
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                    <CardDescription>
                      Your progress and unlocked achievements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className={cn(
                            "rounded-lg border p-4 transition-colors",
                            achievement.unlocked
                              ? "border-primary/30 bg-primary/5"
                              : "opacity-75"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                "flex h-12 w-12 items-center justify-center rounded-full",
                                achievement.unlocked
                                  ? "bg-primary/10"
                                  : "bg-muted",
                                achievement.color
                              )}
                            >
                              <achievement.icon
                                className={cn(
                                  "h-6 w-6",
                                  !achievement.unlocked && "text-muted-foreground"
                                )}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">
                                  {achievement.title}
                                </h4>
                                {achievement.unlocked && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Unlocked
                                  </Badge>
                                )}
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {achievement.description}
                              </p>
                              {!achievement.unlocked && (
                                <div className="mt-2">
                                  <div className="mb-1 flex justify-between text-xs">
                                    <span className="text-muted-foreground">
                                      Progress
                                    </span>
                                    <span>{achievement.progress}%</span>
                                  </div>
                                  <Progress
                                    value={achievement.progress}
                                    className="h-1.5"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
