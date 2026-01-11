"use client"

import { AnimatedSectionWhileInView } from "@/components/ui/animated-section"
import { Button } from "@/components/ui/button"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const faqData = [
    {
        question: "What type of tasks can the AI agent handle?",
        answer: "The AI has access to the internet so it can plan tasks and come up with estimates based on what is available online. But we know that is not enough, so we are building the AI to learn off of your context. The AI can read attachments, look at your task book of completed tasks, rearrange and manage your board, perform start of day and end of day updates and automatically update the board... more to come!",
    },
    {
        question: "How does the AI learn from my completed work?",
        answer: "We have provided you with a task book. When you change the status of tasks to completed, you will be prompted to add the task to your task book which is your AI's memory. You can also create task templates within the task book and add tasks that aren't yet completed. This is how your AI learns your context. It also has access to all comments and history on the board.",
    },
    {
        question: "Do I need to sign in to use Project Machine?",
        answer: "You do not need to sign in to use Project Machine, but you will be limited to one board which will not be accessible on other devices and many features will be restricted. We recommend signing in as it allows you to save your projects and access many other features.",
    },
    {
        question: "Which LLMs does Project Machine use?",
        answer: "Right now we use OpenAI's GPT-4 and plan to add more LLM options in the future.",
    },
    
    {
        question: "Is my project data secure?",
        answer: "We take data privacy seriously. Your project data is securely stored and not shared with third parties. We do not sell your data or use it to train our AI models. We are currently working on end-to-end encryption for added security and looking into SOC2, GDPR, and ISO27001 certifications.",
    },
    {
        question: "Can I use Project Machine offline?",
        answer: "Project Machine requires an internet connection to access AI features and sync your projects. Some basic functionalities are available offline, but full functionality requires online access."
    },
]

export default function FAQSection() {
    return (
        <>
            <div className="flex flex-row justify-center border-x border-border-dark ">
                <div className=" w-[60px] diagonal-lines border-x border-border-dark">
                </div>
                <AnimatedSectionWhileInView className=" flex-1 max-w-[1320px relative flex flex-col items-center text-center overflow-hidden w-full md:w-[98vw] lg:w-[98vw] xl:w-[1220px] max-w-[1220px] " delay={0.2}>
                    <section id="faq-section" className="w-full flex flex-col justify-center">
                        

                        {/* Two Column Layout */}
                        <div className="w-full grid grid-cols-1 lg:grid-cols-2 relative z-10">

                            {/* Left Column - FAQ Accordion */}
                            <div className="flex flex-col justify-start items-start">
                                <Accordion type="single" collapsible className="w-full">
                                    {faqData.map((faq, index) => (
                                        <AccordionItem key={index} value={`item-${index}`} className="border-r border-border-dark backdrop-blur-md last:border-b-0 text-left">
                                            <AccordionTrigger className="px-5 py-4 text-left text-md hover:no-underline text-muted-foreground hover:text-foreground w-full">
                                                {faq.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="px-5 pb-4 text-muted-foreground text-sm">
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>

                            {/* Right Column - Title and Buttons */}
                            <div className="flex flex-col items-center space-y-8 p-5 justify-start">
                                <div className="flex flex-col space-y-6">
                                    <h2 className="text-3xl text-foreground">
                                        Frequently Asked Questions
                                    </h2>
                                  
                                </div>

                                {/* Buttons */}
                                <div className="flex flex-row space-x-4 w-full max-w-[300px]">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-center"
                                        onClick={() => window.open('mailto:nicholas@projectmachine.com', '_blank')}
                                    >
                                        Contact Us
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-center"
                                        onClick={() => window.open('https://www.featurebase.app/', '_blank')}
                                    >
                                        Give feedback
                                    </Button>
                                </div>
                            </div>

                        </div>
                    </section>
                </AnimatedSectionWhileInView>
                <div className=" w-[60px] diagonal-lines border-x border-border-dark">
                </div>
            </div>
        </>
    )
}
