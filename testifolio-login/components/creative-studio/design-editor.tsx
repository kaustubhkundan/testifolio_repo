"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Download, ArrowLeft, Star, Check, Loader2 } from "lucide-react"
import type { BannerbearTemplate, BannerbearModification, BannerbearImageResponse } from "@/lib/bannerbear"
import type { Testimonial } from "@/hooks/use-testimonials"

interface DesignEditorProps {
  template: BannerbearTemplate
  testimonial: Testimonial | null
  onBack: () => void
}

export function DesignEditor({ template, testimonial, onBack }: DesignEditorProps) {
  const [activeTab, setActiveTab] = useState<"content" | "style" | "format">("content")
  const [modifications, setModifications] = useState<BannerbearModification[]>([])
  const [caption, setCaption] = useState("Check out this amazing feedback from our customer!")
  const [showRating, setShowRating] = useState(true)
  const [showSourceIcon, setShowSourceIcon] = useState(true)
  const [showAvatar, setShowAvatar] = useState(true)
  const [selectedFont, setSelectedFont] = useState("Poppins")
  const [selectedColor, setSelectedColor] = useState("#7c5cff")
  const [selectedFormat, setSelectedFormat] = useState<"square" | "story" | "wide">("square")
  const [transparent, setTransparent] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<BannerbearImageResponse | null>(null)
  const [generatedImages, setGeneratedImages] = useState<BannerbearImageResponse[]>([])
  const [error, setError] = useState<string | null>(null)
  const [previewKey, setPreviewKey] = useState(0) // Used to force re-render of preview

  // Color palette options
  const colorPalettes = [
    "#7c5cff", // Purple (default)
    "#1E88E5", // Blue
    "#00897B", // Teal
    "#FB8C00", // Orange
    "#C2185B", // Pink
    "#43A047", // Green
  ]

  // Font options
  const fontOptions = ["Poppins", "Inter", "Roboto", "Montserrat", "Open Sans", "Playfair Display"]

  // Update modifications whenever any setting changes
  const updateModifications = useCallback(() => {
    if (!testimonial) return

    const mods: BannerbearModification[] = [
      {
        name: "testimonial_text",
        text: testimonial.text,
      },
      {
        name: "customer_name",
        text: testimonial.name,
      },
      {
        name: "rating",
        hide: !showRating,
      },
      {
        name: "avatar",
        image_url: testimonial.avatar_url,
        hide: !showAvatar,
      },
      {
        name: "source_icon",
        hide: !showSourceIcon,
      },
      {
        name: "source_name",
        text: testimonial.source,
      },
      {
        name: "caption",
        text: caption,
      },
      {
        name: "primary_color",
        color: selectedColor,
      },
      {
        name: "font_family",
        text: selectedFont,
      },
      {
        name: "format",
        text: selectedFormat,
      },
    ]

    setModifications(mods)
    // Force preview to re-render
    setPreviewKey((prev) => prev + 1)
  }, [testimonial, showRating, showSourceIcon, showAvatar, caption, selectedColor, selectedFont, selectedFormat])

  // Update modifications when any setting changes
  useEffect(() => {
    updateModifications()
  }, [updateModifications])

  // Initialize caption when testimonial changes
  useEffect(() => {
    if (testimonial) {
      setCaption(`Check out this amazing feedback from ${testimonial.name}!`)
    }
  }, [testimonial])

  const handleGenerateImage = async () => {
    if (!testimonial) {
      setError("Please select a testimonial first")
      return
    }

    try {
      setIsGenerating(true)
      setError(null)

      // Make sure modifications are up to date
      updateModifications()

      const response = await fetch("/api/bannerbear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template_id: template.uid,
          modifications: modifications,
          transparent: transparent,
          metadata: {
            testimonial_id: testimonial.id,
            format: selectedFormat,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate image")
      }

      const data = await response.json()
      setGeneratedImage(data)
      setGeneratedImages((prev) => [data, ...prev])
    } catch (err) {
      console.error("Error generating image:", err)
      setError("Failed to generate image. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    if (!generatedImage?.image_url) return

    try {
      const response = await fetch(generatedImage.image_url)
      const blob = await response.blob()

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `testimonial-${new Date().getTime()}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Error downloading image:", err)
      setError("Failed to download image. Please try again.")
    }
  }

  const handleAutoGenerate = () => {
    if (!testimonial) return

    // Generate a caption based on the testimonial
    const captions = [
      `See why our customers love us! ${testimonial.name} had an amazing experience.`,
      `Don't just take our word for it - here's what ${testimonial.name} had to say!`,
      `Real feedback from real customers. Thanks for the kind words, ${testimonial.name}!`,
      `We're proud of the service we provide. Here's what ${testimonial.name} thinks!`,
      `Customer satisfaction is our top priority. See what ${testimonial.name} experienced!`,
    ]

    // Pick a random caption
    const randomCaption = captions[Math.floor(Math.random() * captions.length)]
    setCaption(randomCaption)
  }

  const handleSelectFromHistory = (image: BannerbearImageResponse) => {
    setGeneratedImage(image)
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#7c5cff] px-6 py-4 text-white">
        <button onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Templates</span>
        </button>
        <div className="text-center">
          <h2 className="font-medium">{template.name}</h2>
        </div>
        <button className="rounded-md bg-white px-4 py-2 text-sm font-medium text-[#7c5cff]">Save Template</button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Settings */}
        <div className="w-72 overflow-y-auto border-r border-gray-200 bg-white">
          <div className="p-4">
            <div className="mb-6">
              <div
                className={`mb-2 flex cursor-pointer items-center gap-2 ${activeTab === "content" ? "text-[#7c5cff]" : "text-gray-800"}`}
                onClick={() => setActiveTab("content")}
              >
                <svg
                  className={`h-5 w-5 ${activeTab === "content" ? "text-[#7c5cff]" : "text-gray-500"}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 5H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 7l9 6 9-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-medium">Content</span>
              </div>

              {activeTab === "content" && (
                <div className="ml-7 space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Caption</label>
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Add a caption for your testimonial..."
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                      rows={3}
                    />
                    <button
                      onClick={handleAutoGenerate}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-[#7c5cff] bg-opacity-10 px-4 py-2 text-sm font-medium text-[#7c5cff]"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 16l4-4m0 0l-4-4m4 4H8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Auto-Generate</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Show Rating</label>
                    <div
                      className="relative inline-block h-5 w-10 cursor-pointer rounded-full bg-gray-200"
                      onClick={() => setShowRating(!showRating)}
                    >
                      <input
                        type="checkbox"
                        className="peer absolute h-0 w-0 opacity-0"
                        checked={showRating}
                        onChange={() => {}} // Empty handler to avoid React warning
                      />
                      <span
                        className={`absolute left-0 top-0 h-5 w-5 rounded-full bg-white shadow-md transition-all ${
                          showRating ? "translate-x-5 bg-[#7c5cff]" : ""
                        }`}
                      ></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Show Source Icon</label>
                    <div
                      className="relative inline-block h-5 w-10 cursor-pointer rounded-full bg-gray-200"
                      onClick={() => setShowSourceIcon(!showSourceIcon)}
                    >
                      <input
                        type="checkbox"
                        className="peer absolute h-0 w-0 opacity-0"
                        checked={showSourceIcon}
                        onChange={() => {}} // Empty handler to avoid React warning
                      />
                      <span
                        className={`absolute left-0 top-0 h-5 w-5 rounded-full bg-white shadow-md transition-all ${
                          showSourceIcon ? "translate-x-5 bg-[#7c5cff]" : ""
                        }`}
                      ></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Show Avatar</label>
                    <div
                      className="relative inline-block h-5 w-10 cursor-pointer rounded-full bg-gray-200"
                      onClick={() => setShowAvatar(!showAvatar)}
                    >
                      <input
                        type="checkbox"
                        className="peer absolute h-0 w-0 opacity-0"
                        checked={showAvatar}
                        onChange={() => {}} // Empty handler to avoid React warning
                      />
                      <span
                        className={`absolute left-0 top-0 h-5 w-5 rounded-full bg-white shadow-md transition-all ${
                          showAvatar ? "translate-x-5 bg-[#7c5cff]" : ""
                        }`}
                      ></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Transparent Background</label>
                    <div
                      className="relative inline-block h-5 w-10 cursor-pointer rounded-full bg-gray-200"
                      onClick={() => setTransparent(!transparent)}
                    >
                      <input
                        type="checkbox"
                        className="peer absolute h-0 w-0 opacity-0"
                        checked={transparent}
                        onChange={() => {}} // Empty handler to avoid React warning
                      />
                      <span
                        className={`absolute left-0 top-0 h-5 w-5 rounded-full bg-white shadow-md transition-all ${
                          transparent ? "translate-x-5 bg-[#7c5cff]" : ""
                        }`}
                      ></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <div
                className={`mb-2 flex cursor-pointer items-center gap-2 ${activeTab === "style" ? "text-[#7c5cff]" : "text-gray-800"}`}
                onClick={() => setActiveTab("style")}
              >
                <svg
                  className={`h-5 w-5 ${activeTab === "style" ? "text-[#7c5cff]" : "text-gray-500"}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-medium">Style</span>
              </div>

              {activeTab === "style" && (
                <div className="ml-7 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Color Palette</label>
                    <div className="flex flex-wrap gap-2">
                      {colorPalettes.map((color) => (
                        <button
                          key={color}
                          className={`h-8 w-8 rounded-full ${selectedColor === color ? "ring-2 ring-offset-2 ring-[#7c5cff]" : ""}`}
                          style={{ backgroundColor: color }}
                          onClick={() => setSelectedColor(color)}
                        ></button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Font Style</label>
                    <div className="relative">
                      <select
                        value={selectedFont}
                        onChange={(e) => setSelectedFont(e.target.value)}
                        className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 text-sm focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                      >
                        {fontOptions.map((font) => (
                          <option key={font} value={font}>
                            {font}
                          </option>
                        ))}
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
            </div>

            <div className="mb-6">
              <div
                className={`mb-2 flex cursor-pointer items-center gap-2 ${activeTab === "format" ? "text-[#7c5cff]" : "text-gray-800"}`}
                onClick={() => setActiveTab("format")}
              >
                <svg
                  className={`h-5 w-5 ${activeTab === "format" ? "text-[#7c5cff]" : "text-gray-500"}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 21V8a3 3 0 013-3h10a3 3 0 013 3v13m0-13H4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-medium">Format</span>
              </div>

              {activeTab === "format" && (
                <div className="ml-7 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Choose Format</label>
                    <div className="flex justify-between">
                      <button
                        className={`flex flex-col items-center ${
                          selectedFormat === "square" ? "text-[#7c5cff]" : "text-gray-500"
                        }`}
                        onClick={() => setSelectedFormat("square")}
                      >
                        <div
                          className={`mb-2 flex h-12 w-12 items-center justify-center rounded-md ${
                            selectedFormat === "square" ? "bg-[#7c5cff]" : "bg-gray-100"
                          }`}
                        >
                          <div
                            className={`h-6 w-6 rounded-sm ${selectedFormat === "square" ? "bg-white" : "bg-gray-400"}`}
                          ></div>
                        </div>
                        <span className="text-xs">Square</span>
                      </button>

                      <button
                        className={`flex flex-col items-center ${
                          selectedFormat === "story" ? "text-[#7c5cff]" : "text-gray-500"
                        }`}
                        onClick={() => setSelectedFormat("story")}
                      >
                        <div
                          className={`mb-2 flex h-12 w-12 items-center justify-center rounded-md ${
                            selectedFormat === "story" ? "bg-[#7c5cff]" : "bg-gray-100"
                          }`}
                        >
                          <div
                            className={`h-8 w-4 rounded-sm ${selectedFormat === "story" ? "bg-white" : "bg-gray-400"}`}
                          ></div>
                        </div>
                        <span className="text-xs">Story</span>
                      </button>

                      <button
                        className={`flex flex-col items-center ${
                          selectedFormat === "wide" ? "text-[#7c5cff]" : "text-gray-500"
                        }`}
                        onClick={() => setSelectedFormat("wide")}
                      >
                        <div
                          className={`mb-2 flex h-12 w-12 items-center justify-center rounded-md ${
                            selectedFormat === "wide" ? "bg-[#7c5cff]" : "bg-gray-100"
                          }`}
                        >
                          <div
                            className={`h-4 w-8 rounded-sm ${selectedFormat === "wide" ? "bg-white" : "bg-gray-400"}`}
                          ></div>
                        </div>
                        <span className="text-xs">Wide</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle Panel - Preview */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <div className="mx-auto max-w-md">
            <h2 className="mb-4 text-lg font-medium text-gray-800">Preview</h2>

            {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-500">{error}</div>}

            <div className="mb-6 overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
              {generatedImage?.image_url ? (
                <div className="relative aspect-square w-full">
                  <Image
                    src={generatedImage.image_url || "/placeholder.svg?height=400&width=400&query=testimonial"}
                    alt="Generated testimonial"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div key={previewKey} className="aspect-square w-full p-6">
                  {testimonial ? (
                    <div className="flex h-full flex-col items-center justify-center">
                      <div className="mb-4 flex flex-col items-center">
                        {showAvatar && (
                          <div className="mb-2 h-16 w-16 overflow-hidden rounded-full bg-gray-200">
                            <Image
                              src={testimonial.avatar_url || "/placeholder.svg?height=64&width=64&query=avatar"}
                              alt={testimonial.name}
                              width={64}
                              height={64}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <h3 className="text-lg font-medium">{testimonial.name}</h3>
                        {showRating && (
                          <div className="mt-1 flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-center text-gray-600">{testimonial.text}</p>
                      {showSourceIcon && (
                        <div className="mt-4 flex items-center">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                            <span className="text-xs font-medium">{testimonial.source.charAt(0)}</span>
                          </div>
                          <span className="ml-1 text-sm text-gray-500">{testimonial.source}</span>
                        </div>
                      )}
                      {caption && <div className="mt-4 text-center text-sm text-gray-500">{caption}</div>}
                    </div>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-gray-400">
                      <p>Select a testimonial to preview</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleDownload}
                disabled={!generatedImage?.image_url}
                className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium ${
                  generatedImage?.image_url
                    ? "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>

              <button
                onClick={handleGenerateImage}
                disabled={isGenerating || !testimonial}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium ${
                  isGenerating || !testimonial
                    ? "bg-[#7c5cff] bg-opacity-50 text-white cursor-not-allowed"
                    : "bg-[#7c5cff] text-white hover:bg-[#6a4ddb]"
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : generatedImage ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Regenerate</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - History */}
        <div className="w-64 overflow-y-auto border-l border-gray-200 bg-white p-4">
          <h2 className="mb-4 text-lg font-medium text-gray-800">History</h2>

          <div className="space-y-4">
            {generatedImages.length > 0 ? (
              generatedImages.map((image, index) => (
                <div
                  key={index}
                  className={`cursor-pointer overflow-hidden rounded-lg border ${
                    generatedImage?.uid === image.uid ? "border-[#7c5cff]" : "border-gray-200"
                  }`}
                  onClick={() => handleSelectFromHistory(image)}
                >
                  <div className="relative aspect-square w-full">
                    <Image
                      src={image.image_url || "/placeholder.svg?height=200&width=200&query=image"}
                      alt="Generated image"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-2 text-center">
                    <p className="text-xs text-gray-500">
                      {new Date(image.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-400">
                <p className="text-sm">Your generated images will appear here</p>
              </div>
            )}
          </div>

          <div className="mt-8">
            <h3 className="mb-2 text-sm font-medium text-gray-700">Pro Features</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Batch generation</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Custom branding</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Advanced templates</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>AI caption generation</span>
              </li>
            </ul>
            <button className="mt-4 w-full rounded-md border border-[#7c5cff] bg-white px-4 py-2 text-sm font-medium text-[#7c5cff] hover:bg-[#f8f7ff]">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
