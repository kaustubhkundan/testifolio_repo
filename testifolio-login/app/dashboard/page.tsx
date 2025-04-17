"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  BarChart3,
  ChevronDown,
  ChevronRight,
  Edit,
  Eye,
  FileText,
  Grid,
  LayoutDashboard,
  MessageSquare,
  Moon,
  PaintbrushIcon as PaintBrush,
  Plus,
  Send,
  Settings,
  Share2,
  Sun,
} from "lucide-react"

export default function DashboardPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const recentTestimonials = [
    {
      id: 1,
      customer: {
        name: "Jane Cooper",
        company: "The Walt Disney Company",
        avatar: "/stylized-jc-initials.png",
      },
      type: "Written Testimonials",
      status: "Approved",
      engagement: "2.5k",
      aiScore: "92%",
    },
    {
      id: 2,
      customer: {
        name: "Esther Howard",
        company: "Louis Vuitton",
        avatar: "/abstract-geometric-EH.png",
      },
      type: "Video Testimonials",
      status: "Pending",
      engagement: "2.5k",
      aiScore: "92%",
    },
    {
      id: 3,
      customer: {
        name: "Brooklyn Simmons",
        company: "General Electric",
        avatar: "/abstract-blue-swirls.png",
      },
      type: "Audio Testimonials",
      status: "Published",
      engagement: "2.5k",
      aiScore: "92%",
    },
    {
      id: 4,
      customer: {
        name: "Guy Hawkins",
        company: "Mitsubishi",
        avatar: "/abstract-geometric-gh.png",
      },
      type: "Social Media Testimonials",
      status: "Approved",
      engagement: "2.5k",
      aiScore: "92%",
    },
  ]

  return (
    <div className={`flex min-h-screen ${isDarkMode ? "bg-[#1a1a1a]" : "bg-[#f5f7ff]"}`}>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-60 border-r ${
          isDarkMode ? "border-gray-700 bg-[#1a1a1a]" : "border-gray-200 bg-white"
        }`}
      >
        <div className={`flex h-16 items-center border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"} px-4`}>
          <Link href="/dashboard" className="flex items-center">
            <span className="text-2xl font-bold text-[#7c5cff]">testifolio</span>
          </Link>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto p-4">
          <nav className="flex flex-1 flex-col gap-1">
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 rounded-md ${
                isDarkMode ? "bg-[#2d2d3a] text-[#a5b4fc]" : "bg-[#f0eaff] text-[#7c5cff]"
              } px-3 py-2 transition-colors`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/dashboard/testimonials"
              className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
                isDarkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Testimonials</span>
            </Link>
            <Link
              href="/dashboard/collection-forms"
              className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
                isDarkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>Collection Forms</span>
            </Link>
            <Link
              href="/dashboard/creative-studio"
              className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
                isDarkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <PaintBrush className="h-5 w-5" />
              <span>Creative Studio</span>
            </Link>
            <Link
              href="/dashboard/widgets"
              className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
                isDarkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Grid className="h-5 w-5" />
              <span>Widgets</span>
            </Link>
            <Link
              href="/dashboard/analytics"
              className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
                isDarkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Analytics</span>
            </Link>
            <Link
              href="/dashboard/settings"
              className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
                isDarkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        <div className={`border-t p-4 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Theme</span>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`flex h-6 w-12 items-center rounded-full p-1 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
            >
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full transition-all ${
                  isDarkMode ? "ml-6 bg-[#7c5cff]" : "bg-white"
                }`}
              >
                {isDarkMode ? <Moon className="h-3 w-3 text-white" /> : <Sun className="h-3 w-3 text-gray-600" />}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-60 flex-1">
        {/* Header */}
        <header
          className={`sticky top-0 z-40 flex h-16 items-center justify-between border-b ${
            isDarkMode ? "border-gray-700 bg-[#1a1a1a]" : "border-gray-200 bg-white"
          } px-6`}
        >
          <div></div>
          <div className="flex items-center gap-4">
            <Link
              href="/pricing"
              className="rounded-full bg-[#7c5cff] px-4 py-2 text-sm font-medium text-white hover:bg-[#6a4ddb]"
            >
              Upgrade Now
            </Link>
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gray-200">
                <Image src="/vibrant-street-market.png" alt="User" fill />
              </div>
              <span className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>Harsh</span>
              <ChevronDown className={`h-4 w-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <div className="mb-6">
            <h2 className={`text-xl font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              Welcome back, Harsh! Here&apos;s what&apos;s happening with your testimonials.
            </h2>
          </div>

          {/* Stats Cards */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-[#a5b4fc] p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold">2,466</div>
                  <div className="mt-1 text-sm">Total Testimonials</div>
                </div>
                <div className="rounded-full bg-[#818cf8] p-2">
                  <ChevronRight className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-[#a5b4fc] p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold">32</div>
                  <div className="mt-1 text-sm">Awaiting Approval</div>
                </div>
                <div className="rounded-full bg-[#818cf8] p-2">
                  <ChevronRight className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-[#a5b4fc] p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold">17</div>
                  <div className="mt-1 text-sm">
                    New Testimonials
                    <br />
                    (Last 30 days)
                  </div>
                </div>
                <div className="rounded-full bg-[#818cf8] p-2">
                  <ChevronRight className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-[#a5b4fc] p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold">14%</div>
                  <div className="mt-1 text-sm">Conversion Impact</div>
                </div>
                <div className="rounded-full bg-[#818cf8] p-2">
                  <ChevronRight className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <div className={`rounded-lg ${isDarkMode ? "bg-white" : "bg-white"} p-6 shadow-sm`}>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#7c5cff]">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-medium">Create a New Form</h3>
              <p className="mb-4 text-sm text-gray-600">
                Use forms to collect testimonials and feedback from your customers.
              </p>
              <button className="w-full rounded-lg bg-[#a5b4fc] py-2 text-center text-white hover:bg-[#818cf8]">
                View Forms
              </button>
            </div>

            <div className={`rounded-lg ${isDarkMode ? "bg-white" : "bg-white"} p-6 shadow-sm`}>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#7c5cff]">
                <Send className="h-5 w-5 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-medium">Send a Testimonial Request</h3>
              <p className="mb-4 text-sm text-gray-600">Reach out to customers for new testimonials</p>
              <button className="w-full rounded-lg bg-[#a5b4fc] py-2 text-center text-white hover:bg-[#818cf8]">
                Request a Testimonial
              </button>
            </div>

            <div className={`rounded-lg border border-[#7c5cff] ${isDarkMode ? "bg-white" : "bg-white"} p-6`}>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#7c5cff]">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-medium">Create a Social Post</h3>
              <p className="mb-4 text-sm text-gray-600">Craft engaging content to share with your audience.</p>
              <button className="w-full rounded-lg bg-[#a5b4fc] py-2 text-center text-white hover:bg-[#818cf8]">
                Create a Social Post
              </button>
            </div>
          </div>

          {/* Recent Testimonials */}
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className={`text-xl font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Recent Testimonials
              </h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm ${
                      isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    <span>Recent</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
                <button className="flex items-center gap-2 rounded-md bg-gray-800 px-3 py-1.5 text-sm text-white">
                  <Plus className="h-4 w-4" />
                  <span>Add New</span>
                </button>
              </div>
            </div>

            <div
              className={`overflow-hidden rounded-lg border ${
                isDarkMode ? "border-gray-700 bg-[#1a1a1a]" : "border-gray-200 bg-white"
              }`}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr
                      className={`border-b ${
                        isDarkMode
                          ? "border-gray-700 bg-gray-800 text-gray-200"
                          : "border-gray-200 bg-gray-50 text-gray-600"
                      } text-left text-sm`}
                    >
                      <th className="px-6 py-3 font-medium">Customer</th>
                      <th className="px-6 py-3 font-medium">Type</th>
                      <th className="px-6 py-3 font-medium">
                        Status <ChevronDown className="ml-1 inline h-3 w-3" />
                      </th>
                      <th className="px-6 py-3 font-medium">Engagement</th>
                      <th className="px-6 py-3 font-medium">AI Score</th>
                      <th className="px-6 py-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}>
                    {recentTestimonials.map((testimonial) => (
                      <tr key={testimonial.id} className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 overflow-hidden rounded-full">
                              <Image
                                src={testimonial.customer.avatar || "/placeholder.svg"}
                                alt={testimonial.customer.name}
                                fill
                              />
                            </div>
                            <div>
                              <div className="font-medium">{testimonial.customer.name}</div>
                              <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                {testimonial.customer.company}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">{testimonial.type}</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              testimonial.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : testimonial.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            <span
                              className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                                testimonial.status === "Approved"
                                  ? "bg-green-400"
                                  : testimonial.status === "Pending"
                                    ? "bg-yellow-400"
                                    : "bg-blue-400"
                              }`}
                            ></span>
                            {testimonial.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">{testimonial.engagement}</td>
                        <td className="whitespace-nowrap px-6 py-4">{testimonial.aiScore}</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              className={`rounded-full p-1.5 ${
                                isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
                              } hover:bg-gray-200`}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              className={`rounded-full p-1.5 ${
                                isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
                              } hover:bg-gray-200`}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              className={`rounded-full p-1.5 ${
                                isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
                              } hover:bg-gray-200`}
                            >
                              <Share2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
