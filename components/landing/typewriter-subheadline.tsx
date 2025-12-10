"use client"

import { useEffect, useState, useMemo } from "react"

export function TypewriterSubheadline() {
    const [displayText, setDisplayText] = useState("")
    const [phraseIndex, setPhraseIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)

    const phrases = useMemo(() => [
        "We built this because planning sucks",
        "But planning is important",
        "Built by people who hate meetings",
        "Because Jira makes you cry",
        "This is the tool they'll use on Mars",
        "Humans are the most important appearance in the universe",
        "AI will empower people rather than make them obsolete",
        "We are inspired by becoming a space faring civilization",
        "We set goals that we know we can't yet reach",
        "We’ll push you to be better versions of yourselves",
        "Be ethical in everything you do. Even when no one is looking",
        "Design by consensus kills products",
        "UIs of the future won't be fixed, but created as needed",
        "Planning is guessing. Plan more often, not less",
        "If you need a tutorial to understand it, its bad design",
        "We don’t sell customer data to anyone",
        "Limit the amount of details and make every detail count",
        "Make your requirements less dumb. Your requirements are definitely dumb",
        "Try very hard to delete the part or process",
        "Wow you're still reading these?",
        "Go on! Go build something great!",
        "Using our tool of course!",
        "Phew, tough crowd!",
        "Okay its going to start repeating now...",
        "We've reached the end of the array",
        ".....",
        "Wake up Neo...",
        "The Matrix has you...",
        "Follow the white rabbit.",
        "Knock, knock, Neo.",
        ".....",


    ], [])

    useEffect(() => {
        const currentPhrase = phrases[phraseIndex]
        const timeout = setTimeout(
            () => {
                if (!isDeleting) {
                    if (displayText === currentPhrase) {
                        setTimeout(() => setIsDeleting(true), 500)
                    } else {
                        setDisplayText(currentPhrase.slice(0, displayText.length + 1))
                    }
                } else {
                    if (displayText === "") {
                        setIsDeleting(false)
                        setPhraseIndex((prev) => (prev + 1) % phrases.length)
                    } else {
                        setDisplayText(currentPhrase.slice(0, displayText.length - 1))
                    }
                }
            },
            isDeleting ? 50 : displayText === currentPhrase ? 500 : 100
        )

        return () => clearTimeout(timeout)
    }, [displayText, isDeleting, phraseIndex, phrases])

    return (
        <div className="text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed h-16 flex items-center justify-center mt-5">
            <span className=" text-foreground min-w-[400px] text-center">
                {displayText}
                <span className="animate-pulse">|</span>
            </span>
        </div>
    )
}