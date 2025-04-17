"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Code, Copy, Eye, Save, Share } from "lucide-react"

export default function FormEditorPage() {
  const params = useParams()
  const router = useRouter()
  const formId = params.formId as string

  const [activeTab, setActiveTab] = useState("welcome")
  const [formTitle, setFormTitle] = useState("Welcome 👋")
  const [welcomeMessage, setWelcomeMessage] = useState("Choose to either leave a video or written testimonial! 😊")
  const [requireStarRating, setRequireStarRating] = useState(true)
  const [collectionType, setCollectionType] = useState("Text and video testimonials")

  return (
    <div className="flex h-screen flex-col">
      {/* Top Navigation */}
      <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4">
        <div className="flex items-center">
          <Link href="/dashboard/collection-forms" className="mr-4 flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>Your forms</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Code className="mr-1 inline-block h-4 w-4" />
            <span>Embed Form</span>
          </button>
          <button className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Copy className="mr-1 inline-block h-4 w-4" />
            <span>Duplicate</span>
          </button>
          <button className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Share className="mr-1 inline-block h-4 w-4" />
            <span>Share</span>
          </button>
          <button className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Eye className="mr-1 inline-block h-4 w-4" />
            <span>View</span>
          </button>
          <button className="rounded-md bg-gray-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700">
            <Save className="mr-1 inline-block h-4 w-4" />
            <span>Save</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Form Navigation */}
        <div className="w-60 border-r border-gray-200 bg-white">
          <div className="p-4">
            <button
              className={`mb-2 flex w-full items-center rounded-md px-3 py-2 text-left ${
                activeTab === "welcome" ? "bg-[#f0eaff] text-[#7c5cff]" : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("welcome")}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill={activeTab === "welcome" ? "#f0eaff" : "#f5f5f5"} />
                <path
                  d="M12 6v12M6 12h12"
                  stroke={activeTab === "welcome" ? "#7c5cff" : "#666"}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>Welcome</span>
            </button>
            <button
              className={`mb-2 flex w-full items-center rounded-md px-3 py-2 text-left ${
                activeTab === "testimonial" ? "bg-[#f0eaff] text-[#7c5cff]" : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("testimonial")}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill={activeTab === "testimonial" ? "#f0eaff" : "#f5f5f5"} />
                <path
                  d="M8 10h8M8 14h4"
                  stroke={activeTab === "testimonial" ? "#7c5cff" : "#666"}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>Testimonial</span>
            </button>
            <button
              className={`mb-2 flex w-full items-center rounded-md px-3 py-2 text-left ${
                activeTab === "personal" ? "bg-[#f0eaff] text-[#7c5cff]" : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("personal")}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill={activeTab === "personal" ? "#f0eaff" : "#f5f5f5"} />
                <circle cx="12" cy="10" r="3" stroke={activeTab === "personal" ? "#7c5cff" : "#666"} strokeWidth="2" />
                <path
                  d="M7 18c0-2.76 2.24-5 5-5s5 2.24 5 5"
                  stroke={activeTab === "personal" ? "#7c5cff" : "#666"}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>Personal Details</span>
            </button>
            <button
              className={`mb-2 flex w-full items-center rounded-md px-3 py-2 text-left ${
                activeTab === "thankyou" ? "bg-[#f0eaff] text-[#7c5cff]" : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("thankyou")}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill={activeTab === "thankyou" ? "#f0eaff" : "#f5f5f5"} />
                <path
                  d="M9 12l2 2 4-4"
                  stroke={activeTab === "thankyou" ? "#7c5cff" : "#666"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Thank You</span>
            </button>
            <button
              className={`mb-2 flex w-full items-center rounded-md px-3 py-2 text-left ${
                activeTab === "design" ? "bg-[#f0eaff] text-[#7c5cff]" : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("design")}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill={activeTab === "design" ? "#f0eaff" : "#f5f5f5"} />
                <path
                  d="M12 6v12M6 12h12"
                  stroke={activeTab === "design" ? "#7c5cff" : "#666"}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>Design Settings</span>
            </button>
            <button
              className={`mb-2 flex w-full items-center rounded-md px-3 py-2 text-left ${
                activeTab === "settings" ? "bg-[#f0eaff] text-[#7c5cff]" : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("settings")}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill={activeTab === "settings" ? "#f0eaff" : "#f5f5f5"} />
                <path
                  d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                  stroke={activeTab === "settings" ? "#7c5cff" : "#666"}
                  strokeWidth="2"
                />
                <path
                  d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
                  stroke={activeTab === "settings" ? "#7c5cff" : "#666"}
                  strokeWidth="2"
                />
              </svg>
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Middle - Form Editor */}
        <div className="flex-1 overflow-auto bg-white p-6">
          {activeTab === "welcome" && (
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-800">Welcome 👋</h2>
              <p className="mb-6 text-gray-600">
                This welcome page of your form is where people choose their type of testimonial.
              </p>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Welcome Page Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Welcome Message</label>
                <textarea
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                  rows={4}
                />
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-800">Require Star Rating</h3>
                    <p className="text-sm text-gray-500">Toggle this option to show or hide star ratings</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={requireStarRating}
                      onChange={() => setRequireStarRating(!requireStarRating)}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300"></div>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Collection Type</label>
                <div className="relative">
                  <select
                    value={collectionType}
                    onChange={(e) => setCollectionType(e.target.value)}
                    className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                  >
                    <option>Text and video testimonials</option>
                    <option>Text testimonials only</option>
                    <option>Video testimonials only</option>
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

          {activeTab === "testimonial" && (
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-800">Testimonial ⭐</h2>
              <p className="mb-6 text-gray-600">
                This is where your customers write their feedback and rate your service.
              </p>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Testimonial Page Title</label>
                <input
                  type="text"
                  defaultValue="Share your experience with us!"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Your Custom Message</label>
                <textarea
                  defaultValue="We'd really appreciate hearing your thoughts on your recent experience with our product, what you like about it, and why you'd recommend it. It means a lot to us!"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                  rows={4}
                />
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-800">Include Guided Prompts</h3>
                    <p className="text-sm text-gray-500">Toggle this option to show or hide your prompt guides.</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" defaultChecked className="peer sr-only" />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300"></div>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">What problem were you facing before?</label>
                  <span className="text-xs text-gray-500">36/100</span>
                </div>
                <input
                  type="text"
                  defaultValue="What problem were you facing before?"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                />
              </div>

              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">How did our solution help?</label>
                  <span className="text-xs text-gray-500">26/100</span>
                </div>
                <input
                  type="text"
                  defaultValue="How did our solution help?"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                />
              </div>

              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">What specific results did you notice?</label>
                  <span className="text-xs text-gray-500">37/100</span>
                </div>
                <input
                  type="text"
                  defaultValue="What specific results did you notice?"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                />
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-800">Allow Uploading Images</h3>
                    <p className="text-sm text-gray-500">Let customers include up to 3 images</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" defaultChecked className="peer sr-only" />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300"></div>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div>
                      <h3 className="text-base font-medium text-gray-800">Allow AI Enhancement</h3>
                      <p className="text-sm text-gray-500">
                        Let customers refine their feedback with AI for better testimonials.
                      </p>
                    </div>
                    <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                      New
                    </span>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" defaultChecked className="peer sr-only" />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "personal" && (
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-800">Personal Details</h2>
              <p className="mb-6 text-gray-600">Collect relevant information from your customers and clients.</p>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Page Title</label>
                <input
                  type="text"
                  defaultValue="One last thing! 😎"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Page Message</label>
                <textarea
                  defaultValue="We would love to know who's behind this feedback. Please fill in the details below."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                  rows={4}
                />
              </div>

              <div className="mb-6">
                <h3 className="mb-4 text-lg font-medium text-gray-800">What to collect?</h3>
                <p className="mb-4 text-sm text-gray-600">By default, full name and email are required.</p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="mr-3 h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 12a5 5 0 100-10 5 5 0 000 10z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M3 20.4v.6h18v-.6c0-2.24 0-3.36-.436-4.216a4 4 0 00-1.748-1.748C17.96 14 16.84 14 14.6 14H9.4c-2.24 0-3.36 0-4.216.436a4 4 0 00-1.748 1.748C3 17.04 3 18.16 3 20.4z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div>
                        <span className="font-medium">Full Name</span>
                        <span className="ml-2 rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">Required</span>
                      </div>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" defaultChecked disabled className="peer sr-only" />
                      <div className="peer h-6 w-11 rounded-full bg-green-500 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:translate-x-full after:rounded-full after:border after:border-white after:bg-white after:transition-all after:content-['']"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="mr-3 h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div>
                        <span className="font-medium">Email</span>
                        <span className="ml-2 rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">Required</span>
                      </div>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" defaultChecked disabled className="peer sr-only" />
                      <div className="peer h-6 w-11 rounded-full bg-green-500 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:translate-x-full after:rounded-full after:border after:border-white after:bg-white after:transition-all after:content-['']"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="mr-3 h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M21 13V8a2 2 0 00-2-2H5a2 2 0 00-2 2v5m18 0v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5m18 0h-5.5a1 1 0 00-.8.4l-1.5 2a1 1 0 01-.8.4h-2.8a1 1 0 01-.8-.4l-1.5-2a1 1 0 00-.8-.4H3"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="font-medium">Job Title</span>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" defaultChecked className="peer sr-only" />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="mr-3 h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-2-8h-6m6 4h-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="font-medium">Company Name</span>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" defaultChecked className="peer sr-only" />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="mr-3 h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none">
                        <path d="M3 5h18M3 12h18M3 19h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      <span className="font-medium">Website</span>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" defaultChecked className="peer sr-only" />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="mr-3 h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="font-medium">Profile Image</span>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" className="peer sr-only" />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "thankyou" && (
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-800">Thank you 😊</h2>
              <p className="mb-6 text-gray-600">
                This is the final page a user sees once they submit their testimonial
              </p>

              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-800">Rating based Thank you page</h3>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" defaultChecked className="peer sr-only" />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300"></div>
                  </label>
                </div>
              </div>

              <div className="mb-6 flex gap-4">
                <button className="flex items-center gap-2 rounded-md border border-green-500 bg-white px-4 py-2 text-green-600 hover:bg-green-50">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Positive</span>
                </button>
                <button className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-600 hover:bg-gray-50">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 2h3a2 2 0 012 2v7a2 2 0 01-2 2h-3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Negative</span>
                </button>
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Page Title</label>
                <input
                  type="text"
                  defaultValue="Thanks so much! We value your feedback."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Welcome Message</label>
                <textarea
                  defaultValue="We are always appreciative of the people who take the time to leave feedback. Your words always help improve our service to make sure we deliver!"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
                  rows={4}
                />
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-800">Call to Action</h3>
                    <p className="text-sm text-gray-500">
                      Include a call to action to navigate users to a website or other link.
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "design" && (
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-800">Design Settings</h2>
              <p className="mb-6 text-gray-600">Customize the look and feel of your testimonial form.</p>

              {/* Design settings content would go here */}
              <div className="text-center text-gray-500">
                Design settings content will be implemented in the next phase.
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-800">Settings</h2>
              <p className="mb-6 text-gray-600">Configure general settings for your testimonial form.</p>

              {/* Settings content would go here */}
              <div className="text-center text-gray-500">Settings content will be implemented in the next phase.</div>
            </div>
          )}
        </div>

        {/* Right - Form Preview */}
        <div className="w-96 overflow-auto border-l border-gray-200 bg-gray-50 p-6">
          <div className="mb-4 text-center text-sm text-gray-500">PREVIEW</div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex justify-end">
              <div className="h-10 w-32 rounded bg-gray-100 text-center text-sm leading-10 text-gray-400">
                YOUR LOGO
              </div>
            </div>

            {activeTab === "welcome" && (
              <div className="text-center">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">{formTitle}</h2>
                <p className="mb-6 text-gray-600">{welcomeMessage}</p>

                {requireStarRating && (
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
                )}

                <div className="space-y-3">
                  <button className="w-full rounded-md bg-[#818cf8] py-3 text-center font-medium text-white">
                    🎥 Record a Video
                  </button>
                  <button className="w-full rounded-md bg-[#2d3748] py-3 text-center font-medium text-white">
                    Write a Testimonial
                  </button>
                </div>
              </div>
            )}

            {activeTab === "testimonial" && (
              <div className="text-center">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">Share your experience with us!</h2>
                <p className="mb-6 text-gray-600">
                  We'd really appreciate hearing your thoughts on your recent experience with our product, what you like
                  about it, and why you'd recommend it. It means a lot to us!
                </p>

                <div className="mb-6 rounded-lg border border-gray-200 p-4 text-left">
                  <p className="text-sm text-gray-500">Type your feedback here...</p>
                  <p className="text-sm text-gray-400">What problem were you facing before?</p>
                  <p className="text-sm text-gray-400">How did our solution help?</p>
                  <p className="text-sm text-gray-400">What specific results did you notice?</p>
                </div>

                <div className="mb-4 text-left text-sm text-gray-600">Attach up to 3 image(s)</div>

                <div className="mb-6 flex">
                  <button className="flex-1 rounded-md border border-gray-300 bg-white py-2 text-sm text-gray-600">
                    Attach an image
                  </button>
                  <button className="ml-2 flex-1 rounded-md bg-[#818cf8] py-2 text-sm text-white">
                    Refine with AI
                  </button>
                </div>

                <button className="w-full rounded-md bg-[#818cf8] py-3 text-center font-medium text-white">
                  Submit
                </button>
              </div>
            )}

            {activeTab === "personal" && (
              <div className="text-center">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">One last thing! 😎</h2>
                <p className="mb-6 text-gray-600">
                  We would love to know who's behind this feedback. Please fill in the details below.
                </p>

                <div className="mb-6 space-y-4 text-left">
                  <div>
                    <div className="mb-1 flex justify-between">
                      <label className="text-sm font-medium text-gray-700">Full Name *</label>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between">
                      <label className="text-sm font-medium text-gray-700">Email *</label>
                    </div>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between">
                      <label className="text-sm font-medium text-gray-700">Job Title</label>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter your job title"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between">
                      <label className="text-sm font-medium text-gray-700">Company</label>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter company name"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between">
                      <label className="text-sm font-medium text-gray-700">Website</label>
                    </div>
                    <input
                      type="url"
                      placeholder="Enter website URL"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                </div>

                <button className="w-full rounded-md bg-[#818cf8] py-3 text-center font-medium text-white">
                  Submit
                </button>
              </div>
            )}

            {activeTab === "thankyou" && (
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <svg className="h-16 w-16 text-green-500" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M7 13l3 3 7-7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <h2 className="mb-4 text-2xl font-bold text-gray-800">Thanks so much! We value your feedback.</h2>
                <p className="mb-6 text-gray-600">
                  We are always appreciative of the people who take the time to leave feedback. Your words always help
                  improve our service to make sure we deliver!
                </p>
              </div>
            )}

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
