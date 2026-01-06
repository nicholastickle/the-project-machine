"use client"

import { AnimatedSectionWhileInView } from "@/components/ui/animated-section"
import FeatureCard from "@/components/landing/features-card"
import { Sparkles, Map, BookOpenCheck } from "lucide-react"

export default function FeaturesSection() {
  const cards = [
    {
      title: "Limitless Canvas",
      description: "Why plan on a canvas? Because this is the future of working with AI. Drag, drop, connect, and visualize your entire project ecosystem in one infinite workspace where ideas flow naturally.",
      icon: Map,
      imageUrl: "/images/features/01-Canvas-light.png",
      imageUrlDark: "/images/features/01-Canvas-dark.png",
      imageAlt: "Project Machine canvas interface showing task planning and management"
    },
    {
      title: "Completed Task Database",
      description: "Every completed task becomes valuable data. Store durations, lessons learned, blockers encountered, and success patterns. Transform your project history into predictive intelligence for better future planning.",
      icon: BookOpenCheck,
      imageUrl: "/images/features/02-Task-book-light.png",
      imageUrlDark: "/images/features/02-Task-book-dark.png",
      imageAlt: "Task database interface showing completed task history and analytics"
    },
    {
      title: "Your own context engineered AI",
      description: "Your AI has access to all your history to make you better at planning incl. saved tasks, project files, and estimated durations.",
      icon: Sparkles,
      imageUrl: "/images/features/03-AI-chat-light.png",
      imageUrlDark: "/images/features/03-AI-chat-dark.png",
      imageAlt: "AI chat interface providing context-aware task assistance"
    },

  ]

  return (

    <div className="flex flex-row justify-center border border-border-dark ">
      <div className=" w-[60px] diagonal-lines border-l border-border-dark">
      </div>
      <AnimatedSectionWhileInView className="flex-1 max-w-[1320px relative flex flex-col items-center text-center overflow-hidden w-full md:w-[98vw] lg:w-[98vw] xl:w-[1220px] max-w-[1220px]" delay={0.2}>
        <section id="features-section" className="w-full flex flex-col justify-center items-center  bg-transparent ">
          <div className="w-full relative flex flex-col justify-start items-start">

            <div className="self-stretch flex flex-col justify-center items-center border-x border-border-dark ">
              <div className="flex flex-row justify-start items-center  ">
                <h2 className="w-1/2 text- text-foreground text-6xl border-r border-border-dark p-6 font-semibold leading-tight">
                  Plan with the power of your own history
                </h2>
                <p className="w-1/2 text-center text-muted-foreground text-2xl m-10 italic">
                  &quot;Project Machine is an attempt to finally get better at planning by leveraging your lessons learned and getting better at task durations&quot;
                </p>
              </div>
            </div>
            <div className="self-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10 diagonal-lines p-6 border-t border-border-dark">
              {cards.map((card, index) => (
                <FeatureCard key={card.title} {...card} />
              ))}
            </div>
          </div>
        </section>
      </AnimatedSectionWhileInView>
      <div className=" w-[60px] diagonal-lines border-r border-border-dark">
      </div>
    </div>
  )
}

