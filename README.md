# 📘 ExamEase – AI-Powered Exam Preparation Platform

ExamEase is a modern, AI-powered web application designed to help students prepare for exams through smart revision, practice questions, and personalized learning support. Built using **v0**, **Next.js**, and deployed on **Vercel**, the platform focuses on speed, scalability, and user-friendly design.

---

## 🚀 Live Demo

🔗 **Production URL:** [https://v0-examease.vercel.app/](https://v0-examease.vercel.app/)

---

## 📌 Project Overview

ExamEase provides a centralised platform where students can:

* **Upload Documents:** Transform study materials into structured learning resources.
* **Generate Smart Questions:** Create personalized question banks based on uploaded content.
* **Manage Personal Profile:** Unified settings for academic and personal information.
* **Track Progress:** Visualise learning milestones and focus sessions.
* **Advanced Preferences:** Custom study durations and focus session management.

---

## 🛠️ Tech Stack

### Frontend

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **UI Components:** Shadcn UI, Framer Motion, Lucide React
* **Styling:** Tailwind CSS
* **State Management:** Zustand (with Persist middleware)
* **Themes:** Next-Themes (Light/Dark mode)
* **Notifications:** Sonner Toasts

### Backend & Database

* **Persistence:** SQLite with Prisma ORM (Local/Cloud SQL ready)
* **API:** Next.js Server Actions & API Routes
* **Deployment:** Vercel

---

## ✨ Recent Major Updates

### 🔧 Profile & Settings Refactor
- **Unified Account Management:** Removed standalone `/profile` page; all management is now consolidated in the `/settings` dashboard.
- **Enhanced Personal Information:** Structured fields for First Name, Last Name, academic emails, and institutional details.
- **Functional Avatar Upload:** Real-time preview and simulated backend upload for user profile pictures with loading states and success notifications.

### ⏱️ Study Preference Controls
- **Custom Study Duration:** Users can now set focus session lengths beyond presets (up to 300 minutes).
- **Duration Converter:** Real-time conversion of minutes into readable "hours and minutes" format (e.g., 90 mins -> 1 hr 30 min).

### 🎨 UI/UX Refinement
- **Clean Branding:** Removed square icons from navbars for a sleeker, text-only brand identity.
- **Smooth Navigation:** Implement transparent, blurred navigation bars with smooth scroll transitions.
- **"Coming Soon" Placeholders:** Implemented blocked interactions and toaster notifications for upcoming security features (2FA, Password Change, Export Data).

---

## 📂 Project Structure

The repository follows the standard Next.js App Router structure:

```
ExamEase/
│
├── app/                 # Application routes and pages
│   ├── dashboard/       # Main user dashboard
│   ├── settings/        # Unified settings & profile management
│   ├── layout.tsx       # Root layout with Toaster & ThemeProvider
│   └── globals.css      # Core Design System
│
├── components/          # Reusable UI components
│   ├── ui/              # Shadcn components
│   └── landing/         # Homepage sections (Hero, CTA, etc.)
│
├── lib/                 # Shared logic & store
│   └── store.ts         # Zustand Global Store
│
├── prisma/              # Database schema and migrations
└── README.md            # Documentation
```

---

## 💻 Local Development Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ASH274946/ExamEase.git
   cd ExamEase
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Database Initialization**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

---

## 👨‍💻 Author

**Aswin Kumar Reddy Koothedhula**
B.Tech Student | Full Stack & AI Enthusiast
GitHub: [https://github.com/ASH274946](https://github.com/ASH274946)

---

> If you find this project useful, consider giving it a ⭐ on GitHub.
