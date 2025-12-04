import { Separator } from "@/components/ui/separator"
import Link from "next/link"



export default function FooterSection() {
  return (
    <footer className="w-full max-w-[1320px] mx-auto px-5 py-10 md:py-10">
    
      <div className="w-full mt-8">
        <Separator className="mb-6 bg-muted/20" />
        <div className="flex justify-center items-center gap-4 px-4 md:px-8">
          <p className="text-muted-foreground text-sm">
            © 2025 Project Machine | All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
