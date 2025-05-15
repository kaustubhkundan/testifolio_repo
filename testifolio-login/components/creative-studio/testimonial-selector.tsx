"use client"

import { useState } from "react"
import Image from "next/image"
import { Search, X, Star, AlertCircle } from "lucide-react"
import type { Testimonial } from "@/hooks/use-testimonials"

interface TestimonialSelectorProps {
  testimonials: Testimonial[]
  loading: boolean
  onSelectTestimonial: (testimonial: Testimonial) => void
  onClose: () => void
  selectedTestimonial: Testimonial | null
}

export function TestimonialSelector({
  testimonials,
  loading,
  onSelectTestimonial,
  onClose,
  selectedTestimonial,
}: TestimonialSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sourceFilter, setSourceFilter] = useState<string | null>(null)
  const [ratingFilter, setRatingFilter] = useState<number | null>(null)

  // Get unique sources for filtering
  const sources = Array.from(new Set(testimonials.map((t) => t.source)))

  // Filter testimonials based on search term and filters
  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesSearch =
      searchTerm === "" ||
      testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.text.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSource = sourceFilter === null || testimonial.source === sourceFilter
    const matchesRating = ratingFilter === null || testimonial.rating === ratingFilter

    return matchesSearch && matchesSource && matchesRating
  })

  // Handle selection
  const handleSelect = (testimonial: Testimonial) => {
    onSelectTestimonial(testimonial)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Select a Testimonial</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="border-b border-gray-200 bg-gray-50 p-4">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search testimonials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                disabled={loading}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Source:</span>
              <select
                value={sourceFilter || ""}
                onChange={(e) => setSourceFilter(e.target.value || null)}
                className="rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                disabled={loading}
              >
                <option value="">All Sources</option>
                {sources.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rating:</span>
              <select
                value={ratingFilter || ""}
                onChange={(e) => setRatingFilter(e.target.value ? Number.parseInt(e.target.value) : null)}
                className="rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                disabled={loading}
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </div>

        {/* Testimonials List */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#7c5cff] border-t-transparent"></div>
              <span className="ml-3 text-gray-600">Loading testimonials...</span>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">No testimonials found</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      We couldn't find any testimonials in your account. Don't worry - we've loaded some sample
                      testimonials for you to try out the Creative Studio.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : filteredTestimonials.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <p>No testimonials found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm("")
                  setSourceFilter(null)
                  setRatingFilter(null)
                }}
                className="mt-2 text-[#7c5cff] hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  onClick={() => handleSelect(testimonial)}
                  className={`cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md ${
                    selectedTestimonial?.id === testimonial.id
                      ? "border-[#7c5cff] bg-purple-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start">
                    <div className="mr-3 h-12 w-12 overflow-hidden rounded-full">
                      <Image
                        src={testimonial.avatar_url || "/placeholder.svg?height=48&width=48&query=avatar"}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-800">{testimonial.name}</h3>
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                          {testimonial.source}
                        </span>
                      </div>
                      {testimonial.company && (
                        <p className="text-sm text-gray-500">
                          {testimonial.job_title ? `${testimonial.job_title}, ` : ""}
                          {testimonial.company}
                        </p>
                      )}
                      <div className="mt-1 flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="mt-2 line-clamp-3 text-sm text-gray-600">{testimonial.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-4 text-right">
          <button
            onClick={onClose}
            className="mr-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => selectedTestimonial && handleSelect(selectedTestimonial)}
            disabled={!selectedTestimonial || loading}
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              selectedTestimonial && !loading
                ? "bg-[#7c5cff] text-white hover:bg-[#6a4ddb]"
                : "cursor-not-allowed bg-[#7c5cff] bg-opacity-50 text-white"
            }`}
          >
            {loading ? "Loading..." : "Select Testimonial"}
          </button>
        </div>
      </div>
    </div>
  )
}
