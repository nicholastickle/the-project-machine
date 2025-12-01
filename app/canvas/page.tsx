import Canvas from "@/components/canvas/canvas"
import AIOrb from "@/components/ai-chat/ai-orb"

export default function CanvasPage() {
    return (
        <div className="fixed inset-0 h-screen w-screen overflow-hidden">
            <Canvas />
            <AIOrb />
        </div>
    )
}