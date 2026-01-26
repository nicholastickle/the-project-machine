import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Paperclip, X, Upload } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import useStore from '@/stores/flow-store'
import { toast } from 'sonner'

interface ChatInputProps {
    inputValue: string
    isTyping: boolean
    onInputChange: (value: string) => void
    onSendMessage: () => void
    onKeyPress: (e: React.KeyboardEvent) => void
    onFileUploaded?: () => void
}

interface UploadedFile {
    id: string
    filename: string
    file_type: string
    file_size_bytes: number
    ai_generated_summary: string
    summary: string | null
    confirmed_at: string | null
}

export interface ChatInputRef {
    focus: () => void
}

const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(({
    inputValue,
    onInputChange,
    onSendMessage,
    onKeyPress,
    onFileUploaded
}, ref) => {
    const projectId = useStore((state) => state.projectId)
    const [aiMode, setAiMode] = useState<'ask' | 'agent'>('ask')
    const [isUploading, setIsUploading] = useState(false)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [confirmingFile, setConfirmingFile] = useState<UploadedFile | null>(null)
    const [editedSummary, setEditedSummary] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleAddAttachment = () => {
        fileInputRef.current?.click()
    }

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file || !projectId) return

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
                setConfirmingFile(data.file)
                setEditedSummary(data.file.ai_generated_summary)
                setShowConfirmDialog(true)
            } else {
                toast.error(`Upload failed: ${data.error}`)
            }
        } catch (error) {
            console.error('Upload error:', error)
            toast.error('Upload failed. Please try again.')
        } finally {
            setIsUploading(false)
            event.target.value = ''
        }
    }

    const handleConfirmSummary = async () => {
        if (!confirmingFile || !projectId || editedSummary.trim().length < 200) {
            toast.error('Summary must be at least 200 characters and explain how this file informs planning decisions.')
            return
        }

        const response = await fetch(`/api/projects/${projectId}/files/${confirmingFile.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ summary: editedSummary })
        })

        if (response.ok) {
            setShowConfirmDialog(false)
            setConfirmingFile(null)
            toast.success('File summary confirmed')
            onFileUploaded?.()
        } else {
            const data = await response.json()
            toast.error(`Failed to confirm: ${data.error}`)
        }
    }

    const handleRemoveAttachment = (id: string) => {
        // Legacy - kept for backward compatibility
    }

    const handleInputChange = (value: string) => {
        onInputChange(value)
        adjustTextareaHeight()
    }

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current
        if (textarea) {
            textarea.style.height = 'auto'
            const maxHeight = Math.floor(window.innerHeight / 3)
            const newHeight = Math.min(textarea.scrollHeight, maxHeight)
            textarea.style.height = `${newHeight}px`
        }
    }

    useEffect(() => {
        adjustTextareaHeight()
    }, [inputValue])

    useImperativeHandle(ref, () => ({
        focus: () => {
            if (textareaRef.current) {
                textareaRef.current.focus()
                const length = textareaRef.current.value.length
                textareaRef.current.setSelectionRange(length, length)
            }
        }
    }), [])

    return (
        <div className="border-t border-chat-panel-border bg-chat-panel-background flex-shrink-0">
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".xlsx,.xls,.csv,.pdf,.docx,.doc"
                onChange={handleFileSelect}
                disabled={isUploading || !projectId}
            />
            
            <div className="p-4">
                <div className="relative flex flex-col border border-chat-panel-border rounded-md">
                    <Textarea
                        ref={textareaRef}
                        value={inputValue}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onKeyDown={onKeyPress}
                        placeholder="What can I help you with today?"
                        className="min-h-[40px] w-full resize-none bg-chat-panel-background border-none text-chat-panel-foreground placeholder:text-muted overflow-y-auto"
                        style={{ height: '40px' }}
                    />
                    <div className="flex justify-between items-center gap-1 p-1">
                        <div className="flex gap-1">
                            {/* AIOptions and AILLMOptions removed - simplify for v0.3 */}
                        </div>
                        <div className="flex gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-chat-panel-foreground hover:bg-chat-panel-accent"
                                onClick={handleAddAttachment}
                                disabled={isUploading || !projectId}
                                title={!projectId ? "Select a project first" : "Upload context file"}
                            >
                                {isUploading ? (
                                    <Upload className="h-4 w-4 animate-pulse" />
                                ) : (
                                    <Paperclip className="h-4 w-4 text-chat-panel-foreground" />
                                )}
                            </Button>
                            <Button
                                onClick={onSendMessage}
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-chat-panel-foreground bg-transparent hover:bg-chat-panel-accent"
                                disabled={!inputValue.trim()}
                            >
                                <Send className="h-4 w-4 text-chat-panel-foreground" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* File Confirmation Dialog */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Confirm File Context</DialogTitle>
                        <DialogDescription>
                            Write an action-oriented summary. The AI will use this to inform planning decisions.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {confirmingFile && (
                            <>
                                <div className="p-3 rounded-lg bg-muted">
                                    <p className="text-sm font-medium">{confirmingFile.filename}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {Math.round(confirmingFile.file_size_bytes / 1024)} KB • {confirmingFile.file_type}
                                    </p>
                                </div>

                                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                                        ✨ What makes a useful summary?
                                    </p>
                                    <div className="text-xs space-y-1 text-blue-800 dark:text-blue-200">
                                        <p><strong>GOOD:</strong> &ldquo;County Hydrology Report for Creek Basin. Peak flow: 2,400 cfs (100-yr storm). Channel capacity: 1,800 cfs → overflow risk. Soil type: Type C (slow infiltration). USE FOR: sizing culverts, detention ponds, erosion control decisions.&rdquo;</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        File Summary (minimum 200 characters)
                                    </label>
                                    <Textarea
                                        value={editedSummary}
                                        onChange={(e) => setEditedSummary(e.target.value)}
                                        rows={6}
                                        placeholder="What data/insights does this contain? What decisions can it inform? Key numbers or constraints that matter for planning?"
                                        className="text-sm"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {editedSummary.length}/200 characters {editedSummary.length >= 200 ? '✓' : '(need more detail)'}
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
                                        disabled={editedSummary.trim().length < 200}
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
})

ChatInput.displayName = 'ChatInput'

export default ChatInput