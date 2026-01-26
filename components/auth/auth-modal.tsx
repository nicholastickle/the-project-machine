"use client"

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ProjectMachineLogoStandard } from '@/components/logo/project-machine-logo-standard'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(true) // Default to Sign Up for better conversion
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    const supabase = createClient()

    if (isSignUp) {
      // Sign up
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/canvas`
        }
      })

      setIsLoading(false)

      if (error) {
        setMessage(`Error: ${error.message}`)
        setIsSuccess(false)
      } else {
        setMessage('✅ Account created! Signing you in...')
        setIsSuccess(true)
        setTimeout(() => {
          onClose()
          onSuccess()
        }, 1000)
      }
    } else {
      // Sign in
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      setIsLoading(false)

      if (error) {
        setMessage(`Error: ${error.message}`)
        setIsSuccess(false)
      } else {
        setMessage('✅ Signed in!')
        setIsSuccess(true)
        setTimeout(() => {
          onClose()
          onSuccess()
        }, 500)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-8">
        <div className="space-y-6">
          {/* Logo and Title */}
          <div className="flex flex-col items-center space-y-3">
            <ProjectMachineLogoStandard size={80} />
            <h2 className="font-semibold text-foreground text-2xl">
              Project Machine
            </h2>
          </div>

          {/* Description */}
          <p className="text-center text-foreground leading-relaxed text-balance px-4">
            Project Machine is the future of online planning. Create an account to save projects, save tasks, and collaborate with others
          </p>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="bg-background/80 border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
                className="bg-background/80 border-border"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email || !password}
              variant="outline"
              size="lg"
              className="w-full"
            >
              {isLoading ? 'Loading...' : (isSignUp ? 'Create account' : 'Continue')}
            </Button>

            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setMessage('')
              }}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Create one"
              }
            </button>

            {message && (
              <div className={`p-3 rounded text-sm text-center ${
                isSuccess 
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                  : 'bg-red-500/10 text-red-600 dark:text-red-400'
              }`}>
                {message}
              </div>
            )}
          </form>

          {/* Terms and Privacy */}
          <div className="flex items-center justify-center gap-2 text-sm pt-2">
            <Link 
              href="https://alkaline-apple-00d.notion.site/Terms-of-Service-2e9227fa135b8018aa5fcfa5d593dd48" 
              className="text-blue-600 hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Terms of use
            </Link>
            <span className="text-foreground">•</span>
            <Link 
              href="https://alkaline-apple-00d.notion.site/Privacy-Policy-2e9227fa135b802bae74d5c2eb8ca78f" 
              className="text-blue-600 hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
