"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface EmbedCodeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function EmbedCodeModal({ isOpen, onClose }: EmbedCodeModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const embedCode = `<iframe src="https://yourwebsite.com/wall-of-love" width="100%" height="500px" frameborder="0"></iframe>`

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-4 text-xl font-bold text-[#7c5cff]">Embed Wall of Love</h2>
        <p className="mb-6 text-gray-600">Copy and paste this code to display testimonials on your site.</p>

        <div className="mb-6 overflow-hidden rounded-md border border-gray-200 bg-gray-50 p-4">
          <pre className="text-sm text-gray-700">{embedCode}</pre>
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-2 rounded-md bg-[#7c5cff] px-4 py-2 text-sm font-medium text-white hover:bg-[#6a4ddb]"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
            <span>{copied ? "Copied!" : "Copy Code"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
