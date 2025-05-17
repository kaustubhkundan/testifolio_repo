"use client"

import { X } from "lucide-react"

interface PreviewFormModalProps {
  isOpen: boolean
  onClose: () => void
  formId?: string
  formName?: string
}

export function PreviewFormModal({
  isOpen,
  onClose,
  formId = "abc123",
  formName = "Testimonial Form",
}: PreviewFormModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative h-[90vh] w-full max-w-3xl rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-xl font-bold text-gray-800">Preview: {formName}</h2>
          <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="h-[calc(90vh-64px)] overflow-auto p-4">
          <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex justify-end">
              <div className="h-10 w-32 rounded bg-gray-100 text-center text-sm leading-10 text-gray-400">
                YOUR LOGO
              </div>
            </div>

            <div className="text-center">
              <h2 className="mb-4 text-2xl font-bold text-gray-800">Welcome 👋</h2>
              <p className="mb-6 text-gray-600">Choose to either leave a video or written testimonial! 😊</p>

              <div className="mb-6 flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="h-8 w-8 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    ></path>
                  </svg>
                ))}
              </div>

              <div className="space-y-3">
                <button className="w-full rounded-md bg-[#818cf8] py-3 text-center font-medium text-white">
                  🎥 Record a Video
                </button>
                <button className="w-full rounded-md bg-[#2d3748] py-3 text-center font-medium text-white">
                  Write a Testimonial
                </button>
              </div>
            </div>

            <div className="mt-8 text-center text-xs text-gray-400">
              powered by
              <span className="ml-1 font-semibold text-[#7c5cff]">testifolio</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
