
"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { useState, useEffect, useRef } from "react"
import { AnimatedSection, AnimatedSectionWhileInView } from "@/components/ui/animated-section"
import { CompanyPhilosophy } from "./company-philosophy"

const LinkedInIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
)

const XIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
)

export default function AboutSection() {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [scrollOpacity, setScrollOpacity] = useState(0)
    const sectionRef = useRef<HTMLDivElement>(null)

    // Ensure theme is hydrated before rendering
    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            if (sectionRef.current) {
                const rect = sectionRef.current.getBoundingClientRect()
                const windowHeight = window.innerHeight

                // Calculate opacity based on position in viewport
                // Full opacity when section is in middle of screen
                const center = windowHeight / 2
                const sectionCenter = rect.top + (rect.height / 2)

                // Calculate distance from center (0 = perfect center)
                const distanceFromCenter = Math.abs(center - sectionCenter)

                // Increased maximum distance for fade (full screen height instead of half)
                const maxDistance = windowHeight * 0.8

                // Calculate opacity (1 at center, 0 at max distance)
                const opacity = Math.max(0, Math.min(1, 1 - (distanceFromCenter / maxDistance)))

                setScrollOpacity(opacity)
            }
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll() // Call once to set initial state

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const founders = [
        {
            name: "Nicholas Tickle",
            title: "co-founder",
            description: "Ex bridge engineer who built bridges and buildings. Now building software",
            image: "/images/founders/01-founder-1.jpeg",
            linkedIn: "https://www.linkedin.com/in/nicholastickle/",
            x: "https://x.com/TickleNicholas",
        },
        {
            name: "Brighton Tandabantu",
            title: "co-founder",
            description: "Repeat founder, systems architect, and fullstack developer",
            image: "/images/founders/02-founder-2.jpeg",
            linkedIn: "https://www.linkedin.com/in/bthanda/",
            x: "https://x.com/Its_Thandah",
        },
    ]

    return (
        <>
            <div className="flex flex-row justify-center border border-border-dark ">
                <div className=" w-[60px] diagonal-lines border-l border-border-dark">
                </div>
                <AnimatedSectionWhileInView className=" flex-1 max-w-[1320px relative flex flex-col items-center text-center overflow-hidden w-full md:w-[98vw] lg:w-[98vw] xl:w-[1220px] max-w-[1220px] " delay={0.2}>
                    <section id="about-section" className="w-full flex flex-col">
                        <div className=" flex flex-row w-full ">
                            <div className="flex flex-[3.7] border-r border-border-dark diagonal-lines">

                            </div>
                            <div className="flex flex-[8.3] justify-start items-center p-8 border-r border-b border-border-dark">
                                <h2 className="w-full text-start text-foreground text-5xl italic font-semibold leading-tight ">
                                    &ldquo;We spent our careers building the physical world. Now we&apos;re building the engine that powers it.&rdquo;
                                </h2>

                            </div>
                        </div>

                        <div className="flex justify-center items-center w-full diagonal-lines" ref={sectionRef}>
                            {/* Single Landscape Image Container with Founder Hover Areas */}
                            <div className="relative w-full mt-8 rounded-2xl  shadow-lg">
                                <div className="relative w-full aspect-[2.6/2]  ">
                                    {mounted && (
                                        <Image
                                            src={resolvedTheme === 'dark'
                                                ? "/images/founders/03-founders-landscape-dark.png"
                                                : "/images/founders/03-founders-landscape-light.png"
                                            }
                                            alt="Nicholas Tickle and Brighton Tandabantu - Co-founders of Project Machine"
                                            fill
                                            className="object-cover object-center rounded-2xl"
                                        />
                                    )}
                                </div>

                                {/* Founder Hover Circles and Speech Bubbles */}
                                {founders.map((founder, index) => (
                                    // Position circles directly on the image container
                                    <div
                                        key={founder.name}
                                        className={`group absolute w-60 h-80 transition-all duration-300 cursor-pointer ${index === 0
                                            ? 'top-[35%] left-[21%]'  // Nicholas position (adjust as needed)
                                            : 'top-[42%] right-[21%]' // Brighton position (adjust as needed)
                                            }`}
                                    >

                                        {/* Speech Bubble */}
                                        <div
                                            className={`absolute transition-all duration-100 transform scale-90 group-hover:scale-100 z-20 group-hover:!opacity-100 ${index === 0
                                                ? 'bottom-[90%] right-[75%]'     // Position for Nicholas bubble
                                                : 'bottom-[100%] left-[75%]'    // Position for Brighton bubble
                                                }`}
                                            style={{ opacity: scrollOpacity }}
                                        >

                                            {/* Leader Line - positioned relative to speech bubble */}
                                            <div
                                                className={`absolute transition-all duration-100 z-10 group-hover:!opacity-100 ${index === 0
                                                    ? 'top-full left-1/2 transform -translate-x-1/2'  // Below Nicholas bubble
                                                    : 'top-full left-1/2 transform -translate-x-1/2'  // Below Brighton bubble
                                                    }`}
                                                style={{ opacity: scrollOpacity }}
                                            >
                                                <svg width="200" height="150" className="overflow-visible">
                                                    {/* Vertical line from hover area */}
                                                    <line
                                                        x1={index === 0 ? "100" : "100"}
                                                        y1={index === 0 ? "0" : "0"}
                                                        x2={index === 0 ? "150" : "50"}
                                                        y2={index === 0 ? "150" : "150"}
                                                        stroke="hsl(var(--foreground))"
                                                        strokeWidth="1"

                                                    />
                                                    {/* Horizontal line to speech bubble */}
                                                    <line
                                                        x1={index === 0 ? "150" : "50"}
                                                        y1={index === 0 ? "150" : "150"}
                                                        x2={index === 0 ? "295" : "-90"}
                                                        y2={index === 0 ? "150" : "150"}
                                                        stroke="hsl(var(--foreground))"
                                                        strokeWidth="1"
                                                    />
                                                    {/* Open circle instead of arrow */}
                                                    <circle
                                                        cx={index === 0 ? "300" : "-95"}
                                                        cy={index === 0 ? "150" : "150"}
                                                        r="4"
                                                        fill="none"
                                                        stroke="hsl(var(--foreground))"
                                                        strokeWidth="1"
                                                    />

                                                </svg>
                                            </div>

                                            <div className=" rounded-2xl p-2 w-72 relative">
                                                <div className="flex flex-col gap-2 text-left relative z-10">
                                                    <h3 className="text-foreground text-2xl font-bold">
                                                        {founder.name}
                                                    </h3>
                                                    <p className="text-foreground text-lg font-semibold">
                                                        {founder.title}
                                                    </p>
                                                    <p className="text-foreground text-md">
                                                        {founder.description}
                                                    </p>
                                                </div>



                                                {/* Social Links in speech bubble */}
                                                <div className="flex justify-start gap-4 mt-4 relative z-10">
                                                    {founder.linkedIn && (
                                                        <a
                                                            href={founder.linkedIn}

                                                            rel="noopener noreferrer"
                                                            className="p-2 rounded-full bg-transparent transition-colors duration-200 text-foreground hover:text-primary"
                                                            aria-label={`${founder.name}'s LinkedIn profile`}
                                                        >
                                                            <LinkedInIcon />
                                                        </a>
                                                    )}
                                                    {founder.x && (
                                                        <a
                                                            href={founder.x}

                                                            rel="noopener noreferrer"
                                                            className="p-2 rounded-full bg-transparent transition-colors duration-200 text-foreground hover:text-primary"
                                                            aria-label={`${founder.name}'s X (Twitter) profile`}
                                                        >
                                                            <XIcon />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                ))}
                            </div>
                        </div>
                    </section>
                    <CompanyPhilosophy />
                </AnimatedSectionWhileInView>
                <div className=" w-[60px] diagonal-lines border-r border-border-dark">
                </div>
            </div >


        </>
    )
}