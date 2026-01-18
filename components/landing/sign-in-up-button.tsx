import { AuthRedirectButton } from "@/components/auth/auth-redirect-button"

export function SignInUpButton() {
    return (
        <AuthRedirectButton
            text="Sign In"
            className="h-8 bg-transparent text-muted hover:text-foreground hover:bg-transparent px-5 rounded-md border border-border-dark font-medium"
        />
    )
}
