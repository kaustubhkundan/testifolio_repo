"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, CheckCircle2, Loader2, Search, X } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { GoogleService } from "@/lib/services/google-service"
import { createClient } from "@supabase/supabase-js"

interface GoogleLocation {
  name: string
  locationName: string
  address: string
  reviewCount: number
  rating: number
  id: string
}

interface GoogleReview {
  name: string
  reviewId: string
  reviewer: {
    displayName: string
    profilePhotoUrl?: string
  }
  starRating: number
  comment: string
  createTime: string
  updateTime: string
  selected?: boolean
}

interface GoogleImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImportSuccess: () => void
}

const supabaseUrl = "https://your-supabase-url.supabase.co"
const supabaseKey = "your-supabase-key"
const supabase = createClient(supabaseUrl, supabaseKey)

export function GoogleImportModal({ isOpen, onClose, onImportSuccess }: GoogleImportModalProps) {
  const { user } = useAuth()
  const [step, setStep] = useState<"integration-pending" | "auth" | "search" | "location" | "reviews" | "success">(
    "integration-pending",
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [locations, setLocations] = useState<GoogleLocation[]>([])
  const [selectedLocation, setSelectedLocation] = useState<GoogleLocation | null>(null)
  const [reviews, setReviews] = useState<GoogleReview[]>([])
  const [selectedReviews, setSelectedReviews] = useState<GoogleReview[]>([])
  const [isLoadingReviews, setIsLoadingReviews] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [minRating, setMinRating] = useState(5)
  const [translateToEnglish, setTranslateToEnglish] = useState(true)
  const [onlyWithText, setOnlyWithText] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

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

      // Check if user has Google integration
      const { data, error } = await supabase
        .from("user_integrations")
        .select("access_token, expires_at")
        .eq("user_id", user.id)
        .eq("provider", "google")
        .single()

      if (error || !data) {
        setIsAuthenticated(false)
        setStep("integration-pending")
        return
      }

      // Check if token is still valid
      if (new Date(data.expires_at) <= new Date()) {
        setIsAuthenticated(false)
        setStep("integration-pending")
        return
      }

      setIsAuthenticated(true)
      setStep("search")
    } catch (err) {
      console.error("Error checking Google authentication:", err)
      setIsAuthenticated(false)
      setStep("integration-pending")
    } finally {
      setIsCheckingAuth(false)
    }
  }

  const handleGoogleAuth = () => {
    const authUrl = GoogleService.getAuthUrl()
    window.open(authUrl, "_blank", "width=500,height=600")

    // Listen for auth completion
    const checkAuth = setInterval(async () => {
      try {
        const { data } = await supabase
          .from("user_integrations")
          .select("access_token")
          .eq("user_id", user?.id)
          .eq("provider", "google")
          .single()

        if (data?.access_token) {
          clearInterval(checkAuth)
          setIsAuthenticated(true)
          setStep("search")
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
    setSearchQuery("")
    setLocations([])
    setSelectedLocation(null)
    setReviews([])
    setSelectedReviews([])
    setError(null)
  }

  useEffect(() => {
    if (isOpen) {
      if (isAuthenticated) {
        setStep("search")
      } else {
        resetModal()
      }
    }
  }, [isOpen, isAuthenticated])

  const handleSearch = async () => {
    if (!user || !searchQuery.trim()) return

    try {
      setIsSearching(true)
      setError(null)

      const locations = await GoogleService.getLocations(user.id)

      // Filter locations based on search query
      const filteredLocations =
        locations.locations?.filter(
          (location: any) =>
            location.locationName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            location.title?.toLowerCase().includes(searchQuery.toLowerCase()),
        ) || []

      const formattedLocations: GoogleLocation[] = filteredLocations.map((location: any) => ({
        name: location.title || location.locationName,
        locationName: location.locationName || location.title,
        address: location.storefrontAddress?.addressLines?.join(", ") || "Address not available",
        reviewCount: location.metadata?.reviewCount || 0,
        rating: location.metadata?.averageRating || 0,
        id: location.name,
      }))

      setLocations(formattedLocations)
      setStep("location")
    } catch (err) {
      console.error("Error searching for locations:", err)
      setError("Failed to search for locations. Please make sure you have access to Google My Business and try again.")
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectLocation = async (location: GoogleLocation) => {
    if (!user) return

    try {
      setSelectedLocation(location)
      setIsLoadingReviews(true)
      setError(null)

      const reviewsData = await GoogleService.getReviews(user.id, location.id, {
        pageSize: 50,
        minRating: minRating,
      })

      const formattedReviews: GoogleReview[] =
        reviewsData.reviews?.map((review: any) => ({
          name: review.name,
          reviewId: review.reviewId || review.name,
          reviewer: {
            displayName: review.reviewer?.displayName || "Anonymous",
            profilePhotoUrl: review.reviewer?.profilePhotoUrl,
          },
          starRating: review.starRating || 5,
          comment: review.comment || "",
          createTime: review.createTime,
          updateTime: review.updateTime,
        })) || []

      // Filter reviews based on settings
      let filteredReviews = formattedReviews

      if (onlyWithText) {
        filteredReviews = filteredReviews.filter((review) => review.comment && review.comment.trim().length > 0)
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
      prevReviews.map((review) => (review.reviewId === reviewId ? { ...review, selected: !review.selected } : review)),
    )

    const review = reviews.find((r) => r.reviewId === reviewId)
    if (!review) return

    if (review.selected) {
      setSelectedReviews((prev) => prev.filter((r) => r.reviewId !== reviewId))
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

      await GoogleService.importReviews(user.id, selectedReviews)

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
          {step !== "auth" && step !== "search" && (
            <button
              onClick={() => setStep(step === "reviews" ? "location" : "search")}
              className="mb-4 flex items-center text-[#6d7cff] hover:underline"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span>{step === "reviews" ? "Choose a different location" : "Choose a different source"}</span>
            </button>
          )}

          <h2 className="text-2xl font-bold text-gray-800">
            {step === "integration-pending" && "Google Integration Required"}
            {step === "auth" && "Connect Google My Business"}
            {step === "search" && "Add Testimonials from Google"}
            {step === "location" && "Select Your Business"}
            {step === "reviews" && `Import Reviews from ${selectedLocation?.locationName}`}
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
            <h3 className="mb-4 text-xl font-semibold text-gray-800">Google Integration Required</h3>
            <p className="mb-6 text-gray-600">
              To import reviews from Google My Business, you need to connect your Google account first.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.open("/dashboard/settings", "_blank")}
                className="w-full rounded-md bg-[#4285F4] px-6 py-3 text-white hover:bg-[#3367D6] flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="white"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="white"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="white"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="white"
                  />
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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-12 w-12">
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
                </div>
                <h3 className="mb-4 text-xl font-semibold">Connect your Google My Business account</h3>
                <p className="mb-6 text-gray-600">
                  To import reviews from Google, you need to connect your Google My Business account. This allows us to
                  access your business locations and reviews.
                </p>
                <button
                  onClick={handleGoogleAuth}
                  className="rounded-md bg-[#4285F4] px-6 py-3 text-white hover:bg-[#3367D6] flex items-center gap-2 mx-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="white"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="white"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="white"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="white"
                    />
                  </svg>
                  Connect Google My Business
                </button>
              </div>
            )}
          </div>
        )}

        {step === "search" && (
          <div>
            <p className="mb-6 text-gray-600">Search for your business on Google to import reviews.</p>

            <div className="mb-6">
              <label htmlFor="business-search" className="mb-1 block text-sm font-medium text-gray-700">
                Type your business name as it appears on Google
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="business-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter your business name"
                  className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="rounded-md bg-[#7c5cff] px-6 py-2 text-white hover:bg-[#6a4ddb] disabled:opacity-50"
              >
                {isSearching ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Searching...</span>
                  </div>
                ) : (
                  "Search"
                )}
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center">
              <div className="text-sm text-blue-600">
                <span className="mr-1">Need help importing your Google reviews?</span>
                <a href="#" className="underline">
                  Here's a guide.
                </a>
              </div>
            </div>
          </div>
        )}

        {step === "location" && (
          <div>
            <p className="mb-6 text-gray-600">
              Here are the businesses found. Choose the relevant one and click "Select".
            </p>

            {locations.length > 0 ? (
              <div className="space-y-4">
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className="rounded-lg border border-gray-200 p-4 hover:border-[#7c5cff] hover:bg-[#f8f7ff]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-3 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
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
                        <div>
                          <h3 className="font-medium text-gray-900">{location.locationName}</h3>
                          <p className="text-sm text-gray-500">{location.address}</p>
                          <div className="mt-1 flex items-center">
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <svg
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(location.rating) ? "text-yellow-400" : "text-gray-300"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="ml-1 text-sm text-gray-500">
                              {location.rating} ({location.reviewCount} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSelectLocation(location)}
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
                <p className="text-gray-500">No locations found. Try a different search term.</p>
              </div>
            )}
          </div>
        )}

        {step === "reviews" && selectedLocation && (
          <div>
            <div className="mb-6 flex items-center">
              <div className="mr-3 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
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
              <div>
                <h3 className="font-medium text-gray-900">{selectedLocation.locationName}</h3>
                <p className="text-sm text-gray-500">{selectedLocation.address}</p>
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
                  <option value="yes">Yes, show in English</option>
                  <option value="no">No, show in original language</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Would you like to fetch empty reviews as well?
                </label>
                <select
                  value={onlyWithText ? "only" : "all"}
                  onChange={(e) => setOnlyWithText(e.target.value === "only")}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                >
                  <option value="only">Only ones with text</option>
                  <option value="all">All reviews</option>
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
                      key={review.reviewId}
                      className={`rounded-lg border p-4 ${
                        review.selected ? "border-[#7c5cff] bg-[#f8f7ff]" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="mr-3">
                          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                            {review.reviewer.profilePhotoUrl && (
                              <Image
                                src={review.reviewer.profilePhotoUrl || "/placeholder.svg"}
                                alt={review.reviewer.displayName}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{review.reviewer.displayName}</h4>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={review.selected || false}
                                onChange={() => handleToggleReview(review.reviewId)}
                                className="h-4 w-4 rounded border-gray-300 text-[#7c5cff] focus:ring-[#7c5cff]"
                              />
                            </label>
                          </div>
                          <div className="mb-1 flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                className={`h-4 w-4 ${i < review.starRating ? "text-yellow-400" : "text-gray-300"}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="ml-1 text-xs text-gray-500">
                              {new Date(review.createTime).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep("location")}
                    className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    Back to Options
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
                  setStep("search")
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
