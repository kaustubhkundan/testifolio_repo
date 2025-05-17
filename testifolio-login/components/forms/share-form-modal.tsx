"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Facebook, Linkedin, Loader2, Twitter, PhoneIcon as WhatsApp, X } from "lucide-react"
import QRCode from "qrcode"

interface ShareFormModalProps {
  isOpen: boolean
  onClose: () => void
  formId?: string
  formName?: string
}

export function ShareFormModal({ isOpen, onClose, formId = "", formName = "Testimonial Form" }: ShareFormModalProps) {
  const [copied, setCopied] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)


  useEffect(() => {
    if (isOpen && formId) {
      generateQRCode()
    }
  }, [isOpen, formId])

  const generateQRCode = async () => {
    if (!formId) return

    try {
      setLoading(true)
      setError(null)

      // Generate QR code
      const formLink = `https://testifolio.com/f/${formId}`
      const qrDataUrl = await QRCode.toDataURL(formLink, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })

      setQrCodeUrl(qrDataUrl)
    } catch (err) {
      console.error("Error generating QR code:", err)
      setError("Failed to generate QR code")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const formLink = `https://testifolio-repo.vercel.app/f/${formId}`

  const handleCopy = () => {
    navigator.clipboard.writeText(formLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadQR = () => {
    if (!qrCodeUrl) return

    // Create a temporary link element
    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = `${formName.replace(/\s+/g, "-").toLowerCase()}-qr-code.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = (platform: string) => {
    let shareUrl = ""

    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`Check out my testimonial form: ${formLink}`)}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(formLink)}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Share your experience with ${formName}: ${formLink}`)}`
        break
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(formLink)}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer")
    }
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
          <button
            onClick={() => handleShare("whatsapp")}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0f4f9] text-[#25D366] hover:bg-[#e4eaf2]"
          >
            <WhatsApp className="h-6 w-6" />
          </button>
          <button
            onClick={() => handleShare("linkedin")}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0f4f9] text-[#0077B5] hover:bg-[#e4eaf2]"
          >
            <Linkedin className="h-6 w-6" />
          </button>
          <button
            onClick={() => handleShare("twitter")}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0f4f9] text-[#1DA1F2] hover:bg-[#e4eaf2]"
          >
            <Twitter className="h-6 w-6" />
          </button>
          <button
            onClick={() => handleShare("facebook")}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0f4f9] text-[#1877F2] hover:bg-[#e4eaf2]"
          >
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
              {loading ? (
                <div className="flex h-full w-full items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-[#7c5cff]" />
                </div>
              ) : error ? (
                <div className="flex h-full w-full flex-col items-center justify-center text-red-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mb-2 h-8 w-8"
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
                  <span className="text-xs">Failed to load</span>
                </div>
              ) : qrCodeUrl ? (
                <Image
                  src={qrCodeUrl || "/placeholder.svg"}
                  alt="QR Code"
                  width={150}
                  height={150}
                  className="h-full w-full"
                />
              ) : (
                <Image
                  src="/qr-code-placeholder.png"
                  alt="QR Code"
                  width={150}
                  height={150}
                  className="h-full w-full"
                />
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <button
              onClick={handleDownloadQR}
              disabled={loading || !qrCodeUrl}
              className="rounded-md bg-[#0077ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#0066dd] disabled:opacity-50"
            >
              Download QR Code
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
