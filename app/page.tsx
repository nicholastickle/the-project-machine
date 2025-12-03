"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Mic, Sparkles, Zap, ArrowRight } from "lucide-react"
import { ProjectMachineLogo } from "@/components/logo/project-machine-logo"
import { useEffect, useState } from "react"

export default function Home() {
  const router = useRouter()
  const [displayText, setDisplayText] = useState("")
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const phrases = [
    "We built this because planning sucks",
    "Thoughts → Tasks. No bullshit.",
    "Built by people who hate meetings",
    "Because Jira makes you cry",
    "Turn rambling into tasks..",
    "From 'umm, so like...' to done",
  ]

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <ProjectMachineLogo size="lg" showText={true} href="/" />
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border-2 border-indigo-200/50 rounded-full shadow-lg">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">AI-Powered Project Planning</span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Project Machine
            </span>
          </h1>

          {/* Subheadline with Typewriter */}
          <div className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed h-16 flex items-center justify-center">
            <span className="font-semibold text-indigo-600 min-w-[400px] text-center">
              {displayText}
              <span className="animate-pulse">|</span>
            </span>
          </div>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Just talk about your project. Watch AI generate tasks with time estimates.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              onClick={() => router.push("/canvas")}
              className="text-lg px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              <Mic className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Start Planning
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 border-2 border-indigo-300 hover:bg-indigo-50 shadow-lg"
            >
              Watch Demo
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 pt-16">
            <div className="bg-white/80 backdrop-blur-sm border-2 border-indigo-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Voice-First</h3>
              <p className="text-gray-600">Describe your project naturally using your voice. No typing required.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border-2 border-indigo-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">AI-Generated</h3>
              <p className="text-gray-600">Tasks appear one-by-one with time estimates and dependencies.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border-2 border-indigo-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Interactive Canvas</h3>
              <p className="text-gray-600">Drag, edit, and track your tasks on a beautiful visual workspace.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-4 py-8 text-center text-gray-600 border-t border-indigo-200/50">
        <p>Built for engineers who prefer talking over typing.</p>
      </div>
    </div>
  )
}
