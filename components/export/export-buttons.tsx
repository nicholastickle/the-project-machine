"use client"

import { FileSpreadsheet, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import useStore from "@/stores/flow-store"

interface ExportButtonsProps {
    isChatVisible?: boolean
}

export default function ExportButtons({ isChatVisible = true }: ExportButtonsProps) {
    const [isExporting, setIsExporting] = useState(false)
    const projectId = useStore((state) => state.projectId)
    const nodes = useStore((state) => state.nodes)
    const edges = useStore((state) => state.edges)

    const exportToExcel = async () => {
        if (!projectId) {
            alert('Please select a project first')
            return
        }

        setIsExporting(true)
        try {
            const response = await fetch(`/api/projects/${projectId}/export/excel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nodes, edges })
            })

            if (response.ok) {
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `project-${projectId}-export.xlsx`
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
                document.body.removeChild(a)
            } else {
                const error = await response.json()
                alert(`Export failed: ${error.error}`)
            }
        } catch (error) {
            console.error('Export error:', error)
            alert('Export failed. Please try again.')
        } finally {
            setIsExporting(false)
        }
    }

    const exportTimesheet = async () => {
        if (!projectId) {
            alert('Please select a project first')
            return
        }

        setIsExporting(true)
        try {
            const response = await fetch(`/api/projects/${projectId}/export/timesheet`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nodes, edges })
            })

            if (response.ok) {
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `project-${projectId}-timesheet.xlsx`
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
                document.body.removeChild(a)
            } else {
                const error = await response.json()
                alert(`Timesheet export failed: ${error.error}`)
            }
        } catch (error) {
            console.error('Timesheet export error:', error)
            alert('Timesheet export failed. Please try again.')
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <div
            className={`absolute top-2 z-50 flex gap-2 transition-all duration-500 ${isChatVisible ? 'right-[370px]' : 'right-4'
                }`}
        >
            <Button
                variant="outline"
                onClick={exportToExcel}
                disabled={isExporting || !projectId}
                className="bg-canvas-buttons-background text-canvas-buttons-foreground hover:bg-canvas-buttons-accent hover:text-canvas-buttons-accent-foreground border-canvas-buttons-border gap-2"
            >
                <FileSpreadsheet className="h-4 w-4" />
                <span>{isExporting ? 'Exporting...' : 'Export to Excel'}</span>
            </Button>

            <Button
                variant="outline"
                onClick={exportTimesheet}
                disabled={isExporting || !projectId}
                className="bg-canvas-buttons-background text-canvas-buttons-foreground hover:bg-canvas-buttons-accent hover:text-canvas-buttons-accent-foreground border-canvas-buttons-border gap-2"
            >
                <Clock className="h-4 w-4" />
                <span>{isExporting ? 'Exporting...' : 'Timesheet Export'}</span>
            </Button>
        </div>
    )
}
