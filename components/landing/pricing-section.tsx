"use client"

import { AnimatedSectionWhileInView } from "@/components/ui/animated-section"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <AnimatedSectionWhileInView className="relative z-10 max-w-[1320px] mx-auto mt-8 md:mt-16" delay={0.2}>
      <PricingSectionContent isAnnual={isAnnual} setIsAnnual={setIsAnnual} />
    </AnimatedSectionWhileInView>
  )
}

function PricingSectionContent({ isAnnual, setIsAnnual }: { isAnnual: boolean, setIsAnnual: (v: boolean) => void }) {
  const pricingPlans = [
    {
      name: "Free",
      monthlyPrice: "$0",
      annualPrice: "$0",
      description: "Perfect for individuals getting started",
      features: [
        "Canvas-based flow diagrams",
        "3 planning boards",
        "Basic task cards with descriptions, dates & status",
        "500 AI tokens/month",
        "Store up to 50 tasks in database",
        "Export to Excel/Google Sheets",
        "Up to 3 collaborators per board",
        "AI-powered project creation & edits",
        "Comment & attachment support",
      ],
      buttonText: "Get Started for Free",
      popular: true,
    },
    {
      name: "Pro",
      monthlyPrice: "$29",
      annualPrice: "$299",
      description: "Ideal for professionals",
      features: [
        "Everything in Free, plus:",
        "Unlimited planning boards",
        "Advanced task cards with duration estimation",
        "10,000 AI tokens/month",
        "Unlimited task database storage",
        "Up to 50 collaborators per board",
        "AI deadline tracking & recommendations",
        "Monday.com & Asana integrations",
        "Advanced export options",
        "Priority email support",
      ],
      buttonText: "Coming Soon",

    },
    {
      name: "Enterprise",
      monthlyPrice: "Custom",
      annualPrice: "Custom",
      description: "For teams with advanced needs",
      features: [
        "Everything in Pro, plus:",
        "Unlimited AI tokens",
        "Unlimited collaborators",
        "Custom integrations",
        "Dedicated account manager",
        "Advanced security & compliance",
        "Custom contract terms",
        "SLA guarantees",
        "On-premise deployment options",
        "24/7 priority support",
      ],
      buttonText: "Coming soon",
    },
  ]

  return (
    <section className="w-full px-5 overflow-hidden flex flex-col justify-start items-center my-0 py-8 md:py-14">
      <div className="self-stretch relative flex flex-col justify-center items-center gap-2 py-0">
        <div className="flex flex-col justify-start items-center gap-10 mb-6">
          <h2 className="w-full max-w-[655px] text-center text-foreground text-2xl md:text-4xl lg:text-6xl font-semibold leading-tight md:leading-[66px]">
            Pricing built for every Project
          </h2>
          <p className="w-full max-w-[600px] text-center text-muted-foreground text-md md:text-lg font-medium leading-relaxed">
            Choose a plan that fits your project planning, from individuals planning a small project, to professional project managers and large organizations.
          </p>
        </div>
        <div className="pt-4">
          <div className="p-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg flex justify-start items-center gap-1 md:mt-0">

            <button
              onClick={() => setIsAnnual(false)}
              className={`px-2 py-1 flex justify-start items-start rounded-md ${!isAnnual ? "bg-muted" : ""}`}
            >
              <span
                className={`text-center text-sm font-medium leading-tight ${!isAnnual ? "text-accent-foreground" : "text-muted-foreground"}`}
              >
                Monthly
              </span>
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`pl-2 pr-1 py-1 flex justify-start items-start gap-2 rounded-md ${isAnnual ? "bg-muted" : ""}`}
            >
              <span
                className={`text-center text-sm font-medium leading-tight ${isAnnual ? "text-accent-foreground" : "text-muted-foreground"}`}
              >
                Annually
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="self-stretch px-5 flex flex-col md:flex-row justify-start items-start gap-4 md:gap-6 mt-6 max-w-[1100px] mx-auto">
        {pricingPlans.map((plan) => (
          <div
            key={plan.name}
            className="w-full md:flex-1 p-4 overflow-hidden rounded-xl flex flex-col justify-start items-start gap-6 border bg-white/15 backdrop-blur-md border border-border-dark shadow-2xl ring-1 ring-white/20"
          >
            <div className="self-stretch flex flex-col justify-start items-start gap-6">
              <div className="self-stretch flex flex-col justify-start items-start gap-8">
                <div
                  className="w-full h-5 text-sm font-medium leading-tight text-foreground"
                >
                  {plan.name}
                  {plan.popular && (
                    <div className="ml-2 px-2 py-0.5 rounded-full bg-primary/50 text-foreground text-xs font-medium leading-tight inline-flex items-center justify-center">
                      Popular
                    </div>
                  )}
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="flex justify-start items-center gap-1.5">
                    <div
                      className="relative h-10 flex items-center text-3xl font-medium leading-10 text-foreground"
                    >
                      <span className="invisible">{isAnnual ? plan.annualPrice : plan.monthlyPrice}</span>
                      <span
                        className="absolute inset-0 flex items-center transition-all duration-500"
                        style={{
                          opacity: isAnnual ? 1 : 0,
                          transform: `scale(${isAnnual ? 1 : 0.8})`,
                          filter: `blur(${isAnnual ? 0 : 4}px)`,
                        }}
                        aria-hidden={!isAnnual}
                      >
                        {plan.annualPrice}
                      </span>
                      <span
                        className="absolute inset-0 flex items-center transition-all duration-500"
                        style={{
                          opacity: !isAnnual ? 1 : 0,
                          transform: `scale(${!isAnnual ? 1 : 0.8})`,
                          filter: `blur(${!isAnnual ? 0 : 4}px)`,
                        }}
                        aria-hidden={isAnnual}
                      >
                        {plan.monthlyPrice}
                      </span>
                    </div>
                    <div
                      className="text-center text-sm font-medium leading-tight text-muted-foreground"
                    >
                      /{isAnnual ? "year" : "month"}
                    </div>
                  </div>
                  <div
                    className="self-stretch text-sm font-medium leading-tight text-foreground"
                  >
                    {plan.description}
                  </div>
                </div>
              </div>
              {plan.name === "Free" ? (
                <Link href="/canvas" className="self-stretch">
                  <Button className="w-full px-5 py-2 rounded-[40px] bg-white/10 backdrop-blur-md border border-border-dark text-foreground hover:bg-white/20 shadow-lg text-sm font-medium">
                    {plan.buttonText}
                  </Button>
                </Link>
              ) : (
                <Button className="w-full px-5 py-2 rounded-[40px] bg-white/10 backdrop-blur-md border border-border-dark text-muted-foreground shadow-lg text-sm font-medium cursor-not-allowed hover:bg-white/10">
                  {plan.buttonText}
                </Button>
              )}
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-4">

              <div className="self-stretch flex flex-col justify-start items-start gap-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="self-stretch flex justify-start items-center gap-2">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <Check
                        className="w-full h-full text-foreground"
                        strokeWidth={2}
                      />
                    </div>
                    <div
                      className="leading-tight font-normal text-sm text-left text-foreground"
                    >
                      {feature}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
