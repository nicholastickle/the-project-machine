"use client"


import { useState, useCallback } from "react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/theme-provider/theme-toggle"

import { SignInUpButton } from "@/components/landing/sign-in-up-button"
import { SubscribeButton } from "@/components/landing/subscribe-button"

type NavItem = {
  name: string
  href: string
  external?: boolean
}

export default function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const navItems: NavItem[] = [
    { name: "Features", href: "#features-section" },
    { name: "About", href: "#about-section" },
    { name: "FAQ", href: "#faq-section" },
    { name: "Resources", href: "https://alkaline-apple-00d.notion.site/Project-Machine-User-Manual-121aa4c8ef4d4fac8976882a65642716", external: true },
  ]

  const handleScroll = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith('#')) {
        return; // Allow normal navigation for non-anchor links
      }
      e.preventDefault()
      const targetId = href.substring(1)
      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        const headerHeight = 44 // h-11 = 44px
        const offset = 20 // Additional margin
        const elementPosition = targetElement.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight - offset

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        })
      }
    },
    []
  )

  const handleMobileNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith('#')) {
        setIsSheetOpen(false)
        return; // Allow normal navigation for non-anchor links
      }
      e.preventDefault()
      setIsSheetOpen(false)
      setTimeout(() => {
        const targetId = href.substring(1)
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          const headerHeight = 44 // h-11 = 44px
          const offset = 20 // Additional margin
          const elementPosition = targetElement.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight - offset

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          })
        }
      }, 300)
    },
    [setIsSheetOpen]
  )

  return (
    <header className="z-50 w-full px-5 absolute top-0 left-0 right-0 sticky border border-border-dark bg-background backdrop-blur-md h-11 mx-auto flex flex-row items-center justify-between ">

      <div className="flex items-center gap-5">
        <div className="flex items-center">
          <Link
            href="/"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({
                top: 0,
                behavior: "smooth"
              })
            }}
            className="text-foreground text-lg font-semibold cursor-pointer"
          >
            Project Machine <sub className="text-xs px-1 text-muted">V0.3</sub>
          </Link>
        </div>
        <nav className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => {
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={item.external ? undefined : (e) => handleScroll(e, item.href)}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="text-muted hover:text-foreground px-4 py-2 rounded-full font-medium text-sm transition-colors"
              >
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="flex flex-row items-center">

        <div className="hidden md:flex gap-1">
          <SubscribeButton />
          {/* <ModeToggle /> */}
          <SignInUpButton />
        </div>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button size="icon" className="bg-transparent border border-border-dark text-muted hover:text-foreground hover:bg-transparent rounded-md h-8 outline-none">
              <Menu className="h-7 w-7" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="bg-background border-none text-foreground">
            <SheetHeader>
              <SheetTitle className="text-left text-xl font-semibold text-foreground">Project Machine</SheetTitle>
              <SheetDescription className="hidden text-left text-muted">
                Navigate through the Project Machine sections
              </SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col mt-2">
              {navItems.map((item) => {

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={item.external ? undefined : (e) => handleMobileNavClick(e, item.href)}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="text-muted hover:text-foreground justify-start text-md py-2"
                  >
                    {item.name}
                  </Link>
                )
              })}
              <div className="md:hidden flex flex-col gap-2 ">
                <SubscribeButton />
                {/* <ModeToggle /> */}
                <SignInUpButton />
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

    </header >
  )
}
