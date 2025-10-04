import React from "react"
import Image from "next/image"
import { AspectRatio } from "@/components/ui/aspect-ratio"

interface BentoCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  priority?: boolean;
}

const BentoCard = ({ title, description, imageSrc, imageAlt, priority = false }: BentoCardProps) => (
  <div className="overflow-hidden rounded-2xl bg-white/10  backdrop-blur-md border border-border-dark flex flex-col justify-start items-start relative">

  



    <div className="self-stretch p-6 flex flex-col justify-start items-start gap-2 relative z-10 min-h-32 sm:min-h-36 md:min-h-40 lg:min-h-44">
      <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
        <p className="self-stretch text-foreground text-lg font-normal leading-7 ">
          {title} <br />
          <span className="text-muted-foreground text-sm">{description}</span>
        </p>
      </div>
    </div>
    <div className="self-stretch  relative -mt-0.5 z-10 overflow-hidden">
      <AspectRatio ratio={16 / 9}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority={priority}
          className="object-center rounded-xl opacity-80 mix-blend-luminosity"
        />
      </AspectRatio>

     
    </div>
  </div>


)

export function BentoSection() {
  const cards = [
    {
      title: "The Co-pilot/Cursor for project planning",
      description: "Let your AI project manager create plans, ideate, make updates, set durations, determine risks.",

      imageSrc: "/images/bento/01-Copilot-cursor-for-pm.png",
      imageAlt: "The Co-pilot/Cursor for project planning",
    },
    {
      title: "AI voice chats",
      description: "Talk to your AI project manager as part of your team",

      imageSrc: "/images/bento/02-AI-voice-chats.gif",
      imageAlt: "AI voice chats",
    },
    {
      title: "Flow diagrams for planning",
      description: "Visual project management for early ideation",

      imageSrc: "/images/bento/03-flow-diagrams.gif",
      imageAlt: "Flow diagrams for planning",
    },
    {
      title: "Export to Excel or Google Sheets",
      description: "Export your plan for further use in Excel or Google Sheets",

      imageSrc: "/images/bento/04-sheets.gif",
      imageAlt: "Export to Excel or Google Sheets",
    },
    {
      title: "AI Estimated task durations",
      description: "Let AI determine your task durations",

      imageSrc: "/images/bento/05-Task-durations.gif",
      imageAlt: "AI Estimated task durations",
    },
    {
      title: "Task database",
      description: "Store completed tasks so you know how long the task takes for next time",

      imageSrc: "/images/bento/06-Task-database.gif",
      imageAlt: "Task database",
    },
  ]

  return (
    <section className="w-full px-5 flex flex-col justify-center items-center overflow-visible bg-transparent">
      <div className="w-full py-8 md:py-16 relative flex flex-col justify-start items-start gap-6">
        <div className="w-[547px] h-[938px] absolute top-[614px] left-[80px] origin-top-left rotate-[-33.39deg] bg-primary/10 blur-[130px] z-0" />
        <div className="self-stretch py-8 md:py-14 flex flex-col justify-center items-center gap-2 z-10">
          <div className="flex flex-col justify-start items-center gap-10">
            <h2 className="w-full max-w-[655px] text-center text-foreground text-4xl md:text-6xl font-semibold leading-tight md:leading-[66px]">
              Your Personal AI Project Manager
            </h2>
            <p className="w-full max-w-[600px] text-center text-muted text-md md:text-lg font-medium leading-relaxed">
              Ask your AI Project Manager to build your project plans, timelines, and resources. Get it to save project data for future reference.
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
  )
}
