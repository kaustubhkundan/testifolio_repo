"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

export default function BusinessDetailsPage() {
  const [businessName, setBusinessName] = useState("")
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [industry, setIndustry] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const industries = [
    "E-commerce",
    "SaaS",
    "Marketing Agency",
    "Consulting",
    "Education",
    "Healthcare",
    "Real Estate",
    "Finance",
    "Technology",
    "Other",
  ]

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Section - Business Details Form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 md:px-12 lg:px-16">
        <div className="w-full max-w-md">
          {/* Progress Bar */}
          <div className="mb-10 h-2 w-full rounded-full bg-[#f0f0f5]">
            <div className="h-2 w-1/3 rounded-full bg-[#b69df8]"></div>
          </div>

          <div className="mb-8 text-left">
            <h1 className="mb-3 text-4xl font-bold text-[#16151a]">Your Business Details</h1>
            <p className="text-lg text-[#5b5772]">Help us personalize your experience!</p>
          </div>

          <form className="space-y-6">
            <div>
              <label htmlFor="businessName" className="block text-base font-medium text-[#16151a]">
                Business Name
              </label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Enter your business name"
                required
                className="mt-2 block w-full rounded-md border border-[#d8d7e0] px-4 py-3 text-[#16151a] placeholder-[#706d8a] focus:border-[#b69df8] focus:outline-none focus:ring-1 focus:ring-[#b69df8]"
              />
            </div>

            <div>
              <label htmlFor="websiteUrl" className="block text-base font-medium text-[#16151a]">
                Website URL (optional)
              </label>
              <input
                id="websiteUrl"
                name="websiteUrl"
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="mt-2 block w-full rounded-md border border-[#d8d7e0] px-4 py-3 text-[#16151a] placeholder-[#706d8a] focus:border-[#b69df8] focus:outline-none focus:ring-1 focus:ring-[#b69df8]"
              />
            </div>

            <div>
              <label htmlFor="industry" className="block text-base font-medium text-[#16151a]">
                Select Industry
              </label>
              <div className="relative mt-2">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex w-full items-center justify-between rounded-md border border-[#d8d7e0] px-4 py-3 text-left text-[#16151a] focus:border-[#b69df8] focus:outline-none focus:ring-1 focus:ring-[#b69df8]"
                >
                  <span className={industry ? "text-[#16151a]" : "text-[#706d8a]"}>
                    {industry || "Choose your industry"}
                  </span>
                  <ChevronDown className="h-5 w-5 text-[#706d8a]" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full rounded-md border border-[#d8d7e0] bg-white py-1 shadow-lg">
                    {industries.map((item) => (
                      <div
                        key={item}
                        onClick={() => {
                          setIndustry(item)
                          setIsDropdownOpen(false)
                        }}
                        className="cursor-pointer px-4 py-2 hover:bg-[#f7f7f8]"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-[#b69df8] px-4 py-3 text-center text-base font-medium text-white hover:bg-[#a58af6] focus:outline-none focus:ring-2 focus:ring-[#b69df8] focus:ring-offset-2"
            >
              Continue
            </button>
          </form>

          <div className="mt-8 flex justify-between">
            <Link
              href="/"
              className="flex items-center justify-center rounded-md border border-[#d8d7e0] bg-white px-6 py-3 text-base font-medium text-[#16151a] hover:bg-[#f7f7f8] focus:outline-none focus:ring-2 focus:ring-[#d8d7e0] focus:ring-offset-2"
            >
              Back
            </Link>
            <Link
              href="/next-step"
              className="flex items-center justify-center rounded-md bg-[#b69df8] px-6 py-3 text-base font-medium text-white hover:bg-[#a58af6] focus:outline-none focus:ring-2 focus:ring-[#b69df8] focus:ring-offset-2"
            >
              Continue
            </Link>
          </div>
        </div>
      </div>

      {/* Right Section - Illustration */}
      <div className="hidden flex-1 bg-[#efe7ff] md:block">
        <div className="relative flex h-full flex-col items-center justify-center p-8">
          <div className="max-w-md">
            <Image
              src="/images/business-details-illustration.png"
              alt="Business Details Illustration"
              width={500}
              height={400}
              className="h-auto w-full"
            />
            <p className="mt-8 text-center text-xl font-medium text-[#16151a]">
              Trusted by thousands of small businesses & creators.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
