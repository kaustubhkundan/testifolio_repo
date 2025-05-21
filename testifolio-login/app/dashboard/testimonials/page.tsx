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
  ChevronDown,
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

  // Add state variables for viewing, editing, and sharing testimonials
  const [viewingTestimonial, setViewingTestimonial] = useState<Testimonial | null>(null)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [shareTestimonial, setShareTestimonial] = useState<any | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)

  // Edit testimonial form state
  const [editForm, setEditForm] = useState({
    customerName: "",
    customerCompany: "",
    testimonialText: "",
    rating: 5,
    status: "Pending" as TestimonialStatus,
    email: "",
    link: "",
    date: new Date().toISOString().split("T")[0],
    tags: "",
  })
  const [editFormErrors, setEditFormErrors] = useState<Record<string, string>>({})

  // Text testimonial form state
  const [textTestimonial, setTextTestimonial] = useState({
    customerName: "",
    customerCompany: "",
    testimonialText: "",
    rating: 5,
    email: "",
    link: "",
    date: new Date().toISOString().split("T")[0],
    tags: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Fetch testimonials from Supabase
  useEffect(() => {
    const fetchTestimonials = async () => {
      if (!user) return
      if (testimonials.length > 0 && !isLoading) return

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
      email: "",
      link: "",
      date: new Date().toISOString().split("T")[0],
      tags: "",
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

  // Handle edit form input changes
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field if it exists
    if (editFormErrors[name]) {
      setEditFormErrors((prev) => {
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

  // Handle edit rating change
  const handleEditRatingChange = (rating: number) => {
    setEditForm((prev) => ({
      ...prev,
      rating,
    }))
  }

  // Set up edit form when a testimonial is selected for editing
  const handleEditClick = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setEditForm({
      customerName: testimonial.customer.name,
      customerCompany: testimonial.customer.company,
      testimonialText: testimonial.text,
      rating: testimonial.rating || 5,
      status: testimonial.status,
      email: "", // These fields would be populated from the database if available
      link: "",
      date: testimonial.created_at
        ? new Date(testimonial.created_at).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      tags: "",
    })
    setUpdateSuccess(false)
  }

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!textTestimonial.customerName.trim()) {
      errors.customerName = "Full name is required"
    }

    if (!textTestimonial.customerCompany.trim()) {
      errors.customerCompany = "Tagline is required"
    }

    if (!textTestimonial.testimonialText.trim()) {
      errors.testimonialText = "Message is required"
    } else if (textTestimonial.testimonialText.length < 10) {
      errors.testimonialText = "Message must be at least 10 characters"
    }

    if (textTestimonial.email && !/^\S+@\S+\.\S+$/.test(textTestimonial.email)) {
      errors.email = "Please enter a valid email address"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Validate edit form
  const validateEditForm = () => {
    const errors: Record<string, string> = {}

    if (!editForm.customerName.trim()) {
      errors.customerName = "Customer name is required"
    }

    if (!editForm.customerCompany.trim()) {
      errors.customerCompany = "Company name is required"
    }

    if (!editForm.testimonialText.trim()) {
      errors.testimonialText = "Testimonial text is required"
    } else if (editForm.testimonialText.length < 10) {
      errors.testimonialText = "Testimonial must be at least 10 characters"
    }

    setEditFormErrors(errors)
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
            email: textTestimonial.email,
            link: textTestimonial.link,
            tags: textTestimonial.tags,
            date: textTestimonial.date,
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

  // Update testimonial
  const handleUpdateTestimonial = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEditForm() || !editingTestimonial || !user) return

    try {
      setIsUpdating(true)

      // Update testimonial in Supabase
      const { error } = await supabase
        .from("testimonials")
        .update({
          customer_name: editForm.customerName,
          customer_company: editForm.customerCompany,
          testimonial_text: editForm.testimonialText,
          rating: editForm.rating,
          status: editForm.status,
          email: editForm.email,
          link: editForm.link,
          tags: editForm.tags,
          date: editForm.date,
        })
        .eq("id", editingTestimonial.id)
        .eq("user_id", user.id)

      if (error) throw error

      // Update the testimonial in the state
      const updatedTestimonials = testimonials.map((t) => {
        if (t.id === editingTestimonial.id) {
          return {
            ...t,
            customer: {
              ...t.customer,
              name: editForm.customerName,
              company: editForm.customerCompany,
            },
            text: editForm.testimonialText,
            rating: editForm.rating,
            status: editForm.status,
          }
        }
        return t
      })

      setTestimonials(updatedTestimonials)
      setUpdateSuccess(true)

      // Close the modal after a short delay
      setTimeout(() => {
        setEditingTestimonial(null)
      }, 2000)
    } catch (err) {
      console.error("Error updating testimonial:", err)
      setEditFormErrors({
        submit: "Failed to update testimonial. Please try again.",
      })
    } finally {
      setIsUpdating(false)
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
  const renderStarRating = (currentRating: number, onChange: (rating: number) => void) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type="button" onClick={() => onChange(star)} className="focus:outline-none">
            <Star
              className={`h-6 w-6 ${star <= currentRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between p-4 md:hidden bg-[#f2f4ff]">
        {/* <button className="text-[#6d7cff]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21" stroke="#6d7cff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 6H21" stroke="#6d7cff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 18H21" stroke="#6d7cff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button> */}
        {/* <div className="flex items-center">
          <span className="text-xl font-bold text-[#6d7cff]">testifolio</span>
          <div className="ml-1 h-5 w-5 rounded-full bg-[#6d7cff] flex items-center justify-center text-white text-xs font-bold">
            2
          </div>
        </div> */}
  
      </div>
      <div className="p-6 bg-[#f2f4ff] md:bg-white">
        {/* Page Title */}
        <h1 className="mb-4 text-2xl font-bold text-gray-800">Testimonials Management</h1>

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center text-sm">
          <Link href="/dashboard" className="flex items-center text-[#6d7cff]">
            <Home className="mr-1 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">Testimonials</span>
        </div>

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
            <div className="md:hidden mb-4">
              <h2 className="text-xl font-bold text-gray-800">Recent Testimonials</h2>
            </div>
            <div className="mb-6 flex flex-col gap-4">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search here"
                  className="w-full rounded-md border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                />
              </div>
              <div className="flex items-center gap-2 justify-between">
                <div className="flex gap-2">
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
                </div>
                <button
                  className="flex items-center gap-1 rounded-md bg-[#a5b4fc] px-4 py-2 text-sm font-medium text-white hover:bg-[#818cf8]"
                  onClick={handleImportClick}
                >
                  <span className="text-lg">+</span> Import
                </button>
              </div>
            </div>

            {/* Testimonials Table/List View (Responsive) */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              {/* Desktop Table View - Hidden on Mobile */}
              <div className="hidden md:block overflow-x-auto">
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
                            <button
                              onClick={() => setViewingTestimonial(testimonial)}
                              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                            >
                              <FileText className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleEditClick(testimonial)}
                              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => setShareTestimonial(testimonial)}
                              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                            >
                              <Share2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile List View - Shown only on Mobile */}
              <div className="md:hidden">
                <div className="divide-y divide-gray-200">
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
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
                          <div className="ml-3">
                            <div className="font-medium text-gray-900">{testimonial.customer.name}</div>
                            <div className="text-sm text-gray-500">{testimonial.customer.company}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            /* Toggle expanded view */
                          }}
                          className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                        >
                          <ChevronDown className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Expanded details - This would be conditionally shown */}
                      <div className="mt-3 space-y-3 text-sm">
                        <div className="flex justify-between">
                          <div className="text-gray-500">Type:</div>
                          <div className="font-medium">{testimonial.type}</div>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-gray-500">Status:</div>
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
                        </div>
                        <div>
                          <div className="text-gray-500 mb-1">Testimonial:</div>
                          <div className="text-gray-700">{testimonial.text}</div>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <div className="text-gray-500">Action:</div>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => setViewingTestimonial(testimonial)}
                              className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200"
                            >
                              <FileText className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleEditClick(testimonial)}
                              className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => setShareTestimonial(testimonial)}
                              className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200"
                            >
                              <Share2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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

                    <h2 className="mb-6 text-2xl font-bold text-gray-800">Text Testimonial</h2>

                    {/* Pro Banner */}
                    <div className="mb-6 rounded-lg bg-gradient-to-r from-[#a5b4fc] to-[#e879f9] p-4 text-white">
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

                    <form onSubmit={handleSubmitTextTestimonial} className="space-y-6">
                      <div>
                        <label htmlFor="customerName" className="mb-1 block text-sm font-medium text-gray-700">
                          Full Name
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
                          Tagline
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
                          placeholder="Co-Founder & CTO at Testifolio"
                        />
                        {formErrors.customerCompany && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.customerCompany}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={textTestimonial.email}
                          onChange={handleTextTestimonialChange}
                          className={`w-full rounded-md border ${
                            formErrors.email ? "border-red-300" : "border-gray-300"
                          } px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]`}
                          placeholder="email@example.com"
                        />
                        {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                      </div>

                      <div>
                        <label htmlFor="link" className="mb-1 block text-sm font-medium text-gray-700">
                          Link
                        </label>
                        <input
                          type="url"
                          id="link"
                          name="link"
                          value={textTestimonial.link}
                          onChange={handleTextTestimonialChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                          placeholder="https://reviews.com/review/123"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">Rating</label>
                          {renderStarRating(textTestimonial.rating, handleRatingChange)}
                        </div>

                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">Profile Picture</label>
                          <div className="flex items-center gap-3">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-300 bg-gray-50">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            </div>
                            <button
                              type="button"
                              className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                            >
                              Pick an Image
                            </button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="testimonialText" className="mb-1 block text-sm font-medium text-gray-700">
                          Message
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
                        <div className="mt-1 flex items-center text-xs text-blue-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-1 h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>You can highlight the part of the text by selecting it</span>
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Attach upto 3 Images</label>
                        <div className="flex h-32 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-blue-300 bg-gray-50 hover:bg-gray-100">
                          <div className="text-center">
                            <p className="text-sm font-medium text-blue-600">Click to Upload</p>
                            <p className="text-xs text-gray-500">or drag and drop</p>
                            <p className="text-xs text-gray-500">(Max. File size: 25 MB)</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="tags" className="mb-1 block text-sm font-medium text-gray-700">
                          Add related Tags
                        </label>
                        <input
                          type="text"
                          id="tags"
                          name="tags"
                          value={textTestimonial.tags}
                          onChange={handleTextTestimonialChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                          placeholder="Type Tag Name"
                        />
                      </div>

                      <div>
                        <label htmlFor="date" className="mb-1 block text-sm font-medium text-gray-700">
                          Date
                        </label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={textTestimonial.date}
                          onChange={handleTextTestimonialChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                        />
                      </div>

                      {formErrors.submit && (
                        <div className="rounded-md bg-red-50 p-4">
                          <div className="flex">
                            <AlertCircle className="h-5 w-5 text-red-400" />
                            <p className="ml-3 text-sm text-red-700">{formErrors.submit}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-center">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full rounded-md bg-gradient-to-r from-[#a5b4fc] to-[#e879f9] px-4 py-3 text-center text-sm font-medium text-white hover:from-[#818cf8] hover:to-[#d946ef] disabled:opacity-70"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center">
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              <span>Adding Testimonial...</span>
                            </div>
                          ) : (
                            "Add Testimonial"
                          )}
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

        {/* View Testimonial Modal */}
        {viewingTestimonial && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium">Testimonial Details</h3>
                <button
                  onClick={() => setViewingTestimonial(null)}
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mb-4 flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                  {viewingTestimonial.customer.avatar && (
                    <Image
                      src={viewingTestimonial.customer.avatar || "/placeholder.svg"}
                      alt={viewingTestimonial.customer.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <div className="font-medium">{viewingTestimonial.customer.name}</div>
                  <div className="text-sm text-gray-500">{viewingTestimonial.customer.company}</div>
                </div>
              </div>
              <div className="mb-4">
                {viewingTestimonial.rating && (
                  <div className="mb-1 flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < (viewingTestimonial.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                )}
                <p className="text-gray-700">{viewingTestimonial.text}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-500">Source:</span> <span>{viewingTestimonial.source}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Status:</span>{" "}
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      viewingTestimonial.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : viewingTestimonial.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {viewingTestimonial.status}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Type:</span> <span>{viewingTestimonial.type}</span>
                </div>
                {viewingTestimonial.created_at && (
                  <div>
                    <span className="font-medium text-gray-500">Date:</span>{" "}
                    <span>{new Date(viewingTestimonial.created_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setViewingTestimonial(null)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleEditClick(viewingTestimonial)
                    setViewingTestimonial(null)
                  }}
                  className="rounded-md bg-[#7c5cff] px-4 py-2 text-sm font-medium text-white hover:bg-[#6a4ddb]"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Testimonial Modal */}
        {editingTestimonial && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative mx-4 max-h-[90vh] w-full max-w-3xl overflow-auto rounded-lg bg-white p-6 shadow-xl">
              {/* Close Button */}
              <button
                onClick={() => setEditingTestimonial(null)}
                className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>

              {updateSuccess ? (
                /* Success state */
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                  <h2 className="mb-2 text-2xl font-bold text-gray-800">Testimonial Updated Successfully!</h2>
                  <p className="mb-6 text-center text-gray-600">Your testimonial has been updated.</p>
                  <button
                    onClick={() => setEditingTestimonial(null)}
                    className="rounded-lg bg-[#7c5cff] px-4 py-2 text-white hover:bg-[#6a4ddb]"
                  >
                    Close
                  </button>
                </div>
              ) : (
                /* Edit form */
                <div>
                  <h2 className="mb-6 text-2xl font-bold text-gray-800">Edit Testimonial</h2>

                  {/* Pro Banner */}
                  <div className="mb-6 rounded-lg bg-gradient-to-r from-[#a5b4fc] to-[#e879f9] p-4 text-white">
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
                          <h3 className="font-medium">Become a Pro and Edit Testimonials!</h3>
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

                  <form onSubmit={handleUpdateTestimonial} className="space-y-6">
                    <div>
                      <label htmlFor="customerName" className="mb-1 block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="customerName"
                        name="customerName"
                        value={editForm.customerName}
                        onChange={handleEditFormChange}
                        className={`w-full rounded-md border ${
                          editFormErrors.customerName ? "border-red-300" : "border-gray-300"
                        } px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]`}
                        placeholder="John Smith"
                      />
                      {editFormErrors.customerName && (
                        <p className="mt-1 text-sm text-red-600">{editFormErrors.customerName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="customerCompany" className="mb-1 block text-sm font-medium text-gray-700">
                        Tagline
                      </label>
                      <input
                        type="text"
                        id="customerCompany"
                        name="customerCompany"
                        value={editForm.customerCompany}
                        onChange={handleEditFormChange}
                        className={`w-full rounded-md border ${
                          editFormErrors.customerCompany ? "border-red-300" : "border-gray-300"
                        } px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]`}
                        placeholder="Co-Founder & CTO at Testifolio"
                      />
                      {editFormErrors.customerCompany && (
                        <p className="mt-1 text-sm text-red-600">{editFormErrors.customerCompany}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleEditFormChange}
                        className={`w-full rounded-md border ${
                          editFormErrors.email ? "border-red-300" : "border-gray-300"
                        } px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]`}
                        placeholder="email@example.com"
                      />
                      {editFormErrors.email && <p className="mt-1 text-sm text-red-600">{editFormErrors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="link" className="mb-1 block text-sm font-medium text-gray-700">
                        Link
                      </label>
                      <input
                        type="url"
                        id="link"
                        name="link"
                        value={editForm.link}
                        onChange={handleEditFormChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                        placeholder="https://reviews.com/review/123"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Rating</label>
                        {renderStarRating(editForm.rating, handleEditRatingChange)}
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Profile Picture</label>
                        <div className="flex items-center gap-3">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-300 bg-gray-50">
                            {editingTestimonial.customer.avatar ? (
                              <div className="relative h-16 w-16 overflow-hidden rounded-full">
                                <Image
                                  src={editingTestimonial.customer.avatar || "/placeholder.svg"}
                                  alt={editingTestimonial.customer.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            )}
                          </div>
                          <button
                            type="button"
                            className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                          >
                            Pick an Image
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="testimonialText" className="mb-1 block text-sm font-medium text-gray-700">
                        Message
                      </label>
                      <textarea
                        id="testimonialText"
                        name="testimonialText"
                        value={editForm.testimonialText}
                        onChange={handleEditFormChange}
                        rows={4}
                        className={`w-full rounded-md border ${
                          editFormErrors.testimonialText ? "border-red-300" : "border-gray-300"
                        } px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]`}
                        placeholder="Enter the testimonial text here..."
                      ></textarea>
                      {editFormErrors.testimonialText && (
                        <p className="mt-1 text-sm text-red-600">{editFormErrors.testimonialText}</p>
                      )}
                      <div className="mt-1 flex items-center text-xs text-blue-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-1 h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>You can highlight the part of the text by selecting it</span>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Attach upto 3 Images</label>
                      <div className="flex h-32 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-blue-300 bg-gray-50 hover:bg-gray-100">
                        <div className="text-center">
                          <p className="text-sm font-medium text-blue-600">Click to Upload</p>
                          <p className="text-xs text-gray-500">or drag and drop</p>
                          <p className="text-xs text-gray-500">(Max. File size: 25 MB)</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="tags" className="mb-1 block text-sm font-medium text-gray-700">
                        Add related Tags
                      </label>
                      <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={editForm.tags}
                        onChange={handleEditFormChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                        placeholder="Type Tag Name"
                      />
                    </div>

                    <div>
                      <label htmlFor="date" className="mb-1 block text-sm font-medium text-gray-700">
                        Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={editForm.date}
                        onChange={handleEditFormChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                      />
                    </div>

                    <div>
                      <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={editForm.status}
                        onChange={handleEditFormChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Published">Published</option>
                      </select>
                    </div>

                    {editFormErrors.submit && (
                      <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                          <AlertCircle className="h-5 w-5 text-red-400" />
                          <p className="ml-3 text-sm text-red-700">{editFormErrors.submit}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-center">
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="w-full rounded-md bg-gradient-to-r from-[#a5b4fc] to-[#e879f9] px-4 py-3 text-center text-sm font-medium text-white hover:from-[#818cf8] hover:to-[#d946ef] disabled:opacity-70"
                      >
                        {isUpdating ? (
                          <div className="flex items-center justify-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <span>Updating Testimonial...</span>
                          </div>
                        ) : (
                          "Update Testimonial"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Share Testimonial Modal */}
        {shareTestimonial && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium">Share Testimonial</h3>
                <button
                  onClick={() => setShareTestimonial(null)}
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  Share this testimonial from {shareTestimonial.customer.name} on social media or copy the link.
                </p>
              </div>
              <div className="mb-4 flex justify-center gap-4">
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-400 text-white hover:bg-blue-500">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-white hover:bg-blue-800">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </button>
              </div>
              <div className="mb-4">
                <label htmlFor="share-link" className="mb-1 block text-sm font-medium text-gray-700">
                  Share Link
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="share-link"
                    value={`https://testifolio.com/t/${shareTestimonial.id}`}
                    readOnly
                    className="w-full rounded-l-md border border-gray-300 px-3 py-2 text-sm focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://testifolio.com/t/${shareTestimonial.id}`)
                      alert("Link copied to clipboard!")
                    }}
                    className="rounded-r-md bg-[#7c5cff] px-4 py-2 text-sm font-medium text-white hover:bg-[#6a4ddb]"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShareTestimonial(null)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
