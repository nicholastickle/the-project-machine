"use client"

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isSignUp ? 'Create Account' : 'Sign In'}</DialogTitle>
          <DialogDescription>
            {isSignUp 
              ? 'Create a new account to start planning'
              : 'Sign in to access your projects'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAuth} className="space-y-4 mt-4">
          <Input
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="w-full"
          />

          <Input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            minLength={6}
            className="w-full"
          />

          <Button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full"
          >
            {isLoading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </Button>

          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setMessage('')
            }}
            className="w-full text-sm text-muted-foreground hover:text-foreground"
          >
            {isSignUp 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Create one"
            }
          </button>

          {message && (
            <div className={`p-3 rounded text-sm ${
              isSuccess 
                ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                : 'bg-red-500/10 text-red-600 dark:text-red-400'
            }`}>
              {message}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
