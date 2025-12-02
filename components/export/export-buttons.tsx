"use client"

import { FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import useStore from "@/stores/flow-store"

export default function ExportButtons() {
    const nodes = useStore((state) => state.nodes)
    const edges = useStore((state) => state.edges)

    const exportAsMarkdown = () => {
        if (nodes.length === 0) {
            alert('No tasks to export!')
            return
        }

        let markdown = '# Project Plan\n\n'
        markdown += `Generated: ${new Date().toLocaleDateString()}\n\n`
        markdown += `## Tasks (${nodes.length})\n\n`

        nodes.forEach((node, index) => {
            const data = node.data as any
            const timeSpent = (data.timeSpent as number) || 0
            const hours = Math.floor(timeSpent / 3600)
            const minutes = Math.floor((timeSpent % 3600) / 60)
            const timeSpentStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`

            markdown += `### ${index + 1}. ${data.title || 'Untitled Task'}\n\n`
            markdown += `- **Status:** ${data.status || 'Not started'}\n`
            if (data.estimatedHours) {
                markdown += `- **Estimated Time:** ${data.estimatedHours}h\n`
            }
            markdown += `- **Time Spent:** ${timeSpentStr}\n\n`
        })

        // Find connected tasks
        if (edges.length > 0) {
            markdown += `## Dependencies (${edges.length})\n\n`
            edges.forEach(edge => {
                const sourceNode = nodes.find(n => n.id === edge.source)
                const targetNode = nodes.find(n => n.id === edge.target)
                if (sourceNode && targetNode) {
                    markdown += `- "${sourceNode.data.title}" → "${targetNode.data.title}"\n`
                }
            })
        }

        // Download
        const blob = new Blob([markdown], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `project-plan-${new Date().toISOString().split('T')[0]}.md`
        a.click()
        URL.revokeObjectURL(url)
    }

    const exportAsCSV = () => {
        if (nodes.length === 0) {
            alert('No tasks to export!')
            return
        }

        let csv = 'Task,Status,Estimated Hours,Time Spent (minutes),Position X,Position Y\n'

        nodes.forEach(node => {
            const data = node.data as any
            const titleStr = String(data.title || 'Untitled Task')
            const title = `"${titleStr.replace(/"/g, '""')}"`
            const status = data.status || 'Not started'
            const estimatedHours = data.estimatedHours || ''
            const timeSpent = (data.timeSpent as number) || 0
            const timeSpentMinutes = Math.floor(timeSpent / 60)
            const posX = Math.round(node.position.x)
            const posY = Math.round(node.position.y)

            csv += `${title},${status},${estimatedHours},${timeSpentMinutes},${posX},${posY}\n`
        })

        // Download
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `project-tasks-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <TooltipProvider>
            <div className="absolute top-4 right-4 z-50 flex gap-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={exportAsMarkdown}
                            className="h-9 gap-2 bg-toolbar-background border border-toolbar-border hover:bg-toolbar-accent hover:text-toolbar-foreground shadow-lg"
                        >
                            <FileText className="h-4 w-4" />
                            <span className="hidden sm:inline">Markdown</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Export as Markdown (.md)</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={exportAsCSV}
                            className="h-9 gap-2 bg-toolbar-background border border-toolbar-border hover:bg-toolbar-accent hover:text-toolbar-foreground shadow-lg"
                        >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">CSV</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Export as CSV (.csv)</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    )
}
