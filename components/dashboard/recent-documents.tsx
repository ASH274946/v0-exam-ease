"use client"

import React from "react"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  FileText,
  ImageIcon,
  FileSpreadsheet,
  Presentation,
  MoreHorizontal,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"

const typeIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  docx: FileText,
  pptx: Presentation,
  txt: FileText,
  image: ImageIcon,
  zip: FileSpreadsheet,
}

const typeColors: Record<string, string> = {
  pdf: "text-red-500 bg-red-500/10",
  docx: "text-blue-500 bg-blue-500/10",
  pptx: "text-orange-500 bg-orange-500/10",
  txt: "text-muted-foreground bg-muted",
  image: "text-green-500 bg-green-500/10",
  zip: "text-purple-500 bg-purple-500/10",
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

function formatDate(date: Date) {
  const d = new Date(date)
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function RecentDocuments() {
  const { documents } = useAppStore()
  const recentDocs = documents.slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Documents</CardTitle>
        <Link href="/documents">
          <Button variant="ghost" size="sm" className="gap-1">
            View all
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentDocs.map((doc, index) => {
            const Icon = typeIcons[doc.type] || FileText
            const colorClass = typeColors[doc.type] || typeColors.txt

            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group flex items-center gap-4 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorClass}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{doc.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{formatFileSize(doc.size)}</span>
                    <span>•</span>
                    <span>{formatDate(doc.uploadedAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doc.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  <Badge
                    variant={doc.status === "ready" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {doc.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
