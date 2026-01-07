"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface Philosophy {
    id: string
    name: string
    description: string
}

const philosophies: Philosophy[] = [
    {
        id: "thesis",
        name: "Thesis",
        description:
            "After years of working in the engineering and built environment world, we realized every engineer plans their projects from scratch each time, with Excel plans getting lost in oblivion. Lessons learned are not documented and time taken to complete tasks is forgotten. We wanted to build a tool that helps engineers get better at planning by learning from their past projects.",
    },
    {
        id: "canvas",
        name: "Why a canvas for planning?",
        description:
            "User interfaces (UIs) of the future won't be fixed, but will be created as needed. A canvas allows for infinite space for AI to work with you creating elements as needed, connecting them, and visualizing your entire project ecosystem in one place.",
    },
    {
        id: "stored-history",
        name: "Stored Project History",
        description:
            "We want to help you get better at planning by learning from your past projects. Every completed task becomes valuable data that can be used to improve future planning. So we store durations, lessons learned, blockers encountered, and success patterns to transform your project history.",
    },
    {
        id: "context-engineered-ai",
        name: "Context-Engineered AI",
        description:
            "Legacy LLMs struggle to provide accurate tasks and estimates for your engineering work, because they're not trained on your specific context. We therefore want to differentiate ourselves by focusing on context engineering for engineering based planning work.",
    },
    {
        id: "humans-vs-ai",
        name: "Humans vs AI",
        description:
            "We are pro-human and believe that humans are the most important appearance in the universe. We believe that the most valuable businesses of the coming decades will empower people rather than try to make them obsolete. Better technology won't replace professionals; it will allow them to do even more.",
    },
    {
        id: "data-privacy",
        name: "Data Privacy",
        description:
            "We are not here to build tools that invade privacy and freedoms. We don’t sell customer data to anyone. We don't train our AI on your data.",
    },
]

export function CompanyPhilosophy() {
    const [selectedPhilosophy, setSelectedPhilosophy] = useState<Philosophy>(philosophies[0])

    return (
        <div className="flex flex-row justify-center">

            <section className="flex-1 max-w-[1320px] relative flex flex-col items-center overflow-hidden w-full md:w-[98vw] lg:w-[98vw] xl:w-[1220px] max-w-[1220px] diagonal-lines py-6 w-full">

                <div className="grid lg:grid-cols-2 max-w-6xl mx-auto rounded-2xl">

                    {/* Left Column - Philosophies Card */}
                    <div className="bg-background border-l border-b border-t border-border-dark overflow-hidden px-6">
                        <div className="py-6 border-b border-border-dark">
                            <h2 className="text-3xl text-foreground">Our Philosophies</h2>
                        </div>
                        <div className="p-0">
                            {philosophies.map((philosophy) => (
                                <button
                                    key={philosophy.id}
                                    onClick={() => setSelectedPhilosophy(philosophy)}
                                    className={cn(
                                        "w-full text-left px-3 py-3 transition-all duration-300 relative",

                                        selectedPhilosophy.id === philosophy.id
                                            ? "text-primary-foreground"
                                            : "text-muted/50",
                                    )}
                                >
                                    <div className="flex items-center relative">
                                        {selectedPhilosophy.id === philosophy.id && (
                                            <span className="text-sm mr-3 text-muted animate-in fade-in slide-in-from-left-4 duration-500 absolute left-0">▶</span>
                                        )}
                                        <span className={cn(
                                            " text-lg transition-transform duration-500 ease-out",
                                            selectedPhilosophy.id === philosophy.id ? " text-foreground translate-x-6" : "translate-x-0"
                                        )}>
                                            [  {philosophy.name}  ]
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Description Card */}
                    <div className="bg-background border border-border-dark  overflow-hidden p-8 flex items-center justify-start">

                        <div key={selectedPhilosophy.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                {selectedPhilosophy.description}
                            </p>

                        </div>
                    </div>


                </div >
            </section >

        </div >
    )
}