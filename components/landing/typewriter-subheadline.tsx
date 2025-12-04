"use client"

import { useEffect, useState, useMemo } from "react"

export function TypewriterSubheadline() {
    const [displayText, setDisplayText] = useState("")
    const [phraseIndex, setPhraseIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)

    const phrases = useMemo(() => [
        "We built this because planning sucks",
        "Thoughts → Tasks. No bullshit.",
        "Built by people who hate meetings",
        "Because Jira makes you cry",
        "Turn rambling into tasks..",
        "From 'umm, so like...' to done",
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