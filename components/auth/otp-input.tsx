"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface OTPInputProps {
  length: number
  value: string
  onChange: (value: string) => void
}

export function OTPInput({ length, value, onChange }: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [localValues, setLocalValues] = useState<string[]>(Array(length).fill(""))

  useEffect(() => {
    if (value === "") {
      setLocalValues(Array(length).fill(""))
      inputRefs.current[0]?.focus()
    }
  }, [value, length])

  const handleChange = (index: number, inputValue: string) => {
    const newValue = inputValue.slice(-1)
    if (newValue && !/^\d$/.test(newValue)) return

    const newValues = [...localValues]
    newValues[index] = newValue
    setLocalValues(newValues)
    onChange(newValues.join(""))

    // Auto-focus next input
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault()
      const newValues = [...localValues]

      if (localValues[index]) {
        newValues[index] = ""
        setLocalValues(newValues)
        onChange(newValues.join(""))
      } else if (index > 0) {
        newValues[index - 1] = ""
        setLocalValues(newValues)
        onChange(newValues.join(""))
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, length)
    const digits = pastedData.match(/\d/g) || []

    const newValues = [...localValues]
    digits.forEach((digit, i) => {
      if (i < length) {
        newValues[i] = digit
      }
    })
    setLocalValues(newValues)
    onChange(newValues.join(""))

    const lastFilledIndex = Math.min(digits.length, length) - 1
    inputRefs.current[lastFilledIndex]?.focus()
  }

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={localValues[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={cn(
            "w-12 h-14 text-center text-2xl font-medium border-2 rounded-lg",
            "bg-white text-black border-black/20",
            "focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20",
            "transition-colors",
          )}
        />
      ))}
    </div>
  )
}