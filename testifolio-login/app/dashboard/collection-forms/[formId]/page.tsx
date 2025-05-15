"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { ArrowLeft, Loader2 } from "lucide-react"

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
  responses_count: number
  created_at: string
}

export default function FormDetailsPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const formId = params.formId as string

  const [form, setForm] = useState<FormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("welcome")


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
    router.push("/dashboard/collection-forms")
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
    <DashboardLayout>
      <div className="p-6">
        {/* Back button and title */}
        <div className="mb-6">
          <button onClick={handleBackClick} className="mb-4 flex items-center text-[#7c5cff] hover:underline">
            <ArrowLeft className="mr-1 h-4 w-4" />
            <span>Back to Collection Forms</span>
          </button>

          {loading ? (
            <div className="h-8 w-64 animate-pulse rounded bg-gray-200"></div>
          ) : error ? (
            <h1 className="text-2xl font-bold text-gray-800">Form Details</h1>
          ) : (
            <h1 className="text-2xl font-bold text-gray-800">{form?.name || "Form Details"}</h1>
          )}
        </div>

        {loading ? (
          // Loading state
          <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white">
            <div className="flex flex-col items-center">
              <Loader2 className="mb-2 h-8 w-8 animate-spin text-[#7c5cff]" />
              <p className="text-gray-600">Loading form details...</p>
            </div>
          </div>
        ) : error ? (
          // Error state
          <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-gray-200 bg-white">
            <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600">
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
            <p className="mb-4 text-center text-gray-800">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-md bg-[#7c5cff] px-4 py-2 text-white hover:bg-[#6a4ddb]"
            >
              Try Again
            </button>
          </div>
        ) : form ? (
          // Form details
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
                        value={form.welcome_title}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Welcome Message</label>
                      <textarea
                        value={form.welcome_message}
                        rows={4}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                        readOnly
                      ></textarea>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Collection Type</label>
                      <input
                        type="text"
                        value={form.collection_type}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "testimonial" && (
                <div>
                  <h2 className="mb-4 text-lg font-medium text-gray-800">Testimonial Collection</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Testimonial Title</label>
                      <input
                        type="text"
                        value={form.testimonial_title}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Testimonial Message</label>
                      <textarea
                        value={form.testimonial_message}
                        rows={4}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                        readOnly
                      ></textarea>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={form.require_star_rating}
                        className="h-4 w-4 rounded border-gray-300 text-[#7c5cff] focus:ring-[#7c5cff]"
                        readOnly
                        disabled
                      />
                      <label className="ml-2 text-sm text-gray-700">Require star rating</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={form.include_guided_prompts}
                        className="h-4 w-4 rounded border-gray-300 text-[#7c5cff] focus:ring-[#7c5cff]"
                        readOnly
                        disabled
                      />
                      <label className="ml-2 text-sm text-gray-700">Include guided prompts</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={form.allow_images}
                        className="h-4 w-4 rounded border-gray-300 text-[#7c5cff] focus:ring-[#7c5cff]"
                        readOnly
                        disabled
                      />
                      <label className="ml-2 text-sm text-gray-700">Allow image uploads</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={form.allow_ai_enhancement}
                        className="h-4 w-4 rounded border-gray-300 text-[#7c5cff] focus:ring-[#7c5cff]"
                        readOnly
                        disabled
                      />
                      <label className="ml-2 text-sm text-gray-700">Allow AI enhancement</label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "personal" && (
                <div>
                  <h2 className="mb-4 text-lg font-medium text-gray-800">Personal Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Personal Details Title</label>
                      <input
                        type="text"
                        value={form.personal_details_title}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Personal Details Message</label>
                      <textarea
                        value={form.personal_details_message}
                        rows={4}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                        readOnly
                      ></textarea>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={form.collect_job_title}
                        className="h-4 w-4 rounded border-gray-300 text-[#7c5cff] focus:ring-[#7c5cff]"
                        readOnly
                        disabled
                      />
                      <label className="ml-2 text-sm text-gray-700">Collect job title</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={form.collect_company}
                        className="h-4 w-4 rounded border-gray-300 text-[#7c5cff] focus:ring-[#7c5cff]"
                        readOnly
                        disabled
                      />
                      <label className="ml-2 text-sm text-gray-700">Collect company name</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={form.collect_website}
                        className="h-4 w-4 rounded border-gray-300 text-[#7c5cff] focus:ring-[#7c5cff]"
                        readOnly
                        disabled
                      />
                      <label className="ml-2 text-sm text-gray-700">Collect website</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={form.collect_profile_image}
                        className="h-4 w-4 rounded border-gray-300 text-[#7c5cff] focus:ring-[#7c5cff]"
                        readOnly
                        disabled
                      />
                      <label className="ml-2 text-sm text-gray-700">Collect profile image</label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "thank-you" && (
                <div>
                  <h2 className="mb-4 text-lg font-medium text-gray-800">Thank You Page</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Thank You Title</label>
                      <input
                        type="text"
                        value={form.thank_you_title}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Thank You Message</label>
                      <textarea
                        value={form.thank_you_message}
                        rows={4}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                        readOnly
                      ></textarea>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={form.include_call_to_action}
                        className="h-4 w-4 rounded border-gray-300 text-[#7c5cff] focus:ring-[#7c5cff]"
                        readOnly
                        disabled
                      />
                      <label className="ml-2 text-sm text-gray-700">Include call to action</label>
                    </div>
                    {form.include_call_to_action && (
                      <>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">CTA Text</label>
                          <input
                            type="text"
                            value={form.cta_text || ""}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">CTA URL</label>
                          <input
                            type="text"
                            value={form.cta_url || ""}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                            readOnly
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "design" && (
                <div>
                  <h2 className="mb-4 text-lg font-medium text-gray-800">Design Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Theme Color</label>
                      <div className="flex items-center">
                        <div
                          className="mr-2 h-6 w-6 rounded-full border border-gray-300"
                          style={{ backgroundColor: form.theme_color }}
                        ></div>
                        <input
                          type="text"
                          value={form.theme_color}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                          readOnly
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Background Color</label>
                      <div className="flex items-center">
                        <div
                          className="mr-2 h-6 w-6 rounded-full border border-gray-300"
                          style={{ backgroundColor: form.background_color }}
                        ></div>
                        <input
                          type="text"
                          value={form.background_color}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                          readOnly
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Font Family</label>
                      <input
                        type="text"
                        value={form.font_family}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Logo URL</label>
                      <input
                        type="text"
                        value={form.logo_url || "No logo uploaded"}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div>
                  <h2 className="mb-4 text-lg font-medium text-gray-800">General Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Form Name</label>
                      <input
                        type="text"
                        value={form.name}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        value={form.description || ""}
                        rows={4}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                        readOnly
                      ></textarea>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={form.is_active}
                        className="h-4 w-4 rounded border-gray-300 text-[#7c5cff] focus:ring-[#7c5cff]"
                        readOnly
                        disabled
                      />
                      <label className="ml-2 text-sm text-gray-700">Form is active</label>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Created On</label>
                      <input
                        type="text"
                        value={new Date(form.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Responses</label>
                      <input
                        type="text"
                        value={form.responses_count}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  )
}
