"use client"

import { useState } from "react"
import { X, Copy, Check } from "lucide-react"

interface EmbedCodeModalProps {
  isOpen: boolean
  onClose: () => void
  config?: {
    layout?: string
    theme?: string
    primaryColor?: string
    showRating?: boolean
    showSource?: boolean
    showAvatar?: boolean
    maxItems?: number
    sortBy?: string
    minRating?: number
    borderRadius?: number
    padding?: number
    font?: string
  }
}

export function EmbedCodeModal({ isOpen, onClose, config = {} }: EmbedCodeModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  // Default embed code without customization parameters
  const embedCode = `<iframe src="${typeof window !== "undefined" ? window.location.origin : ""}/embed/testimonials" width="100%" height="500px" frameborder="0"></iframe>`

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
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
