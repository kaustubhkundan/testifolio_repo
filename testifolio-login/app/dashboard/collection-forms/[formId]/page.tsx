"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, Code, Copy, Eye, Loader2, Save, Share } from "lucide-react"
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
  const [isMobile, setIsMobile] = useState(false)

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

  // Check if mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

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

      alert("Form saved successfully!")
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

  // Mobile view
  if (isMobile) {
    return (
      <div className="flex h-screen">
        {/* Left sidebar with icons */}
        <div className="flex w-[60px] flex-col items-center border-r border-gray-200 bg-white py-4">
          <div className="mb-8 flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#6d7cff] text-white">
              <span className="text-xl font-bold">t</span>
            </div>
            <div className="mt-1 h-2 w-2 rounded-full bg-[#6d7cff]"></div>
          </div>

          <button
            onClick={() => handleTabChange("dashboard")}
            className={`mb-6 flex h-10 w-10 items-center justify-center rounded-md ${activeTab === "dashboard" ? "bg-[#f2f4ff] text-[#6d7cff]" : "text-gray-500 hover:bg-gray-100"}`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>

          <button
            onClick={() => handleTabChange("forms")}
            className={`mb-6 flex h-10 w-10 items-center justify-center rounded-md ${activeTab === "forms" ? "bg-[#f2f4ff] text-[#6d7cff]" : "text-gray-500 hover:bg-gray-100"}`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8 6H16M8 10H16M8 14H11M6 22H18C20.2091 22 22 20.2091 22 18V6C22 3.79086 20.2091 2 18 2H6C3.79086 2 2 3.79086 2 6V18C2 20.2091 3.79086 22 6 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            onClick={() => handleTabChange("design")}
            className={`mb-6 flex h-10 w-10 items-center justify-center rounded-md ${activeTab === "design" ? "bg-[#f2f4ff] text-[#6d7cff]" : "text-gray-500 hover:bg-gray-100"}`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 19L19 12L22 15L15 22L12 19Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18 13L16.5 5.5L2 2L5.5 16.5L13 18L18 13Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 2L9.5 9.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11 13C12.1046 13 13 12.1046 13 11C13 9.89543 12.1046 9 11 9C9.89543 9 9 9.89543 9 11C9 12.1046 9.89543 13 11 13Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            onClick={() => handleTabChange("analytics")}
            className={`mb-6 flex h-10 w-10 items-center justify-center rounded-md ${activeTab === "analytics" ? "bg-[#f2f4ff] text-[#6d7cff]" : "text-gray-500 hover:bg-gray-100"}`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 20V10M12 20V4M6 20V14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            onClick={() => handleTabChange("settings")}
            className={`mb-6 flex h-10 w-10 items-center justify-center rounded-md ${activeTab === "settings" ? "bg-[#f2f4ff] text-[#6d7cff]" : "text-gray-500 hover:bg-gray-100"}`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="border-b border-gray-200 p-4">
            <button
              onClick={() => router.push("/dashboard/collection-forms")}
              className="inline-flex items-center rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </button>
          </div>

          <div className="p-6">
            <h1 className="mb-2 text-2xl font-bold text-gray-800">Welcome 👋</h1>
            <p className="mb-6 text-gray-600">
              This welcome page of your form is where people choose their type of testimonial.
            </p>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Welcome Page Title</label>
                <input
                  type="text"
                  value={formSettings.welcomeTitle || ""}
                  onChange={(e) => handleSettingChange("welcomeTitle", e.target.value)}
                  placeholder="How would you like to leave your testimonial?"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Welcome Message</label>
                <textarea
                  value={formSettings.welcomeMessage || ""}
                  onChange={(e) => handleSettingChange("welcomeMessage", e.target.value)}
                  placeholder="Choose to either leave a video or written testimonial! 😊"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                  rows={4}
                />
              </div>

              <div>
                <div className="mb-2">
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
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#12b981] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                </label>
              </div>

              <div className="space-y-2">
                <div>
                  <h3 className="text-base font-medium text-gray-800">Collection Type</h3>
                  <p className="text-sm text-gray-500">Choose what type of testimonials you want to collect.</p>
                </div>
                <div className="relative">
                  <select
                    value={formSettings.collectionType || "Text and video testimonials"}
                    onChange={(e) => handleSettingChange("collectionType", e.target.value)}
                    className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                  >
                    <option>Text and video testimonials</option>
                    <option>Text testimonials only</option>
                    <option>Video testimonials only</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => alert("Previous section")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="h-2 flex-1 rounded-full bg-gray-200 mx-4">
                <div className="h-2 w-1/4 rounded-full bg-[#6d7cff]"></div>
              </div>

              <button
                onClick={() => alert("Next section")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Desktop view (unchanged)
  return (
    <div className="flex h-screen flex-col">
      {/* Top Navigation */}
      <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4">
        <div className="flex items-center">
          <Link href="/dashboard/collection-forms"   className="inline-flex items-center gap-2 rounded-full border border-gray-400 px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:border-gray-600 transition-colors mr-2">
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
              className={`mb-2 flex w-full items-center rounded-md px-3 py-2 text-left ${activeTab === "welcome" ? "bg-[#f0eaff] text-[#7c5cff]" : "text-gray-700 hover:bg-gray-100"
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
              className={`mb-2 flex w-full items-center rounded-md px-3 py-2 text-left ${activeTab === "testimonial" ? "bg-[#f0eaff] text-[#7c5cff]" : "text-gray-700 hover:bg-gray-100"
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
              className={`mb-2 flex w-full items-center rounded-md px-3 py-2 text-left ${activeTab === "personal" ? "bg-[#f0eaff] text-[#7c5cff]" : "text-gray-700 hover:bg-gray-100"
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
              className={`mb-2 flex w-full items-center rounded-md px-3 py-2 text-left ${activeTab === "thankyou" ? "bg-[#f0eaff] text-[#7c5cff]" : "text-gray-700 hover:bg-gray-100"
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
              className={`mb-2 flex w-full items-center rounded-md px-3 py-2 text-left ${activeTab === "design" ? "bg-[#f0eaff] text-[#7c5cff]" : "text-gray-700 hover:bg-gray-100"
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
              className={`mb-2 flex w-full items-center rounded-md px-3 py-2 text-left ${activeTab === "settings" ? "bg-[#f0eaff] text-[#7c5cff]" : "text-gray-700 hover:bg-gray-100"
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

        {/* Right Preview Panel - Added based on screenshots */}
        <div className="hidden md:block w-[650px] bg-[#f2f4ff] p-6 border-l border-gray-200 overflow-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
            <div className="flex justify-center mb-6">
              <div className="bg-gray-100 rounded-lg p-4 w-32 h-16 flex items-center justify-center">
                <span className="text-gray-400 text-sm">YOUR LOGO</span>
              </div>
            </div>

            {activeTab === "welcome" && (
              <div className="text-center">
                <h2 className="text-xl font-bold mb-4">
                  {formSettings.welcomeTitle || "How would you like to leave your testimonial?"}
                </h2>
                <p className="text-gray-600 mb-8">
                  {formSettings.welcomeMessage || "Choose to either leave a video or written testimonial! 😊"}
                </p>

                {formSettings.requireStarRating && (
                  <div className="flex justify-center mb-8">
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className="w-8 h-8 text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <button className="w-full bg-[#6d7cff] text-white py-3 px-4 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Record a Video
                  </button>
                  <button className="w-full bg-[#2d3340] text-white py-3 px-4 rounded-md">Write a Testimonial</button>
                </div>
              </div>
            )}

            {activeTab === "testimonial" && (
              <div className="text-center">
                <h2 className="text-xl font-bold mb-4">
                  {formSettings.testimonialTitle || "Share your experience with us!"}
                </h2>
                <p className="text-gray-600 mb-6">
                  {formSettings.testimonialMessage ||
                    "We'd really appreciate hearing your thoughts on your recent experience with our product, what you like about it, and why you'd recommend it. It means a lot to us!"}
                </p>

                <div className="bg-[#f3f4f6] rounded-lg p-4 mb-6">
                  <textarea
                    className="w-full bg-transparent border-none resize-none focus:ring-0 text-gray-700 placeholder-gray-500"
                    rows={6}
                    placeholder="Type your feedback here..."
                  ></textarea>

                  {formSettings.includeGuidedPrompts && formSettings.guidedPrompts && (
                    <div className="mt-4 space-y-3 text-left">
                      <p className="text-sm text-gray-500">
                        {formSettings.guidedPrompts[0] || "What problem were you facing before?"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formSettings.guidedPrompts[1] || "How did our solution help?"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formSettings.guidedPrompts[2] || "What specific results did you notice?"}
                      </p>
                    </div>
                  )}
                </div>

                {formSettings.allowImages && (
                  <div className="mb-6 text-left">
                    <p className="text-sm font-medium text-gray-700 mb-2">Attach up to 3 image(s)</p>
                    <button className="flex items-center text-[#6d7cff] text-sm">
                      <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Attach and image
                    </button>
                  </div>
                )}

                {formSettings.allowAI && (
                  <div className="mb-6">
                    <button className="flex items-center justify-center w-full text-[#6d7cff] border border-[#6d7cff] rounded-md py-2 px-4">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Refine with AI
                    </button>
                  </div>
                )}

                <button className="w-full bg-[#6d7cff] text-white py-3 px-4 rounded-md">Submit</button>
              </div>
            )}

            {activeTab === "personal" && (
              <div>
                <h2 className="text-xl font-bold mb-4 text-center">
                  {formSettings.personalTitle || "One last thing! 😎"}
                </h2>
                <p className="text-gray-600 mb-6 text-center">
                  {formSettings.personalMessage ||
                    "We would love to know who's behind this feedback. Please fill in the details below."}
                </p>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  {formSettings.collectFields?.includes("jobTitle") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                      <input
                        type="text"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                        placeholder="Enter your job title"
                      />
                    </div>
                  )}

                  {formSettings.collectFields?.includes("company") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <input
                        type="text"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                        placeholder="Enter company name"
                      />
                    </div>
                  )}

                  {formSettings.collectFields?.includes("website") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                      <input
                        type="url"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                        placeholder="Enter website URL"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <button className="w-full bg-[#6d7cff] text-white py-3 px-4 rounded-md">Submit</button>
                </div>
              </div>
            )}

            {activeTab === "thankyou" && (
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-green-100 rounded-full p-4">
                    <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-4">
                  {formSettings.thankYouTitle || "Thanks so much! We value your feedback."}
                </h2>
                <p className="text-gray-600 mb-8">
                  {formSettings.thankYouMessage ||
                    "We are always appreciative of the people who take the time to leave feedback. Your words always help improve our service to make sure we deliver!"}
                </p>

                {formSettings.includeCTA && (
                  <button className="bg-[#6d7cff] text-white py-2 px-6 rounded-md">
                    {formSettings.ctaText || "Visit our website"}
                  </button>
                )}
              </div>
            )}

            {activeTab === "design" && (
              <div className="text-center">
                <h2 className="text-xl font-bold mb-4" style={{ color: formSettings.primaryColor || "#7c5cff" }}>
                  How would you like to leave us a testimonial?
                </h2>
                <p className="text-gray-600 mb-8">You can either write it out as text or record it as a video.</p>

                <div className="flex justify-center mb-8">
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-8 h-8"
                        style={{ color: star <= 3 ? formSettings.primaryColor || "#7c5cff" : "#e5e7eb" }}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    className="w-full py-3 px-4 rounded-md flex items-center justify-center text-white"
                    style={{ backgroundColor: formSettings.primaryColor || "#7c5cff" }}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Record a Video
                  </button>
                  <button className="w-full bg-[#2d3340] text-white py-3 px-4 rounded-md">Write a Testimonial</button>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="text-center">
                <h2 className="text-xl font-bold mb-4">How would you like to leave us a testimonial?</h2>
                <p className="text-gray-600 mb-8">You can either write it out as text or record it as a video.</p>

                <div className="space-y-4">
                  <button className="w-full bg-[#6d7cff] text-white py-3 px-4 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Record a Video
                  </button>
                  <button className="w-full bg-[#2d3340] text-white py-3 px-4 rounded-md">Write a Testimonial</button>
                </div>
              </div>
            )}
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">powered by</p>
            <div className="flex justify-center mt-1">
              <img src="/poweredby.svg"></img>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PreviewFormModal isOpen={showPreviewModal} onClose={() => setShowPreviewModal(false)} formId={formId} />
      <ShareFormModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} formId={formId} />
      <EmbedFormModal isOpen={showEmbedModal} onClose={() => setShowEmbedModal(false)} formId={formId} />
    </div>
  )
}
