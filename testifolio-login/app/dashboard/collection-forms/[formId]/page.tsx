"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Code, Copy, Eye, Loader2, Save, Share } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { PreviewFormModal } from "@/components/forms/preview-form-modal"
import { ShareFormModal } from "@/components/forms/share-form-modal"
import { EmbedFormModal } from "@/components/forms/embed-form-modal"

interface FormSettings {
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
  [key: string]: any
}

interface FormData {
  id: string
  name: string
  created_at: string
  updated_at: string
  user_id: string
  settings: FormSettings
  status: string
}

export default function FormEditorPage() {
  const params = useParams()
  const router = useRouter()
  const formId = params.formId as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<FormData | null>(null)
  const [activeTab, setActiveTab] = useState("welcome")
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showEmbedModal, setShowEmbedModal] = useState(false)

  // Form settings state
  const [formSettings, setFormSettings] = useState<FormSettings>({
    welcomeTitle: "Welcome 👋",
    welcomeMessage: "Choose to either leave a video or written testimonial! 😊",
    requireStarRating: true,
    collectionType: "Text and video testimonials",
    testimonialTitle: "Share your experience with us!",
    testimonialMessage:
      "We'd really appreciate hearing your thoughts on your recent experience with our product, what you like about it, and why you'd recommend it. It means a lot to us!",
    includeGuidedPrompts: true,
    guidedPrompts: [
      "What problem were you facing before?",
      "How did our solution help?",
      "What specific results did you notice?",
    ],
    allowImages: true,
    allowAI: true,
    personalTitle: "One last thing! 😎",
    personalMessage: "We would love to know who's behind this feedback. Please fill in the details below.",
    collectFields: ["fullName", "email", "jobTitle", "company", "website"],
    thankYouTitle: "Thanks so much! We value your feedback.",
    thankYouMessage:
      "We are always appreciative of the people who take the time to leave feedback. Your words always help improve our service to make sure we deliver!",
    ratingBasedThankYou: true,
    theme: "Default",
    primaryColor: "#7c5cff",
    fontFamily: "Inter",
    customLogo: false,
    customBackground: false,
    formStatus: true,
    emailNotifications: true,
    autoApprove: false,
    gdprCompliance: true,
  })

  // Fetch form data
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase.from("collection_forms").select("*").eq("id", formId).single()

        if (error) {
          console.error("Error fetching form:", error)
          return
        }

        if (data) {
          setFormData(data)
          // Initialize form settings from data
          if (data.settings) {
            setFormSettings((prev) => ({
              ...prev,
              ...data.settings,
            }))
          }
        }
      } catch (error) {
        console.error("Error fetching form:", error)
      } finally {
        setLoading(false)
      }
    }

    if (formId) {
      fetchFormData()
    }
  }, [formId])

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  // Handle form settings change
  const handleSettingChange = (key: string, value: any) => {
    setFormSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Save form changes
  const saveForm = async () => {
    if (!formData) return

    try {
      setSaving(true)
      const { error } = await supabase
        .from("collection_forms")
        .update({
          settings: formSettings,
          updated_at: new Date().toISOString(),
        })
        .eq("id", formId)

      if (error) {
        console.error("Error saving form:", error)
        return
      }

      // Update local form data
      setFormData((prev) => {
        if (!prev) return null
        return {
          ...prev,
          settings: formSettings,
          updated_at: new Date().toISOString(),
        }
      })
    } catch (error) {
      console.error("Error saving form:", error)
    } finally {
      setSaving(false)
    }
  }

  // Duplicate form
  const duplicateForm = async () => {
    if (!formData) return

    try {
      const { data, error } = await supabase
        .from("collection_forms")
        .insert({
          name: `${formData.name} (Copy)`,
          settings: formSettings,
          user_id: formData.user_id,
          status: formData.status,
        })
        .select()

      if (error) {
        console.error("Error duplicating form:", error)
        return
      }

      if (data && data[0]) {
        router.push(`/dashboard/collection-forms/${data[0].id}`)
      }
    } catch (error) {
      console.error("Error duplicating form:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#7c5cff]" />
        <span className="ml-2 text-gray-600">Loading form editor...</span>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Top Navigation */}
      <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4">
        <div className="flex items-center">
          <Link href="/dashboard/collection-forms" className="mr-4 flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>Your forms</span>
          </Link>
          <h1 className="text-lg font-medium text-gray-800">{formData?.name || "Form Editor"}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEmbedModal(true)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Code className="mr-1 inline-block h-4 w-4" />
            <span>Embed Form</span>
          </button>
          <button
            onClick={duplicateForm}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Copy className="mr-1 inline-block h-4 w-4" />
            <span>Duplicate</span>
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Share className="mr-1 inline-block h-4 w-4" />
            <span>Share</span>
          </button>
          <button
            onClick={() => setShowPreviewModal(true)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Eye className="mr-1 inline-block h-4 w-4" />
            <span>View</span>
          </button>
          <button
            onClick={saveForm}
            disabled={saving}
            className="rounded-md bg-gray-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-70"
          >
            {saving ? (
              <>
                <Loader2 className="mr-1 inline-block h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="mr-1 inline-block h-4 w-4" />
                <span>Save</span>
              </>
            )}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Form Navigation */}
        <div className="w-60 border-r border-gray-200 bg-white">
          <div className="p-4">
            <button
              className={`mb-2 flex w-full items-center rounded-md px-3 py-2 text-left ${
                activeTab === "welcome" ? "bg-[#f0eaff] text-[#7c5cff]" : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => handleTabChange("welcome")}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill={activeTab === "welcome" ? "#f0eaff" : "#f5f5f5"} />
                <path
                  d="M12 6v12M6 12h12"
                  stroke={activeTab === "welcome" ? "#7c5cff" : "#666"}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>Welcome</span>
            </button>
            <button
              className={`mb-2 flex w-full items-center rounded-md px-3 py-2 text-left ${
                activeTab === "testimonial" ? "bg-[#f0eaff] text-[#7c5cff]" : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => handleTabChange("testimonial")}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill={activeTab === "testimonial" ? "#f0eaff" : "#f5f5f5"} />
                <path
                  d="M8 10h8M8 14h4"
                  stroke={activeTab === "testimonial" ? "#7c5cff" : "#666"}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>Testimonial</span>
            </button>
            <button
              className={`mb-2 flex w-full items-center rounded-md px-3 py-2 text-left ${
                activeTab === "personal" ? "bg-[#f0eaff] text-[#7c5cff]" : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => handleTabChange("personal")}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill={activeTab === "personal" ? "#f0eaff" : "#f5f5f5"} />
                <circle cx="12" cy="10" r="3" stroke={activeTab === "personal" ? "#7c5cff" : "#666"} strokeWidth="2" />
                <path
                  d="M7 18c0-2.76 2.24-5 5-5s5 2.24 5 5"
                  stroke={activeTab === "personal" ? "#7c5cff" : "#666"}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>Personal Details</span>
            </button>
            <button
              className={`mb-2 flex w-full items-center rounded-md px-3 py-2 text-left ${
                activeTab === "thankyou" ? "bg-[#f0eaff] text-[#7c5cff]" : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => handleTabChange("thankyou")}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill={activeTab === "thankyou" ? "#f0eaff" : "#f5f5f5"} />
                <path
                  d="M9 12l2 2 4-4"
                  stroke={activeTab === "thankyou" ? "#7c5cff" : "#666"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Thank You</span>
            </button>
            <button
              className={`mb-2 flex w-full items-center rounded-md px-3 py-2 text-left ${
                activeTab === "design" ? "bg-[#f0eaff] text-[#7c5cff]" : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => handleTabChange("design")}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill={activeTab === "design" ? "#f0eaff" : "#f5f5f5"} />
                <path
                  d="M12 6v12M6 12h12"
                  stroke={activeTab === "design" ? "#7c5cff" : "#666"}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>Design Settings</span>
            </button>
            <button
              className={`mb-2 flex w-full items-center rounded-md px-3 py-2 text-left ${
                activeTab === "settings" ? "bg-[#f0eaff] text-[#7c5cff]" : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => handleTabChange("settings")}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill={activeTab === "settings" ? "#f0eaff" : "#f5f5f5"} />
                <path
                  d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                  stroke={activeTab === "settings" ? "#7c5cff" : "#666"}
                  strokeWidth="2"
                />
                <path
                  d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
                  stroke={activeTab === "settings" ? "#7c5cff" : "#666"}
                  strokeWidth="2"
                />
              </svg>
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Middle - Form Editor */}
        <div className="flex-1 overflow-auto bg-white p-6">
          {activeTab === "welcome" && (
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-800">Welcome 👋</h2>
              <p className="mb-6 text-gray-600">
                This welcome page of your form is where people choose their type of testimonial.
              </p>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Welcome Page Title</label>
                <input
                  type="text"
                  value={formSettings.welcomeTitle || ""}
                  onChange={(e) => handleSettingChange("welcomeTitle", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Welcome Message</label>
                <textarea
                  value={formSettings.welcomeMessage || ""}
                  onChange={(e) => handleSettingChange("welcomeMessage", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                  rows={4}
                />
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-800">Require Star Rating</h3>
                    <p className="text-sm text-gray-500">Toggle this option to show or hide star ratings</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={formSettings.requireStarRating || false}
                      onChange={(e) => handleSettingChange("requireStarRating", e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300"></div>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Collection Type</label>
                <div className="relative">
                  <select
                    value={formSettings.collectionType || "Text and video testimonials"}
                    onChange={(e) => handleSettingChange("collectionType", e.target.value)}
                    className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                  >
                    <option>Text and video testimonials</option>
                    <option>Text testimonials only</option>
                    <option>Video testimonials only</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "testimonial" && (
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-800">Testimonial ⭐</h2>
              <p className="mb-6 text-gray-600">
                This is where your customers write their feedback and rate your service.
              </p>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Testimonial Page Title</label>
                <input
                  type="text"
                  value={formSettings.testimonialTitle || ""}
                  onChange={(e) => handleSettingChange("testimonialTitle", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Your Custom Message</label>
                <textarea
                  value={formSettings.testimonialMessage || ""}
                  onChange={(e) => handleSettingChange("testimonialMessage", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                  rows={4}
                />
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-800">Include Guided Prompts</h3>
                    <p className="text-sm text-gray-500">Toggle this option to show or hide your prompt guides.</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={formSettings.includeGuidedPrompts || false}
                      onChange={(e) => handleSettingChange("includeGuidedPrompts", e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300"></div>
                  </label>
                </div>
              </div>

              {formSettings.includeGuidedPrompts && formSettings.guidedPrompts && (
                <>
                  <div className="mb-6">
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">What problem were you facing before?</label>
                      <span className="text-xs text-gray-500">{formSettings.guidedPrompts[0]?.length || 0}/100</span>
                    </div>
                    <input
                      type="text"
                      value={formSettings.guidedPrompts[0] || ""}
                      onChange={(e) => {
                        const newPrompts = [...(formSettings.guidedPrompts || [])]
                        newPrompts[0] = e.target.value
                        handleSettingChange("guidedPrompts", newPrompts)
                      }}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                      maxLength={100}
                    />
                  </div>

                  <div className="mb-6">
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">How did our solution help?</label>
                      <span className="text-xs text-gray-500">{formSettings.guidedPrompts[1]?.length || 0}/100</span>
                    </div>
                    <input
                      type="text"
                      value={formSettings.guidedPrompts[1] || ""}
                      onChange={(e) => {
                        const newPrompts = [...(formSettings.guidedPrompts || [])]
                        newPrompts[1] = e.target.value
                        handleSettingChange("guidedPrompts", newPrompts)
                      }}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                      maxLength={100}
                    />
                  </div>

                  <div className="mb-6">
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">What specific results did you notice?</label>
                      <span className="text-xs text-gray-500">{formSettings.guidedPrompts[2]?.length || 0}/100</span>
                    </div>
                    <input
                      type="text"
                      value={formSettings.guidedPrompts[2] || ""}
                      onChange={(e) => {
                        const newPrompts = [...(formSettings.guidedPrompts || [])]
                        newPrompts[2] = e.target.value
                        handleSettingChange("guidedPrompts", newPrompts)
                      }}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                      maxLength={100}
                    />
                  </div>
                </>
              )}

              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-800">Allow Uploading Images</h3>
                    <p className="text-sm text-gray-500">Let customers include up to 3 images</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={formSettings.allowImages || false}
                      onChange={(e) => handleSettingChange("allowImages", e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300"></div>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div>
                      <h3 className="text-base font-medium text-gray-800">Allow AI Enhancement</h3>
                      <p className="text-sm text-gray-500">
                        Let customers refine their feedback with AI for better testimonials.
                      </p>
                    </div>
                    <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                      New
                    </span>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={formSettings.allowAI || false}
                      onChange={(e) => handleSettingChange("allowAI", e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "personal" && (
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-800">Personal Details</h2>
              <p className="mb-6 text-gray-600">Collect relevant information from your customers and clients.</p>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Page Title</label>
                <input
                  type="text"
                  value={formSettings.personalTitle || ""}
                  onChange={(e) => handleSettingChange("personalTitle", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Page Message</label>
                <textarea
                  value={formSettings.personalMessage || ""}
                  onChange={(e) => handleSettingChange("personalMessage", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                  rows={4}
                />
              </div>

              <div className="mb-6">
                <h3 className="mb-4 text-lg font-medium text-gray-800">What to collect?</h3>
                <p className="mb-4 text-sm text-gray-600">By default, full name and email are required.</p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="mr-3 h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 12a5 5 0 100-10 5 5 0 000 10z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M3 20.4v.6h18v-.6c0-2.24 0-3.36-.436-4.216a4 4 0 00-1.748-1.748C17.96 14 16.84 14 14.6 14H9.4c-2.24 0-3.36 0-4.216.436a4 4 0 00-1.748 1.748C3 17.04 3 18.16 3 20.4z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div>
                        <span className="font-medium">Full Name</span>
                        <span className="ml-2 rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">Required</span>
                      </div>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" defaultChecked disabled className="peer sr-only" />
                      <div className="peer h-6 w-11 rounded-full bg-green-500 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:translate-x-full after:rounded-full after:border after:border-white after:bg-white after:transition-all after:content-['']"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="mr-3 h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div>
                        <span className="font-medium">Email</span>
                        <span className="ml-2 rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">Required</span>
                      </div>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" defaultChecked disabled className="peer sr-only" />
                      <div className="peer h-6 w-11 rounded-full bg-green-500 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:translate-x-full after:rounded-full after:border after:border-white after:bg-white after:transition-all after:content-['']"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="mr-3 h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M21 13V8a2 2 0 00-2-2H5a2 2 0 00-2 2v5m18 0v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5m18 0h-5.5a1 1 0 00-.8.4l-1.5 2a1 1 0 01-.8.4h-2.8a1 1 0 01-.8-.4l-1.5-2a1 1 0 00-.8-.4H3"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="font-medium">Job Title</span>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={formSettings.collectFields?.includes("jobTitle") || false}
                        onChange={(e) => {
                          const fields = [...(formSettings.collectFields || [])]
                          if (e.target.checked) {
                            if (!fields.includes("jobTitle")) fields.push("jobTitle")
                          } else {
                            const index = fields.indexOf("jobTitle")
                            if (index !== -1) fields.splice(index, 1)
                          }
                          handleSettingChange("collectFields", fields)
                        }}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="mr-3 h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-2-8h-6m6 4h-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="font-medium">Company Name</span>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={formSettings.collectFields?.includes("company") || false}
                        onChange={(e) => {
                          const fields = [...(formSettings.collectFields || [])]
                          if (e.target.checked) {
                            if (!fields.includes("company")) fields.push("company")
                          } else {
                            const index = fields.indexOf("company")
                            if (index !== -1) fields.splice(index, 1)
                          }
                          handleSettingChange("collectFields", fields)
                        }}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="mr-3 h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none">
                        <path d="M3 5h18M3 12h18M3 19h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      <span className="font-medium">Website</span>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={formSettings.collectFields?.includes("website") || false}
                        onChange={(e) => {
                          const fields = [...(formSettings.collectFields || [])]
                          if (e.target.checked) {
                            if (!fields.includes("website")) fields.push("website")
                          } else {
                            const index = fields.indexOf("website")
                            if (index !== -1) fields.splice(index, 1)
                          }
                          handleSettingChange("collectFields", fields)
                        }}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="mr-3 h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="font-medium">Profile Image</span>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={formSettings.collectFields?.includes("profileImage") || false}
                        onChange={(e) => {
                          const fields = [...(formSettings.collectFields || [])]
                          if (e.target.checked) {
                            if (!fields.includes("profileImage")) fields.push("profileImage")
                          } else {
                            const index = fields.indexOf("profileImage")
                            if (index !== -1) fields.splice(index, 1)
                          }
                          handleSettingChange("collectFields", fields)
                        }}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "thankyou" && (
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-800">Thank you 😊</h2>
              <p className="mb-6 text-gray-600">
                This is the final page a user sees once they submit their testimonial
              </p>

              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-800">Rating based Thank you page</h3>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={formSettings.ratingBasedThankYou || false}
                      onChange={(e) => handleSettingChange("ratingBasedThankYou", e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300"></div>
                  </label>
                </div>
              </div>

              <div className="mb-6 flex gap-4">
                <button className="flex items-center gap-2 rounded-md border border-green-500 bg-white px-4 py-2 text-green-600 hover:bg-green-50">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Positive</span>
                </button>
                <button className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-600 hover:bg-gray-50">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 2h3a2 2 0 012 2v7a2 2 0 01-2 2h-3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Negative</span>
                </button>
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Page Title</label>
                <input
                  type="text"
                  value={formSettings.thankYouTitle || ""}
                  onChange={(e) => handleSettingChange("thankYouTitle", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Thank You Message</label>
                <textarea
                  value={formSettings.thankYouMessage || ""}
                  onChange={(e) => handleSettingChange("thankYouMessage", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                  rows={4}
                />
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-800">Call to Action</h3>
                    <p className="text-sm text-gray-500">
                      Include a call to action to navigate users to a website or other link.
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={formSettings.includeCTA || false}
                      onChange={(e) => handleSettingChange("includeCTA", e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300"></div>
                  </label>
                </div>
              </div>

              {formSettings.includeCTA && (
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">CTA Text</label>
                      <input
                        type="text"
                        value={formSettings.ctaText || "Visit our website"}
                        onChange={(e) => handleSettingChange("ctaText", e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">CTA URL</label>
                      <input
                        type="url"
                        value={formSettings.ctaUrl || "https://"}
                        onChange={(e) => handleSettingChange("ctaUrl", e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "design" && (
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-800">Design Settings</h2>
              <p className="mb-6 text-gray-600">Customize the look and feel of your testimonial form.</p>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Form Theme</label>
                <div className="relative">
                  <select
                    value={formSettings.theme || "Default"}
                    onChange={(e) => handleSettingChange("theme", e.target.value)}
                    className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                  >
                    <option>Default</option>
                    <option>Modern</option>
                    <option>Minimal</option>
                    <option>Bold</option>
                    <option>Professional</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Primary Color</label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={formSettings.primaryColor || "#7c5cff"}
                    onChange={(e) => handleSettingChange("primaryColor", e.target.value)}
                    className="h-10 w-10 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={formSettings.primaryColor || "#7c5cff"}
                    onChange={(e) => handleSettingChange("primaryColor", e.target.value)}
                    className="ml-2 w-32 rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Font Family</label>
                <div className="relative">
                  <select
                    value={formSettings.fontFamily || "Inter"}
                    onChange={(e) => handleSettingChange("fontFamily", e.target.value)}
                    className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                  >
                    <option>Inter (Default)</option>
                    <option>Roboto</option>
                    <option>Open Sans</option>
                    <option>Montserrat</option>
                    <option>Poppins</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-800">Custom Logo</h3>
                    <p className="text-sm text-gray-500">Upload your own logo to display on the form</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={formSettings.customLogo || false}
                      onChange={(e) => handleSettingChange("customLogo", e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300"></div>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-800">Custom Background</h3>
                    <p className="text-sm text-gray-500">Set a custom background color or image</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={formSettings.customBackground || false}
                      onChange={(e) => handleSettingChange("customBackground", e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-800">Settings</h2>
              <p className="mb-6 text-gray-600">Configure general settings for your testimonial form.</p>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Form Name</label>
                <input
                  type="text"
                  value={formData?.name || ""}
                  onChange={(e) => {
                    setFormData((prev) => {
                      if (!prev) return null
                      return { ...prev, name: e.target.value }
                    })
                  }}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                />
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-800">Form Status</h3>
                    <p className="text-sm text-gray-500">Enable or disable the form</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={formSettings.formStatus || false}
                      onChange={(e) => handleSettingChange("formStatus", e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300"></div>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-800">Email Notifications</h3>
                    <p className="text-sm text-gray-500">
                      Receive email notifications when a new testimonial is submitted
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={formSettings.emailNotifications || false}
                      onChange={(e) => handleSettingChange("emailNotifications", e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300"></div>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-800">Auto Approve</h3>
                    <p className="text-sm text-gray-500">Automatically approve all submitted testimonials</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={formSettings.autoApprove || false}
                      onChange={(e) => handleSettingChange("autoApprove", e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300"></div>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-800">GDPR Compliance</h3>
                    <p className="text-sm text-gray-500">Enable GDPR compliance features</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={formSettings.gdprCompliance || false}
                      onChange={(e) => handleSettingChange("gdprCompliance", e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <PreviewFormModal isOpen={showPreviewModal} onClose={() => setShowPreviewModal(false)} formId={formId} />
      <ShareFormModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} formId={formId} />
      <EmbedFormModal isOpen={showEmbedModal} onClose={() => setShowEmbedModal(false)} formId={formId} />
    </div>
  )
}
