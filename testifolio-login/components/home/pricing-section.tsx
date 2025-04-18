"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Clock, Headphones, CheckCircle } from "lucide-react"

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "pro">("basic")

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-4xl font-bold text-[#1a202c] md:text-5xl">
            Choose Your Plan <span className="text-yellow-400">✨</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[#4a5568]">
            Choose a plan that grows with your business.
            <br />
            From collecting your first testimonial to scaling your brand.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="mb-12 flex justify-center">
          <div className="inline-flex rounded-full bg-gray-100 p-1 shadow-sm">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-full px-8 py-2.5 text-base font-medium transition-colors ${
                billingCycle === "monthly" ? "bg-[#7c5cff] text-white shadow-sm" : "bg-transparent text-[#4a5568]"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`rounded-full px-8 py-2.5 text-base font-medium transition-colors ${
                billingCycle === "yearly" ? "bg-[#7c5cff] text-white shadow-sm" : "bg-transparent text-[#4a5568]"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto flex max-w-5xl flex-col gap-8 md:flex-row">
          {/* Basic Plan */}
          <div
            onClick={() => setSelectedPlan("basic")}
            className={`w-full overflow-hidden rounded-2xl p-8 shadow-sm md:w-1/2 cursor-pointer transition-all duration-300 ${
              selectedPlan === "basic"
                ? "bg-gradient-to-br from-[#5e3bee] to-[#6a5af9] text-white"
                : "border border-[#e2e8f0] bg-white"
            }`}
          >
            <h3
              className={`mb-6 text-center text-2xl font-bold ${selectedPlan === "basic" ? "text-white" : "text-[#1a202c]"}`}
            >
              Basic
            </h3>
            <div className="mb-6 text-center">
              <span className={`text-5xl font-bold ${selectedPlan === "basic" ? "text-white" : "text-[#1a202c]"}`}>
                $24
              </span>
              <span className={selectedPlan === "basic" ? "text-white" : "text-[#4a5568]"}> / Month</span>
            </div>
            <p className={`mb-8 text-center ${selectedPlan === "basic" ? "text-white" : "text-[#4a5568]"}`}>
              The essentials to collect high-converting testimonials.
            </p>

            <div className="mb-8 space-y-4">
              <div className="flex items-start">
                <Check className={`mr-3 h-5 w-5 ${selectedPlan === "basic" ? "text-white" : "text-[#7c5cff]"}`} />
                <span className={selectedPlan === "basic" ? "text-white" : "text-[#4a5568]"}>
                  Up to 3 Collection Forms
                </span>
              </div>
              <div className="flex items-start">
                <Check className={`mr-3 h-5 w-5 ${selectedPlan === "basic" ? "text-white" : "text-[#7c5cff]"}`} />
                <span className={selectedPlan === "basic" ? "text-white" : "text-[#4a5568]"}>
                  AI-Refined Testimonials
                </span>
              </div>
              <div className="flex items-start">
                <Check className={`mr-3 h-5 w-5 ${selectedPlan === "basic" ? "text-white" : "text-[#7c5cff]"}`} />
                <span className={selectedPlan === "basic" ? "text-white" : "text-[#4a5568]"}>
                  Up to 50 Testimonials
                </span>
              </div>
              <div className="flex items-start">
                <Check className={`mr-3 h-5 w-5 ${selectedPlan === "basic" ? "text-white" : "text-[#7c5cff]"}`} />
                <span className={selectedPlan === "basic" ? "text-white" : "text-[#4a5568]"}>
                  Your own Wall of Love
                </span>
              </div>
              <div className={`flex items-start ${selectedPlan === "basic" ? "opacity-70" : "opacity-40"}`}>
                <Check className={`mr-3 h-5 w-5 ${selectedPlan === "basic" ? "text-white/70" : "text-gray-400"}`} />
                <span className={selectedPlan === "basic" ? "text-white/70" : "text-[#4a5568]"}>Creative Studio</span>
              </div>
              <div className={`flex items-start ${selectedPlan === "basic" ? "opacity-70" : "opacity-40"}`}>
                <Check className={`mr-3 h-5 w-5 ${selectedPlan === "basic" ? "text-white/70" : "text-gray-400"}`} />
                <span className={selectedPlan === "basic" ? "text-white/70" : "text-[#4a5568]"}>Custom Branding</span>
              </div>
            </div>

            <Link
              href="/signup"
              className={`block w-full rounded-lg border-2 py-3 text-center font-medium transition-colors ${
                selectedPlan === "basic"
                  ? "border-white bg-transparent text-white hover:bg-white/10"
                  : "border-[#7c5cff] bg-white text-[#7c5cff] hover:bg-[#7c5cff]/5"
              }`}
            >
              Choose Plan
            </Link>
          </div>

          {/* Pro Plan */}
          <div
            onClick={() => setSelectedPlan("pro")}
            className={`w-full overflow-hidden rounded-2xl p-8 shadow-lg md:w-1/2 cursor-pointer transition-all duration-300 ${
              selectedPlan === "pro"
                ? "bg-gradient-to-br from-[#5e3bee] to-[#6a5af9] text-white"
                : "border border-[#e2e8f0] bg-white"
            }`}
          >
            <h3
              className={`mb-6 text-center text-2xl font-bold ${selectedPlan === "pro" ? "text-white" : "text-[#1a202c]"}`}
            >
              Pro
            </h3>
            <div className="mb-6 text-center">
              <span className={`text-5xl font-bold ${selectedPlan === "pro" ? "text-white" : "text-[#1a202c]"}`}>
                $49
              </span>
              <span className={selectedPlan === "pro" ? "text-white" : "text-[#4a5568]"}> / Month</span>
            </div>
            <p className={`mb-8 text-center ${selectedPlan === "pro" ? "text-white" : "text-[#4a5568]"}`}>
              Everything in Basic + More.
            </p>

            <div className="mb-8 space-y-4">
              <div className="flex items-start">
                <Check className={`mr-3 h-5 w-5 ${selectedPlan === "pro" ? "text-white" : "text-[#7c5cff]"}`} />
                <span className={selectedPlan === "pro" ? "text-white" : "text-[#4a5568]"}>Unlimited Forms</span>
              </div>
              <div className="flex items-start">
                <Check className={`mr-3 h-5 w-5 ${selectedPlan === "pro" ? "text-white" : "text-[#7c5cff]"}`} />
                <span className={selectedPlan === "pro" ? "text-white" : "text-[#4a5568]"}>Social Media Generator</span>
              </div>
              <div className="flex items-start">
                <Check className={`mr-3 h-5 w-5 ${selectedPlan === "pro" ? "text-white" : "text-[#7c5cff]"}`} />
                <span className={selectedPlan === "pro" ? "text-white" : "text-[#4a5568]"}>Unlimited Testimonials</span>
              </div>
              <div className="flex items-start">
                <Check className={`mr-3 h-5 w-5 ${selectedPlan === "pro" ? "text-white" : "text-[#7c5cff]"}`} />
                <span className={selectedPlan === "pro" ? "text-white" : "text-[#4a5568]"}>Remove Watermark</span>
              </div>
              <div className="flex items-start">
                <Check className={`mr-3 h-5 w-5 ${selectedPlan === "pro" ? "text-white" : "text-[#7c5cff]"}`} />
                <span className={selectedPlan === "pro" ? "text-white" : "text-[#4a5568]"}>Advanced Analytics</span>
              </div>
              <div className="flex items-start">
                <Check className={`mr-3 h-5 w-5 ${selectedPlan === "pro" ? "text-white" : "text-[#7c5cff]"}`} />
                <span className={selectedPlan === "pro" ? "text-white" : "text-[#4a5568]"}>Pro Widgets</span>
              </div>
              <div className="flex items-start">
                <Check className={`mr-3 h-5 w-5 ${selectedPlan === "pro" ? "text-white" : "text-[#7c5cff]"}`} />
                <span className={selectedPlan === "pro" ? "text-white" : "text-[#4a5568]"}>Team Collaboration</span>
              </div>
            </div>

            <Link
              href="/signup"
              className={`block w-full rounded-lg border-2 py-3 text-center font-medium transition-colors ${
                selectedPlan === "pro"
                  ? "border-white bg-transparent text-white hover:bg-white/10"
                  : "border-[#7c5cff] bg-white text-[#7c5cff] hover:bg-[#7c5cff]/5"
              }`}
            >
              Choose Plan
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-[#1a202c] md:text-5xl">Frequently Asked Questions</h2>
          </div>

          <div className="mx-auto max-w-3xl space-y-6">
            {/* FAQ Item 1 */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-xl font-semibold text-[#1a202c]">How does TestiFolio collect testimonials?</h3>
              <p className="text-[#4a5568]">
                We use AI-powered email and SMS requests that automatically follow up with customers at the perfect
                time.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-xl font-semibold text-[#1a202c]">Can I customize my testimonial display?</h3>
              <p className="text-[#4a5568]">
                Yes! You can fully customize the look and feel of your testimonials to match your brand.
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-xl font-semibold text-[#1a202c]">Does it integrate with Shopify & Stripe?</h3>
              <p className="text-[#4a5568]">
                We offer seamless integration with major platforms including Shopify, Stripe, and more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
