"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const duration = 3000 // 3 seconds total loading time
    const interval = 50 // Update every 50ms
    const increment = (100 / duration) * interval

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment
        if (next >= 100) {
          clearInterval(timer)
          // Wait a bit before triggering the lift animation
          setTimeout(() => onComplete(), 300)
          return 100
        }
        return next
      })
    }, interval)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="absolute inset-4 border border-zinc-700/30 rounded-lg overflow-hidden">
        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle, #6b7280 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Radial blur effect around center */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, hsl(var(--background) / 0.95) 0%, hsl(var(--background) / 0.7) 25%, transparent 50%)",
          }}
        />
      </div>

      <div className="relative z-10 mb-8 md:mb-12 flex items-center justify-center px-4">
        <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-zinc-800 text-center">
          Project Machine
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-4 sm:px-6 md:px-8">
        <Progress
          value={progress}
          className="h-1 md:h-1.5 bg-zinc-800/50 [&>div]:bg-zinc-800/100"
        />
      </div>
    </div>
  )
}

