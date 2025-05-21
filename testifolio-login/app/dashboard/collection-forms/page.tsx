"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Code, Copy, Eye, FileText, Loader2, MoreVertical, Plus, Share2 } from "lucide-react"

import { useAuth } from "@/contexts/auth-context"
import { NewFormModal } from "@/components/forms/new-form-modal"
import { ShareFormModal } from "@/components/forms/share-form-modal"
import { EmbedFormModal } from "@/components/forms/embed-form-modal"
import { supabase } from "@/lib/supabase"

type Form = {
  id: string
  name: string
  responses_count: number
  created_at: string
  is_active: boolean
  collection_type?: string
}

export default function CollectionFormsPage() {
  const { user } = useAuth()
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showNewFormModal, setShowNewFormModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showEmbedModal, setShowEmbedModal] = useState(false)
  const [selectedForm, setSelectedForm] = useState<{ id: string; name: string } | null>(null)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    async function fetchForms() {
      if (!user) return

      // Check if we already have forms data and don't need to reload
      if (forms.length > 0 && !loading) return

      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from("collection_forms")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        setForms(data || [])
      } catch (err) {
        console.error("Error fetching forms:", err)
        setError("Failed to load forms. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchForms()

    // Set up real-time subscription
    const channel = supabase
      .channel("collection_forms_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "collection_forms",
          filter: `user_id=eq.${user?.id}`,
        },
        (payload) => {
          // Instead of re-fetching everything, update the forms array directly
          if (payload.eventType === "INSERT") {
            setForms((prev) => [payload.new as Form, ...prev])
          } else if (payload.eventType === "UPDATE") {
            setForms((prev) => prev.map((form) => (form.id === payload.new.id ? (payload.new as Form) : form)))
          } else if (payload.eventType === "DELETE") {
            setForms((prev) => prev.filter((form) => form.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, supabase])

  const handleShareClick = (form: { id: string; name: string }) => {
    setSelectedForm(form)
    setShowShareModal(true)
    setActiveMenuId(null)
  }

  const handleEmbedClick = (form: { id: string; name: string }) => {
    setSelectedForm(form)
    setShowEmbedModal(true)
    setActiveMenuId(null)
  }

  const handleCopyLink = (formId: string) => {
    const link = `${window.location.origin}/forms/${formId}`
    navigator.clipboard.writeText(link)
    alert("Form link copied to clipboard!")
    setActiveMenuId(null)
  }

  const handleDuplicateForm = async (form: Form) => {
    try {
      const { data, error } = await supabase
        .from("collection_forms")
        .insert({
          name: `${form.name} (Copy)`,
          user_id: user?.id,
          settings: form.settings,
          status: form.status,
        })
        .select()

      if (error) {
        console.error("Error duplicating form:", error)
        alert("Failed to duplicate form. Please try again.")
        return
      }

      alert("Form duplicated successfully!")
    } catch (err) {
      console.error("Error duplicating form:", err)
      alert("Failed to duplicate form. Please try again.")
    } finally {
      setActiveMenuId(null)
    }
  }

  const handleDeleteForm = async (formId: string) => {
    if (!confirm("Are you sure you want to delete this form? This action cannot be undone.")) {
      return
    }

    try {
      const { error } = await supabase.from("collection_forms").delete().eq("id", formId)

      if (error) {
        console.error("Error deleting form:", error)
        alert("Failed to delete form. Please try again.")
        return
      }

      // Remove the form from the local state
      setForms(forms.filter((form) => form.id !== formId))
      alert("Form deleted successfully!")
    } catch (err) {
      console.error("Error deleting form:", err)
      alert("Failed to delete form. Please try again.")
    } finally {
      setActiveMenuId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const toggleMenu = (formId: string) => {
    if (activeMenuId === formId) {
      setActiveMenuId(null)
    } else {
      setActiveMenuId(formId)
    }
  }

  return (
    <div className="p-6 bg-[#f8f9fe]">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm mb-4">
        <Link href="/dashboard" className="text-[#6d7cff] flex items-center">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1"
          >
            <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
            <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
            <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
            <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span>Dashboard</span>
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">Collection Forms</span>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Collection Forms</h1>
      <p className="text-gray-600 mb-6">
        Easily collect AI-powered testimonials from your customers using a simple link.
      </p>

      {loading ? (
        // Loading state
        <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#6d7cff] mb-2" />
            <p className="text-gray-600">Loading your forms...</p>
          </div>
        </div>
      ) : error ? (
        // Error state
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
          <div className="text-red-600 bg-red-100 p-3 rounded-full mb-4">
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
          <p className="text-gray-800 text-center mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#6d7cff] text-white px-4 py-2 rounded-md hover:bg-[#5a69ff]"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          {/* Create Form Button */}
          <button
            onClick={() => setShowNewFormModal(true)}
            className="bg-gradient-to-r from-[#a5b4fc] to-[#818cf8] text-white px-6 py-3 rounded-lg mb-8 flex items-center justify-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            <span>Create a New Form</span>
          </button>

          {forms.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-6">
                <Image
                  src="/forms-and-documents.png"
                  alt="No forms"
                  width={200}
                  height={200}
                  className="h-auto w-auto"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No forms yet</h3>
              <p className="text-gray-600 text-center mb-6 max-w-md">
                Create your first form to start collecting testimonials from your customers.
              </p>
              <button
                onClick={() => setShowNewFormModal(true)}
                className="bg-[#6d7cff] text-white px-4 py-2 rounded-md hover:bg-[#5a69ff]"
              >
                <Plus className="h-4 w-4 inline-block mr-2" />
                <span>Create Your First Form</span>
              </button>
            </div>
          ) : (
            // Forms list
            <div className="space-y-4">
              {forms.map((form) => (
                <div
                  key={form.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-[#6d7cff] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        <div className="h-10 w-10 bg-[#f0eaff] rounded-md flex items-center justify-center">
                          <FileText className="h-5 w-5 text-[#6d7cff]" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{form.name}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="mr-2">{form.responses_count} responses</span>
                          <span className="text-gray-400">•</span>
                          <span className="ml-2">created on {formatDate(form.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      {isMobile ? (
                        <div className="relative" ref={menuRef}>
                          <button
                            onClick={() => toggleMenu(form.id)}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                          {activeMenuId === form.id && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                              <div className="py-1">
                                <button
                                  onClick={() => handleEmbedClick({ id: form.id, name: form.name })}
                                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-3 text-gray-500"
                                  >
                                    <path
                                      d="M9 15L3 9L9 3"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M15 3L21 9L15 15"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  Embed form
                                </button>
                                <button
                                  onClick={() => handleCopyLink(form.id)}
                                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-3 text-gray-500"
                                  >
                                    <path
                                      d="M13.7778 2.22222L10.2222 2.22222C8.99492 2.22222 8 3.21714 8 4.44444L8 19.5556C8 20.7829 8.99492 21.7778 10.2222 21.7778L17.7778 21.7778C19.0051 21.7778 20 20.7829 20 19.5556L20 8.44444M13.7778 2.22222L20 8.44444M13.7778 2.22222L13.7778 8.44444L20 8.44444"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M8 17.5L4.22222 17.5C2.99492 17.5 2 16.5051 2 15.2778L2 4.22222C2 2.99492 2.99492 2 4.22222 2L11.7778 2C13.0051 2 14 2.99492 14 4.22222L14 6"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  Copy form link
                                </button>
                                <button
                                  onClick={() => handleDuplicateForm(form)}
                                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-3 text-gray-500"
                                  >
                                    <path
                                      d="M16 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V16"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                    />
                                    <rect
                                      x="8"
                                      y="4"
                                      width="12"
                                      height="12"
                                      rx="2"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                    />
                                  </svg>
                                  Duplicate form
                                </button>
                                <button
                                  onClick={() => window.open(`/forms/${form.id}`, "_blank")}
                                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-3 text-gray-500"
                                  >
                                    <path
                                      d="M14 5L21 12M21 12L14 19M21 12H3"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  See live
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center">
                          {isMobile ? (
                            <div className="relative" ref={menuRef}>
                              <button
                                onClick={() => toggleMenu(form.id)}
                                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                              >
                                <MoreVertical className="h-5 w-5" />
                              </button>
                              {activeMenuId === form.id && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                  <div className="py-1">
                                    <button
                                      onClick={() => handleEmbedClick({ id: form.id, name: form.name })}
                                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      <Code className="h-4 w-4 mr-3 text-gray-500" />
                                      Embed form
                                    </button>
                                    <button
                                      onClick={() => handleCopyLink(form.id)}
                                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      <Share2 className="h-4 w-4 mr-3 text-gray-500" />
                                      Copy form link
                                    </button>
                                    <button
                                      onClick={() => handleDuplicateForm(form)}
                                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      <Copy className="h-4 w-4 mr-3 text-gray-500" />
                                      Duplicate form
                                    </button>
                                    <button
                                      onClick={() => window.open(`/forms/${form.id}`, "_blank")}
                                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      <Eye className="h-4 w-4 mr-3 text-gray-500" />
                                      See live
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => handleShareClick({ id: form.id, name: form.name })}
                                className="text-gray-500 hover:text-[#6d7cff] p-2"
                                title="Invite"
                              >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M16.6667 3.33334H3.33341C2.41294 3.33334 1.66675 4.07954 1.66675 5.00001V15C1.66675 15.9205 2.41294 16.6667 3.33341 16.6667H16.6667C17.5872 16.6667 18.3334 15.9205 18.3334 15V5.00001C18.3334 4.07954 17.5872 3.33334 16.6667 3.33334Z" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M18.3334 5.83334L10.8584 10.5833C10.6011 10.7445 10.3037 10.83 10.0001 10.83C9.69648 10.83 9.39902 10.7445 9.14175 10.5833L1.66675 5.83334" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                              </button>
                              <button
                                onClick={() => handleEmbedClick({ id: form.id, name: form.name })}
                                className="text-gray-500 hover:text-[#6d7cff] p-2"
                                title="Embed code"
                              >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M15 13.3333L18.3333 9.99999L15 6.66666" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M5.00008 6.66666L1.66675 9.99999L5.00008 13.3333" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M12.0834 3.33334L7.91675 16.6667" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                              </button>
                              <button
                                onClick={() => handleShareClick({ id: form.id, name: form.name })}
                                className="text-gray-500 hover:text-[#6d7cff] p-2"
                                title="Copy link"
                              >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M15 6.66666C16.3807 6.66666 17.5 5.54737 17.5 4.16666C17.5 2.78594 16.3807 1.66666 15 1.66666C13.6193 1.66666 12.5 2.78594 12.5 4.16666C12.5 5.54737 13.6193 6.66666 15 6.66666Z" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M5 12.5C6.38071 12.5 7.5 11.3807 7.5 10C7.5 8.61929 6.38071 7.5 5 7.5C3.61929 7.5 2.5 8.61929 2.5 10C2.5 11.3807 3.61929 12.5 5 12.5Z" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M15 18.3333C16.3807 18.3333 17.5 17.2141 17.5 15.8333C17.5 14.4526 16.3807 13.3333 15 13.3333C13.6193 13.3333 12.5 14.4526 12.5 15.8333C12.5 17.2141 13.6193 18.3333 15 18.3333Z" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M7.15845 11.2583L12.8501 14.575" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M12.8418 5.42499L7.15845 8.74165" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                              </button>
                              <button
                                onClick={() => handleDuplicateForm(form)}
                                className="text-gray-500 hover:text-[#6d7cff] p-2"
                                title="Duplicate"
                              >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <g clip-path="url(#clip0_5017_1466)">
                                    <path d="M12.5 10V15" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M10 12.5H15" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M16.6667 6.66666H8.33341C7.41294 6.66666 6.66675 7.41285 6.66675 8.33332V16.6667C6.66675 17.5871 7.41294 18.3333 8.33341 18.3333H16.6667C17.5872 18.3333 18.3334 17.5871 18.3334 16.6667V8.33332C18.3334 7.41285 17.5872 6.66666 16.6667 6.66666Z" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M3.33341 13.3333C2.41675 13.3333 1.66675 12.5833 1.66675 11.6667V3.33332C1.66675 2.41666 2.41675 1.66666 3.33341 1.66666H11.6667C12.5834 1.66666 13.3334 2.41666 13.3334 3.33332" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_5017_1466">
                                      <rect width="20" height="20" fill="white" />
                                    </clipPath>
                                  </defs>
                                </svg>

                              </button>
                              <Link
                                href={`/dashboard/collection-forms/${form.id}`}
                                className="text-gray-500 hover:text-[#6d7cff] p-2"
                                title="Edit"
                              >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12.5 2.5H17.5V7.5" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M8.33325 11.6667L17.4999 2.5" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M15 10.8333V15.8333C15 16.2754 14.8244 16.6993 14.5118 17.0118C14.1993 17.3244 13.7754 17.5 13.3333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V6.66667C2.5 6.22464 2.67559 5.80072 2.98816 5.48816C3.30072 5.17559 3.72464 5 4.16667 5H9.16667" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                              </Link>
                              <button
                                onClick={() => window.open(`/forms/${form.id}`, "_blank")}
                                className="text-gray-500 hover:text-[#6d7cff] p-2"
                                title="See live"
                              >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <g clip-path="url(#clip0_5017_1475)">
                                    <path d="M17.645 5.67667C18.0856 5.23619 18.3332 4.63872 18.3333 4.01571C18.3333 3.3927 18.0859 2.79518 17.6454 2.35459C17.205 1.91399 16.6075 1.66643 15.9845 1.66635C15.3615 1.66627 14.764 1.91369 14.3234 2.35417L3.20169 13.4783C3.00821 13.6713 2.86512 13.9088 2.78503 14.17L1.68419 17.7967C1.66266 17.8687 1.66103 17.9453 1.67949 18.0182C1.69794 18.0911 1.73579 18.1577 1.78902 18.2108C1.84225 18.264 1.90888 18.3017 1.98183 18.3201C2.05477 18.3384 2.13133 18.3367 2.20336 18.315L5.83086 17.215C6.09183 17.1356 6.32934 16.9934 6.52253 16.8008L17.645 5.67667Z" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M12.5 4.16666L15.8333 7.49999" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_5017_1475">
                                      <rect width="20" height="20" fill="white" />
                                    </clipPath>
                                  </defs>
                                </svg>

                              </button>
                              <button
                                onClick={() => handleDeleteForm(form.id)}
                                className="text-gray-500 hover:text-red-500 p-2"
                                title="Delete"
                              >
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M4 7H20"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M10 11V17"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M14 11V17"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M5 7L6 19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19L19 7"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M9 7V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V7"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <NewFormModal isOpen={showNewFormModal} onClose={() => setShowNewFormModal(false)} />
      <ShareFormModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        formId={selectedForm?.id}
        formName={selectedForm?.name}
      />
      <EmbedFormModal isOpen={showEmbedModal} onClose={() => setShowEmbedModal(false)} formId={selectedForm?.id} />
    </div>
  )
}
