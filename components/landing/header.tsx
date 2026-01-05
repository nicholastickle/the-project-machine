"use client"


import { useState, useCallback } from "react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/theme-provider/theme-toggle"

import { SignInUpButton } from "@/components/landing/sign-in-up-button"
import { SubscribeButton } from "@/components/landing/subscribe-button"

export default function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const navItems = [
    { name: "Features", href: "#features-section" },
    { name: "About", href: "#about-section" },
    { name: "FAQ", href: "#faq-section" },
    { name: "Get started", href: "#pricing-section" },
  ]

  const handleScroll = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault()
      const targetId = href.substring(1)
      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" })
      }
    },
    []
  )

  const handleMobileNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault()
      setIsSheetOpen(false)
      setTimeout(() => {
        const targetId = href.substring(1)
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" })
        }
      }, 300)
    },
    [setIsSheetOpen]
  )

  return (
    <header className="z-50 w-full px-5 absolute top-0 left-0 right-0 sticky border border-border-dark bg-background backdrop-blur-md h-10">
      <div className=" mx-auto flex items-center justify-between my-auto">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-foreground text-lg font-semibold cursor-pointer">
              Project Machine <sub className="text-xs px-1 text-muted">V0.3</sub>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleScroll(e, item.href)} // Add onClick handler
                className="text-muted hover:text-foreground px-4 py-2 rounded-full font-medium text-sm transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">


          <SubscribeButton />
          <ModeToggle />
          <SignInUpButton />

          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button size="icon" className="bg-white/10 backdrop-blur-md border border-white/20 text-foreground hover:bg-white/20 rounded-full shadow-lg">
                <Menu className="h-7 w-7" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="bg-background border-none text-foreground">
              <SheetHeader>
                <SheetTitle className="text-left text-xl font-semibold text-foreground">Project Machine</SheetTitle>
                <SheetDescription className="text-left text-muted">
                  Navigate through the Project Machine sections
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleMobileNavClick(e, item.href)} // Use mobile-specific handler
                    className="text-muted hover:text-foreground justify-start text-lg py-2"
                  >
                    {item.name}
                  </Link>
                ))}
                <Link href="/canvas" className="w-full mt-4">
                  <Button className="bg-white/10 backdrop-blur-md border border-white/20 text-foreground hover:bg-white/20 px-6 py-2 rounded-full font-medium shadow-lg">
                    Start
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header >
  )
}
