"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Home, Plus, Star, AlertCircle } from "lucide-react"

import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { TemplateSelector } from "@/components/creative-studio/template-selector"
import { TestimonialSelector } from "@/components/creative-studio/testimonial-selector"
import { DesignEditor } from "@/components/creative-studio/design-editor"
import { useTestimonials, type Testimonial } from "@/hooks/use-testimonials"
import type { BannerbearTemplate } from "@/lib/bannerbear"

export default function CreativeStudioPage() {
  const [view, setView] = useState<"templates" | "editor">("templates")
  const [showTestimonialSelector, setShowTestimonialSelector] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<BannerbearTemplate | null>(null)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false)

  // Fetch testimonials with a limit of 50
  const { testimonials, loading: loadingTestimonials, error: testimonialError } = useTestimonials(50)

  // Set hasAttemptedFetch to true once loading is complete
  useEffect(() => {
    if (!loadingTestimonials) {
      setHasAttemptedFetch(true)
    }
  }, [loadingTestimonials])

  const handleSelectTemplate = (template: BannerbearTemplate) => {
    setSelectedTemplate(template)
    setShowTestimonialSelector(true)
  }

  const handleSelectTestimonial = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial)
    setShowTestimonialSelector(false)
    setView("editor")
  }

  const handleBackToTemplates = () => {
    setView("templates")
  }

  return (
    <>
      <div className="p-6">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center text-sm">
          <Link href="/dashboard" className="flex items-center text-[#7c5cff]">
            <Home className="mr-1 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">Creative Studio</span>
        </div>

        {/* Error message if testimonial fetching failed but we have fallbacks */}
        {testimonialError && hasAttemptedFetch && testimonials.length > 0 && (
          <div className="mb-4 rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Connection Notice</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    We're currently using sample testimonials because we couldn't connect to your database. You can
                    still use all features with these examples.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === "templates" ? (
          <>
            {/* Page Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-2xl font-bold text-gray-800">Create Stunning Testimonial Visuals</h1>
                <p className="text-gray-600">
                  Pick a style, let AI do its magic, and share your amazing testimonials effortlessly.
                </p>
              </div>
              <button
                onClick={() => {
                  // Only show testimonial selector if we have testimonials
                  if (testimonials.length > 0) {
                    setShowTestimonialSelector(true)
                  } else if (!loadingTestimonials) {
                    // If we've finished loading and have no testimonials, show an alert
                    alert("No testimonials available. Please add testimonials first.")
                  }
                }}
                className="flex items-center gap-2 rounded-md bg-[#7c5cff] px-6 py-3 text-white hover:bg-[#6a4ddb]"
                disabled={loadingTestimonials}
              >
                {loadingTestimonials ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    <span>Create New Visual</span>
                  </>
                )}
              </button>
            </div>

            {/* Template Selector */}
            <TemplateSelector onSelectTemplate={handleSelectTemplate} selectedTemplateId={selectedTemplate?.id} />

            {/* Pro Features Section */}
            <div className="mt-12 overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-orange-400 p-8 text-white">
              <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div className="max-w-lg">
                  <h2 className="mb-2 text-2xl font-bold">
                    Make Your Testimonials Truly Yours{" "}
                    <Star className="mb-1 ml-1 inline-block h-5 w-5 fill-yellow-300 text-yellow-300" />
                  </h2>
                  <p className="mb-6">
                    Unlock advanced customization and branding tools to elevate trust and conversions.
                  </p>

                  <div className="mb-6 space-y-4">
                    <div className="flex items-center">
                      <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-teal-400 text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span>Upload Your Brand Logo</span>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-teal-400 text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span>Custom Brand Colors + More Templates</span>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-teal-400 text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span>AI-Powered Captions Matched to Your Brand Voice</span>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-teal-400 text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span>Advanced Font & Style Control</span>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-teal-400 text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span>Instantly Summarize Long Testimonials with AI</span>
                    </div>
                  </div>

                  <button className="flex items-center gap-2 rounded-md bg-white px-6 py-3 font-medium text-purple-600 hover:bg-gray-100">
                    <span className="text-lg">🚀</span>
                    <span>Start Your 7-Day Free Trial</span>
                  </button>
                </div>

                <div className="relative">
                  <div className="relative mx-auto max-w-md">
                    <div className="mb-4 rounded-lg bg-white p-4 shadow-lg">
                      <div className="flex items-center">
                        <div className="h-12 w-12 overflow-hidden rounded-full">
                          <Image src="/testimonial-avatar.png" alt="Rosie Flores" width={48} height={48} />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-800">Rosie Flores</p>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-gray-600">
                        My family has been going to Medinas for years. It's always pleasurable. Rene and his staff are
                        so friendly always.
                      </p>
                    </div>

                    <div className="absolute bottom-[-100px] right-[-50px] w-64 rotate-6 rounded-lg bg-gradient-to-r from-green-400 to-teal-500 p-4 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 overflow-hidden rounded-full">
                            <Image src="/testimonial-avatar.png" alt="Rosie Flores" width={40} height={40} />
                          </div>
                          <div className="ml-2">
                            <p className="text-xs font-medium text-white">Rosie Flores</p>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-white">
                        Our family's trusted Medina's for years—always a pleasure working with Rene's friendly team!
                      </p>
                      <div className="mt-2 flex justify-between">
                        <span className="text-xs text-white opacity-80">ROSIE FLORES</span>
                        <div className="h-5 w-10 rounded bg-white bg-opacity-20"></div>
                      </div>
                    </div>

                    <div className="absolute bottom-[-50px] left-[-30px] text-center text-sm text-white">
                      <div className="mb-2 mx-auto h-20 w-[1px] bg-white bg-opacity-50"></div>
                      <span>Before</span>
                    </div>

                    <div className="absolute bottom-[-150px] right-[-30px] text-center text-sm text-white">
                      <div className="mb-2 mx-auto h-20 w-[1px] bg-white bg-opacity-50"></div>
                      <span>After (Pro)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <DesignEditor template={selectedTemplate!} testimonial={selectedTestimonial} onBack={handleBackToTemplates} />
        )}
      </div>

      {/* Testimonial Selector Modal */}
      {showTestimonialSelector && (
        <TestimonialSelector
          testimonials={testimonials}
          loading={loadingTestimonials}
          onSelectTestimonial={handleSelectTestimonial}
          onClose={() => setShowTestimonialSelector(false)}
          selectedTestimonial={selectedTestimonial}
        />
      )}
      </>
  )
}
