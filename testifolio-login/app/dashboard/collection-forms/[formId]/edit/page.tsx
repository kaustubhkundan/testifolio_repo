"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { ArrowLeft, Loader2, Save } from "lucide-react"

import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { supabase } from "@/lib/supabase"

type FormData = {
  id: string
  name: string
  description: string | null
  welcome_title: string
  welcome_message: string
  require_star_rating: boolean
  collection_type: string
  testimonial_title: string
  testimonial_message: string
  include_guided_prompts: boolean
  allow_images: boolean
  allow_ai_enhancement: boolean
  personal_details_title: string
  personal_details_message: string
  collect_job_title: boolean
  collect_company: boolean
  collect_website: boolean
  collect_profile_image: boolean
  thank_you_title: string
  thank_you_message: string
  include_call_to_action: boolean
  cta_text: string | null
  cta_url: string | null
  theme_color: string
  logo_url: string | null
  background_color: string
  font_family: string
  is_active: boolean
}

export default function EditFormPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const formId = params.formId as string

  const [form, setForm] = useState<FormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("welcome")
  const [successMessage, setSuccessMessage] = useState<string | null>(null)


  useEffect(() => {
    async function fetchFormDetails() {
      if (!user || !formId) return

      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase.from("collection_forms").select("*").eq("id", formId).single()

        if (error) {
          throw error
        }

        setForm(data)
      } catch (err) {
        console.error("Error fetching form details:", err)
        setError("Failed to load form details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchFormDetails()
  }, [user, formId, supabase])

  const handleBackClick = () => {
    router.push(`/dashboard/collection-forms/${formId}`)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (form) {
      setForm({
        ...form,
        [name]: value,
      })
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    if (form) {
      setForm({
        ...form,
        [name]: checked,
      })
    }
  }

  const handleSave = async () => {
    if (!user || !form) return

    try {
      setSaving(true)
      setError(null)
      setSuccessMessage(null)

      const { error } = await supabase
        .from("collection_forms")
        .update({
          name: form.name,
          description: form.description,
          welcome_title: form.welcome_title,
          welcome_message: form.welcome_message,
          require_star_rating: form.require_star_rating,
          collection_type: form.collection_type,
          testimonial_title: form.testimonial_title,
          testimonial_message: form.testimonial_message,
          include_guided_prompts: form.include_guided_prompts,
          allow_images: form.allow_images,
          allow_ai_enhancement: form.allow_ai_enhancement,
          personal_details_title: form.personal_details_title,
          personal_details_message: form.personal_details_message,
          collect_job_title: form.collect_job_title,
          collect_company: form.collect_company,
          collect_website: form.collect_website,
          collect_profile_image: form.collect_profile_image,
          thank_you_title: form.thank_you_title,
          thank_you_message: form.thank_you_message,
          include_call_to_action: form.include_call_to_action,
          cta_text: form.cta_text,
          cta_url: form.cta_url,
          theme_color: form.theme_color,
          logo_url: form.logo_url,
          background_color: form.background_color,
          font_family: form.font_family,
          is_active: form.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", formId)

      if (error) {
        throw error
      }

      setSuccessMessage("Form saved successfully!")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    } catch (err) {
      console.error("Error saving form:", err)
      setError("Failed to save form. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: "welcome", label: "Welcome" },
    { id: "testimonial", label: "Testimonial" },
    { id: "personal", label: "Personal Details" },
    { id: "thank-you", label: "Thank You" },
    { id: "design", label: "Design" },
    { id: "settings", label: "Settings" },
  ]

  return (
      <div className="p-6">
        {/* Back button and title */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <button onClick={handleBackClick} className="mb-4 flex items-center text-[#7c5cff] hover:underline">
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span>Back to Form Details</span>
            </button>

            {loading ? (
              <div className="h-8 w-64 animate-pulse rounded bg-gray-200"></div>
            ) : error ? (
              <h1 className="text-2xl font-bold text-gray-800">Edit Form</h1>
            ) : (
              <h1 className="text-2xl font-bold text-gray-800">Edit: {form?.name || "Form"}</h1>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={loading || saving}
            className="flex items-center rounded-md bg-[#7c5cff] px-4 py-2 text-white hover:bg-[#6a4ddb] disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>

        {successMessage && (
          <div className="mb-4 rounded-md bg-green-50 p-4 text-green-800">
            <p>{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-red-800">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          // Loading state
          <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white">
            <div className="flex flex-col items-center">
              <Loader2 className="mb-2 h-8 w-8 animate-spin text-[#7c5cff]" />
              <p className="text-gray-600">Loading form details...</p>
            </div>
          </div>
        ) : form ? (
          // Form editor
          <div className="rounded-lg border border-gray-200 bg-white">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-sm font-medium ${
                      activeTab === tab.id
                        ? "border-b-2 border-[#7c5cff] text-[#7c5cff]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="p-6">
              {activeTab === "welcome" && (
                <div>
                  <h2 className="mb-4 text-lg font-medium text-gray-800">Welcome Page</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Welcome Title</label>
                      <input
                        type="text"
                        name="welcome_title"
                        value={form.welcome_title}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Welcome Message</label>
                      <textarea
                        name="welcome_message"
                        value={form.welcome_message}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                      ></textarea>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Collection Type</label>
                      <select
                        name="collection_type"
                        value={form.collection_type}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                      >
                        <option value="Text and video testimonials">Text and video testimonials</option>
                        <option value="Text testimonials only">Text testimonials only</option>
                        <option value="Video testimonials only">Video testimonials only</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Other tabs content similar to the view page but with editable fields */}
              {/* ... */}
            </div>
          </div>
        ) : null}
      </div>
  )
}
