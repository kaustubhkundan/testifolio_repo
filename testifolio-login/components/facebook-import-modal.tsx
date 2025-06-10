"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, CheckCircle2, Loader2, X } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { FacebookService } from "@/lib/services/facebook-service"
import { createClient } from "@supabase/supabase-js"

interface FacebookPage {
  id: string
  name: string
  picture?: {
    data: {
      url: string
    }
  }
  access_token: string
}

interface FacebookReview {
  id: string
  reviewer: {
    name: string
    id: string
    profile_picture?: string
  }
  rating: number
  recommendation_type: string
  review_text: string
  created_time: string
  updated_time: string
  selected?: boolean
}

interface FacebookImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImportSuccess: () => void
}

export function FacebookImportModal({ isOpen, onClose, onImportSuccess }: FacebookImportModalProps) {
  const { user } = useAuth()
  const [step, setStep] = useState<"integration-pending" | "auth" | "pages" | "reviews" | "success">(
    "integration-pending",
  )
  const [isLoadingPages, setIsLoadingPages] = useState(false)
  const [pages, setPages] = useState<FacebookPage[]>([])
  const [selectedPage, setSelectedPage] = useState<FacebookPage | null>(null)
  const [reviews, setReviews] = useState<FacebookReview[]>([])
  const [selectedReviews, setSelectedReviews] = useState<FacebookReview[]>([])
  const [isLoadingReviews, setIsLoadingReviews] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [minRating, setMinRating] = useState(5)
  const [translateToEnglish, setTranslateToEnglish] = useState(true)
  const [onlyWithText, setOnlyWithText] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const supabaseUrl = "https://your-supabase-url.supabase.co"
  const supabaseKey = "your-supabase-key"
  const supabase = createClient(supabaseUrl, supabaseKey)

  useEffect(() => {
    if (isOpen) {
      checkAuthentication()
    }
  }, [isOpen])

  const checkAuthentication = async () => {
    if (!user) return

    try {
      setIsCheckingAuth(true)
      setError(null)

      // Check if user has Facebook integration
      const { data, error } = await supabase
        .from("user_integrations")
        .select("access_token, page_access_token, expires_at")
        .eq("user_id", user.id)
        .eq("provider", "facebook")
        .single()

      if (error || !data) {
        setIsAuthenticated(false)
        setStep("integration-pending")
        return
      }

      // Facebook page tokens don't expire, but user tokens do
      if (data.access_token || data.page_access_token) {
        setIsAuthenticated(true)
        setStep("pages")
        fetchPages()
      } else {
        setIsAuthenticated(false)
        setStep("integration-pending")
      }
    } catch (err) {
      console.error("Error checking Facebook authentication:", err)
      setIsAuthenticated(false)
      setStep("integration-pending")
    } finally {
      setIsCheckingAuth(false)
    }
  }

  const handleFacebookAuth = () => {
    const authUrl = FacebookService.getAuthUrl()
    window.open(authUrl, "_blank", "width=500,height=600")

    // Listen for auth completion
    const checkAuth = setInterval(async () => {
      try {
        const { data } = await supabase
          .from("user_integrations")
          .select("access_token")
          .eq("user_id", user?.id)
          .eq("provider", "facebook")
          .single()

        if (data?.access_token) {
          clearInterval(checkAuth)
          setIsAuthenticated(true)
          setStep("pages")
          fetchPages()
        }
      } catch (err) {
        // Still checking...
      }
    }, 2000)

    // Stop checking after 5 minutes
    setTimeout(() => clearInterval(checkAuth), 300000)
  }

  const resetModal = () => {
    setStep("auth")
    setPages([])
    setSelectedPage(null)
    setReviews([])
    setSelectedReviews([])
    setError(null)
  }

  useEffect(() => {
    if (isOpen) {
      if (isAuthenticated) {
        setStep("pages")
        fetchPages()
      } else {
        resetModal()
      }
    }
  }, [isOpen, isAuthenticated])

  const fetchPages = async () => {
    if (!user) return

    try {
      setIsLoadingPages(true)
      setError(null)

      const pagesData = await FacebookService.getPages(user.id)

      const formattedPages: FacebookPage[] =
        pagesData.data?.map((page: any) => ({
          id: page.id,
          name: page.name,
          picture: page.picture,
          access_token: page.access_token,
        })) || []

      setPages(formattedPages)
    } catch (err) {
      console.error("Error fetching Facebook pages:", err)
      setError(
        "Failed to fetch your Facebook pages. Please make sure you have the necessary permissions and try again.",
      )
    } finally {
      setIsLoadingPages(false)
    }
  }

  const handleSelectPage = async (page: FacebookPage) => {
    if (!user) return

    try {
      setSelectedPage(page)
      setIsLoadingReviews(true)
      setError(null)

      const reviewsData = await FacebookService.getReviews(user.id, page.id, {
        limit: 50,
        minRating: minRating,
      })

      const formattedReviews: FacebookReview[] =
        reviewsData.data?.map((review: any) => ({
          id: review.id,
          reviewer: {
            name: review.reviewer?.name || "Anonymous",
            id: review.reviewer?.id || "",
            profile_picture: review.reviewer?.picture?.data?.url,
          },
          rating: review.rating || (review.recommendation_type === "positive" ? 5 : 1),
          recommendation_type: review.recommendation_type,
          review_text:
            review.review_text ||
            `${review.recommendation_type === "positive" ? "Recommends" : "Doesn't recommend"} this business`,
          created_time: review.created_time,
          updated_time: review.updated_time,
        })) || []

      // Filter reviews based on settings
      let filteredReviews = formattedReviews

      if (onlyWithText) {
        filteredReviews = filteredReviews.filter(
          (review) =>
            review.review_text &&
            review.review_text.trim().length > 0 &&
            !review.review_text.includes("Recommends this business") &&
            !review.review_text.includes("Doesn't recommend this business"),
        )
      }

      setReviews(filteredReviews)
      setStep("reviews")
    } catch (err) {
      console.error("Error fetching reviews:", err)
      setError("Failed to fetch reviews. Please make sure you have the necessary permissions and try again.")
    } finally {
      setIsLoadingReviews(false)
    }
  }

  const handleToggleReview = (reviewId: string) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) => (review.id === reviewId ? { ...review, selected: !review.selected } : review)),
    )

    const review = reviews.find((r) => r.id === reviewId)
    if (!review) return

    if (review.selected) {
      setSelectedReviews((prev) => prev.filter((r) => r.id !== reviewId))
    } else {
      setSelectedReviews((prev) => [...prev, { ...review, selected: true }])
    }
  }

  const handleSelectAll = () => {
    const allSelected = reviews.every((review) => review.selected)

    if (allSelected) {
      // Deselect all
      setReviews((prevReviews) => prevReviews.map((review) => ({ ...review, selected: false })))
      setSelectedReviews([])
    } else {
      // Select all
      setReviews((prevReviews) => prevReviews.map((review) => ({ ...review, selected: true })))
      setSelectedReviews([...reviews])
    }
  }

  const handleImportReviews = async () => {
    if (!user || selectedReviews.length === 0) return

    try {
      setIsImporting(true)
      setError(null)

      await FacebookService.importReviews(user.id, selectedReviews)

      setStep("success")
      onImportSuccess()
    } catch (err) {
      console.error("Error importing reviews:", err)
      setError("Failed to import reviews. Please try again.")
    } finally {
      setIsImporting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative mx-4 max-h-[90vh] w-full max-w-3xl overflow-auto rounded-lg bg-white p-6 shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          {step !== "auth" && step !== "pages" && (
            <button onClick={() => setStep("pages")} className="mb-4 flex items-center text-[#6d7cff] hover:underline">
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span>Choose a different source</span>
            </button>
          )}

          <h2 className="text-2xl font-bold text-gray-800">
            {step === "integration-pending" && "Facebook Integration Required"}
            {step === "auth" && "Connect Facebook"}
            {step === "pages" && "Add Testimonials from Facebook"}
            {step === "reviews" && `Import Reviews from ${selectedPage?.name}`}
            {step === "success" && "Reviews Imported Successfully!"}
          </h2>
        </div>

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
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
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
              Go Unlimited!
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            <p>{error}</p>
          </div>
        )}

        {/* Content based on step */}
        {step === "integration-pending" && (
          <div className="text-center py-8">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-orange-100 p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-12 w-12 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="mb-4 text-xl font-semibold text-gray-800">Facebook Integration Required</h3>
            <p className="mb-6 text-gray-600">
              To import reviews from Facebook, you need to connect your Facebook account first.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.open("/dashboard/settings", "_blank")}
                className="w-full rounded-md bg-[#1877F2] px-6 py-3 text-white hover:bg-[#166FE5] flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="white">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Go to Integrations Settings
              </button>
              <button
                onClick={onClose}
                className="w-full rounded-md border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {step === "auth" && (
          <div className="text-center">
            {isCheckingAuth ? (
              <div className="flex flex-col items-center py-8">
                <Loader2 className="mb-4 h-8 w-8 animate-spin text-[#7c5cff]" />
                <p className="text-gray-600">Checking authentication...</p>
              </div>
            ) : (
              <div className="py-8">
                <div className="mb-6 flex justify-center">
                  <div className="rounded-full bg-blue-100 p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-12 w-12" fill="#1877F2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                </div>
                <h3 className="mb-4 text-xl font-semibold">Connect your Facebook account</h3>
                <p className="mb-6 text-gray-600">
                  To import reviews from Facebook, you need to connect your Facebook account and grant access to your
                  pages.
                </p>
                <button
                  onClick={handleFacebookAuth}
                  className="rounded-md bg-[#1877F2] px-6 py-3 text-white hover:bg-[#166FE5] flex items-center gap-2 mx-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="white">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Connect Facebook
                </button>
              </div>
            )}
          </div>
        )}

        {step === "pages" && (
          <div>
            <p className="mb-6 text-gray-600">Select the Facebook page from which you want to import reviews.</p>

            {isLoadingPages ? (
              <div className="flex h-32 items-center justify-center">
                <Loader2 className="mr-2 h-6 w-6 animate-spin text-[#7c5cff]" />
                <span className="text-gray-600">Loading your Facebook pages...</span>
              </div>
            ) : pages.length > 0 ? (
              <div className="space-y-4">
                {pages.map((page) => (
                  <div
                    key={page.id}
                    className="rounded-lg border border-gray-200 p-4 hover:border-[#7c5cff] hover:bg-[#f8f7ff]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-3 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-[#1877F2]">
                          {page.picture ? (
                            <Image
                              src={page.picture.data.url || "/placeholder.svg"}
                              alt={page.name}
                              width={48}
                              height={48}
                              className="rounded-full"
                            />
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              className="h-6 w-6"
                              fill="currentColor"
                            >
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{page.name}</h3>
                          <p className="text-sm text-gray-500">Facebook Page</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSelectPage(page)}
                        className="rounded-md bg-[#7c5cff] px-4 py-2 text-sm text-white hover:bg-[#6a4ddb]"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center rounded-md border-2 border-dashed border-gray-300">
                <p className="text-gray-500">
                  No Facebook pages found. Make sure you've connected your Facebook account and have page access.
                </p>
              </div>
            )}
          </div>
        )}

        {step === "reviews" && selectedPage && (
          <div>
            <div className="mb-6 flex items-center">
              <div className="mr-3 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-[#1877F2]">
                {selectedPage.picture ? (
                  <Image
                    src={selectedPage.picture.data.url || "/placeholder.svg"}
                    alt={selectedPage.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{selectedPage.name}</h3>
                <p className="text-sm text-gray-500">Facebook Page</p>
              </div>
            </div>

            <div className="mb-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Fetch Reviews that have a minimum rating of
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                >
                  <option value={5}>5 Star</option>
                  <option value={4}>4 Star</option>
                  <option value={3}>3 Star</option>
                  <option value={2}>2 Star</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Should we translate the reviews to English?
                </label>
                <select
                  value={translateToEnglish ? "yes" : "no"}
                  onChange={(e) => setTranslateToEnglish(e.target.value === "yes")}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Only import reviews with text?</label>
                <select
                  value={onlyWithText ? "yes" : "no"}
                  onChange={(e) => setOnlyWithText(e.target.value === "yes")}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            {isLoadingReviews ? (
              <div className="flex h-32 items-center justify-center">
                <Loader2 className="mr-2 h-6 w-6 animate-spin text-[#7c5cff]" />
                <span className="text-gray-600">Loading reviews...</span>
              </div>
            ) : reviews.length > 0 ? (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <button onClick={handleSelectAll} className="text-sm text-[#7c5cff] hover:underline">
                      {reviews.every((review) => review.selected) ? "Deselect All" : "Select All"}
                    </button>
                    <span className="ml-2 text-sm text-gray-500">
                      {selectedReviews.length} of {reviews.length} selected
                    </span>
                  </div>
                </div>

                <div className="mb-6 space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className={`rounded-lg border p-4 ${
                        review.selected ? "border-[#7c5cff] bg-[#f8f7ff]" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="mr-3">
                          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                            {review.reviewer.profile_picture && (
                              <Image
                                src={review.reviewer.profile_picture || "/placeholder.svg"}
                                alt={review.reviewer.name}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{review.reviewer.name}</h4>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={review.selected || false}
                                onChange={() => handleToggleReview(review.id)}
                                className="h-4 w-4 rounded border-gray-300 text-[#7c5cff] focus:ring-[#7c5cff]"
                              />
                            </label>
                          </div>
                          <div className="mb-1 flex items-center">
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <svg
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="ml-1 text-xs text-gray-500">
                              {new Date(review.created_time).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{review.review_text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep("pages")}
                    className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    Back to Pages
                  </button>
                  <button
                    onClick={handleImportReviews}
                    disabled={isImporting || selectedReviews.length === 0}
                    className="rounded-md bg-[#7c5cff] px-6 py-2 text-white hover:bg-[#6a4ddb] disabled:opacity-50"
                  >
                    {isImporting ? (
                      <div className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Importing...</span>
                      </div>
                    ) : (
                      `Import ${selectedReviews.length} Reviews`
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center rounded-md border-2 border-dashed border-gray-300">
                <p className="text-gray-500">No reviews found with the selected criteria.</p>
              </div>
            )}
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-800">Reviews Imported Successfully!</h2>
            <p className="mb-6 text-center text-gray-600">
              {selectedReviews.length} reviews have been imported and are pending approval.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setStep("pages")
                  setSelectedReviews([])
                }}
                className="rounded-lg border border-[#7c5cff] bg-white px-4 py-2 text-[#7c5cff] hover:bg-[#f8f7ff]"
              >
                Import More Reviews
              </button>
              <button onClick={onClose} className="rounded-lg bg-[#7c5cff] px-4 py-2 text-white hover:bg-[#6a4ddb]">
                View All Testimonials
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
