"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"
import { OTPInput } from "@/components/auth/otp-input"

interface OTPDialogProps {
    isOpen: boolean
    onClose: () => void
    otpValue: string
    onOTPChange: (value: string) => void
    error: string
    onOTPComplete: (value: string) => void
    onResend: () => void
    resendDisabled: boolean
    countdown: number
}

export default function OTPDialog({
    isOpen,
    onClose,
    otpValue,
    onOTPChange,
    error,
    onOTPComplete,
    onResend,
    resendDisabled,
    countdown,
}: OTPDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white border-black/20">
                <DialogTitle className="sr-only">Email Verification</DialogTitle>
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:pointer-events-none"
                >
                    <X className="h-5 w-5 text-black" />
                    <span className="sr-only">Close</span>
                </button>

                <div className="flex flex-col items-center gap-8 pt-6">
                    <h3 className="text-xl font-medium text-black/70 text-center text-balance">
                        Check your email for a verification code.
                    </h3>

                    <div className="space-y-4 w-full">
                        <OTPInput
                            length={6}
                            value={otpValue}
                            onChange={(value) => {
                                onOTPChange(value)
                                if (value.length === 6) {
                                    onOTPComplete(value)
                                }
                            }}
                        />

                        {error && <p className="text-red-600 text-sm text-center font-medium">{error}</p>}
                    </div>

                    <div className="text-sm">
                        <span className="text-black/60">{"Didn't receive a code? "}</span>
                        <button
                            onClick={onResend}
                            disabled={resendDisabled}
                            className={`font-medium ${resendDisabled ? "text-black/30 cursor-not-allowed" : "text-blue-600 hover:underline"
                                }`}
                        >
                            Resend{resendDisabled && ` (${countdown}s)`}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}