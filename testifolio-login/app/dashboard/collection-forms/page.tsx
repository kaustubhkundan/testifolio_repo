"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Eye, FileText, Home, Pencil, Plus, Share2 } from "lucide-react"

import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { NewFormModal } from "@/components/forms/new-form-modal"
import { ShareFormModal } from "@/components/forms/share-form-modal"

export default function CollectionFormsPage() {
  const [showNewFormModal, setShowNewFormModal] = useState(false)
  const [showImportedCollection, setShowImportedCollection] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [selectedForm, setSelectedForm] = useState<{ id: string | number; name: string } | null>(null)

  const forms = [
    {
      id: 1,
      name: "Yoga Coaching Sessions",
      responses: 4,
      createdOn: "Mar 8, 2025",
      isActive: true,
    },
    {
      id: 2,
      name: "Video Testimonials",
      responses: "2.5k",
      createdOn: "",
      type: "Video Testimonials",
    },
    {
      id: 3,
      name: "Audio Testimonials",
      responses: "2.5k",
      createdOn: "",
      type: "Audio Testimonials",
    },
  ]

  const handleShareClick = (form: { id: string | number; name: string }) => {
    setSelectedForm(form)
    setShowShareModal(true)
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center text-sm">
          <Link href="/dashboard" className="flex items-center text-[#7c5cff]">
            <Home className="mr-1 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">Collection Forms</span>
        </div>

        {/* Page Title */}
        <h1 className="mb-2 text-2xl font-bold text-gray-800">Collection Forms</h1>
        <p className="mb-6 text-gray-600">
          Easily collect AI-powered testimonials from your customers using a simple link.
        </p>

        {showImportedCollection ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-6 flex justify-between">
              <button
                onClick={() => setShowImportedCollection(false)}
                className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span>Back to Forms</span>
              </button>
              <button
                onClick={() => setShowNewFormModal(true)}
                className="flex items-center gap-2 rounded-md bg-[#7c5cff] px-4 py-2 text-sm font-medium text-white hover:bg-[#6a4ddb]"
              >
                <Plus className="h-4 w-4" />
                <span>Create a New Form</span>
              </button>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    <th className="px-6 py-3">Form Name</th>
                    <th className="px-6 py-3">Responses</th>
                    <th className="px-6 py-3">Created On</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {forms.map((form) => (
                    <tr key={form.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-[#f0eaff]">
                            <FileText className="h-5 w-5 text-[#7c5cff]" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{form.name}</div>
                            {form.isActive && (
                              <div className="flex items-center">
                                <span className="mr-1.5 h-2 w-2 rounded-full bg-green-400"></span>
                                <span className="text-xs text-gray-500">Active</span>
                              </div>
                            )}
                            {form.type && <div className="text-xs text-gray-500">{form.type}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900">{form.responses}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-500">{form.createdOn}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex space-x-2">
                          <button className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                            <Eye className="h-5 w-5" />
                          </button>
                          <button className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleShareClick(form)}
                            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                          >
                            <Share2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Empty State Card */
          <div className="rounded-lg border border-gray-200 bg-white p-8">
            <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
              <div className="max-w-lg">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">Get even more testimonials! ✨</h2>
                <p className="mb-6 text-gray-600">
                  Create nice looking, shareable forms to let customers say some great things about you and your
                  business.
                </p>

                <div className="mb-6 space-y-2">
                  <div className="flex items-center">
                    <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-sm bg-green-500 text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">Create a form in 2 minutes</span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-sm bg-green-500 text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">Style it to match your brand</span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-sm bg-green-500 text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">Collect video & text testimonials with ease</span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-sm bg-green-500 text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">Share with a link or embed it on your site</span>
                  </div>
                </div>

                <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                  <button
                    onClick={() => setShowNewFormModal(true)}
                    className="flex items-center justify-center gap-2 rounded-md bg-[#7c5cff] px-4 py-2 text-white hover:bg-[#6a4ddb]"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create a New Form</span>
                  </button>

                  <button
                    onClick={() => setShowImportedCollection(true)}
                    className="flex items-center justify-center gap-2 rounded-md border border-[#7c5cff] bg-white px-4 py-2 text-[#7c5cff] hover:bg-[#f8f7ff]"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Imported Collection</span>
                  </button>
                </div>
              </div>

              <div className="flex-shrink-0">
                <Image
                  src="/hands-checklist.png"
                  alt="Collection form illustration"
                  width={300}
                  height={300}
                  className="h-auto w-auto"
                />
              </div>
            </div>
          </div>
        )}

        {/* New Form Modal */}
        <NewFormModal isOpen={showNewFormModal} onClose={() => setShowNewFormModal(false)} />

        {/* Share Form Modal */}
        <ShareFormModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          formId={selectedForm?.id.toString()}
          formName={selectedForm?.name}
        />
      </div>
    </DashboardLayout>
  )
}
