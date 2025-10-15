"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from "next/image"

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)


  const [isLoading, setIsLoading] = useState(true)
  const [shouldLift, setShouldLift] = useState(false)

  const handleLoadingComplete = () => {
    setShouldLift(true)
    setTimeout(() => setIsLoading(false), 1800)
  }

  useEffect(() => {
    const duration = 3000
    const interval = 50
    const increment = (100 / duration) * interval

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment
        if (next >= 100) {
          clearInterval(timer)
          setTimeout(() => handleLoadingComplete(), 300)
          return 100
        }
        return next
      })
    }, interval)

    return () => clearInterval(timer)
  }, [])

  return (
    <>
    { isLoading && (
      <div
        className={`fixed inset-0 z-50 ${shouldLift ? "-translate-y-full" : "translate-y-0"
          }`}
        style={{
          transition: "transform 1800ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
          <div className="absolute inset-4 border border-zinc-700/30 rounded-lg overflow-hidden">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: "radial-gradient(circle, #6b7280 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at center, hsl(var(--background) / 0.95) 0%, hsl(var(--background) / 0.7) 25%, transparent 50%)",
              }}
            />
          </div>

          <div className="relative z-10 mb-3 md:mb-4 flex items-center justify-center px-4">
            <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48">
              <AspectRatio ratio={1} className="flex items-center justify-center">
                <Image
                  src="/logos/logo.svg"
                  alt="Project Machine Logo"
                  width={192}
                  height={192}
                  className="w-full h-full "
                />
              </AspectRatio>
            </div>
          </div>
          <div className="relative z-10 mb-8 md:mb-12 flex items-center justify-center px-4">
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground text-center">
              Project Machine
            </span>
          </div>
          <div className="relative z-10 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-4 sm:px-6 md:px-8">
            <Progress
              value={progress}
              className="h-1 md:h-1.5 bg-foreground/50 [&>div]:bg-foreground"
            />
          </div>
        </div>
      </div>
    )}
    </>
  )
}

