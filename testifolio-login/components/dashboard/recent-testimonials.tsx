"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronDown, Edit, Eye, MessageSquare, Share2, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

type Testimonial = {
  id: number
  customer_name: string
  customer_company: string
  customer_avatar: string
  content: string
  rating: number
  type: string
  status: "Approved" | "Pending" | "Published"
  source: string
  created_at: string
}

interface RecentTestimonialsProps {
  testimonials: Testimonial[]
  isLoading: boolean
  error: string | null
  isDarkMode?: boolean
  onRefresh?: () => void
}

export default function RecentTestimonials({
  testimonials,
  isLoading,
  error,
  isDarkMode = false,
  onRefresh,
}: RecentTestimonialsProps) {
  const [viewTestimonial, setViewTestimonial] = useState<Testimonial | null>(null)
  const [deleteTestimonial, setDeleteTestimonial] = useState<Testimonial | null>(null)
  const [shareTestimonial, setShareTestimonial] = useState<Testimonial | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const statusDropdown = document.getElementById("status-dropdown")
      if (statusDropdown && !statusDropdown.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle edit testimonial
  const handleEdit = (testimonialId: number) => {
    router.push(`/dashboard/testimonials/edit/${testimonialId}`)
  }

  // Handle delete testimonial
  const handleDelete = async () => {
    if (!deleteTestimonial) return

    try {
      setIsDeleting(true)
      const { error } = await supabase.from("testimonials").delete().eq("id", deleteTestimonial.id)

      if (error) throw error

      setDeleteTestimonial(null)
      if (onRefresh) onRefresh()
    } catch (error) {
      console.error("Error deleting testimonial:", error)
      alert("Failed to delete testimonial. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    const platformLower = platform?.toLowerCase() || ""

    if (platformLower.includes("google")) {
      return (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow">
          <Image src="/google-icon.png" alt="Google" width={16} height={16} />
        </div>
      )
    } else if (platformLower.includes("facebook")) {
      return (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </div>
      )
    } else if (platformLower.includes("yelp")) {
      return (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow">
          <Image src="/yelp-icon.png" alt="Yelp" width={16} height={16} />
        </div>
      )
    } else if (platformLower.includes("amazon")) {
      return (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow">
          <Image src="/amazon-icon.png" alt="Amazon" width={16} height={16} />
        </div>
      )
    } else {
      return (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
          <MessageSquare className="h-3 w-3 text-gray-500" />
        </div>
      )
    }
  }

  return (
    <>
      <div
        className={`overflow-hidden rounded-lg border ${
          isDarkMode ? "border-gray-700 bg-[#1a1a1a]" : "border-gray-200 bg-white"
        }`}
      >
        {isLoading ? (
          <div className="p-6">
            <div className="flex animate-pulse space-x-4">
              <div className="h-12 w-12 rounded-full bg-gray-300"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 w-3/4 rounded bg-gray-300"></div>
                <div className="space-y-2">
                  <div className="h-4 rounded bg-gray-300"></div>
                  <div className="h-4 w-5/6 rounded bg-gray-300"></div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex animate-pulse space-x-4">
              <div className="h-12 w-12 rounded-full bg-gray-300"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 w-3/4 rounded bg-gray-300"></div>
                <div className="space-y-2">
                  <div className="h-4 rounded bg-gray-300"></div>
                  <div className="h-4 w-5/6 rounded bg-gray-300"></div>
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <p>{error}</p>
            <button onClick={onRefresh} className="mt-2 text-sm text-[#7c5cff] hover:underline">
              Try again
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className={`border-b ${
                    isDarkMode
                      ? "border-gray-700 bg-gray-800 text-gray-200"
                      : "border-gray-200 bg-gray-50 text-gray-600"
                  } text-left text-sm`}
                >
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium relative">
                    Status
                    <ChevronDown
                      className={`ml-1 inline h-3 w-3 cursor-pointer ${
                        isStatusDropdownOpen ? "rotate-180" : ""
                      } transition-transform duration-300`}
                      onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    />
                    {isStatusDropdownOpen && (
                      <div
                        id="status-dropdown"
                        className={`absolute left-0 right-0 top-full z-10 mt-2 rounded-lg bg-white shadow ${
                          isDarkMode ? "bg-gray-800 text-gray-200" : ""
                        }`}
                      >
                        <div className="p-2">
                          <span className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                            Approved
                          </span>
                          <span className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                            Pending
                          </span>
                          <span className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                            Published
                          </span>
                        </div>
                      </div>
                    )}
                  </th>
                  <th className="px-6 py-3 font-medium">Source</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}>
                {testimonials.length > 0 ? (
                  testimonials.map((testimonial) => (
                    <tr key={testimonial.id} className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 overflow-hidden rounded-full">
                            <Image
                              src={testimonial.customer_avatar || "/placeholder.svg"}
                              alt={testimonial.customer_name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{testimonial.customer_name}</div>
                            <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                              {testimonial.customer_company}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">{testimonial.type || "Written"}</td>
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
                        <div className="flex items-center gap-2">
                          {getPlatformIcon(testimonial.source)}
                          <span>{testimonial.source || "Direct"}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {formatDate(testimonial.created_at)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewTestimonial(testimonial)}
                            className={`rounded-full p-1.5 ${
                              isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
                            } hover:bg-gray-200`}
                            aria-label="View testimonial"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(testimonial.id)}
                            className={`rounded-full p-1.5 ${
                              isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
                            } hover:bg-gray-200`}
                            aria-label="Edit testimonial"
                            disabled={isDeleting}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setShareTestimonial(testimonial)}
                            className={`rounded-full p-1.5 ${
                              isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
                            } hover:bg-gray-200`}
                            aria-label="Share testimonial"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTestimonial(testimonial)}
                            className={`rounded-full p-1.5 ${
                              isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
                            } hover:bg-gray-200`}
                            aria-label="Delete testimonial"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="mx-auto max-w-md">
                        <div className="mb-4 text-center">
                          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f0eaff]">
                            <MessageSquare className="h-6 w-6 text-[#7c5cff]" />
                          </div>
                          <h3 className={`text-lg font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            No testimonials yet
                          </h3>
                          <p className={`mt-1 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Get started by collecting testimonials from your customers.
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Testimonial Modal */}
      {viewTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">Testimonial Details</h3>
              <button
                onClick={() => setViewTestimonial(null)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-4 flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full">
                <Image
                  src={viewTestimonial.customer_avatar || "/placeholder.svg"}
                  alt={viewTestimonial.customer_name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-medium">{viewTestimonial.customer_name}</div>
                <div className="text-sm text-gray-500">{viewTestimonial.customer_company}</div>
              </div>
            </div>
            <div className="mb-4">
              <div className="mb-1 flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`h-5 w-5 ${
                      i < viewTestimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700">{viewTestimonial.content}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">Source:</span>{" "}
                <span>{viewTestimonial.source || "Direct"}</span>
              </div>
              <div>
                <span className="font-medium text-gray-500">Status:</span>{" "}
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    viewTestimonial.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : viewTestimonial.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {viewTestimonial.status}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-500">Type:</span>{" "}
                <span>{viewTestimonial.type || "Written"}</span>
              </div>
              <div>
                <span className="font-medium text-gray-500">Date:</span>{" "}
                <span>{formatDate(viewTestimonial.created_at)}</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setViewTestimonial(null)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setViewTestimonial(null)
                  handleEdit(viewTestimonial.id)
                }}
                className="rounded-md bg-[#7c5cff] px-4 py-2 text-sm font-medium text-white hover:bg-[#6a4ddb]"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium">Delete Testimonial</h3>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to delete this testimonial from {deleteTestimonial.customer_name}? This action
                cannot be undone.
              </p>
            </div>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setDeleteTestimonial(null)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">Share Testimonial</h3>
              <button
                onClick={() => setShareTestimonial(null)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Share this testimonial from {shareTestimonial.customer_name} on social media or copy the link.
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
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 22h20L12 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
