import { AnimatedSectionWhileInView } from "@/components/ui/animated-section"
import BentoCard from "@/components/landing/bento-card"
import { TextCursor, Mic, Map } from "lucide-react"

export default function BentoSection() {
  const cards = [
    {
      title: "The Copilot for project planning",
      description: "Create plans, ideate, make updates, set durations, store history.",
      icon: TextCursor,
    },
    {
      title: "Voice-First",
      description: "Describe your project naturally using your voice. No typing required.",
      icon: Mic,
    },
    {
      title: "Interactive Canvas",
      description: "Drag, edit, and track your tasks on a beautiful visual workspace.",
      icon: Map,
    },

  ]

  return (
    <AnimatedSectionWhileInView className="relative z-10 max-w-[1320px] mx-auto mt-1" delay={0.2}>
      <section id="features-section" className="w-full px-5 flex flex-col justify-center items-center overflow-visible bg-transparent mt-20 md:mt-20 lg:mt-20">
        <div className="w-full py-8 md:py-16 relative flex flex-col justify-start items-start gap-6">

          <div className="self-stretch py-8 md:py-14 flex flex-col justify-center items-center gap-2 z-10">
            <div className="flex flex-col justify-start items-center gap-10">
              <h2 className="w-full max-w-[655px] text-center text-foreground text-2xl md:text-4xl lg:text-6xl font-semibold leading-tight md:leading-[66px]">
                The Planning Machine
              </h2>
              <p className="w-full max-w-[600px] text-center text-muted-foreground text-md md:text-lg font-medium leading-relaxed">
                We&apos;re redefining what project planning could be.
              </p>
            </div>
          </div>
          <div className="self-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10">
            {cards.map((card, index) => (
              <BentoCard key={card.title} {...card} priority={index < 2} />
            ))}
          </div>
        </div>
      </section>
    </AnimatedSectionWhileInView>
  )
}

