"use client"

import { useState, useEffect } from "react"
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
  Trash2,
  Download,
  Key,
  Smartphone,
  Lock,
  Loader2,
} from "lucide-react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { useRef } from "react"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"

const achievements = [
  {
    id: 1,
    title: "Early Bird",
    description: "Complete 10 study sessions before 8 AM",
    icon: Sun,
    progress: 70,
    unlocked: false,
    color: "text-amber-500",
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
    color: "text-amber-500",
  },
]

const stats = [
  { label: "Total Study Hours", value: "156", icon: Clock },
  { label: "Questions Answered", value: "1,248", icon: CheckCircle2 },
  { label: "Current Streak", value: "14 days", icon: Flame },
  { label: "Documents Uploaded", value: "47", icon: BookOpen },
]

export default function SettingsPage() {
  const router = useRouter()
  const { user, updateUser } = useAppStore()

  const handleLogout = () => {
    localStorage.removeItem("examease-storage")
    router.push("/")
  }
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "Alex",
    lastName: user?.lastName || "Johnson",
    email: user?.email || "alex.johnson@personal.com",
    studentEmail: user?.studentEmail || "alex.j@university.edu",
    institution: user?.institution || "State Engineering University",
    department: user?.department || "Computer Science",
    studyDuration: user?.studyDuration || 25,
  })
  const [isCustomDuration, setIsCustomDuration] = useState(![15, 25, 45, 60].includes(user?.studyDuration || 25))
  const [notifications, setNotifications] = useState({
    studyReminders: true,
    examAlerts: true,
    weeklyReports: true,
    achievementAlerts: true,
    emailDigest: false,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validation
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image (JPG, PNG, or WebP)")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB")
      return
    }

    setIsUploading(true)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      // Simulate backend upload
      setTimeout(() => {
        updateUser({ avatar: base64String })
        setIsUploading(false)
        toast.success("Profile picture updated successfully!")
      }, 1500)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    updateUser({ 
      firstName: formData.firstName,
      lastName: formData.lastName, 
      email: formData.email,
      studentEmail: formData.studentEmail,
      institution: formData.institution,
      department: formData.department,
      studyDuration: formData.studyDuration,
    })
    setIsEditing(false)
    toast.success("Profile updated successfully")
  }

  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Guest User"

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 pt-24 pb-24 lg:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account, preferences, and application settings
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
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={fullName} />
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-lg hover:scale-110 transition-transform"
                      onClick={handleAvatarClick}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                    </Button>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      className="hidden"
                      accept="image/jpeg,image/png,image/webp"
                    />
                  </div>
                  <h2 className="text-xl font-semibold">{fullName}</h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <div className="mt-2 flex flex-wrap justify-center gap-2">
                    <Badge variant="secondary">{user?.department}</Badge>
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
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="profile" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Alerts</span>
                </TabsTrigger>
                <TabsTrigger value="preferences" className="gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Preferences</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Security</span>
                </TabsTrigger>
                <TabsTrigger value="achievements" className="gap-2">
                  <Award className="h-4 w-4" />
                  <span className="hidden sm:inline">Badges</span>
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
                          Update your profile details and academic information
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
                            Save Changes
                          </>
                        ) : (
                          "Edit Profile"
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-6">
                      {/* Row 1: Names */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label htmlFor="firstName">First Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="firstName"
                              value={formData.firstName}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  firstName: e.target.value,
                                }))
                              }
                              className="pl-9"
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="lastName">Last Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="lastName"
                              value={formData.lastName}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  lastName: e.target.value,
                                }))
                              }
                              className="pl-9"
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Row 2: Emails */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label htmlFor="email">Personal Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
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
                              className="pl-9"
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="studentEmail">Student/Institution Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="studentEmail"
                              type="email"
                              value={formData.studentEmail}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  studentEmail: e.target.value,
                                }))
                              }
                              className="pl-9"
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Row 3: Academic */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label htmlFor="institution">Institution</Label>
                          <div className="relative">
                            <School className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="institution"
                              value={formData.institution}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  institution: e.target.value,
                                }))
                              }
                              className="pl-9"
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="department">Department</Label>
                          <div className="relative">
                            <BookOpen className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="department"
                              value={formData.department}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  department: e.target.value,
                                }))
                              }
                              className="pl-9"
                              disabled={!isEditing}
                            />
                          </div>
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
                      Control how and when you receive notifications
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
                        {mounted && resolvedTheme === "dark" ? (
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
                      <Select value={mounted ? (theme || "system") : "system"} onValueChange={setTheme}>
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
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Default Study Duration</p>
                          <p className="text-sm text-muted-foreground">
                            Set your preferred focus session length
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4">
                        <Select 
                          value={isCustomDuration ? "custom" : formData.studyDuration.toString()} 
                          onValueChange={(value) => {
                            if (value === "custom") {
                              setIsCustomDuration(true)
                            } else {
                              setIsCustomDuration(false)
                              const mins = parseInt(value)
                              setFormData(prev => ({ ...prev, studyDuration: mins }))
                              updateUser({ studyDuration: mins })
                            }
                          }}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="25">25 minutes</SelectItem>
                            <SelectItem value="45">45 minutes</SelectItem>
                            <SelectItem value="60">60 minutes</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>

                        {isCustomDuration && (
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                              <Input
                                type="number"
                                min={1}
                                max={300}
                                value={formData.studyDuration}
                                onChange={(e) => {
                                  const val = e.target.value === "" ? 0 : parseInt(e.target.value)
                                  const mins = Math.min(300, Math.max(0, val))
                                  setFormData(prev => ({ ...prev, studyDuration: mins }))
                                  updateUser({ studyDuration: mins })
                                }}
                                className="w-[100px]"
                              />
                              <span className="text-sm text-muted-foreground font-medium">
                                minutes
                              </span>
                            </div>
                            {formData.studyDuration > 60 && (
                              <p className="text-xs font-semibold text-primary animate-in fade-in slide-in-from-left-1">
                                {Math.floor(formData.studyDuration / 60)} hr{Math.floor(formData.studyDuration / 60) > 1 ? 's' : ''} {formData.studyDuration % 60} min
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Security & Privacy</CardTitle>
                    <CardDescription>
                      Manage your account security and data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Key className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Change Password</p>
                          <p className="text-sm text-muted-foreground">
                            Update your account password
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security
                          </p>
                        </div>
                      </div>
                      <Switch />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Active Sessions</p>
                          <p className="text-sm text-muted-foreground">
                            Manage devices where you&apos;re logged in
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Download className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Export Data</p>
                          <p className="text-sm text-muted-foreground">
                            Download all your data
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Export
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between transition-all duration-200 p-3 rounded-lg [&:has(button:hover)]:outline [&:has(button:hover)]:outline-1 [&:has(button:hover)]:outline-destructive">
                      <div className="flex items-center gap-3">
                        <Trash2 className="h-5 w-5 text-destructive" />
                        <div>
                          <p className="font-medium text-destructive">Delete Account</p>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete your account and data
                          </p>
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="transition-all duration-200 hover:bg-[#1a0000] hover:text-destructive border border-transparent hover:border-destructive"
                          >
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your
                              account and remove all your data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Delete Account
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between transition-all duration-200 p-3 rounded-lg [&:has(button:hover)]:outline [&:has(button:hover)]:outline-1 [&:has(button:hover)]:outline-destructive">
                      <div className="flex items-center gap-3">
                        <LogOut className="h-5 w-5 text-destructive" />
                        <div>
                          <p className="font-medium text-destructive">Logout</p>
                          <p className="text-sm text-muted-foreground">
                            Logout of ExamEase
                          </p>
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            className="transition-all duration-200 border border-transparent hover:bg-transparent hover:text-destructive hover:border-destructive"
                          >
                            Logout
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Logout</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to logout of ExamEase?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-destructive text-destructive-foreground transition-all duration-200 border border-transparent hover:bg-transparent hover:text-destructive hover:border-destructive"
                              onClick={handleLogout}
                            >
                              Logout
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Achievements Tab */}
              <TabsContent value="achievements">
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements & Badges</CardTitle>
                    <CardDescription>
                      Track your progress and unlock rewards
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className={`flex items-start gap-4 rounded-lg border p-4 transition-colors ${
                            achievement.unlocked
                              ? "bg-muted/50"
                              : "opacity-75"
                          }`}
                        >
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full ${
                              achievement.unlocked
                                ? "bg-primary/10"
                                : "bg-muted"
                            }`}
                          >
                            <achievement.icon
                              className={`h-6 w-6 ${
                                achievement.unlocked
                                  ? achievement.color
                                  : "text-muted-foreground"
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{achievement.title}</h4>
                              {achievement.unlocked && (
                                <Badge variant="secondary" className="text-xs">
                                  Unlocked
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {achievement.description}
                            </p>
                            <div className="mt-2">
                              <Progress
                                value={achievement.progress}
                                className="h-1.5"
                              />
                              <p className="mt-1 text-xs text-muted-foreground">
                                {achievement.progress}% complete
                              </p>
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
