"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Check } from "lucide-react"

export default function TestimonialsStatusPage() {
  const [hasTestimonials, setHasTestimonials] = useState("yes")

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Section - Testimonials Status */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 md:px-12 lg:px-16">
        <div className="w-full max-w-md">
          {/* Progress Bar */}
          <div className="mb-10 h-2 w-full rounded-full bg-[#f0f0f5]">
            <div className="h-2 w-3/4 rounded-full bg-[#b69df8]"></div>
          </div>

          <div className="mb-8 text-left">
            <h1 className="mb-3 text-4xl font-bold text-[#16151a]">Do you currently have any testimonials?</h1>
            <p className="text-lg text-[#5b5772]">
              Let us know so we can tailor your dashboard and get you started faster.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setHasTestimonials("yes")}
              className={`flex w-full items-center justify-between rounded-md border px-5 py-4 text-left text-base transition-colors ${
                hasTestimonials === "yes"
                  ? "border-[#b69df8] bg-white text-[#16151a]"
                  : "border-[#d8d7e0] bg-white text-[#16151a] hover:border-[#b69df8]"
              }`}
            >
              <span>Yes, I already have some testimonials</span>
              {hasTestimonials === "yes" && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#b69df8] text-white">
                  <Check className="h-4 w-4" />
                </span>
              )}
            </button>

            <button
              onClick={() => setHasTestimonials("no")}
              className={`flex w-full items-center justify-between rounded-md border px-5 py-4 text-left text-base transition-colors ${
                hasTestimonials === "no"
                  ? "border-[#b69df8] bg-white text-[#16151a]"
                  : "border-[#d8d7e0] bg-white text-[#16151a] hover:border-[#b69df8]"
              }`}
            >
              <span>No, I&apos;d like to start collecting</span>
              {hasTestimonials === "no" && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#b69df8] text-white">
                  <Check className="h-4 w-4" />
                </span>
              )}
            </button>
          </div>

          <div className="mt-8 flex justify-between">
            <Link
              href="/goals"
              className="flex items-center justify-center rounded-md border border-[#d8d7e0] bg-white px-6 py-3 text-base font-medium text-[#16151a] hover:bg-[#f7f7f8] focus:outline-none focus:ring-2 focus:ring-[#d8d7e0] focus:ring-offset-2"
            >
              Back
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center justify-center rounded-md bg-[#b69df8] px-6 py-3 text-base font-medium text-white hover:bg-[#a58af6] focus:outline-none focus:ring-2 focus:ring-[#b69df8] focus:ring-offset-2"
            >
              Continue
            </Link>
          </div>
        </div>
      </div>

      {/* Right Section - Preview */}
       <div className="hidden md:flex flex-1 h-screen relative">
        <Image
          src="/testi-status.svg"
          alt="Testimonial Example"
          fill
          className="object-contain object-bottom-right"
        />
      </div>
    </div>
  )
}
