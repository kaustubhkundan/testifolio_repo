"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Code, Grid, Home, List, Star } from "lucide-react"

import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { EmbedCodeModal } from "@/components/widgets/embed-code-modal"
import { WidgetCustomizer } from "@/components/widgets/widget-customizer"
import { useTestimonials } from "@/hooks/use-testimonials"

export default function WidgetsPage() {
  const [isGridView, setIsGridView] = useState(true)
  const [showEmbedModal, setShowEmbedModal] = useState(false)
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [sortBy, setSortBy] = useState("Most Recent")

  // Widget configuration state
  const [widgetConfig, setWidgetConfig] = useState({
    layout: "grid",
    theme: "light",
    primaryColor: "#7c5cff",
    showRating: true,
    showSource: true,
    showAvatar: true,
    maxItems: 6,
    sortBy: "newest",
    minRating: 1,
    borderRadius: 8,
    padding: 16,
    font: "Inter",
  })

  // Fetch real testimonial data
  const { testimonials: realTestimonials } = useTestimonials()

  // Format real testimonials to match the expected structure
  const testimonials =
    realTestimonials.map((t) => ({
      id: t.id,
      name: t.name || "Anonymous",
      position: t.role ? `${t.role}${t.company ? ` at ${t.company}` : ""}` : t.company || "",
      avatar: t.avatar_url || `/avatars/${Math.floor(Math.random() * 6) + 1}.png`,
      rating: t.rating || 5,
      text: t.text || t.content || "Great experience!",
      date: new Date(t.created_at || t.date || Date.now()).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      platform: t.source?.toLowerCase() || "google",
    })) || []

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "twitter":
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
        )
      case "pinterest":
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
            </svg>
          </div>
        )
      case "linkedin":
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </div>
        )
      case "instagram":
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </div>
        )
      case "facebook":
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
        )
      case "google":
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-gray-800 shadow-sm">
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </div>
        )
      default:
        return null
    }
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
          <span className="text-gray-600">Widgets</span>
        </div>

        {!showCustomizer ? (
          <>
            {/* Page Header */}
            <div className="mb-6 flex flex-col items-center justify-center text-center">
              <div className="mb-2 inline-block rounded-full bg-[#f0eaff] px-4 py-1 text-sm text-[#7c5cff]">
                Customer Stories
              </div>
              <h1 className="mb-2 text-4xl font-bold text-[#7c5cff]">Wall of Love</h1>
              <p className="mb-6 text-gray-600">See what our amazing users have to say!</p>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowEmbedModal(true)}
                  className="flex items-center gap-2 rounded-md border border-[#7c5cff] bg-white px-4 py-2 text-sm font-medium text-[#7c5cff] hover:bg-[#f8f7ff]"
                >
                  <Code className="h-4 w-4" />
                  <span>Get Embed Code</span>
                </button>
                <button
                  onClick={() => setShowCustomizer(true)}
                  className="flex items-center gap-2 rounded-md bg-[#7c5cff] px-4 py-2 text-sm font-medium text-white hover:bg-[#6a4ddb]"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                  <span>Customize Widgets</span>
                </button>
              </div>
            </div>

            {/* Sort and View Controls */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort By</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none rounded-md border border-gray-300 bg-white px-3 py-1.5 pr-8 text-sm focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                  >
                    <option>Most Recent</option>
                    <option>Highest Rated</option>
                    <option>Oldest First</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsGridView(true)}
                  className={`rounded-md p-1.5 ${
                    isGridView ? "bg-[#7c5cff] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setIsGridView(false)}
                  className={`rounded-md p-1.5 ${
                    !isGridView ? "bg-[#7c5cff] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Testimonials Grid/List */}
            {isGridView ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full">
                          <Image
                            src={testimonial.avatar || "/placeholder.svg"}
                            alt={testimonial.name}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{testimonial.name}</h3>
                          <p className="text-xs text-gray-500">{testimonial.position}</p>
                        </div>
                      </div>
                      {getPlatformIcon(testimonial.platform)}
                    </div>

                    <div className="mb-3 flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="mb-4 text-sm text-gray-600">{testimonial.text}</p>

                    <div className="text-xs text-gray-400">{testimonial.date}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full">
                          <Image
                            src={testimonial.avatar || "/placeholder.svg"}
                            alt={testimonial.name}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{testimonial.name}</h3>
                          <p className="text-xs text-gray-500">{testimonial.position}</p>
                        </div>
                      </div>
                      {getPlatformIcon(testimonial.platform)}
                    </div>

                    <div className="my-3 flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-gray-600">{testimonial.text}</p>
                    <div className="mt-2 text-right text-xs text-gray-400">{testimonial.date}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            <div className="mt-8 flex justify-center">
              <button className="rounded-md bg-[#7c5cff] px-6 py-2 text-sm font-medium text-white hover:bg-[#6a4ddb]">
                Load More Testimonials
              </button>
            </div>
          </>
        ) : (
          <WidgetCustomizer
            onClose={() => setShowCustomizer(false)}
            testimonials={testimonials}
            config={widgetConfig}
            onConfigChange={setWidgetConfig}
          />
        )}
      </div>

      {/* Embed Code Modal */}
      <EmbedCodeModal isOpen={showEmbedModal} onClose={() => setShowEmbedModal(false)} config={widgetConfig} />
    </>
  )
}
