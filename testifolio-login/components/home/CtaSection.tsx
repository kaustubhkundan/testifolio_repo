"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Clock, Headphones, CheckCircle } from "lucide-react"

export function CTASection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "pro">("basic")

  return (
    <section>
        {/* CTA Section */}
        <div className="mt-24 bg-[#5a6bff] py-16 text-center text-white">
          <div className="mx-auto px-4">
            <h2 className="mb-10 text-2xl font-bold md:text-3xl">
              Start Collecting & Repurposing AI-Powered Testimonials Today!
            </h2>

            <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="rounded-full bg-white px-8 py-3.5 text-base font-medium text-[#5a6bff] transition-transform hover:scale-105"
              >
                Get Started Free
              </Link>
              <Link
                href="/demo"
                className="rounded-full border-2 border-white bg-transparent px-8 py-3.5 text-base font-medium text-white transition-transform hover:bg-white/10"
              >
                Book a Demo
              </Link>
            </div>

            <div className="flex flex-col items-center justify-center gap-6 text-sm sm:flex-row">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-white" />
                <span>7 Day Free Trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-white" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="h-5 w-5 text-white" />
                <span>24/7 support</span>
              </div>
            </div>
          </div>
        </div>
    </section>
  )
}
