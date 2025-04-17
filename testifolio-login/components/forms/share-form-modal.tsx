"use client"

import { useState } from "react"
import Image from "next/image"
import { Facebook, Linkedin, Twitter, PhoneIcon as WhatsApp, X } from "lucide-react"

interface ShareFormModalProps {
  isOpen: boolean
  onClose: () => void
  formId?: string
  formName?: string
}

export function ShareFormModal({
  isOpen,
  onClose,
  formId = "abc123",
  formName = "Testimonial Form",
}: ShareFormModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const formLink = `https://testifolio.com/f/${formId}`

  const handleCopy = () => {
    navigator.clipboard.writeText(formLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadQR = () => {
    // In a real implementation, this would download the QR code
    alert("QR code download functionality would be implemented here")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {/* Close button */}
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-6 text-xl font-bold text-gray-800">Share Form Link</h2>

        {/* Social Media Sharing */}
        <div className="mb-6 flex justify-center space-x-4">
          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0f4f9] text-[#25D366] hover:bg-[#e4eaf2]">
            <WhatsApp className="h-6 w-6" />
          </button>
          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0f4f9] text-[#0077B5] hover:bg-[#e4eaf2]">
            <Linkedin className="h-6 w-6" />
          </button>
          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0f4f9] text-[#1DA1F2] hover:bg-[#e4eaf2]">
            <Twitter className="h-6 w-6" />
          </button>
          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0f4f9] text-[#1877F2] hover:bg-[#e4eaf2]">
            <Facebook className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-4 text-center text-sm text-gray-500">OR</div>

        {/* Magic Link */}
        <div className="mb-6 rounded-lg border border-gray-200 p-4">
          <h3 className="mb-3 text-center text-base font-medium text-gray-700">Share Magic Link</h3>
          <div className="flex">
            <input
              type="text"
              value={formLink}
              readOnly
              className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 text-sm focus:border-[#7c5cff] focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="flex items-center rounded-r-md bg-[#0077ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#0066dd]"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="mb-4 text-center text-sm text-gray-500">OR</div>

        {/* QR Code */}
        <div className="mb-6 rounded-lg border border-gray-200 p-4">
          <h3 className="mb-2 text-center text-base font-medium text-gray-700">Here is your QR Code</h3>
          <p className="mb-4 text-center text-sm text-gray-500">Download and share this QR Code to collect feedback</p>

          <div className="flex justify-center">
            <div className="h-40 w-40 bg-white p-2">
              <Image src="/qr-code-placeholder.png" alt="QR Code" width={150} height={150} className="h-full w-full" />
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <button
              onClick={handleDownloadQR}
              className="rounded-md bg-[#0077ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#0066dd]"
            >
              Download QR Code
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
