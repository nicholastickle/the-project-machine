import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ShareButton() {
    const handleShare = () => {
        // Future: Implement share functionality
        alert('Share functionality coming soon! This will allow you to share your project.')
    }

    return (
        <Button
            variant="outline"
            onClick={handleShare}
            className="bg-canvas-buttons-background text-muted-foreground hover:bg-canvas-buttons-accent hover:text-canvas-buttons-accent-foreground border-canvas-buttons-border gap-2 p-2 text-sm"
        >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
        </Button>
    )
}
