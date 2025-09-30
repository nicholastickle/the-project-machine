import React from "react"

export function SocialProof() {
  return (
    <section className="self-stretch py-16 flex flex-col justify-center items-center gap-6 overflow-hidden">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scroll-left {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .scroll-animation {
            animation: scroll-left 30s linear infinite;
          }
        `
      }} />
      <div className="text-center text-gray-300 text-sm font-medium leading-tight">
        Trusted by Project Management Teams at:
      </div>
      <div className="relative w-full h-20 overflow-hidden">
        <div className="scroll-animation whitespace-nowrap flex items-center justify-center h-full py-2">
          <span className="text-l md:text-2xl font-semibold text-muted-foreground tracking-wider mx-8">
            Great companies coming soon...   Great companies coming soon...   Great companies coming soon...   Great companies coming soon...
          </span>
        </div>
        {/* Fade overlays for text */}
        <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-background to-transparent pointer-events-none z-10"></div>
        <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-background to-transparent pointer-events-none z-10"></div>
        {/* Fading borders */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </div>
    </section>
  )
}
