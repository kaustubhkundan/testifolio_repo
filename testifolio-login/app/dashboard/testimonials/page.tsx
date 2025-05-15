"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  Edit,
  FileText,
  Home,
  Loader2,
  Pencil,
  Search,
  Share2,
  Star,
  X,
} from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"

// Define types
type TestimonialStatus = "Approved" | "Pending" | "Published"

interface Customer {
  name: string
  company: string
  avatar?: string
}

interface Testimonial {
  id: number | string
  customer: Customer
  text: string
  type: string
  source: string
  status: TestimonialStatus
  rating?: number
  created_at?: string
}

export default function TestimonialsPage() {
  const router = useRouter()
  const { user } = useAuth()

  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showImported, setShowImported] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [selectedSource, setSelectedSource] = useState<string | null>(null)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Text testimonial form state
  const [textTestimonial, setTextTestimonial] = useState({
    customerName: "",
    customerCompany: "",
    testimonialText: "",
    rating: 5,
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Fetch testimonials from Supabase
  useEffect(() => {
    const fetchTestimonials = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from("testimonials")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        if (data && data.length > 0) {
          // Transform data to match our Testimonial interface
          const formattedTestimonials = data.map((item) => ({
            id: item.id,
            customer: {
              name: item.customer_name,
              company: item.customer_company,
              avatar: item.customer_avatar || getRandomAvatar(),
            },
            text: item.testimonial_text,
            type: "Written Testimonials",
            source: item.source || "Manual Entry",
            status: item.status as TestimonialStatus,
            rating: item.rating,
            created_at: item.created_at,
          }))

          setTestimonials(formattedTestimonials)
          setShowImported(formattedTestimonials.length > 0)
        }
      } catch (err) {
        console.error("Error fetching testimonials:", err)
        setError("Failed to load testimonials. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTestimonials()
  }, [user, supabase])

  // Get random avatar for testimonials without one
  const getRandomAvatar = () => {
    const avatars = [
      "/stylized-jc-initials.png",
      "/abstract-geometric-EH.png",
      "/abstract-blue-swirls.png",
      "/abstract-geometric-gh.png",
      "/guy-hawkins-2.png",
      "/robert-fox.png",
      "/leslie-alexander.png",
    ]
    return avatars[Math.floor(Math.random() * avatars.length)]
  }

  const handleImportClick = () => {
    setShowImportModal(true)
  }

  const handleCloseModal = () => {
    setShowImportModal(false)
    setSelectedSource(null)
    setSubmitSuccess(false)
    setFormErrors({})
    setTextTestimonial({
      customerName: "",
      customerCompany: "",
      testimonialText: "",
      rating: 5,
    })
  }

  const handleSourceSelect = (sourceId: string) => {
    if (sourceId === "text") {
      setSelectedSource(sourceId)
    } else {
      // Show a message that only text testimonials are available now
      alert("Coming soon! Currently only Text Testimonial import is available.")
    }
  }

  const handleBackToSources = () => {
    setSelectedSource(null)
    setSubmitSuccess(false)
  }

  // Handle text testimonial form input changes
  const handleTextTestimonialChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTextTestimonial((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle rating change
  const handleRatingChange = (rating: number) => {
    setTextTestimonial((prev) => ({
      ...prev,
      rating,
    }))
  }

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!textTestimonial.customerName.trim()) {
      errors.customerName = "Customer name is required"
    }

    if (!textTestimonial.customerCompany.trim()) {
      errors.customerCompany = "Company name is required"
    }

    if (!textTestimonial.testimonialText.trim()) {
      errors.testimonialText = "Testimonial text is required"
    } else if (textTestimonial.testimonialText.length < 10) {
      errors.testimonialText = "Testimonial must be at least 10 characters"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Submit text testimonial
  const handleSubmitTextTestimonial = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return
    if (!user) {
      setError("You must be logged in to submit a testimonial")
      return
    }

    try {
      setIsSubmitting(true)

      // Insert testimonial into Supabase
      const { data, error } = await supabase
        .from("testimonials")
        .insert([
          {
            user_id: user.id,
            customer_name: textTestimonial.customerName,
            customer_company: textTestimonial.customerCompany,
            testimonial_text: textTestimonial.testimonialText,
            rating: textTestimonial.rating,
            source: "Manual Entry",
            status: "Pending",
            type: "text",
          },
        ])
        .select()

      if (error) throw error

      // Add the new testimonial to the state
      if (data && data.length > 0) {
        const newTestimonial: Testimonial = {
          id: data[0].id,
          customer: {
            name: data[0].customer_name,
            company: data[0].customer_company,
            avatar: getRandomAvatar(),
          },
          text: data[0].testimonial_text,
          type: "Written Testimonials",
          source: "Manual Entry",
          status: "Pending",
          rating: data[0].rating,
          created_at: data[0].created_at,
        }

        setTestimonials((prev) => [newTestimonial, ...prev])
        setSubmitSuccess(true)

        // If this is the first testimonial, show the testimonials table
        if (testimonials.length === 0) {
          setTimeout(() => {
            setShowImported(true)
            setShowImportModal(false)
          }, 2000)
        }
      }
    } catch (err) {
      console.error("Error submitting testimonial:", err)
      setFormErrors({
        submit: "Failed to submit testimonial. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const importSources = [
    { id: "text", name: "Text Testimonial", logo: "/text-testimonial-icon.png", isReady: true },
    { id: "google", name: "Google", logo: "/google-icon.png", isReady: false },
    { id: "yelp", name: "Yelp", logo: "/yelp-icon.png", isReady: false },
    { id: "facebook", name: "Facebook", logo: "/facebook-icon.png", isReady: false },
    { id: "trustpilot", name: "Trustpilot", logo: "/trustpilot-icon.png", isReady: false },
    { id: "amazon", name: "Amazon", logo: "/amazon-icon.png", isReady: false },
  ]

  // Render star rating input
  const renderStarRating = () => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type="button" onClick={() => handleRatingChange(star)} className="focus:outline-none">
            <Star
              className={`h-6 w-6 ${
                star <= textTestimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center text-sm">
          <Link href="/dashboard" className="flex items-center text-[#7c5cff]">
            <Home className="mr-1 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">Testimonials</span>
        </div>

        {/* Page Title */}
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Testimonials Management</h1>

        {isLoading ? (
          // Loading state
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#7c5cff]" />
            <span className="ml-2 text-lg text-gray-600">Loading testimonials...</span>
          </div>
        ) : error ? (
          // Error state
          <div className="mx-auto max-w-3xl rounded-lg border border-red-200 bg-red-50 p-8 shadow-sm">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <h2 className="ml-2 text-lg font-medium text-red-800">Error loading testimonials</h2>
            </div>
            <p className="mt-2 text-red-700">{error}</p>
            <button
              onClick={() => router.refresh()}
              className="mt-4 rounded-md bg-red-100 px-4 py-2 text-red-700 hover:bg-red-200"
            >
              Try again
            </button>
          </div>
        ) : showImported && testimonials.length > 0 ? (
          <div>
            {/* Search and Filters */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-xs">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search here"
                  className="w-full rounded-md border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select className="appearance-none rounded-md border border-gray-200 bg-gray-100 px-4 py-2 pr-8 text-sm focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]">
                    <option>Recent</option>
                    <option>Oldest</option>
                    <option>Highest Rated</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                <div className="relative">
                  <select className="appearance-none rounded-md border border-gray-200 bg-gray-100 px-4 py-2 pr-8 text-sm focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]">
                    <option>Text Type</option>
                    <option>Written</option>
                    <option>Video</option>
                    <option>Audio</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                <button
                  className="flex items-center gap-1 rounded-md bg-[#a5b4fc] px-4 py-2 text-sm font-medium text-white hover:bg-[#818cf8]"
                  onClick={handleImportClick}
                >
                  <span className="text-lg">+</span> Import
                </button>
              </div>
            </div>

            {/* Testimonials Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      <th className="px-6 py-3">Customer</th>
                      <th className="px-6 py-3">Testimonial Text</th>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3">Source</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {testimonials.map((testimonial) => (
                      <tr key={testimonial.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="relative h-10 w-10 rounded-full bg-gray-200">
                                {testimonial.customer.avatar && (
                                  <Image
                                    src={testimonial.customer.avatar || "/placeholder.svg"}
                                    alt={testimonial.customer.name}
                                    fill
                                    className="rounded-full object-cover"
                                  />
                                )}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{testimonial.customer.name}</div>
                              <div className="text-sm text-gray-500">{testimonial.customer.company}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs truncate text-sm text-gray-500">{testimonial.text}</div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm text-gray-500">{testimonial.type}</div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm text-gray-500">{testimonial.source}</div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              testimonial.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : testimonial.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            <span
                              className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                                testimonial.status === "Approved"
                                  ? "bg-green-400"
                                  : testimonial.status === "Pending"
                                    ? "bg-yellow-400"
                                    : "bg-blue-400"
                              }`}
                            ></span>
                            {testimonial.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                              <FileText className="h-5 w-5" />
                            </button>
                            <button className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                              <Edit className="h-5 w-5" />
                            </button>
                            <button className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                              <Share2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex items-center space-x-2">
                  <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white p-2 text-gray-400 hover:bg-gray-50">
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <button className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#a5b4fc] text-sm font-medium text-white">
                    1
                  </button>
                  <button className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50">
                    2
                  </button>
                  <span className="text-gray-500">...</span>
                  <button className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50">
                    8
                  </button>
                  <button className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50">
                    9
                  </button>
                  <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white p-2 text-gray-400 hover:bg-gray-50">
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State Card */
          <div className="mx-auto max-w-3xl rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col items-center md:flex-row md:items-start md:justify-between">
              <div className="mb-6 md:mb-0 md:max-w-md">
                <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:text-left">
                  Let&apos;s add some testimonials! ❤️
                </h2>
                <p className="mb-6 text-center text-gray-600 md:text-left">
                  Import testimonials from multiple platforms and display them in minutes. Build trust and boost
                  conversions with real feedback.
                </p>

                <div className="mb-6 space-y-3">
                  <div className="flex items-start">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Fast import from 15+ sources</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Show off your testimonials in minutes</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Increase trust and credibility</span>
                  </div>
                </div>

                <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                  <button
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#a5b4fc] px-4 py-3 text-white transition-colors hover:bg-[#818cf8]"
                    onClick={handleImportClick}
                  >
                    <Download className="h-4 w-4" />
                    <span>Import Testimonials</span>
                  </button>

                  <button
                    className="flex items-center justify-center gap-2 rounded-lg border border-[#a5b4fc] bg-white px-4 py-3 text-[#7c5cff] transition-colors hover:bg-[#f8f7ff]"
                    onClick={() => setShowImported(true)}
                  >
                    <span>View Imported Dashboard</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-center md:w-1/3">
                <Image
                  src="/envelope-character.png"
                  alt="Envelope with hearts"
                  width={200}
                  height={200}
                  className="h-auto w-auto"
                />
              </div>
            </div>
          </div>
        )}

        {/* Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative mx-4 max-h-[90vh] w-full max-w-3xl overflow-auto rounded-lg bg-white p-6 shadow-xl">
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>

              {selectedSource === "text" ? (
                submitSuccess ? (
                  /* Success state */
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </div>
                    <h2 className="mb-2 text-2xl font-bold text-gray-800">Testimonial Added Successfully!</h2>
                    <p className="mb-6 text-center text-gray-600">
                      Your testimonial has been added and is pending approval.
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={handleBackToSources}
                        className="rounded-lg border border-[#7c5cff] bg-white px-4 py-2 text-[#7c5cff] hover:bg-[#f8f7ff]"
                      >
                        Add Another Testimonial
                      </button>
                      <button
                        onClick={handleCloseModal}
                        className="rounded-lg bg-[#7c5cff] px-4 py-2 text-white hover:bg-[#6a4ddb]"
                      >
                        View All Testimonials
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Text testimonial form */
                  <div>
                    {/* Back Button */}
                    <button
                      onClick={handleBackToSources}
                      className="mb-4 flex items-center text-[#7c5cff] hover:underline"
                    >
                      <ArrowLeft className="mr-1 h-4 w-4" />
                      <span>Choose a different source</span>
                    </button>

                    <h2 className="mb-6 text-2xl font-bold text-gray-800">Add a Text Testimonial</h2>

                    <form onSubmit={handleSubmitTextTestimonial} className="space-y-6">
                      <div>
                        <label htmlFor="customerName" className="mb-1 block text-sm font-medium text-gray-700">
                          Customer Name*
                        </label>
                        <input
                          type="text"
                          id="customerName"
                          name="customerName"
                          value={textTestimonial.customerName}
                          onChange={handleTextTestimonialChange}
                          className={`w-full rounded-md border ${
                            formErrors.customerName ? "border-red-300" : "border-gray-300"
                          } px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]`}
                          placeholder="John Smith"
                        />
                        {formErrors.customerName && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.customerName}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="customerCompany" className="mb-1 block text-sm font-medium text-gray-700">
                          Company/Organization*
                        </label>
                        <input
                          type="text"
                          id="customerCompany"
                          name="customerCompany"
                          value={textTestimonial.customerCompany}
                          onChange={handleTextTestimonialChange}
                          className={`w-full rounded-md border ${
                            formErrors.customerCompany ? "border-red-300" : "border-gray-300"
                          } px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]`}
                          placeholder="Acme Inc."
                        />
                        {formErrors.customerCompany && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.customerCompany}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="testimonialText" className="mb-1 block text-sm font-medium text-gray-700">
                          Testimonial Text*
                        </label>
                        <textarea
                          id="testimonialText"
                          name="testimonialText"
                          value={textTestimonial.testimonialText}
                          onChange={handleTextTestimonialChange}
                          rows={4}
                          className={`w-full rounded-md border ${
                            formErrors.testimonialText ? "border-red-300" : "border-gray-300"
                          } px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]`}
                          placeholder="Enter the testimonial text here..."
                        ></textarea>
                        {formErrors.testimonialText && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.testimonialText}</p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Rating</label>
                        {renderStarRating()}
                      </div>

                      {formErrors.submit && (
                        <div className="rounded-md bg-red-50 p-4">
                          <div className="flex">
                            <AlertCircle className="h-5 w-5 text-red-400" />
                            <p className="ml-3 text-sm text-red-700">{formErrors.submit}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={handleCloseModal}
                          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex items-center rounded-md bg-[#7c5cff] px-4 py-2 text-sm font-medium text-white hover:bg-[#6a4ddb] disabled:opacity-70"
                        >
                          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {isSubmitting ? "Saving..." : "Save Testimonial"}
                        </button>
                      </div>
                    </form>
                  </div>
                )
              ) : (
                /* Source selection view */
                <div>
                  <h2 className="mb-6 text-2xl font-bold text-gray-800">Let&apos;s import some testimonials 👋</h2>

                  {/* Pro Banner */}
                  <div className="mb-6 rounded-lg bg-[#a5b4fc] p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-3 rounded-full bg-white p-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-[#a5b4fc]"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">Become a Pro and Import Testimonials!</h3>
                          <p className="text-sm text-white text-opacity-90">
                            Access all features and grow your business with social proof
                          </p>
                        </div>
                      </div>
                      <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-[#7c5cff] hover:bg-opacity-90">
                        Go Unlimited! <ArrowRight className="ml-1 inline-block h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <p className="mb-6 text-gray-700">Select the source from which you wish to import testimonials.</p>

                  {/* Source Grid */}
                  <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {importSources.map((source) => (
                      <button
                        key={source.id}
                        className={`flex items-center justify-between rounded-md border ${
                          source.isReady ? "border-gray-200" : "border-gray-200 opacity-70"
                        } p-4 hover:border-[#a5b4fc] hover:bg-[#f8f7ff]`}
                        onClick={() => handleSourceSelect(source.id)}
                      >
                        <div className="flex items-center">
                          <div className="mr-3 h-8 w-8">
                            {source.id === "text" ? (
                              <Pencil className="h-8 w-8 text-[#7c5cff]" />
                            ) : source.id === "google" ? (
                              <div className="flex h-8 w-8 items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6">
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
                            ) : source.id === "facebook" ? (
                              <div className="flex h-8 w-8 items-center justify-center text-[#1877F2]">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  className="h-6 w-6"
                                  fill="currentColor"
                                >
                                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                              </div>
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                            )}
                          </div>
                          <span className="font-medium">{source.name}</span>
                        </div>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            source.isReady ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {source.isReady ? "READY" : "COMING SOON"}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* More Integrations Button */}
                  <div className="flex justify-center">
                    <button className="rounded-md bg-[#a5b4fc] px-6 py-2 text-white hover:bg-[#818cf8]">
                      More Integrations Coming Soon...
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
