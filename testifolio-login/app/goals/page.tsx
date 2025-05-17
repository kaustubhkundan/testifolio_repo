"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function GoalsPage() {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(["Boost Sales & Conversions"])

  const goals = [
    "Increase Social Proof",
    "Boost Sales & Conversions",
    "SEO",
    "Online Visibility",
    "Gain Customer Insights",
    "Advertising",
    "Get More Clients",
    "Other",
  ]

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal))
    } else {
      setSelectedGoals([...selectedGoals, goal])
    }
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Section - Goals Selection */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 md:px-12 lg:px-16">
        <div className="w-full max-w-md">
          {/* Progress Bar */}
          <div className="mb-10 h-2 w-full rounded-full bg-[#f0f0f5]">
            <div className="h-2 w-1/2 rounded-full bg-[#b69df8]"></div>
          </div>

          <div className="mb-8 text-left">
            <h1 className="mb-3 text-4xl font-bold text-[#16151a]">What&apos;s your primary goal with testimonials?</h1>
            <p className="text-lg text-[#5b5772]">
              Select the option(s) that best matches your main reason for using Testifolio.
            </p>
          </div>

          <div className="mb-8 flex flex-wrap gap-3">
            {goals.map((goal) => (
              <button
                key={goal}
                onClick={() => toggleGoal(goal)}
                className={`rounded-full border px-5 py-2.5 text-base font-medium transition-colors ${selectedGoals.includes(goal)
                  ? "border-[#b69df8] bg-[#b69df8] text-white"
                  : "border-[#d8d7e0] bg-white text-[#16151a] hover:border-[#b69df8] hover:bg-[#efe7ff]"
                  }`}
              >
                {goal}
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-between">
            <Link
              href="/business-details"
              className="flex items-center justify-center rounded-md border border-[#d8d7e0] bg-white px-6 py-3 text-base font-medium text-[#16151a] hover:bg-[#f7f7f8] focus:outline-none focus:ring-2 focus:ring-[#d8d7e0] focus:ring-offset-2"
            >
              Back
            </Link>
            <Link
              href="/testimonials-status"
              className="flex items-center justify-center rounded-md bg-[#b69df8] px-6 py-3 text-base font-medium text-white hover:bg-[#a58af6] focus:outline-none focus:ring-2 focus:ring-[#b69df8] focus:ring-offset-2"
            >
              Continue
            </Link>
          </div>
        </div>
      </div>

      {/* Right Section - Testimonial Examples */}
      <div className="hidden md:flex flex-1 bg-[#9d4edd] h-screen relative">
        <Image
          src="/goals.svg"
          alt="Testimonial Example"
          fill
          className="object-contain object-bottom-right"
        />
      </div>



    </div>
  )
}
