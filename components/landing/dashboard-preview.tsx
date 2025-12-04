"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { AnimatedSectionWhileInView } from "@/components/ui/animated-section"

export default function DashboardPreview() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <AnimatedSectionWhileInView delay={0.1}>
        <section className="flex justify-center -mt-45 sm:-mt-82 md:-mt-50 lg:-mt-50 xl:-mt-72 z-30 relative w-[calc(100vw-32px)] sm:w-[calc(100vw-48px)] md:w-[95vw] lg:w-[90vw] xl:w-[1160px] max-w-[1160px] mx-auto bg-primary-light/40 rounded-2xl p-2 shadow-lg">
          <Image
            src="/images/Dashboard-preview-light.png"
            alt="Dashboard preview"
            width={1160}
            height={700}
            priority
            className="w-full h-full object-cover rounded-xl shadow-lg"
          />
        </section>
      </AnimatedSectionWhileInView>
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <AnimatedSectionWhileInView delay={0.1}>
      <section className="flex justify-center -mt-45 sm:-mt-82 md:-mt-50 lg:-mt-50 xl:-mt-72 z-30 relative w-[calc(100vw-32px)] sm:w-[calc(100vw-48px)] md:w-[95vw] lg:w-[90vw] xl:w-[1160px] max-w-[1160px] mx-auto bg-primary-light/40 rounded-2xl p-2 shadow-lg">
        <Image
          src={isDark ? "/images/Dashboard-preview-dark.png" : "/images/Dashboard-preview-light.png"}
          alt="Dashboard preview"
          width={1160}
          height={700}
          priority
          className="w-full h-full object-cover rounded-xl shadow-lg"
        />
      </section>
    </AnimatedSectionWhileInView>
  )
}
