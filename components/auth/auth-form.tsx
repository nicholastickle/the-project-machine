"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import OTPDialog from "@/components/auth/otp-dialog"
import { ProjectMachineLogoStandard } from "@/components/logo/project-machine-logo-standard"
import Link from "next/link"

export default function AuthForm() {
    const [email, setEmail] = useState("")
    const [showOtpDialog, setShowOtpDialog] = useState(false)
    const [generatedCode, setGeneratedCode] = useState("")
    const [otpValue, setOtpValue] = useState("")
    const [error, setError] = useState("")
    const [resendDisabled, setResendDisabled] = useState(false)
    const [countdown, setCountdown] = useState(60)

    const generateCode = () => {
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        setGeneratedCode(code)
        return code
    }

    const startCountdown = () => {
        setResendDisabled(true)
        setCountdown(60)

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    setResendDisabled(false)
                    return 60
                }
                return prev - 1
            })
        }, 1000)
    }

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault()
        if (email && email.includes("@")) {
            const code = generateCode()
            alert(`Your verification code is: ${code}`)
            setShowOtpDialog(true)
        }
    }

    const handleResend = () => {
        if (!resendDisabled) {
            alert(`Your verification code is: ${generatedCode}`)
            startCountdown()
        }
    }

    const handleOtpComplete = (value: string) => {
        if (value === generatedCode) {
            setTimeout(() => {
                alert("Correct code, you are logged in")
                setShowOtpDialog(false)
                setOtpValue("")
                setError("")
                setEmail("")
            }, 500)
        } else {
            setError("Incorrect code")
            setOtpValue("")
        }
    }

    return (
        <div className=" h-[80vh] flex items-center justify-center p-20 bg-background">
            <div className="w-full max-w-md space-y-8">
                {/* Logo and Title */}
                <div className="flex flex-col items-center">
                    <ProjectMachineLogoStandard size={100} />
                    <span className="font-semibold text-foreground text-2xl whitespace-nowrap">
                        Project Machine
                    </span>
                </div>

                {/* Description */}
                <p className="text-center text-black/70 leading-relaxed text-balance">
                    Project Machine is the future of online planning. Create an account to save projects, save tasks, and
                    collaborate with others
                </p>

                {/* Email Form */}
                <form onSubmit={handleContinue} className="space-y-6" suppressHydrationWarning={true}>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-black font-medium">
                            Email address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            suppressHydrationWarning={true}
                            className="bg-white border-black/20 text-black placeholder:text-black/40"
                        />
                    </div>

                    <Button type="submit" className="w-full bg-black text-white hover:bg-black/90">
                        Continue with email
                    </Button>
                </form>

                {/* Terms and Privacy */}
                <div className="flex items-center justify-center gap-2 text-sm">

                    <Link href="https://alkaline-apple-00d.notion.site/Terms-of-Service-2e9227fa135b8018aa5fcfa5d593dd48" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Terms of use</Link>

                    <span className="text-foreground">•</span>
                    <Link href="https://alkaline-apple-00d.notion.site/Privacy-Policy-2e9227fa135b802bae74d5c2eb8ca78f" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>
                </div>
            </div>


            {/* OTP Dialog */}
            <OTPDialog
                isOpen={showOtpDialog}
                onClose={() => setShowOtpDialog(false)}
                otpValue={otpValue}
                onOTPChange={(value) => {
                    setOtpValue(value)
                    setError("")
                }}
                error={error}
                onOTPComplete={handleOtpComplete}
                onResend={handleResend}
                resendDisabled={resendDisabled}
                countdown={countdown}
            />
        </div>
    )
}