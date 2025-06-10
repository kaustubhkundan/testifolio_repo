"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface AIRefinementModalProps {
  isOpen: boolean
  onClose: () => void
  originalText: string
  onSelectVersion: (text: string) => void
}

export function AIRefinementModal({ isOpen, onClose, originalText, onSelectVersion }: AIRefinementModalProps) {
  const [selectedVersion, setSelectedVersion] = useState<"original" | "polished" | "emotional">("polished")

  if (!isOpen) return null

  const versions = {
    original: {
      title: "Your Original",
      text: originalText,
      icon: "📄",
      description: "",
    },
    polished: {
      title: "Polished",
      text: "Testifolio streamlined the feedback process for my clients, offering a clean dashboard and effortless sharing for all my testimonials.",
      icon: "✨",
      description: "Clearer, more professional version",
    },
    emotional: {
      title: "Emotional",
      text: "Using Testifolio was such a relief! My clients found it simple, and now I'm proud to show off their feedback. It's made a real difference.",
      icon: "💖",
      description: "Adds warmth and human tone",
    },
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-800">Refine Your Testimonial with AI</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-gray-600 mb-6 text-center">
          We've created improved versions of your feedback. Choose the one that fits best.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Object.entries(versions).map(([key, version]) => (
            <div
              key={key}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                selectedVersion === key
                  ? key === "polished"
                    ? "border-blue-400 bg-blue-50"
                    : key === "emotional"
                      ? "border-pink-400 bg-pink-50"
                      : "border-gray-400 bg-gray-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedVersion(key as any)}
            >
              <div className="flex items-center mb-3">
                <span className="text-lg mr-2">{version.icon}</span>
                <h3 className="font-semibold text-gray-800">{version.title}</h3>
              </div>

              <p className="text-gray-700 text-sm mb-4 leading-relaxed">{version.text}</p>

              {version.description && (
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {version.description}
                </div>
              )}

              {selectedVersion === key && (
                <button
                  className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
                    key === "polished"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : key === "emotional"
                        ? "bg-pink-600 hover:bg-pink-700"
                        : "bg-gray-600 hover:bg-gray-700"
                  }`}
                  onClick={() => {
                    onSelectVersion(version.text)
                    onClose()
                  }}
                >
                  Use this version
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <button onClick={onClose} className="text-blue-600 hover:text-blue-700 font-medium">
            Keep my original
          </button>
        </div>
      </div>
    </div>
  )
}
