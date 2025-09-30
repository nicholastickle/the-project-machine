import React from "react"
import Image from "next/image"

// Social Media Icons
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

export function AboutSection() {
    const founders = [
        {
            name: "Nicholas Tickle",
            title: "Co-Founder & CEO",
            description: "Experienced project manager, bridge designer, and web developer with 10 years experience in Civil Engineering. Passionate about simplifying project management through AI.",
            image: "/images/founders/01-founder-1.jpeg",
            linkedIn: "https://www.linkedin.com/in/nicholastickle/",
            x: "https://x.com/TickleNicholas",
        },
        {
            name: "Brighton Tandabantu",
            title: "Co-Founder & CTO",
            description: "Second time founder. Web developer with a passion for creating innovative solutions. Expert in fullstack web development and building scalable platforms.",
            image: "/images/founders/02-founder-2.jpeg",
            linkedIn: "https://www.linkedin.com/in/bthanda/",
            x: "https://x.com/Its_Thandah",
        },
    ]

    return (
        <section id="about-section" className="w-full px-5 overflow-hidden flex flex-col justify-start items-center my-0 py-8 md:py-14">
            <div className="self-stretch relative flex flex-col justify-center items-center gap-2 py-0">
                <div className="flex flex-col justify-start items-center gap-10 mb-6">
                    <h2 className="w-full max-w-[655px] text-center text-foreground text-4xl md:text-6xl font-semibold leading-tight md:leading-[66px]">
                        Meet the Founders
                    </h2>
                    <p className="w-full max-w-[600px] text-center text-muted-foreground text-md md:text-lg font-medium leading-relaxed">
                        We&apos;re passionate about transforming how teams plan and execute projects. Our combined expertise in project management and AI technology drives our mission to make project planning effortless and intelligent.
                    </p>
                </div>
            </div>

            <div className="self-stretch px-5 flex flex-col md:flex-row justify-center items-start gap-6 md:gap-8 mt-6 max-w-[800px] mx-auto">
                {founders.map((founder) => (
                    <div
                        key={founder.name}
                        className="w-full md:flex-1 p-6 overflow-hidden rounded-xl flex flex-col justify-start items-center gap-6 bg-gradient-to-b from-gray-50/5 to-gray-50/0"
                        style={{ outline: "1px solid hsl(var(--border))", outlineOffset: "-1px" }}
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-41 h-41 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                                <Image
                                    src={founder.image}
                                    alt={`${founder.name} - ${founder.title}`}
                                    width={100}
                                    height={100}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex flex-col items-center gap-2 text-center">
                                <h3 className="text-foreground text-xl font-semibold leading-tight">
                                    {founder.name}
                                </h3>
                                <p className="text-orange-400 text-sm font-medium leading-tight">
                                    {founder.title}
                                </p>
                            </div>
                        </div>

                        <div className="self-stretch flex flex-col gap-4">
                            <p className="text-muted-foreground text-sm leading-relaxed text-center">
                                {founder.description}
                            </p>

                            <div className="flex justify-center gap-4">
                                {founder.linkedIn && (
                                    <a
                                        href={founder.linkedIn}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-full bg-transparent  transition-colors duration-200 text-white hover:text-orange-400"
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
                                        className="p-2 rounded-full bg-transparent transition-colors duration-200 text-white hover:text-orange-400"
                                        aria-label={`${founder.name}'s X (Twitter) profile`}
                                    >
                                        <XIcon />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}