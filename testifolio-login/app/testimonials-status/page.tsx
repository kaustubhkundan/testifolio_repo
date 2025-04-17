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
      <div className="hidden flex-1 bg-[#efe7ff] md:block">
        <div className="relative flex h-full flex-col items-center justify-center p-8">
          {/* Testimonial Collection Widget */}
          <div className="relative mb-8 w-full max-w-md">
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-4 flex justify-end">
                <div className="rounded bg-gray-200 px-4 py-2 text-sm text-gray-500">YOUR LOGO</div>
              </div>

              <div className="mb-6 text-center">
                <h3 className="mb-2 text-xl font-semibold text-[#16151a]">
                  How would you like to leave your testimonial?
                </h3>
                <p className="text-[#5b5772]">Choose to either leave a video or written testimonial! 😊</p>
              </div>

              <div className="mb-6 flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="h-8 w-8 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    ></path>
                  </svg>
                ))}
              </div>

              <div className="space-y-3">
                <button className="w-full rounded-md bg-[#6366f1] py-3 text-center font-medium text-white">
                  🎥 Record a Video
                </button>
                <button className="w-full rounded-md bg-[#2d3748] py-3 text-center font-medium text-white">
                  Write a Testimonial
                </button>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="relative mb-4 w-full max-w-md">
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-1">
                <h3 className="text-lg font-semibold text-[#16151a]">New Testimonials This Week</h3>
                <div className="flex items-center text-sm text-green-500">
                  <svg
                    className="mr-1 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    ></path>
                  </svg>
                  12% Increase
                </div>
              </div>

              <div className="mb-4">
                <span className="text-4xl font-bold text-[#16151a]">127</span>
              </div>

              <div className="h-16 w-full">
                <svg viewBox="0 0 100 20" className="h-full w-full">
                  <path
                    d="M0,10 Q10,15 20,10 T40,10 T60,5 T80,15 T100,10"
                    fill="none"
                    stroke="#b69df8"
                    strokeWidth="2"
                  />
                  <circle cx="60" cy="5" r="1.5" fill="#000" />
                </svg>
              </div>
            </div>
          </div>

          {/* Astronaut Illustration */}
          <div className="absolute bottom-8 right-8">
            <Image
              src="/images/astronaut-star.png"
              alt="Astronaut with Star"
              width={180}
              height={180}
              className="h-auto w-44"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
