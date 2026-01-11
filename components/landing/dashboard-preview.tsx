"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

export default function DashboardPreview() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

 if (!mounted || !resolvedTheme) {
    return null
  }

  if (!mounted) {
    return (
      
        <section className="absolute top-[600px] left-1/2 transform -translate-x-1/2 z-30 w-[calc(100vw-32px)] sm:w-[calc(100vw-48px)] md:w-[95vw] lg:w-[90vw] xl:w-[1160px] max-w-[1160px] bg-primary-light/40 rounded-2xl p-2 shadow-lg">
          <Image
            src="/images/Dashboard-preview-light.png"
            alt="Dashboard preview"
            width={1160}
            height={700}
            priority
            className="w-full h-full object-cover rounded-xl shadow-lg"
          />
        </section>
      
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    
      <section className="absolute top-[600px] left-1/2 transform -translate-x-1/2 z-30 w-[calc(100vw-32px)] sm:w-[calc(100vw-48px)] md:w-[95vw] lg:w-[90vw] xl:w-[1160px] max-w-[1160px] bg-primary-light/40 rounded-2xl p-2 shadow-lg ">
        <Image
          src={isDark ? "/images/Dashboard-preview-dark.png" : "/images/Dashboard-preview-light.png"}
          alt="Dashboard preview"
          width={1160}
          height={700}
          priority
          className="w-full h-full object-cover rounded-xl shadow-lg"
        />
      </section>
    
  )
}
