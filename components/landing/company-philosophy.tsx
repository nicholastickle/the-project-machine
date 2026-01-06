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
        id: "transparency",
        name: "[Transparency]",
        description:
            "We believe in open, honest communication about our progress, challenges, and decisions. Every feature, limitation, and roadmap item is shared openly with our community, fostering trust and collaborative improvement.",
    },
    {
        id: "simplicity",
        name: "[Simplicity]",
        description:
            "Complex projects don't need complex tools. We focus on intuitive design and streamlined workflows that make project planning feel natural, not overwhelming. Every feature must earn its place by truly adding value.",
    },
    {
        id: "learning",
        name: "[Continuous Learning]",
        description:
            "We learn from every completed task, failed estimate, and successful project. Our platform grows smarter with your experience, turning past lessons into future advantages for better planning.",
    },
    {
        id: "ownership",
        name: "[User Ownership]",
        description:
            "Your data, your decisions, your control. We build tools that empower you to own your planning process completely. No vendor lock-in, no hidden agendas—just powerful tools that work for you.",
    },
    {
        id: "iteration",
        name: "[Rapid Iteration]",
        description:
            "Planning is never perfect on the first try. We embrace quick cycles of planning, testing, learning, and adjusting. Our tools support this natural rhythm of continuous improvement and adaptation.",
    },
]

export function CompanyPhilosophy() {
    const [selectedPhilosophy, setSelectedPhilosophy] = useState<Philosophy>(philosophies[0])

    return (
        <div className="flex flex-row justify-center">

            <section className="flex-1 max-w-[1320px] relative flex flex-col items-center overflow-hidden w-full md:w-[98vw] lg:w-[98vw] xl:w-[1220px] max-w-[1220px] diagonal-lines p-6">
                <div className="w-full px-4">
                    <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">

                        {/* Left Column - Philosophies Card */}
                        <div className="bg-background border border-border-dark rounded-lg overflow-hidden shadow-lg">
                            <div className="p-6 border-b border-border-dark">
                                <h2 className="text-3xl font-bold text-foreground">Our Philosophies</h2>
                            </div>
                            <div className="p-0">00
                                {philosophies.map((philosophy) => (
                                    <button
                                        key={philosophy.id}
                                        onClick={() => setSelectedPhilosophy(philosophy)}
                                        className={cn(
                                            "w-full text-left px-6 py-6 transition-all duration-300 relative",
                                            "hover:bg-accent/20 hover:text-foreground border-b border-border-dark last:border-b-0",
                                            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset",
                                            selectedPhilosophy.id === philosophy.id
                                                ? "bg-primary text-primary-foreground"
                                                : "text-foreground",
                                        )}
                                    >
                                        <div className="flex items-center">
                                            {selectedPhilosophy.id === philosophy.id && (
                                                <span className="text-xl font-bold mr-3">▶</span>
                                            )}
                                            <span className="text-lg font-medium">[ {philosophy.name.toUpperCase()} ]</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right Column - Description Card */}
                        <div className="bg-background border border-border-dark rounded-lg overflow-hidden shadow-lg">
                            <div className="p-6 border-b border-border-dark">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-3xl font-bold text-foreground">Project Machine</h2>
                                    <div className="text-2xl">⚙️</div>
                                </div>
                            </div>
                            <div className="p-8 flex items-center justify-center min-h-[400px]">
                                <div key={selectedPhilosophy.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
                                    <h3 className="text-2xl font-bold mb-6 text-foreground">{selectedPhilosophy.name}</h3>
                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                        {selectedPhilosophy.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    )
}