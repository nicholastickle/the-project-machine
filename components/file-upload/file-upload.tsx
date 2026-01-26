"use client"

import { useState } from 'react'
import { Upload, FileSpreadsheet, FileText, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import useStore from '@/stores/flow-store'
import { toast } from 'sonner'

interface UploadedFile {
  id: string
  filename: string
  file_type: string
  ai_generated_summary: string
  summary: string | null
  confirmed_at: string | null
  created_at: string
}

export default function FileUpload() {
  const projectId = useStore((state) => state.projectId)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [confirmingFile, setConfirmingFile] = useState<UploadedFile | null>(null)
  const [editedSummary, setEditedSummary] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const loadFiles = async () => {
    if (!projectId) return

    try {
      const response = await fetch(`/api/projects/${projectId}/files`)
      if (response.ok) {
        const data = await response.json()
        setFiles(data.files || [])
      }
    } catch (error) {
      console.error('Error loading files:', error)
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!projectId) {
      toast.error('Please select a project first')
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('extractStructure', 'true')

      const response = await fetch(`/api/projects/${projectId}/files`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        await loadFiles()
        // Auto-open confirmation dialog
        setConfirmingFile(data.file)
        setEditedSummary(data.file.ai_generated_summary)
      } else {
        toast.error(`Upload failed: ${data.error}`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileUpload(droppedFile)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileUpload(selectedFile)
    }
  }

  const confirmSummary = async () => {
    if (!confirmingFile || !projectId) return

    try {
      const response = await fetch(`/api/projects/${projectId}/files/${confirmingFile.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: editedSummary })
      })

      if (response.ok) {
        await loadFiles()
        setConfirmingFile(null)
      } else {
        const data = await response.json()
        toast.error(`Failed to confirm: ${data.error}`)
      }
    } catch (error) {
      console.error('Confirmation error:', error)
      toast.error('Failed to confirm file')
    }
  }

  const deleteFile = async (fileId: string) => {
    if (!projectId || !confirm('Delete this file?')) return

    try {
      const response = await fetch(`/api/projects/${projectId}/files/${fileId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await loadFiles()
      } else {
        toast.error('Failed to delete file')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete file')
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('spreadsheet') || fileType.includes('csv')) {
      return <FileSpreadsheet className="h-4 w-4" />
    }
    return <FileText className="h-4 w-4" />
  }

  return (
    <div className="space-y-3">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-2">
          Drag & drop or click to upload
        </p>
        <p className="text-xs text-muted-foreground mb-3">
          Excel, CSV, PDF (max 10MB)
        </p>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".xlsx,.xls,.csv,.pdf"
          onChange={handleFileSelect}
          disabled={isUploading || !projectId}
        />
        <label htmlFor="file-upload">
          <Button
            variant="outline"
            size="sm"
            disabled={isUploading || !projectId}
            onClick={() => document.getElementById('file-upload')?.click()}
            asChild
          >
            <span>
              {isUploading ? 'Uploading...' : 'Choose File'}
            </span>
          </Button>
        </label>
      </div>

      {/* File List */}
      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className={`flex items-start gap-2 p-2 rounded border ${
              file.confirmed_at ? 'border-border' : 'border-amber-500/50 bg-amber-500/5'
            }`}
          >
            <div className="mt-0.5">
              {getFileIcon(file.file_type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.filename}</p>
              {!file.confirmed_at && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Pending confirmation
                </p>
              )}
              {file.summary && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {file.summary}
                </p>
              )}
            </div>
            <div className="flex gap-1">
              {!file.confirmed_at && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => {
                    setConfirmingFile(file)
                    setEditedSummary(file.ai_generated_summary)
                  }}
                >
                  <Check className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => deleteFile(file.id)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog */}
      {confirmingFile && (
        <Dialog open onOpenChange={() => setConfirmingFile(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm File Summary</DialogTitle>
              <DialogDescription>
                Review and edit the AI-generated summary for: {confirmingFile.filename}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">AI-Generated Summary</label>
                <Textarea
                  value={editedSummary}
                  onChange={(e) => setEditedSummary(e.target.value)}
                  rows={4}
                  className="mt-1"
                  placeholder="Edit the summary to be more accurate..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setConfirmingFile(null)}>
                  Cancel
                </Button>
                <Button onClick={confirmSummary} disabled={!editedSummary.trim()}>
                  Confirm & Use
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
