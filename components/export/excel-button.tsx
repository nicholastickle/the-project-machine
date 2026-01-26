import { FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useExcelExport } from "@/hooks/use-excel-export"
import useProjectStore from "@/stores/project-store"
import { toast } from 'sonner'

export default function ExcelButton() {
    const { exportProjectToExcel } = useExcelExport()
    const { getActiveProject } = useProjectStore()

    const handleExport = () => {
        const activeProject = getActiveProject()
        if (!activeProject) {
            toast.error('Please select a project before exporting to Excel.')
            return
        }
        exportProjectToExcel()
    }

    return (
        <Button
            variant="outline"
            onClick={handleExport}
            className="bg-canvas-buttons-background text-muted-foreground hover:bg-canvas-buttons-accent hover:text-canvas-buttons-accent-foreground border-canvas-buttons-border gap-2 p-2 text-sm"
        >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export to Excel</span>
        </Button>
    )
}