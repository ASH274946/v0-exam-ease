"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { uploadDocument, type UploadResult } from "@/app/actions/upload"
import { processDocument } from "@/app/actions/process"

interface FileWithProgress {
  file: File
  progress: number
  status: "pending" | "uploading" | "processing" | "complete" | "error"
  error?: string
  documentId?: string
}

interface FileUploadProps {
  onUploadComplete?: (results: UploadResult[]) => void
  maxFiles?: number
  className?: string
}

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint",
  "text/plain",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/zip",
]

const MAX_SIZE = 20 * 1024 * 1024 // 20MB

export function FileUpload({ onUploadComplete, maxFiles = 10, className }: FileUploadProps) {
  const [files, setFiles] = useState<FileWithProgress[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.slice(0, maxFiles - files.length).map((file) => ({
      file,
      progress: 0,
      status: "pending" as const,
    }))
    setFiles((prev) => [...prev, ...newFiles])
  }, [files.length, maxFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
      "application/vnd.ms-powerpoint": [".ppt"],
      "text/plain": [".txt"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "application/zip": [".zip"],
    },
    maxSize: MAX_SIZE,
    maxFiles: maxFiles - files.length,
    disabled: isUploading || files.length >= maxFiles,
  })

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    const results: UploadResult[] = []

    for (let i = 0; i < files.length; i++) {
      const fileItem = files[i]
      if (fileItem.status !== "pending") continue

      // Update status to uploading
      setFiles((prev) =>
        prev.map((f, idx) =>
          idx === i ? { ...f, status: "uploading" as const, progress: 30 } : f
        )
      )

      try {
        const formData = new FormData()
        formData.set("file", fileItem.file)

        const result = await uploadDocument(formData)

        if (result.success && result.documentId) {
          // Update to processing
          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === i ? { ...f, status: "processing" as const, progress: 60, documentId: result.documentId } : f
            )
          )

          // Process the document
          await processDocument(result.documentId)

          // Update to complete
          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === i ? { ...f, status: "complete" as const, progress: 100 } : f
            )
          )
        } else {
          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === i ? { ...f, status: "error" as const, error: result.error } : f
            )
          )
        }

        results.push(result)
      } catch (error) {
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? { ...f, status: "error" as const, error: "Upload failed" }
              : f
          )
        )
        results.push({ success: false, error: "Upload failed" })
      }
    }

    setIsUploading(false)
    onUploadComplete?.(results)
  }

  const clearCompleted = () => {
    setFiles((prev) => prev.filter((f) => f.status !== "complete"))
  }

  const getStatusIcon = (status: FileWithProgress["status"]) => {
    switch (status) {
      case "uploading":
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />
      case "complete":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusText = (status: FileWithProgress["status"]) => {
    switch (status) {
      case "uploading":
        return "Uploading..."
      case "processing":
        return "Processing..."
      case "complete":
        return "Complete"
      case "error":
        return "Failed"
      default:
        return "Pending"
    }
  }

  const hasCompletedFiles = files.some((f) => f.status === "complete")
  const hasPendingFiles = files.some((f) => f.status === "pending")

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50",
          (isUploading || files.length >= maxFiles) && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className="p-4 rounded-full bg-primary/10">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="font-medium">
              {isDragActive ? "Drop files here" : "Drag & drop files here"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse (PDF, DOCX, PPTX, TXT, Images)
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Max 20MB per file, up to {maxFiles} files
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Files ({files.length})</h4>
            {hasCompletedFiles && (
              <Button variant="ghost" size="sm" onClick={clearCompleted}>
                Clear completed
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {files.map((fileItem, index) => (
              <div
                key={`${fileItem.file.name}-${index}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                {getStatusIcon(fileItem.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{fileItem.file.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={fileItem.progress} className="h-1.5 flex-1" />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {getStatusText(fileItem.status)}
                    </span>
                  </div>
                  {fileItem.error && (
                    <p className="text-xs text-destructive mt-1">{fileItem.error}</p>
                  )}
                </div>
                {fileItem.status === "pending" && !isUploading && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {hasPendingFiles && (
            <Button onClick={uploadFiles} disabled={isUploading} className="w-full">
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload {files.filter((f) => f.status === "pending").length} file(s)
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
