"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowLeft, Star } from "lucide-react"

interface WidgetCustomizerProps {
  onClose: () => void
  testimonials: Testimonial[]
}

export function WidgetCustomizer({ onClose, testimonials }: WidgetCustomizerProps) {
  const [selectedFont, setSelectedFont] = useState("Inter")
  const [testimonialCount, setTestimonialCount] = useState("4 Testimonials")
  const [autoRotate, setAutoRotate] = useState(true)
  const [rotationInterval, setRotationInterval] = useState("Every 3 seconds")
  const [selectedTheme, setSelectedTheme] = useState("active")

  const themes = [
    { id: "active", name: "Active" },
    { id: "bold", name: "Bold" },
    { id: "elegant", name: "Elegant" },
    { id: "foodie", name: "Foodie" },
    { id: "fun", name: "Fun" },
    { id: "minimal", name: "Minimal" },
    { id: "modern", name: "Modern" },
    { id: "nature", name: "Nature" },
    { id: "neutral", name: "Neutral" },
  ]

  const colorPalettes = [
    "#1E88E5", // Blue
    "#6A1B9A", // Purple
    "#00897B", // Teal
    "#FB8C00", // Orange
    "#C2185B", // Pink
  ]

  const handleSaveAndGetCode = () => {
    // In a real app, this would save the customization settings and generate the embed code
    alert("Settings saved! Embed code generated.")
    onClose()
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* Header */}
      <div className="flex items-center bg-[#7c5cff] px-6 py-4 text-white">
        <button onClick={onClose} className="flex items-center gap-2">
          <ArrowLeft className="h-5 w-5" />
          <span>Widgets</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Customization Options */}
        <div className="w-80 overflow-y-auto border-r border-gray-200 bg-white p-6">
          <h2 className="mb-6 text-xl font-bold text-gray-800">Customization</h2>

          {/* Color Palette */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">Color Palette</h3>
              <button className="text-xs text-[#7c5cff] hover:underline">See All</button>
            </div>
            <div className="flex gap-2">
              {colorPalettes.map((color) => (
                <button
                  key={color}
                  className="h-10 w-10 rounded-full border-2 border-transparent hover:border-gray-300"
                  style={{ backgroundColor: color }}
                ></button>
              ))}
            </div>
          </div>

          {/* Font Style */}
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-medium text-gray-700">Font Style</h3>
            <div className="relative">
              <select
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
                className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 text-sm focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
              >
                <option>Inter</option>
                <option>Poppins</option>
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

          {/* Number of Testimonials */}
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-medium text-gray-700">Number of Testimonials</h3>
            <div className="relative">
              <select
                value={testimonialCount}
                onChange={(e) => setTestimonialCount(e.target.value)}
                className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 text-sm focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
              >
                <option>4 Testimonials</option>
                <option>6 Testimonials</option>
                <option>8 Testimonials</option>
                <option>12 Testimonials</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* View Type */}
          <div className="mb-6">
            <h3 className="mb-4 text-sm font-medium text-gray-700">View Type</h3>
            <div className="flex justify-between">
              <button
                className={`flex flex-col items-center ${
                  selectedTheme !== "vertical" ? "text-[#7c5cff]" : "text-gray-500"
                }`}
                onClick={() => setSelectedTheme(selectedTheme === "vertical" ? "active" : selectedTheme)}
              >
                <div
                  className={`mb-2 flex h-12 w-12 items-center justify-center rounded-md ${
                    selectedTheme !== "vertical" ? "bg-[#7c5cff]" : "bg-gray-100"
                  }`}
                >
                  <div className="grid h-6 w-6 grid-cols-2 gap-0.5">
                    <div className={`rounded-sm ${selectedTheme !== "vertical" ? "bg-white" : "bg-gray-400"}`}></div>
                    <div className={`rounded-sm ${selectedTheme !== "vertical" ? "bg-white" : "bg-gray-400"}`}></div>
                    <div className={`rounded-sm ${selectedTheme !== "vertical" ? "bg-white" : "bg-gray-400"}`}></div>
                    <div className={`rounded-sm ${selectedTheme !== "vertical" ? "bg-white" : "bg-gray-400"}`}></div>
                  </div>
                </div>
                <span className="text-xs">Grid</span>
              </button>

              <button
                className={`flex flex-col items-center ${
                  selectedTheme === "vertical" ? "text-[#7c5cff]" : "text-gray-500"
                }`}
                onClick={() => setSelectedTheme("vertical")}
              >
                <div
                  className={`mb-2 flex h-12 w-12 items-center justify-center rounded-md ${
                    selectedTheme === "vertical" ? "bg-[#7c5cff]" : "bg-gray-100"
                  }`}
                >
                  <div className="flex h-6 w-6 flex-col gap-0.5">
                    <div
                      className={`h-1.5 w-full rounded-sm ${selectedTheme === "vertical" ? "bg-white" : "bg-gray-400"}`}
                    ></div>
                    <div
                      className={`h-1.5 w-full rounded-sm ${selectedTheme === "vertical" ? "bg-white" : "bg-gray-400"}`}
                    ></div>
                    <div
                      className={`h-1.5 w-full rounded-sm ${selectedTheme === "vertical" ? "bg-white" : "bg-gray-400"}`}
                    ></div>
                  </div>
                </div>
                <span className="text-xs">List</span>
              </button>
            </div>
          </div>

          {/* Auto Rotate */}
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-medium text-gray-700">Auto Rotate</h3>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">Enable Auto Rotation</span>
              <div className="relative inline-block h-6 w-12 cursor-pointer rounded-full bg-gray-200">
                <input
                  type="checkbox"
                  className="peer absolute h-0 w-0 opacity-0"
                  checked={autoRotate}
                  onChange={() => setAutoRotate(!autoRotate)}
                />
                <span
                  className={`absolute left-0 top-0 h-6 w-6 rounded-full bg-white shadow-md transition-all ${
                    autoRotate ? "translate-x-6 bg-[#7c5cff]" : ""
                  }`}
                ></span>
              </div>
            </div>
            {autoRotate && (
              <div className="relative">
                <select
                  value={rotationInterval}
                  onChange={(e) => setRotationInterval(e.target.value)}
                  className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 text-sm focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                >
                  <option>Every 3 seconds</option>
                  <option>Every 5 seconds</option>
                  <option>Every 8 seconds</option>
                  <option>Every 10 seconds</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Themes */}
          <div>
            <h3 className="mb-4 text-sm font-medium text-gray-700">Themes</h3>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  className={`cursor-pointer overflow-hidden rounded-md border ${
                    selectedTheme === theme.id
                      ? "border-[#7c5cff] bg-[#f0eaff]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedTheme(theme.id)}
                >
                  <div className="relative h-16 w-full bg-gray-100">
                    <Image
                      src={`/templates/${theme.id}-thumb.png`}
                      alt={theme.name}
                      width={100}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-1 text-center">
                    <span className="text-xs">{theme.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <h2 className="mb-6 text-xl font-bold text-gray-800">Live Preview</h2>

          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6">
            {selectedTheme === "vertical" ? (
              <div className="space-y-4">
                {testimonials.slice(0, 2).map((testimonial) => (
                  <div key={testimonial.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full">
                          <Image
                            src={testimonial.avatar || "/placeholder.svg"}
                            alt={testimonial.name}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">{testimonial.name}</h3>
                          <p className="text-xs text-gray-500">{testimonial.position}</p>
                        </div>
                      </div>
                      {testimonial.platform === "twitter" && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </div>
                      )}
                      {testimonial.platform === "pinterest" && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="my-2 flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-xs text-gray-600">{testimonial.text}</p>
                    <div className="mt-2 text-right text-xs text-gray-400">{testimonial.date}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {testimonials.slice(0, 4).map((testimonial) => (
                  <div key={testimonial.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full">
                        <Image
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">{testimonial.name}</h3>
                        <p className="text-xs text-gray-500">{testimonial.position}</p>
                      </div>
                    </div>

                    <div className="mb-2 flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-xs text-gray-600">{testimonial.text}</p>
                    <div className="mt-2 text-xs text-gray-400">{testimonial.date}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleSaveAndGetCode}
              className="flex items-center gap-2 rounded-md bg-[#7c5cff] px-6 py-2 text-sm font-medium text-white hover:bg-[#6a4ddb]"
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
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              <span>Save & Get Embed Code</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface Testimonial {
  id: number
  name: string
  position: string
  avatar: string
  rating: number
  text: string
  date: string
  platform: string
}
