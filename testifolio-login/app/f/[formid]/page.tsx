"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2, Star } from "lucide-react"
import { supabase } from "@/lib/supabase"

type FormData = {
  id: string
  name: string
  welcome_title: string
  welcome_message: string
  require_star_rating: boolean
  collection_type: string
  testimonial_title: string
  testimonial_message: string
  personal_details_title: string
  personal_details_message: string
  thank_you_title: string
  thank_you_message: string
  include_call_to_action: boolean
  cta_text: string | null
  cta_url: string | null
  theme_color: string
  logo_url: string | null
  background_color: string
  font_family: string
}

export default function PublicFormPage() {
  const params = useParams()
  console.log("params===",params)
  const formId = params.formid as string

  const [form, setForm] = useState<FormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(1)
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
        console.log("formId===",formId)
      if (!formId) return

      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from("collection_forms")
          .select("*")
          .eq("id", formId)
          .eq("is_active", true)
          .single()


        if (error) {
          throw error
        }

        if (!data) {
          throw new Error("Form not found or inactive")
        }

        setForm(data)

        // Apply form styling
        if (data.background_color) {
          document.body.style.backgroundColor = data.background_color
        }

        if (data.font_family) {
          document.body.style.fontFamily = data.font_family
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
      document.body.style.backgroundColor = ""
      document.body.style.fontFamily = ""
    }
  }, [formId, supabase])

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

      // Move to thank you step
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="mb-2 h-8 w-8 animate-spin text-[#7c5cff]" />
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
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

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {/* Form logo if available */}
        {form.logo_url && (
          <div className="mb-6 flex justify-center">
            <Image
              src={form.logo_url || "/placeholder.svg"}
              alt="Company Logo"
              width={120}
              height={60}
              className="h-auto max-h-16 w-auto"
            />
          </div>
        )}

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold" style={{ color: form.theme_color }}>
              {form.welcome_title}
            </h1>
            <p className="mb-8 text-gray-600">{form.welcome_message}</p>

            <button
              onClick={() => setStep(2)}
              className="w-full rounded-md px-4 py-3 text-white"
              style={{ backgroundColor: form.theme_color }}
            >
              Get Started
            </button>
          </div>
        )}

        {/* Step 2: Testimonial */}
        {step === 2 && (
          <div>
            <h1 className="mb-4 text-xl font-bold" style={{ color: form.theme_color }}>
              {form.testimonial_title}
            </h1>
            <p className="mb-6 text-gray-600">{form.testimonial_message}</p>

            {form.require_star_rating && (
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Your Rating</label>
                <div className="flex items-center">
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

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">Your Testimonial</label>
              <textarea
                name="testimonial_text"
                value={formData.testimonial_text}
                onChange={handleInputChange}
                rows={6}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                placeholder="Share your experience..."
                required
              ></textarea>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.testimonial_text.trim()}
                className="rounded-md px-4 py-2 text-white disabled:opacity-50"
                style={{ backgroundColor: form.theme_color }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Personal Details */}
        {step === 3 && (
          <div>
            <h1 className="mb-4 text-xl font-bold" style={{ color: form.theme_color }}>
              {form.personal_details_title}
            </h1>
            <p className="mb-6 text-gray-600">{form.personal_details_message}</p>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Your Name *</label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Your Email *</label>
                <input
                  type="email"
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                  required
                />
              </div>

              {form.collect_company && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Company/Organization</label>
                  <input
                    type="text"
                    name="customer_company"
                    value={formData.customer_company}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                  />
                </div>
              )}

              {form.collect_job_title && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Job Title</label>
                  <input
                    type="text"
                    name="customer_job_title"
                    value={formData.customer_job_title}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                  />
                </div>
              )}

              {form.collect_website && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Website</label>
                  <input
                    type="url"
                    name="customer_website"
                    value={formData.customer_website}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                    placeholder="https://"
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
                <p>{error}</p>
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                disabled={submitting}
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !formData.customer_name || !formData.customer_email}
                className="rounded-md px-4 py-2 text-white disabled:opacity-50"
                style={{ backgroundColor: form.theme_color }}
              >
                {submitting ? (
                  <span className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Submit Testimonial"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Thank You */}
        {step === 4 && (
          <div className="text-center">
            <div className="mb-6 inline-flex rounded-full bg-green-100 p-3 text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mb-4 text-2xl font-bold" style={{ color: form.theme_color }}>
              {form.thank_you_title}
            </h1>
            <p className="mb-8 text-gray-600">{form.thank_you_message}</p>

            {form.include_call_to_action && form.cta_text && form.cta_url && (
              <a
                href={form.cta_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-md px-6 py-3 text-white"
                style={{ backgroundColor: form.theme_color }}
              >
                {form.cta_text}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
