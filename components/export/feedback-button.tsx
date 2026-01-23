import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function FeedbackButton() {
    return (
        <Button
            variant="outline"
            asChild
            className="bg-canvas-buttons-background text-muted-foreground hover:bg-canvas-buttons-accent hover:text-canvas-buttons-accent-foreground border-canvas-buttons-border gap-2 p-2 text-sm"
        >
            <Link href="https://www.featurebase.app/" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                <span>Feedback</span>
            </Link>
        </Button>
    )
}
