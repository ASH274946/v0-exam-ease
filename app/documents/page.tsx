"use client"

import React from "react"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Upload,
  Search,
  Filter,
  Grid3X3,
  List,
  FolderPlus,
  FileText,
  Presentation,
  ImageIcon,
  FileArchive,
  MoreVertical,
  Trash2,
  Download,
  Eye,
  Tag,
  X,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAppStore, type Document } from "@/lib/store"
import { cn } from "@/lib/utils"

const typeIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  docx: FileText,
  pptx: Presentation,
  txt: FileText,
  image: ImageIcon,
  zip: FileArchive,
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

export default function DocumentsPage() {
  const { documents, folders, addDocument, removeDocument, addFolder } =
    useAppStore()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesFolder = selectedFolder ? doc.folderId === selectedFolder : true
    return matchesSearch && matchesFolder
  })

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const files = Array.from(e.dataTransfer.files)
      files.forEach((file) => {
        const extension = file.name.split(".").pop()?.toLowerCase()
        let type: Document["type"] = "txt"
        if (extension === "pdf") type = "pdf"
        else if (extension === "docx" || extension === "doc") type = "docx"
        else if (extension === "pptx" || extension === "ppt") type = "pptx"
        else if (["jpg", "jpeg", "png", "gif"].includes(extension || ""))
          type = "image"
        else if (extension === "zip") type = "zip"

        addDocument({
          name: file.name,
          type,
          size: file.size,
          tags: [],
          status: "processing",
        })
      })
    },
    [addDocument]
  )

  const handleCreateFolder = () => {
    const name = prompt("Enter folder name:")
    if (name) {
      addFolder({ name })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 pb-24 lg:pb-8">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Document Hub</h1>
              <p className="mt-1 text-muted-foreground">
                Upload and manage your study materials
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCreateFolder}
              >
                <FolderPlus className="mr-2 h-4 w-4" />
                New Folder
              </Button>
              <Button size="sm" onClick={() => setUploadDialogOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <div className="flex rounded-lg border border-border">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-r-none"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-l-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Folders */}
          <div className="mb-6 flex flex-wrap gap-2">
            <Button
              variant={selectedFolder === null ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSelectedFolder(null)}
            >
              All Documents
            </Button>
            {folders.map((folder) => (
              <Button
                key={folder.id}
                variant={selectedFolder === folder.id ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedFolder(folder.id)}
              >
                {folder.name}
              </Button>
            ))}
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "mb-6 rounded-xl border-2 border-dashed p-8 text-center transition-colors",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
          >
            <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-2 font-medium">
              Drop files here or click to browse
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              PDF, DOCX, PPTX, TXT, Images, and ZIP files supported
            </p>
          </div>

          {/* Documents Grid/List */}
          <AnimatePresence mode="popLayout">
            {viewMode === "grid" ? (
              <motion.div
                layout
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {filteredDocuments.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    onDelete={() => removeDocument(doc.id)}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div layout className="space-y-2">
                {filteredDocuments.map((doc) => (
                  <DocumentRow
                    key={doc.id}
                    document={doc}
                    onDelete={() => removeDocument(doc.id)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {filteredDocuments.length === 0 && (
            <div className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 font-medium">No documents found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Upload your first document or adjust your search filters
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Documents</DialogTitle>
            <DialogDescription>
              Upload your study materials for processing
            </DialogDescription>
          </DialogHeader>
          <div
            className="rounded-xl border-2 border-dashed border-border p-8 text-center"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => {
              handleDrop(e)
              setUploadDialogOpen(false)
            }}
          >
            <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-2 font-medium">Drop files here</p>
            <p className="mt-1 text-sm text-muted-foreground">
              or click to browse your files
            </p>
            <Button variant="outline" className="mt-4 bg-transparent">
              Select Files
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function DocumentCard({
  document,
  onDelete,
}: {
  document: Document
  onDelete: () => void
}) {
  const Icon = typeIcons[document.type] || FileText
  const colorClass = typeColors[document.type] || typeColors.txt

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <Card className="group overflow-hidden transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className={`rounded-lg p-2 ${colorClass}`}>
              <Icon className="h-6 w-6" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Tag className="mr-2 h-4 w-4" />
                  Add Tags
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={onDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <h3 className="mt-3 truncate font-medium">{document.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatFileSize(document.size)} · {formatDate(document.uploadedAt)}
          </p>
          <div className="mt-3 flex items-center gap-2">
            {document.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            <Badge
              variant={document.status === "ready" ? "default" : "secondary"}
              className="ml-auto text-xs"
            >
              {document.status}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function DocumentRow({
  document,
  onDelete,
}: {
  document: Document
  onDelete: () => void
}) {
  const Icon = typeIcons[document.type] || FileText
  const colorClass = typeColors[document.type] || typeColors.txt

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="group flex items-center gap-4 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
    >
      <div className={`rounded-lg p-2 ${colorClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{document.name}</p>
        <p className="text-sm text-muted-foreground">
          {formatFileSize(document.size)} · {formatDate(document.uploadedAt)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {document.tags.slice(0, 2).map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
        <Badge
          variant={document.status === "ready" ? "default" : "secondary"}
          className="text-xs"
        >
          {document.status}
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Download
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={onDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  )
}
