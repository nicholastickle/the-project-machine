
import { useCallback } from "react"
import { ChevronDown } from "lucide-react"

export interface FAQItemProps {
    question: string
    answer: string
    isOpen: boolean
    onToggle: () => void
}

const FAQItem = ({ question, answer, isOpen, onToggle }: FAQItemProps) => {
    const handleClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        onToggle()
    }, [onToggle])

    return (
        <div
            className={`w-full bg-white/10 backdrop-blur-md border border-border-dark shadow-lg overflow-hidden rounded-[10px] transition-all duration-500 ease-out cursor-pointer`}
            onClick={handleClick}
        >
            <div className="w-full px-5 py-[18px] pr-4 flex justify-between items-center gap-5 text-left transition-all duration-300 ease-out">
                <div className="flex-1 text-foreground text-base font-medium leading-6 break-words">{question}</div>
                <div className="flex justify-center items-center">
                    <ChevronDown
                        className={`w-6 h-6 text-muted-foreground transition-all duration-500 ease-out ${isOpen ? "rotate-180 scale-110" : "rotate-0 scale-100"}`}
                    />
                </div>
            </div>
            <div
                className={`overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                style={{
                    transitionProperty: "max-height, opacity, padding",
                    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                }}
            >
                <div
                    className={`px-5 transition-all duration-500 ease-out ${isOpen ? "pb-[18px] pt-2 translate-y-0" : "pb-0 pt-0 -translate-y-2"}`}
                >
                    <div className="text-foreground/80 text-sm font-normal leading-6 break-words">{answer}</div>
                </div>
            </div>
        </div>
    )
}

export default FAQItem
