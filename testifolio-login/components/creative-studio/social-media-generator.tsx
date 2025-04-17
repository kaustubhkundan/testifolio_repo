"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowLeft, Download, Star } from "lucide-react"

interface SocialMediaGeneratorProps {
  onClose: () => void
  initialTemplate?: string | null
}

export function SocialMediaGenerator({ onClose, initialTemplate }: SocialMediaGeneratorProps) {
  const [activeTab, setActiveTab] = useState<"content" | "display" | "template">("content")
  const [showTestimonialSelector, setShowTestimonialSelector] = useState(false)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<"square" | "story" | "wide">("square")
  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate || "minimal")
  const [caption, setCaption] = useState("")
  const [showRating, setShowRating] = useState(true)
  const [showSourceIcon, setShowSourceIcon] = useState(true)
  const [showAvatar, setShowAvatar] = useState(true)
  const [selectedFont, setSelectedFont] = useState("Poppins")
  const [outputCount, setOutputCount] = useState(2)

  // Mock testimonials data
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Saira Selene E",
      text: "I have been doing my taxes for more than 10 years and never have a problem with them. Always polite and available to help you no matter the day or time. Even after they move from location to a better one, I don't mind the long driving because I know it is worth it.",
      rating: 5,
      source: "Google",
      avatar: "/avatars/saira.png",
    },
    {
      id: 2,
      name: "Rosie Flores",
      text: "My family has been going to Medinas for years. It's always pleasurable. Rene and his staff are so friendly always.",
      rating: 5,
      source: "Google",
      avatar: "/avatars/rosie.png",
    },
    {
      id: 3,
      name: "Walter Moran",
      text: "I've been doing my Taxes for over 15 years with Medina's Tax Services Never had a problem with the I.R.S ! I highly recommend them!!",
      rating: 5,
      source: "Google",
      avatar: "/avatars/walter.png",
    },
  ]

  const templates = [
    { id: "active", name: "Active", image: "/templates/active-thumb.png" },
    { id: "bold", name: "Bold", image: "/templates/bold-thumb.png" },
    { id: "elegant", name: "Elegant", image: "/templates/elegant-thumb.png" },
    { id: "foodie", name: "Foodie", image: "/templates/foodie-thumb.png" },
    { id: "fun", name: "Fun", image: "/templates/fun-thumb.png" },
    { id: "minimal", name: "Minimal", image: "/templates/minimal-thumb.png" },
    { id: "modern", name: "Modern", image: "/templates/modern-thumb.png" },
    { id: "nature", name: "Nature", image: "/templates/nature-thumb.png" },
    { id: "neutral", name: "Neutral", image: "/templates/neutral-thumb.png" },
    { id: "professional", name: "Professional", image: "/templates/professional-thumb.png" },
    { id: "retro", name: "Retro", image: "/templates/retro-thumb.png" },
    { id: "tech", name: "Tech", image: "/templates/tech-thumb.png" },
  ]

  const colorPalettes = [
    "#1E88E5", // Blue
    "#6A1B9A", // Purple
    "#00897B", // Teal
    "#FB8C00", // Orange
    "#C2185B", // Pink
  ]

  const handleSelectTestimonial = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial)
    setShowTestimonialSelector(false)
  }

  const handleAutoGenerate = () => {
    // In a real app, this would call an AI service to generate a caption
    setCaption("Our customers love our service! Check out this amazing feedback from one of our valued clients.")
  }

  const handleGenerateVisual = () => {
    // In a real app, this would generate the visual
    alert("Visual would be generated here")
  }

  const handleDownload = () => {
    // In a real app, this would download the visual
    alert("Visual would be downloaded here")
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#7c5cff] px-6 py-4 text-white">
        <button onClick={onClose} className="flex items-center gap-2">
          <ArrowLeft className="h-5 w-5" />
          <span>Social Media Generator</span>
        </button>
        <button className="rounded-md bg-white px-4 py-2 text-sm font-medium text-[#7c5cff]">Save Template</button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-72 overflow-y-auto border-r border-gray-200 bg-white">
          <div className="p-4">
            <button
              onClick={() => setShowTestimonialSelector(true)}
              className="mb-6 flex w-full items-center justify-center gap-2 rounded-md bg-[#7c5cff] bg-opacity-10 px-4 py-3 text-sm font-medium text-[#7c5cff]"
            >
              <Star className="h-4 w-4" />
              <span>Select Testimonial</span>
            </button>

            <div className="mb-6">
              <div className="mb-2 flex cursor-pointer items-center gap-2" onClick={() => setActiveTab("content")}>
                <svg
                  className="h-5 w-5 text-gray-500"
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
                    d="M3 7l9 6 9-6M3 17l6-4m6 0l6 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-medium text-gray-800">Content</span>
              </div>

              {activeTab === "content" && (
                <div className="ml-7 space-y-4">
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Headline</label>
                      <button className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M19 9l-7 7-7-7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Testimonial Text</label>
                      <button className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M19 9l-7 7-7-7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <div className="mb-2 flex cursor-pointer items-center gap-2" onClick={() => setActiveTab("display")}>
                <svg
                  className="h-5 w-5 text-gray-500"
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
                <span className="font-medium text-gray-800">Display Options</span>
              </div>

              {activeTab === "display" && (
                <div className="ml-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Show Rating</label>
                    <div className="relative inline-block h-5 w-10 cursor-pointer rounded-full bg-gray-200">
                      <input
                        type="checkbox"
                        className="peer absolute h-0 w-0 opacity-0"
                        checked={showRating}
                        onChange={() => setShowRating(!showRating)}
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
                    <div className="relative inline-block h-5 w-10 cursor-pointer rounded-full bg-gray-200">
                      <input
                        type="checkbox"
                        className="peer absolute h-0 w-0 opacity-0"
                        checked={showSourceIcon}
                        onChange={() => setShowSourceIcon(!showSourceIcon)}
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
                    <div className="relative inline-block h-5 w-10 cursor-pointer rounded-full bg-gray-200">
                      <input
                        type="checkbox"
                        className="peer absolute h-0 w-0 opacity-0"
                        checked={showAvatar}
                        onChange={() => setShowAvatar(!showAvatar)}
                      />
                      <span
                        className={`absolute left-0 top-0 h-5 w-5 rounded-full bg-white shadow-md transition-all ${
                          showAvatar ? "translate-x-5 bg-[#7c5cff]" : ""
                        }`}
                      ></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="mb-2 flex cursor-pointer items-center gap-2" onClick={() => setActiveTab("template")}>
                <svg
                  className="h-5 w-5 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 21V8a3 3 0 013-3h10a3 3 0 013 3v13m0-13H4m16 0l-5-5m5 5l-5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-medium text-gray-800">Template Style</span>
              </div>

              {activeTab === "template" && (
                <div className="ml-7 grid grid-cols-3 gap-2">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`cursor-pointer overflow-hidden rounded-md border ${
                        selectedTemplate === template.id
                          ? "border-[#7c5cff] bg-[#f0eaff]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className="relative h-16 w-full">
                        <Image
                          src={template.image || "/placeholder.svg"}
                          alt={template.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-1 text-center">
                        <span className="text-xs">{template.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle Panel - Preview */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <div className="mx-auto max-w-md">
            <h2 className="mb-4 text-lg font-medium text-gray-800">Selected Testimonial</h2>
            <div className="aspect-square w-full rounded-lg border border-dashed border-gray-300 bg-white p-6">
              {selectedTestimonial ? (
                <div className="flex h-full flex-col items-center justify-center">
                  <div className="mb-4 flex flex-col items-center">
                    {showAvatar && (
                      <div className="mb-2 h-16 w-16 overflow-hidden rounded-full bg-gray-200">
                        <Image
                          src={selectedTestimonial.avatar || "/placeholder.svg"}
                          alt={selectedTestimonial.name}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <h3 className="text-lg font-medium">{selectedTestimonial.name}</h3>
                    {showRating && (
                      <div className="mt-1 flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < selectedTestimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-center text-gray-600">{selectedTestimonial.text}</p>
                  {showSourceIcon && (
                    <div className="mt-4 flex items-center">
                      {selectedTestimonial.source === "Google" && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                          <span className="text-lg">G</span>
                        </div>
                      )}
                      <span className="ml-1 text-sm text-gray-500">{selectedTestimonial.source}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-gray-400">
                  <p>Testimonial you select will show up here</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
              <button
                onClick={handleGenerateVisual}
                className="flex items-center gap-2 rounded-md bg-[#7c5cff] px-4 py-2 text-sm font-medium text-white hover:bg-[#6a4ddb]"
              >
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
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Customization */}
        <div className="w-80 overflow-y-auto border-l border-gray-200 bg-white p-4">
          <h2 className="mb-4 text-lg font-medium text-gray-800">Customization</h2>

          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">Color Palette</h3>
              <button className="text-xs text-[#7c5cff] hover:underline">See All</button>
            </div>
            <div className="flex gap-2">
              {colorPalettes.map((color) => (
                <button key={color} className="h-8 w-8 rounded-full" style={{ backgroundColor: color }}></button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-2 text-sm font-medium text-gray-700">Upload Image</h3>
            <div className="flex h-16 cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
              <svg className="h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 16l4-4 4 4m4-10v16m0-16l-4 4m4-4l4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">Branding</h3>
              <button className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M19 9l-7 7-7-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-2 text-sm font-medium text-gray-700">Font Style</h3>
            <div className="relative">
              <select
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
                className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 text-sm focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
              >
                <option>Poppins</option>
                <option>Inter</option>
                <option>Roboto</option>
                <option>Montserrat</option>
                <option>Open Sans</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-4 text-sm font-medium text-gray-700">Choose Format</h3>
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
                  <div className={`h-4 w-8 rounded-sm ${selectedFormat === "wide" ? "bg-white" : "bg-gray-400"}`}></div>
                </div>
                <span className="text-xs">Wide</span>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-2 text-sm font-medium text-gray-700">Create a Caption</h3>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What is your post about? Try to be as detailed as possible."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
              rows={4}
            ></textarea>
            <button
              onClick={handleAutoGenerate}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-[#7c5cff] bg-opacity-10 px-4 py-2 text-sm font-medium text-[#7c5cff]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Auto-Generate</span>
            </button>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">Number of Outputs</h3>
            <p className="mb-2 text-xs text-gray-500">Select 1-4 outputs. Fewer outputs generate faster.</p>
            <input
              type="range"
              min="1"
              max="4"
              value={outputCount}
              onChange={(e) => setOutputCount(Number.parseInt(e.target.value))}
              className="w-full"
            />
            <div className="mt-1 flex justify-between">
              <span className="text-xs text-gray-500">1</span>
              <span className="text-xs font-medium">{outputCount}</span>
              <span className="text-xs text-gray-500">4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Selector Modal */}
      {showTestimonialSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-lg bg-white p-6 shadow-xl">
            <button
              onClick={() => setShowTestimonialSelector(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="flex gap-8">
              <div className="w-2/3">
                <h2 className="mb-4 text-xl font-bold text-gray-800">Select Testimonials</h2>
                <p className="mb-4 text-gray-600">Choose up to 3 testimonials to include in your social media design</p>

                <div className="mb-4">
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search testimonials..."
                      className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 4h18M3 8h18M3 12h18M3 16h18M3 20h18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-medium text-gray-700">Filters</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {testimonials.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="cursor-pointer rounded-lg border border-gray-200 p-4 hover:border-[#7c5cff] hover:bg-[#f8f7ff]"
                      onClick={() => handleSelectTestimonial(testimonial)}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                            <Image
                              src={testimonial.avatar || "/placeholder.svg"}
                              alt={testimonial.name}
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-3">
                            <h3 className="font-medium text-gray-800">{testimonial.name}</h3>
                          </div>
                        </div>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600">{testimonial.text}</p>
                      <div className="mt-2 flex items-center">
                        {testimonial.source === "Google" && (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                            <span className="text-lg">G</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-2 flex justify-end">
                        <button className="rounded-md border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 hover:bg-gray-50">
                          Summarize
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-1/3">
                <h2 className="mb-4 text-xl font-bold text-gray-800">Selected Testimonials</h2>
                <div className="rounded-lg border border-dashed border-gray-300 p-6">
                  {selectedTestimonial ? (
                    <div>
                      <div className="mb-2 flex items-center">
                        <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200">
                          <Image
                            src={selectedTestimonial.avatar || "/placeholder.svg"}
                            alt={selectedTestimonial.name}
                            width={32}
                            height={32}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-2">
                          <h3 className="text-sm font-medium text-gray-800">{selectedTestimonial.name}</h3>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{selectedTestimonial.text}</p>
                    </div>
                  ) : (
                    <div className="flex h-40 flex-col items-center justify-center text-center text-gray-400">
                      <p>Your selected testimonials will appear here</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowTestimonialSelector(false)}
                  className="mt-4 w-full rounded-md bg-[#7c5cff] px-4 py-2 text-white hover:bg-[#6a4ddb]"
                >
                  Save Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface Testimonial {
  id: number
  name: string
  text: string
  rating: number
  source: string
  avatar: string
}
