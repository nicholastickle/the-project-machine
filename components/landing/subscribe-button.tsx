import { Send } from "lucide-react"

export function SubscribeButton() {
    return (
        <div className="relative group">
            <div className="z-10 bg-transparent border border-border-dark rounded-md px-2 flex items-center gap-2 h-8">
                <input
                    type="email"
                    placeholder="Subscribe for updates..."
                    className="bg-transparent text-foreground text-sm placeholder:text-muted border-none outline-none px-4  min-w-[200px]"
                    suppressHydrationWarning
                />
                <button className="bg-none text-muted hover:text-foreground p-2 transition-colors duration-200 flex items-center justify-center">
                    <Send size={16} />
                </button>
            </div>
        </div>
    )
}
