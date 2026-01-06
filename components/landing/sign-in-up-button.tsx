import { Button } from "@/components/ui/button"
import Link from "next/link"

export function SignInUpButton() {
    return (
        <Link href="">
            <Button className="h-8 bg-transparent text-muted hover:text-foreground hover:bg-transparent px-5 rounded-md border border-border-dark font-medium">
                Sign In
            </Button>
        </Link>
    )
}
