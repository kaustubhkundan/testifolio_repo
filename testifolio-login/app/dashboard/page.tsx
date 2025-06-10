"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronDown,
  ChevronRight,
  Edit,
  Eye,
  FileText,
  MessageSquare,
  Plus,
  Send,
  Share2,
  X,
  ArrowLeft,
  CheckCircle2,
  Star,
  Upload,
  Loader2,
  Pencil,
  ArrowRight,
  AlertCircle,
  Download,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { HowItWorks } from "@/components/home/how-it-works"
import { GoogleImportModal } from "@/components/google-import-modal"
import { FacebookImportModal } from "@/components/facebook-import-modal"

// Define types for our data
type Testimonial = {
  id: number
  customer_name: string
  customer_company: string
  customer_avatar: string
  type: string
  status: "Approved" | "Pending" | "Published"
  engagement: string
  ai_score: string
  created_at: string
}

type DashboardStats = {
  totalTestimonials: number
  awaitingApproval: number
  newTestimonials: number
  conversionImpact: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTestimonials: 0,
    awaitingApproval: 0,
    newTestimonials: 0,
    conversionImpact: 0,
  })
  const [recentTestimonials, setRecentTestimonials] = useState<Testimonial[]>([])
  const [isStatsLoading, setIsStatsLoading] = useState(true)
  const [isTestimonialsLoading, setIsTestimonialsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, profile } = useAuth()
  const router = useRouter()

  // Modal states - copied from testimonials page
  const [showImportModal, setShowImportModal] = useState(false)
  const [selectedSource, setSelectedSource] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showGoogleImportModal, setShowGoogleImportModal] = useState(false)
  const [showFacebookImportModal, setShowFacebookImportModal] = useState(false)
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null)

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
    customerAvatar: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Memoize the fetchDashboardStats function to prevent unnecessary re-renders
  const fetchDashboardStats = useCallback(async () => {
    if (!user) return

    try {
      setIsStatsLoading(true)

      // Get total testimonials count
      const { count: totalCount, error: totalError } = await supabase
        .from("testimonials")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)

      if (totalError) throw totalError

      // Get awaiting approval count
      const { count: pendingCount, error: pendingError } = await supabase
        .from("testimonials")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "Pending")

      if (pendingError) throw pendingError

      // Get new testimonials in last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { count: newCount, error: newError } = await supabase
        .from("testimonials")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", thirtyDaysAgo.toISOString())

      if (newError) throw newError

      // For conversion impact, we would typically calculate this based on analytics
      // For now, we'll use a placeholder value or calculate it based on available data
      const conversionImpact = Math.round((totalCount || 0) > 0 ? ((newCount || 0) / (totalCount || 1)) * 100 : 0)

      setStats({
        totalTestimonials: totalCount || 0,
        awaitingApproval: pendingCount || 0,
        newTestimonials: newCount || 0,
        conversionImpact: conversionImpact > 0 ? conversionImpact : 0,
      })
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      setError("Failed to load dashboard statistics")
    } finally {
      setIsStatsLoading(false)
    }
  }, [user])

  // Memoize the fetchRecentTestimonials function to prevent unnecessary re-renders
  const fetchRecentTestimonials = useCallback(async () => {
    if (!user) return

    try {
      setIsTestimonialsLoading(true)

      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(4)

      if (error) throw error

      if (data) {
        // Map the database data to our component format
        const formattedTestimonials = data.map((item) => ({
          id: item.id,
          customer_name: item.customer_name,
          customer_company: item.customer_company,
          customer_avatar: item.customer_avatar || "/stylized-jc-initials.png", // Default avatar if none
          type: item.type || "Written Testimonials",
          status: item.status || "Pending",
          engagement: item.engagement || "0",
          ai_score: item.ai_score || "0%",
          created_at: item.created_at,
        }))

        setRecentTestimonials(formattedTestimonials)
      } else {
        // If no data, set empty array (not dummy data)
        setRecentTestimonials([])
      }
    } catch (error) {
      console.error("Error fetching recent testimonials:", error)
      setError("Failed to load recent testimonials")
      setRecentTestimonials([]) // Set empty array, not dummy data
    } finally {
      setIsTestimonialsLoading(false)
    }
  }, [user])

  // Modal handler functions - copied from testimonials page
  const handleAddNewClick = () => {
    setShowImportModal(true)
  }

  const handleImportSuccess = () => {
    // Refresh testimonials
    setLastFetchTime(null)
    // Close any open modals
    setShowGoogleImportModal(false)
    setShowFacebookImportModal(false)
    setShowImportModal(false)
  }

  const handleCloseModal = () => {
    setShowImportModal(false)
    setSelectedSource(null)
    setSubmitSuccess(false)
    setFormErrors({})
    setPreviewImage(null)
    setTextTestimonial({
      customerName: "",
      customerCompany: "",
      testimonialText: "",
      rating: 5,
      email: "",
      link: "",
      date: new Date().toISOString().split("T")[0],
      tags: "",
      customerAvatar: "",
    })
  }

  const handleSourceSelect = async (sourceId: string) => {
    if (sourceId === "text") {
      setSelectedSource(sourceId)
    } else if (sourceId === "google") {
      // Check if Google integration exists
      if (user) {
        const { data } = await supabase
          .from("user_integrations")
          .select("access_token, expires_at")
          .eq("user_id", user.id)
          .eq("provider", "google")
          .single()

        if (!data || (data.expires_at && new Date(data.expires_at) <= new Date())) {
          // No integration or expired - show integration pending
          setShowImportModal(false)
          setShowGoogleImportModal(true)
        } else {
          // Integration exists - proceed with import
          setShowImportModal(false)
          setShowGoogleImportModal(true)
        }
      }
    } else if (sourceId === "facebook") {
      // Check if Facebook integration exists
      if (user) {
        const { data } = await supabase
          .from("user_integrations")
          .select("access_token, page_access_token")
          .eq("user_id", user.id)
          .eq("provider", "facebook")
          .single()

        if (!data || (!data.access_token && !data.page_access_token)) {
          // No integration - show integration pending
          setShowImportModal(false)
          setShowFacebookImportModal(true)
        } else {
          // Integration exists - proceed with import
          setShowImportModal(false)
          setShowFacebookImportModal(true)
        }
      }
    } else {
      // Show a message that only text testimonials are available now
      alert("Coming soon! Currently only Text, Google, and Facebook testimonial imports are available.")
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

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    try {
      setUploadingImage(true)

      // Create a preview of the image
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `testimonial-avatars/${fileName}`

      const { data, error } = await supabase.storage.from("testimonials").upload(filePath, file)

      if (error) throw error

      // Get the public URL
      const { data: publicUrlData } = supabase.storage.from("testimonials").getPublicUrl(filePath)

      const avatarUrl = publicUrlData.publicUrl

      // Update the form state with the new avatar URL
      setTextTestimonial((prev) => ({
        ...prev,
        customerAvatar: avatarUrl,
      }))
    } catch (err) {
      console.error("Error uploading image:", err)
      alert("Failed to upload image. Please try again.")
    } finally {
      setUploadingImage(false)
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
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
            customer_avatar: textTestimonial.customerAvatar || null,
          },
        ])
        .select()

      if (error) throw error

      // Add the new testimonial to the state
      if (data && data.length > 0) {
        const newTestimonial: Testimonial = {
          id: data[0].id,
          customer_name: data[0].customer_name,
          customer_company: data[0].customer_company,
          customer_avatar: data[0].customer_avatar || "/stylized-jc-initials.png",
          type: "Written Testimonials",
          status: "Pending",
          engagement: "0",
          ai_score: "0%",
          created_at: data[0].created_at,
        }

        setRecentTestimonials((prev) => [newTestimonial, ...prev.slice(0, 3)])
        setSubmitSuccess(true)

        // Refresh stats
        fetchDashboardStats()
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

  const importSources = [
    { id: "text", name: "Text Testimonial", logo: "/text-testimonial-icon.png", isReady: true },
    { id: "google", name: "Google", logo: "/google-icon.png", isReady: true },
    { id: "yelp", name: "Yelp", logo: "/yelp-icon.png", isReady: false },
    { id: "facebook", name: "Facebook", logo: "/facebook-icon.png", isReady: true },
    { id: "trustpilot", name: "Trustpilot", logo: "/trustpilot-icon.png", isReady: false },
    { id: "amazon", name: "Amazon", logo: "/amazon-icon.png", isReady: false },
  ]

  // Fetch dashboard stats and testimonials
  useEffect(() => {
    if (recentTestimonials.length > 0 && !isTestimonialsLoading) return

    if (user) {
      // Fetch data in parallel
      Promise.all([fetchDashboardStats(), fetchRecentTestimonials()]).catch((error) => {
        console.error("Error fetching dashboard data:", error)
      })
    }
  }, [user, fetchDashboardStats, fetchRecentTestimonials])

  // Set up real-time subscription for testimonials
  useEffect(() => {
    if (!user) return

    // Subscribe to changes in the testimonials table
    const subscription = supabase
      .channel("testimonials-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "testimonials",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          // Refresh the testimonials data when changes occur
          fetchRecentTestimonials()
          fetchDashboardStats()
        },
      )
      .subscribe()

    // Cleanup function to remove the subscription
    return () => {
      supabase.removeChannel(subscription)
    }
  }, [user, fetchRecentTestimonials, fetchDashboardStats])

  // Redirect if not authenticated
  useEffect(() => {
    if (!user && !isStatsLoading && !isTestimonialsLoading) {
      router.push("/login")
    }
  }, [user, isStatsLoading, isTestimonialsLoading, router])

  return (
    <>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-medium text-gray-800">
            Welcome back, {profile?.business_name || user?.email?.split("@")[0] || "User"}! Here&apos;s what&apos;s happening
            with your testimonials.
          </h2>
          <a
            href="/pricing"
            className="rounded-full bg-gradient-to-r from-[#6366f1] to-[#ec4899] px-6 py-2.5 text-white font-medium text-sm transition-transform hover:scale-105"
          >
            Upgrade Now
          </a>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Stats Card 1 */}
          <div className="rounded-lg bg-[#a5b4fc] p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                {isStatsLoading ? (
                  <div className="h-10 w-16 animate-pulse rounded bg-[#818cf8]/50"></div>
                ) : (
                  <div className="text-4xl font-bold">{stats.totalTestimonials.toLocaleString()}</div>
                )}
                <div className="mt-1 text-sm">Total Testimonials</div>
              </div>
              <div className="rounded-full bg-[#818cf8] p-2">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Stats Card 2 */}
          <div className="rounded-lg bg-[#a5b4fc] p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                {isStatsLoading ? (
                  <div className="h-10 w-16 animate-pulse rounded bg-[#818cf8]/50"></div>
                ) : (
                  <div className="text-4xl font-bold">{stats.awaitingApproval}</div>
                )}
                <div className="mt-1 text-sm">Awaiting Approval</div>
              </div>
              <div className="rounded-full bg-[#818cf8] p-2">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Stats Card 3 */}
          <div className="rounded-lg bg-[#a5b4fc] p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                {isStatsLoading ? (
                  <div className="h-10 w-16 animate-pulse rounded bg-[#818cf8]/50"></div>
                ) : (
                  <div className="text-4xl font-bold">{stats.newTestimonials}</div>
                )}
                <div className="mt-1 text-sm">
                  New Testimonials
                  <br />
                  (Last 30 days)
                </div>
              </div>
              <div className="rounded-full bg-[#818cf8] p-2">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Stats Card 4 */}
          <div className="rounded-lg bg-[#a5b4fc] p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                {isStatsLoading ? (
                  <div className="h-10 w-16 animate-pulse rounded bg-[#818cf8]/50"></div>
                ) : (
                  <div className="text-4xl font-bold">{stats.conversionImpact}%</div>
                )}
                <div className="mt-1 text-sm">Conversion Impact</div>
              </div>
              <div className="rounded-full bg-[#818cf8] p-2">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#7c5cff]">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <h3 className="mb-2 text-lg font-medium">Create a New Form</h3>
            <p className="mb-4 text-sm text-gray-600">
              Use forms to collect testimonials and feedback from your customers.
            </p>
            <Link href="/dashboard/collection-forms" className="block w-full">
              <button className="w-full rounded-lg bg-[#a5b4fc] py-2 text-center text-white hover:bg-[#818cf8]">
                View Forms
              </button>
            </Link>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#7c5cff]">
              <Send className="h-5 w-5 text-white" />
            </div>
            <h3 className="mb-2 text-lg font-medium">Send a Testimonial Request</h3>
            <p className="mb-4 text-sm text-gray-600">Reach out to customers for new testimonials</p>
            <Link href="/dashboard/testimonials" className="block w-full">
              <button className="w-full rounded-lg bg-[#a5b4fc] py-2 text-center text-white hover:bg-[#818cf8]">
                Request a Testimonial
              </button>
            </Link>
          </div>

          <div className="rounded-lg border border-[#7c5cff] bg-white p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#7c5cff]">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <h3 className="mb-2 text-lg font-medium">Create a Social Post</h3>
            <p className="mb-4 text-sm text-gray-600">Craft engaging content to share with your audience.</p>
            <Link href="/dashboard/creative-studio" className="block w-full">
              <button className="w-full rounded-lg bg-[#a5b4fc] py-2 text-center text-white hover:bg-[#818cf8]">
                Create a Social Post
              </button>
            </Link>
          </div>
        </div>

        {/* Recent Testimonials */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-medium text-gray-800">Recent Testimonials</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button className="flex items-center gap-2 rounded-md bg-gray-200 px-3 py-1.5 text-sm text-gray-700">
                  <span>Recent</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={handleAddNewClick}
                className="flex items-center gap-2 rounded-md bg-gray-800 px-3 py-1.5 text-sm text-white"
              >
                <Plus className="h-4 w-4" />
                <span>Add New</span>
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            {isTestimonialsLoading ? (
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
                <button
                  onClick={() => {
                    setError(null)
                    fetchRecentTestimonials()
                  }}
                  className="mt-2 text-sm text-[#7c5cff] hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">

                {recentTestimonials.length > 0 ? (
                  recentTestimonials.map((testimonial) => (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50 text-left text-sm text-gray-600">
                          <th className="px-6 py-3 font-medium">Customer</th>
                          <th className="px-6 py-3 font-medium">Type</th>
                          <th className="px-6 py-3 font-medium">
                            Status <ChevronDown className="ml-1 inline h-3 w-3" />
                          </th>
                          <th className="px-6 py-3 font-medium">Engagement</th>
                          <th className="px-6 py-3 font-medium">AI Score</th>
                          <th className="px-6 py-3 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr key={testimonial.id} className="text-gray-700">
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                                <Image
                                  src={testimonial.customer_avatar || "/placeholder.svg"}
                                  alt={testimonial.customer_name}
                                  fill
                                />
                              </div>
                              <div>
                                <div className="font-medium">{testimonial.customer_name}</div>
                                <div className="text-sm text-gray-500">{testimonial.customer_company}</div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">{testimonial.type}</td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${testimonial.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : testimonial.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                                }`}
                            >
                              <span
                                className={`mr-1.5 h-1.5 w-1.5 rounded-full ${testimonial.status === "Approved"
                                  ? "bg-green-400"
                                  : testimonial.status === "Pending"
                                    ? "bg-yellow-400"
                                    : "bg-blue-400"
                                  }`}
                              ></span>
                              {testimonial.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">{testimonial.engagement}</td>
                          <td className="whitespace-nowrap px-6 py-4">{testimonial.ai_score}</td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div
                              className="flex items-center gap-2"
                              onClick={() => window.open("/dashboard/testimonials", "_self")}
                            >
                              <button className="rounded-full bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="rounded-full bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="rounded-full bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200">
                                <Share2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ))
                ) : (
                  <div className=" rounded-lg p-8 w-[1128px] h-[355px] mx-auto">
                    <div className="flex items-center justify-between h-full">
                      <div className="flex-1 max-w-lg">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                          Already have testimonials? Import them now with our integrations.
                        </h3>
                        <p className="text-base text-gray-600 mb-6 leading-relaxed">
                          Import testimonials from multiple platforms and display them in minutes. Build trust and boost conversions
                          with real feedback.
                        </p>
                        <button onClick={handleAddNewClick} className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg text-base font-medium transition-colors">
                          <Download className="h-5 w-5" />
                          <span>Import Testimonials</span>
                        </button>
                      </div>

                      <div className="relative w-[300px] h-[300px] flex-shrink-0">
                        <Image
                          src="/howitworks4.svg"
                          alt="Star character on skateboard"
                          width={400}
                          height={280}
                          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        />

                        {/* Social media platform logos positioned around the character */}

                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      </div>

      {/* Import Modal - Same as testimonials page */}
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
                            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-300 bg-gray-50 overflow-hidden">
                              {previewImage ? (
                                <Image
                                  src={previewImage || "/placeholder.svg"}
                                  alt="Profile preview"
                                  width={64}
                                  height={64}
                                  className="object-cover w-full h-full"
                                />
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
                            <input
                              type="file"
                              ref={fileInputRef}
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e)}
                            />
                            <button
                              type="button"
                              onClick={() => triggerFileInput()}
                              disabled={uploadingImage}
                              className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-70 flex items-center gap-2"
                            >
                              {uploadingImage ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span>Uploading...</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="h-4 w-4" />
                                  <span>Pick an Image</span>
                                </>
                              )}
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

        {/* Google Import Modal */}
        <GoogleImportModal
          isOpen={showGoogleImportModal}
          onClose={() => setShowGoogleImportModal(false)}
          onImportSuccess={handleImportSuccess}
        />

        {/* Facebook Import Modal */}
        <FacebookImportModal
          isOpen={showFacebookImportModal}
          onClose={() => setShowFacebookImportModal(false)}
          onImportSuccess={handleImportSuccess}
        />
    </>
  )
}
