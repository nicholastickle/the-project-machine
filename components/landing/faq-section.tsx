"use client"



import { useState, useCallback } from "react"
import FAQItem from "@/components/landing/faq-item"
import { AnimatedSectionWhileInView } from "@/components/ui/animated-section"

const faqData = [
  {
    question: "Do I need a credit card to get started?",
    answer:
      "No credit card required! You can start using Project Machine completely free — just sign up and begin planning. We believe in letting you experience the full power of AI-driven project planning before making any commitments. Additional features and paid plans are still under development, and we'll announce the official launch date soon. Until then, enjoy exploring the platform risk-free.",
  },
  {
    question: "Do I need to sign in to use Project Machine?",
    answer:
      "You can start using our simple canvas planning tool immediately without signing in — perfect for quick brainstorming sessions. However, to unlock AI features, you'll need to create a free account. Here's what changes when you sign in: Without Sign In - Access to basic canvas planning tool; 1 board only; No AI features; No task database storage; With Free Account (Signed In): All AI-powered features unlocked; Up to 3 boards; 500 AI tokens per month; Task database storage (up to 50 tasks); Collaboration features; Pro & Enterprise tiers require sign-in to access all premium features.",
  },

  {
    question: "How do I sign out or deactivate my account?",
    answer:
      "Head over to the canvas tool and click on your profile icon in the top corner. From there, you can sign out, manage your account settings, update your profile, or deactivate your account if needed. All your project data will be preserved if you decide to come back later.",
  },
  {
    question: "What are AI tokens and how do they work?",
    answer:
      "AI tokens are the currency that powers your AI assistant. Every time you ask the AI to create a project plan, make edits, analyze delays, or provide recommendations, it uses tokens. Think of it like your monthly AI budget. Token Usage: Simple requests (e.g., adding a task) use fewer tokens, while more complex requests (e.g., generating a full project plan) use more tokens. You can track your monthly token usage directly within the canvas. Tokens reset at the beginning of each month. We've designed the system to be transparent—you'll always know how many tokens you have left and can see your usage in real-time.",
  },
  {
    question: "Which AI model does Project Machine use?",
    answer:
      "Project Machine is smart about AI model selection. By default, we use intelligent routing—the system automatically determines the best AI model for your specific task. Advanced users can manually select their preferred AI model if they want specific performance characteristics. We support multiple leading LLM providers to ensure you always get the best results for your project planning needs.",
  },
  {
    question: "Why does Project Machine use flow diagrams for planning?",
    answer:
      "Flow diagrams provide a visual way to map out project tasks, dependencies, and timelines. This approach helps you see the big picture and understand how different parts of your project connect. It’s especially useful for complex projects where tasks are interdependent. By visualizing your plan, you can identify potential bottlenecks, optimize task sequences, and communicate your plan more effectively with stakeholders. Flow diagrams make it easier to adapt and update your plan as the project evolves. They are especially useful for early-stage planning and brainstorming and even more useful for collaborating with your AI project manager.",
  },
  {
    question: "Is my project data secure?",
    answer:
      "Your data security is our top priority. We use industry-standard encryption for data in transit and at rest. Your projects are private by default — only you and the collaborators you explicitly invite can access them. We never sell or share your project data with third parties."
  },
  {
    question: "Can I use Project Machine offline?",
    answer:
      "Currently, Project Machine requires an internet connection to access AI features and sync collaboration. However, once loaded, the canvas planning tool will continue to work if you temporarily lose connection. Any changes you make will sync automatically when your connection is restored."
  },
  {
    question: "What browsers are supported?",
    answer:
      "Project Machine is designed to work on all modern browsers, including Chrome, Firefox, Safari, and Edge. We recommend using the latest version of your preferred browser for the best experience. Chrome tends to offer the best performance with our AI features."
  },
  {
    question: "Still Have Questions?",
    answer:
      "We'd love to hear from you! Feel free to reach out to our support team at support@projectmachine.com. We're here to help with any questions or feedback you have about Project Machine. Please also check out our community forums, live chat support, and knowledge base for additional resources."
  }
]



export default function FAQSection() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())
  const toggleItem = useCallback((index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }, [openItems])
  return (
    <AnimatedSectionWhileInView className="relative z-10 max-w-[1320px] mx-auto mt-8 md:mt-16" delay={0.2}>
      <section className="w-full pt-[20px] pb-10 md:pb-20 px-5 relative flex flex-col justify-center items-center">
        <div className="w-[300px] h-[500px] absolute top-[150px] left-1/2 -translate-x-1/2 origin-top-left rotate-[-33.39deg] bg-primary/10 blur-[100px] z-0" />
        <div className="self-stretch pt-8 pb-8 md:pt-14 md:pb-14 flex flex-col justify-center items-center gap-4 relative z-10">
          <div className="flex flex-col justify-start items-center gap-8">
            <h2 className="w-full max-w-[435px] text-center text-foreground text-2xl md:text-4xl lg:text-5xl font-semibold leading-10 break-words">
              Frequently Asked Questions
            </h2>
            <p className="self-stretch text-center text-muted-foreground text-md font-medium leading-[18.20px] break-words">
              Everything you need to know about Pointer and how it can transform your development workflow
            </p>
          </div>
        </div>
        <div className="w-full max-w-[600px] pt-0.5 pb-10 flex flex-col justify-start items-start gap-4 relative z-10">
          {faqData.map((faq, index) => (
            <FAQItem key={index} {...faq} isOpen={openItems.has(index)} onToggle={() => toggleItem(index)} />
          ))}
        </div>
      </section>
    </AnimatedSectionWhileInView>
  )


}
