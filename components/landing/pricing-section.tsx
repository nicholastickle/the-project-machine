"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false)

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
      buttonClass:
        "bg-zinc-300 shadow-[0px_1px_1px_-0.5px_rgba(16,24,40,0.20)] outline outline-0.5 outline-[#1e29391f] outline-offset-[-0.5px] text-gray-800 text-shadow-[0px_1px_1px_rgba(16,24,40,0.08)] hover:bg-zinc-400",
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
      buttonClass:
        "bg-secondary shadow-[0px_1px_1px_-0.5px_rgba(16,24,40,0.20)] text-secondary-foreground text-shadow-[0px_1px_1px_rgba(16,24,40,0.08)] hover:bg-secondary/90",

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
      buttonClass:
        "bg-secondary shadow-[0px_1px_1px_-0.5px_rgba(16,24,40,0.20)] text-secondary-foreground text-shadow-[0px_1px_1px_rgba(16,24,40,0.08)] hover:bg-secondary/90",
    },
  ]

  return (
    <section className="w-full px-5 overflow-hidden flex flex-col justify-start items-center my-0 py-8 md:py-14">
      <div className="self-stretch relative flex flex-col justify-center items-center gap-2 py-0">
        <div className="flex flex-col justify-start items-center gap-10 mb-6">
          <h2 className="w-full max-w-[655px] text-center text-foreground text-4xl md:text-6xl font-semibold leading-tight md:leading-[66px]">
            Pricing built for every Project
          </h2>
          <p className="w-full max-w-[600px] text-center text-muted-foreground text-md md:text-lg font-medium leading-relaxed">
            Choose a plan that fits your project planning, from individuals planning a small project, to professional project managers and large organizations.
          </p>
        </div>
        <div className="pt-4">
          <div className="p-0.5 bg-muted rounded-lg outline outline-1 outline-[#0307120a] outline-offset-[-1px] flex justify-start items-center gap-1 md:mt-0">

            <button
              onClick={() => setIsAnnual(false)}
              className={`px-2 py-1 flex justify-start items-start rounded-md ${!isAnnual ? "bg-accent shadow-[0px_1px_1px_-0.5px_rgba(0,0,0,0.08)]" : ""}`}
            >
              <span
                className={`text-center text-sm font-medium leading-tight ${!isAnnual ? "text-accent-foreground" : "text-zinc-400"}`}
              >
                Monthly
              </span>
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`pl-2 pr-1 py-1 flex justify-start items-start gap-2 rounded-md ${isAnnual ? "bg-accent shadow-[0px_1px_1px_-0.5px_rgba(0,0,0,0.08)]" : ""}`}
            >
              <span
                className={`text-center text-sm font-medium leading-tight ${isAnnual ? "text-accent-foreground" : "text-zinc-400"}`}
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
            className={`w-full md:flex-1 p-4 overflow-hidden rounded-xl flex flex-col justify-start items-start gap-6 ${plan.popular ? "shadow-[0px_4px_8px_-2px_rgba(0,0,0,0.10)]" : "bg-gradient-to-b from-gray-50/5 to-gray-50/0"}`}
            style={plan.popular ? {
              background: "linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 25%, rgba(50, 50, 50, 0.3) 50%, rgba(255, 140, 0, 0.1) 75%, rgba(255, 165, 0, 0.3) 100%)",
              outline: "1px solid hsl(var(--border))",
              outlineOffset: "-1px"
            } : { outline: "1px solid hsl(var(--border))", outlineOffset: "-1px" }}
          >
            <div className="self-stretch flex flex-col justify-start items-start gap-6">
              <div className="self-stretch flex flex-col justify-start items-start gap-8">
                <div
                  className={`w-full h-5 text-sm font-medium leading-tight ${plan.popular ? "text-primary-foreground" : "text-zinc-200"}`}
                >
                  {plan.name}
                  {plan.popular && (
                    <div className="ml-2 px-2 overflow-hidden rounded-full justify-center items-center gap-2.5 inline-flex mt-0 py-0.5 bg-gradient-to-b from-primary-light/50 to-primary-light bg-white">
                      <div className="text-center text-gray-900 text-xs font-medium leading-tight break-words">
                        Popular
                      </div>
                    </div>
                  )}
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="flex justify-start items-center gap-1.5">
                    <div
                      className={`relative h-10 flex items-center text-3xl font-medium leading-10 ${plan.popular ? "text-primary-foreground" : "text-zinc-50"}`}
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
                      className={`text-center text-sm font-medium leading-tight ${plan.popular ? "text-primary-foreground/70" : "text-zinc-400"}`}
                    >
                      /{isAnnual ? "year" : "month"}
                    </div>
                  </div>
                  <div
                    className={`self-stretch text-sm font-medium leading-tight ${plan.popular ? "text-primary-foreground/70" : "text-zinc-400"}`}
                  >
                    {plan.description}
                  </div>
                </div>
              </div>
              {plan.name === "Free" ? (
                <Link href="/canvas" className="self-stretch">
                  <Button
                    className={`w-full px-5 py-2 rounded-[40px] flex justify-center items-center ${plan.buttonClass}`}
                  >
                    <div className="px-1.5 flex justify-center items-center gap-2">
                      <span
                        className={`text-center text-sm font-medium leading-tight ${plan.name === "Free" ? "text-gray-800" : plan.name === "Pro" ? "text-zinc-950" : "text-zinc-950"}`}
                      >
                        {plan.buttonText}
                      </span>
                    </div>
                  </Button>
                </Link>
              ) : (
                <Button
                  className={`self-stretch px-5 py-2 rounded-[40px] flex justify-center items-center ${plan.buttonClass}`}
                >
                  <div className="px-1.5 flex justify-center items-center gap-2">
                    <span
                      className={`text-center text-sm font-medium leading-tight ${plan.name === "Free" ? "text-gray-800" : plan.name === "Pro" ? "text-zinc-950" : "text-zinc-950"}`}
                    >
                      {plan.buttonText}
                    </span>
                  </div>
                </Button>
              )}
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <div
                className={`self-stretch text-sm font-medium leading-tight ${plan.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}
              >
                {plan.name === "Free" ? "Get Started today:" : "Everything in Free +"}
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="self-stretch flex justify-start items-center gap-2">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <Check
                        className={`w-full h-full ${plan.popular ? "text-primary-foreground" : "text-muted-foreground"}`}
                        strokeWidth={2}
                      />
                    </div>
                    <div
                      className={`leading-tight font-normal text-sm text-left ${plan.popular ? "text-primary-foreground" : "text-muted-foreground"}`}
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
