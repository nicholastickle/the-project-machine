import { AnimatedSectionWhileInView } from "@/components/ui/animated-section"
import BentoCard from "@/components/landing/bento-card"
import { TextCursor, Map, BookOpenCheck } from "lucide-react"

export default function BentoSection() {
  const cards = [
    {
      title: "Limitless canvas",
      description: "Autogenerate plans, estimate durations, make updates, track progress.",
      icon: TextCursor,
    },
    {
      title: "Complete task database",
      description: "Store completed tasks to improve AI generation and future planning.",
      icon: BookOpenCheck,
    },
    {
      title: "Your own context engineered AI",
      description: "Drag, drop, edit, and track your tasks on a visual workspace.",
      icon: Map,
    },

  ]

  return (

    <div className="flex flex-row justify-center border border-border-dark ">
      <div className=" w-[60px] diagonal-lines border-x border-border-dark">
      </div>
      <AnimatedSectionWhileInView className="flex-1 max-w-[1320px relative flex flex-col items-center text-center rounded-2xl overflow-hidden w-full md:w-[98vw] lg:w-[98vw] xl:w-[1220px] max-w-[1220px]" delay={0.2}>
        <section id="features-section" className="w-full flex flex-col justify-center items-center  bg-transparent ">
          <div className="w-full relative flex flex-col justify-start items-start">

            <div className="self-stretch flex flex-col justify-center items-center ">
              <div className="flex flex-row justify-start items-center  border-b border-border-dark">
                <h2 className="w-full max-w-[655px] text-start text-foreground text-2xl md:text-4xl lg:text-6xl border-r border-border-dark">
                  Plan with the power of your own history
                </h2>
                <p className="w-full max-w-[600px] text-start text-muted-foreground text-md md:text-lg font-medium leading-relaxed">
                  Project Machine is an attempt to finally get better at planning by leveraging your lessons learned and we&apos;re doing it with big data and AI
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
      <div className=" w-[60px] diagonal-lines border-x border-border-dark">
      </div>
    </div>
  )
}

