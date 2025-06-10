"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Star, Video, ImageIcon, Sparkles } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { VideoRecorder } from "@/components/video-recorder"
import { AIRefinementModal } from "@/components/ai-refinement-modal"

type FormSettings = {
  welcomeTitle?: string
  welcomeMessage?: string
  requireStarRating?: boolean
  collectionType?: string
  testimonialTitle?: string
  testimonialMessage?: string
  includeGuidedPrompts?: boolean
  guidedPrompts?: string[]
  allowImages?: boolean
  allowAI?: boolean
  personalTitle?: string
  personalMessage?: string
  collectFields?: string[]
  thankYouTitle?: string
  thankYouMessage?: string
  ratingBasedThankYou?: boolean
  theme?: string
  primaryColor?: string
  fontFamily?: string
  customLogo?: boolean
  customBackground?: boolean
  formStatus?: boolean
  emailNotifications?: boolean
  autoApprove?: boolean
  gdprCompliance?: boolean
  includeCTA?: boolean
  ctaText?: string
  ctaUrl?: string
  [key: string]: any
}

type FormData = {
  id: string
  name: string
  created_at: string
  updated_at: string
  user_id: string
  settings: FormSettings
  status: string
}

export default function PublicFormPage() {
  const params = useParams()
  const formId = params.formid as string

  const [form, setForm] = useState<FormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const [isVideoMode, setIsVideoMode] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_company: "",
    customer_job_title: "",
    customer_website: "",
    testimonial_text: "",
    rating: 5,
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchFormDetails() {
      if (!formId) return

      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase.from("collection_forms").select("*").eq("id", formId).single()

        if (error) {
          throw error
        }

        if (!data) {
          throw new Error("Form not found or inactive")
        }

        console.log("Form data:", data)
        setForm(data)

        // Apply background based on customBackground setting
        if (data.settings?.customBackground) {
          document.body.style.background = "linear-gradient(90deg, #3A4EFF 0%, #F77CFF 100%)"
        } else {
          document.body.style.background = "linear-gradient(90deg, #3A4EFF 0%, #F77CFF 100%)"
        }

        document.body.style.minHeight = "100vh"
        document.body.style.margin = "0"
        document.body.style.padding = "0"

        // Apply font family if specified
        if (data.settings?.fontFamily) {
          document.body.style.fontFamily = data.settings.fontFamily
        }
      } catch (err) {
        console.log("Error fetching form:", err)
        setError("This form is not available. It may have been removed or deactivated.")
      } finally {
        setLoading(false)
      }
    }

    fetchFormDetails()

    // Cleanup
    return () => {
      document.body.style.background = ""
      document.body.style.minHeight = ""
      document.body.style.margin = ""
      document.body.style.padding = ""
      document.body.style.fontFamily = ""
    }
  }, [formId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleRatingChange = (rating: number) => {
    setFormData({
      ...formData,
      rating,
    })
  }

  const handleSubmit = async () => {
    if (!form) return

    try {
      setSubmitting(true)
      setError(null)

      const { error } = await supabase.from("form_responses").insert([
        {
          form_id: form.id,
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_company: formData.customer_company,
          customer_job_title: formData.customer_job_title,
          customer_website: formData.customer_website,
          testimonial_text: formData.testimonial_text,
          rating: formData.rating,
          status: "Pending",
        },
      ])

      if (error) {
        throw error
      }

      setStep(4)
    } catch (err) {
      console.error("Error submitting form:", err)
      setError("Failed to submit your testimonial. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: "linear-gradient(90deg, #3A4EFF 0%, #F77CFF 100%)" }}
      >
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
          <p className="text-white">Loading form...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="flex min-h-screen items-center justify-center p-4"
        style={{ background: "linear-gradient(90deg, #3A4EFF 0%, #F77CFF 100%)" }}
      >
        <div className="max-w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow-lg">
          <div className="mb-4 inline-flex rounded-full bg-red-100 p-3 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
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
          <h2 className="mb-2 text-xl font-bold">Form Not Available</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!form) {
    return null
  }

  const settings = form.settings || {}
  const primaryColor = settings.primaryColor || "#7c5cff"
  const showVideoOption = settings.collectionType?.includes("video") !== false
  const showTextOption = settings.collectionType?.includes("Text") !== false

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{
        background: "linear-gradient(90deg, #3A4EFF 0%, #F77CFF 100%)",
        minHeight: "100vh",
      }}
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        {/* Video Recording Mode */}
        {isVideoMode && step === 2 && (
          <VideoRecorder
            onBack={() => setIsVideoMode(false)}
            onVideoRecorded={(blob) => {
              console.log("Video recorded:", blob)
              setIsVideoMode(false)
              setStep(3)
            }}
          />
        )}

        {/* Regular Form Steps */}
        {!isVideoMode && (
          <>
            {/* Form logo */}
            <div className="mb-6 flex justify-center">
              <div className="bg-gray-100 rounded-lg p-4 w-32 h-16 flex items-center justify-center">
                <span className="text-gray-400 text-sm">YOUR LOGO</span>
              </div>
            </div>

            {/* Step 1: Welcome */}
            {step === 1 && (
              <div className="text-center">
                <h1 className="mb-4 text-2xl font-bold text-gray-800">
                  {settings.welcomeTitle || "How would you like to leave your testimonial?"}
                </h1>
                <p className="mb-8 text-gray-600">
                  {settings.welcomeMessage || "Choose to either leave a video or written testimonial! 😊"}
                </p>

                {settings.requireStarRating && (
                  <div className="flex justify-center mb-8">
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => handleRatingChange(star)} className="p-1">
                          <Star
                            className={`h-8 w-8 ${
                              formData.rating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {showVideoOption && (
                    <button
                      onClick={() => {
                        setIsVideoMode(true)
                        setStep(2)
                      }}
                      className="w-full text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Video className="w-5 h-5 mr-2" />
                      Record a Video
                    </button>
                  )}
                  {showTextOption && (
                    <button
                      onClick={() => setStep(2)}
                      className="w-full bg-gray-700 hover:bg-gray-800 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      Write a Testimonial
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Text Testimonial */}
            {step === 2 && (
              <div>
                <button onClick={() => setStep(1)} className="mb-4 flex items-center text-gray-600 hover:text-gray-800">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </button>

                <h1 className="mb-4 text-xl font-bold text-gray-800">
                  {settings.testimonialTitle || "Share your experience with us!"}
                </h1>
                <p className="mb-6 text-gray-600">
                  {settings.testimonialMessage ||
                    "We'd really appreciate hearing your thoughts on your recent experience with our product, what you like about it, and why you'd recommend it. It means a lot to us!"}
                </p>

                <div className="mb-6">
                  <textarea
                    name="testimonial_text"
                    value={formData.testimonial_text}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full rounded-lg border-2 border-blue-200 px-4 py-3 focus:border-blue-400 focus:outline-none resize-none"
                    placeholder={
                      settings.includeGuidedPrompts && settings.guidedPrompts
                        ? `Type your feedback here...\n\n${settings.guidedPrompts.join("\n")}`
                        : "Type your feedback here..."
                    }
                    required
                  />
                </div>

                {settings.allowImages && (
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">Attach up to 3 image(s)</p>
                    <div className="flex gap-3">
                      <button className="flex items-center text-gray-600 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
                        <ImageIcon className="w-5 h-5 mr-2" />
                        Attach an image
                      </button>
                      {settings.allowAI && (
                        <button
                          onClick={() => setShowAIModal(true)}
                          className="flex items-center text-blue-600 border border-blue-300 rounded-lg px-4 py-2 hover:bg-blue-50"
                        >
                          <Sparkles className="w-5 h-5 mr-2" />
                          Refine with AI
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.testimonial_text.trim()}
                  className="w-full text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: primaryColor }}
                >
                  Submit
                </button>
              </div>
            )}

            {/* Step 3: Personal Details */}
            {step === 3 && (
              <div>
                <h1 className="mb-4 text-2xl font-bold text-center text-gray-800">
                  {settings.personalTitle || "One last thing! 😎"}
                </h1>
                <p className="mb-6 text-gray-600 text-center">
                  {settings.personalMessage ||
                    "We would love to know who's behind this feedback. Please fill in the details below."}
                </p>

                <div className="space-y-4">
                  {/* Always show name and email as they're required */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Full Name *</label>
                      <input
                        type="text"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-400 focus:outline-none"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Email *</label>
                      <input
                        type="email"
                        name="customer_email"
                        value={formData.customer_email}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-400 focus:outline-none"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  {/* Conditionally show other fields based on collectFields */}
                  {settings.collectFields?.includes("jobTitle") && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Job Title</label>
                      <input
                        type="text"
                        name="customer_job_title"
                        value={formData.customer_job_title}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-400 focus:outline-none"
                        placeholder="Enter your job title"
                      />
                    </div>
                  )}

                  {settings.collectFields?.includes("company") && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Company</label>
                      <input
                        type="text"
                        name="customer_company"
                        value={formData.customer_company}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-400 focus:outline-none"
                        placeholder="Enter company name"
                      />
                    </div>
                  )}

                  {settings.collectFields?.includes("website") && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Website</label>
                      <input
                        type="url"
                        name="customer_website"
                        value={formData.customer_website}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-400 focus:outline-none"
                        placeholder="Enter website URL"
                      />
                    </div>
                  )}
                </div>

                {settings.gdprCompliance && (
                  <p className="text-xs text-gray-500 text-center mt-4 mb-6">
                    By submitting this form, you agree to our Terms of Service and Privacy Policy, allowing us to store
                    and use your testimonial for marketing purposes.
                  </p>
                )}

                {error && (
                  <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
                    <p>{error}</p>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting || !formData.customer_name || !formData.customer_email}
                  className="w-full text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: primaryColor }}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </span>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            )}

            {/* Step 4: Thank You */}
            {step === 4 && (
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="bg-green-100 rounded-full p-6">
                    <div className="relative">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <h1 className="mb-4 text-2xl font-bold text-gray-800">
                  {settings.thankYouTitle || "Thanks so much! We value your feedback."}
                </h1>
                <p className="mb-8 text-gray-600">
                  {settings.thankYouMessage ||
                    "We are always appreciative of the people who take the time to leave feedback. Your words always help improve our service to make sure we deliver!"}
                </p>

                {settings.includeCTA && settings.ctaText && settings.ctaUrl && (
                  <a
                    href={settings.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {settings.ctaText}
                  </a>
                )}
              </div>
            )}
          </>
        )}

        {/* AI Refinement Modal */}
        {settings.allowAI && (
          <AIRefinementModal
            isOpen={showAIModal}
            onClose={() => setShowAIModal(false)}
            originalText={formData.testimonial_text}
            onSelectVersion={(text) => {
              setFormData((prev) => ({ ...prev, testimonial_text: text }))
            }}
          />
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-white text-sm opacity-80">powered by</p>
        <p className="text-white font-semibold">testifolio</p>
      </div>
    </div>
  )
}
