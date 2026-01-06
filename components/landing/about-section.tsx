
import Image from "next/image"
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
    const founders = [
        {
            name: "Nicholas Tickle",
            title: "co-founder",
            description: "Ex bridge engineer who literally built bridges and buildings. Now building software.",
            image: "/images/founders/01-founder-1.jpeg",
            linkedIn: "https://www.linkedin.com/in/nicholastickle/",
            x: "https://x.com/TickleNicholas",
        },
        {
            name: "Brighton Tandabantu",
            title: "co-founder",
            description: "Repeat founder, systems architect, and fullstack developer.",
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
                            <div className="flex flex-[8.3] justify-start items-center p-8 border-r border-border-dark">
                                <h2 className="w-full text-start text-foreground text-5xl italic font-semibold leading-tight ">
                                    &ldquo;We spent our careers building the physical world. Now we&apos;re building the engine that powers it.&rdquo;
                                </h2>

                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-center items-center w-full mx-auto py-16 border border-border-dark">
                            {founders.map((founder, index) => (
                                <div
                                    key={founder.name}
                                    className="relative group cursor-pointer flex flex-col items-center"
                                >
                                    {/* Founder Image */}
                                    <div className="w-80 h-80 rounded-lg overflow-hidden bg-muted flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                                        <Image
                                            src={founder.image}
                                            alt={`${founder.name} - ${founder.title}`}
                                            width={320}
                                            height={320}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                                        />
                                    </div>

                                    {/* Social Links - below image */}
                                    <div className="flex justify-center gap-4 mt-6 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                                        {founder.linkedIn && (
                                            <a
                                                href={founder.linkedIn}
                                                target="_blank"
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
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 rounded-full bg-transparent transition-colors duration-200 text-foreground hover:text-primary"
                                                aria-label={`${founder.name}'s X (Twitter) profile`}
                                            >
                                                <XIcon />
                                            </a>
                                        )}
                                    </div>

                                    {/* Leader Line - L-shaped from speech bubble to image edge */}
                                    <div className="absolute opacity-0 group-hover:opacity-100 transition-all duration-700 top-64 left-1/2 transform -translate-x-1/2 z-5">
                                        <svg width="150" height="120" className="overflow-visible">
                                            {/* Vertical line from speech bubble */}
                                            <line
                                                x1="75"
                                                y1="120"
                                                x2="75"
                                                y2="80"
                                                stroke="#ef4444"
                                                strokeWidth="2"
                                                strokeDasharray="4,4"
                                                className="animate-pulse"
                                            />
                                            {/* Horizontal line to image edge */}
                                            <line
                                                x1="75"
                                                y1="80"
                                                x2="20"
                                                y2="80"
                                                stroke="#ef4444"
                                                strokeWidth="2"
                                                strokeDasharray="4,4"
                                                className="animate-pulse"
                                            />
                                            {/* Arrow pointing to image */}
                                            <polygon
                                                points="20,80 15,77 15,83"
                                                fill="#ef4444"
                                            />
                                            {/* Starting point circle at speech bubble */}
                                            <circle
                                                cx="75"
                                                cy="120"
                                                r="3"
                                                fill="#ef4444"
                                            />
                                        </svg>
                                    </div>

                                    {/* Speech Bubble - appears below social links */}
                                    <div className="absolute opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-90 group-hover:scale-100 z-10 top-80 left-1/2 transform -translate-x-1/2">
                                        <div className="bg-background border-2 border-primary rounded-lg p-4 shadow-lg w-72 relative">
                                            <div className="flex flex-col gap-2 text-center">
                                                <h3 className="text-foreground text-lg font-bold">
                                                    {founder.name}
                                                </h3>
                                                <p className="text-primary text-sm font-semibold">
                                                    {founder.title}
                                                </p>
                                                <p className="text-muted-foreground text-sm">
                                                    {founder.description}
                                                </p>
                                            </div>

                                            {/* Arrow pointer pointing up to the image */}
                                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                                                <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-primary"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <CompanyPhilosophy />
                </AnimatedSectionWhileInView>
                <div className=" w-[60px] diagonal-lines border-r border-border-dark">
                </div>
            </div>

        </>
    )
}