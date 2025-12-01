"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            Project Machine
          </h1>
          <p className="text-xl text-muted-foreground">
            Voice-first project planning for engineers
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-lg text-muted-foreground">
            Describe your project using your voice, and watch as AI generates your task plan on an interactive canvas.
          </p>
        </div>

        <Button 
          size="lg" 
          onClick={() => router.push("/canvas")}
          className="text-lg px-8 py-6"
        >
          Begin
        </Button>
      </div>
    </div>
  )
}
