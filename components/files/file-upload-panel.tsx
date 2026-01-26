"use client"

import { useState, useEffect } from 'react'
import { Upload, FileSpreadsheet, FileText, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import useStore from '@/stores/flow-store'

interface UploadedFile {
  id: string
  filename: string
  file_type: string
  file_size_bytes: number
  ai_generated_summary: string
  summary: string | null
  confirmed_at: string | null
  created_at: string
}

export default function FileUploadPanel() {
  const projectId = useStore((state) => state.projectId)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmingFile, setConfirmingFile] = useState<UploadedFile | null>(null)
  const [editedSummary, setEditedSummary] = useState('')

  const loadFiles = async () => {
    if (!projectId) return

    const response = await fetch(`/api/projects/${projectId}/files`)
    if (response.ok) {
      const data = await response.json()
      setFiles(data.files || [])
    }
  }

  // Load files when component mounts or projectId changes
  useEffect(() => {
    if (projectId) {
      loadFiles()
    }
  }, [projectId])

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !projectId) return

    setIsUploading(true)
    setUploadProgress('Uploading file...')

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
        setUploadProgress('File uploaded! Generating summary...')
        await loadFiles()
        
        // Show confirmation dialog
        setConfirmingFile(data.file)
        setEditedSummary(data.file.ai_generated_summary)
        setShowConfirmDialog(true)
        setUploadProgress(null)
      } else {
        alert(`Upload failed: ${data.error}`)
        setUploadProgress(null)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
      setUploadProgress(null)
    } finally {
      setIsUploading(false)
      event.target.value = '' // Reset input
    }
  }

  const handleConfirmSummary = async () => {
    if (!confirmingFile || !projectId) return

    const response = await fetch(`/api/projects/${projectId}/files/${confirmingFile.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ summary: editedSummary })
    })

    if (response.ok) {
      setShowConfirmDialog(false)
      setConfirmingFile(null)
      await loadFiles()
    } else {
      const data = await response.json()
      alert(`Failed to confirm: ${data.error}`)
    }
  }

  const handleDeleteFile = async (fileId: string) => {
    if (!projectId || !confirm('Delete this file? This cannot be undone.')) return

    const response = await fetch(`/api/projects/${projectId}/files/${fileId}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      await loadFiles()
    } else {
      alert('Failed to delete file')
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('spreadsheet') || fileType.includes('csv')) {
      return <FileSpreadsheet className="h-5 w-5" />
    }
    return <FileText className="h-5 w-5" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
    return `${Math.round(bytes / 1024 / 1024 * 10) / 10} MB`
  }

  return (
    <div className="space-y-4 group-data-[collapsible=icon]:hidden">
      {/* Upload Zone */}
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-3">
          Upload Excel, CSV, or PDF files for context
        </p>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".xlsx,.xls,.csv,.pdf"
          onChange={handleFileSelect}
          disabled={isUploading || !projectId}
        />
        <Button
          asChild
          disabled={isUploading || !projectId}
          variant="outline"
        >
          <label htmlFor="file-upload" className="cursor-pointer">
            {isUploading ? uploadProgress : 'Choose File'}
          </label>
        </Button>
        {!projectId && (
          <p className="text-xs text-destructive mt-2">Select a project first</p>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Uploaded Files</h3>
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-start gap-3 p-3 rounded-lg border bg-card"
            >
              <div className="mt-0.5">{getFileIcon(file.file_type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.filename}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.file_size_bytes)} • {new Date(file.created_at).toLocaleDateString()}
                </p>
                {file.summary && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {file.summary}
                  </p>
                )}
                {!file.confirmed_at && (
                  <p className="text-xs text-warning mt-1">⚠️ Awaiting confirmation</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                {file.confirmed_at && (
                  <Check className="h-4 w-4 text-success" />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteFile(file.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Confirm File Summary</DialogTitle>
            <DialogDescription>
              Review and edit the AI-generated summary. This is what the AI will know about this file.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {confirmingFile && (
              <>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-sm font-medium">{confirmingFile.filename}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(confirmingFile.file_size_bytes)}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Summary for AI Context
                  </label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Describe what this document contains and how it&apos;s useful for planning decisions. Minimum 200 characters.
                  </p>
                  <Textarea
                    value={editedSummary}
                    onChange={(e) => setEditedSummary(e.target.value)}
                    rows={8}
                    placeholder="Example: Hydrological assessment for River X catchment. Peak flows: 100yr = 450m³/s, 50yr = 320m³/s. Recommends 2x culvert upgrade at Station 15+200. Critical for drainage design and flood mitigation strategy."
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {editedSummary.length}/200 characters {editedSummary.length < 200 ? '(need more detail)' : '✓'}
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmSummary}
                    disabled={editedSummary.length < 200}
                  >
                    Confirm & Save
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
