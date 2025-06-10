"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ArrowDown, ArrowUp, Calendar, Home, Star } from "lucide-react"

import { useTestimonials } from "@/hooks/use-testimonials"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("Last 7 days")
  const { testimonials, isLoading, error } = useTestimonials()

  // Format date to a readable string (e.g., "May 15, 2025")
  const formatDateString = (dateInput: string | Date) => {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Calculate analytics from real testimonial data
  const calculateAnalytics = () => {
    if (!testimonials || testimonials.length === 0) {
      return {
        totalTestimonials: 0,
        averageRating: 0,
        bySource: [],
        byRating: [],
        submissionTrend: [],
        recentActivity: [],
      }
    }

    // Calculate total testimonials
    const totalTestimonials = testimonials.length

    // Calculate average rating
    const totalRating = testimonials.reduce((sum, t) => sum + (t.rating || 0), 0)
    const averageRating = totalRating / totalTestimonials

    // Calculate testimonials by source
    const sourceMap = new Map()
    testimonials.forEach((t) => {
      const source = (t.platform || t.source || "other").toLowerCase()
      sourceMap.set(source, (sourceMap.get(source) || 0) + 1)
    })

    const bySource = Array.from(sourceMap.entries()).map(([name, value]) => ({
      name,
      value,
    }))

    // Calculate testimonials by rating
    const ratingMap = new Map()
    testimonials.forEach((t) => {
      const rating = t.rating || 0
      ratingMap.set(rating, (ratingMap.get(rating) || 0) + 1)
    })

    const byRating = Array.from(ratingMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([name, value]) => ({
        name,
        value,
      }))

    // Format data for the submission trend chart
    const submissionTrend = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))

      const dateString = date.toISOString().split("T")[0]
      const count = testimonials.filter((t) => {
        const testimonialDate = new Date(t.created_at || t.date || new Date())
        return testimonialDate.toISOString().split("T")[0] === dateString
      }).length

      return {
        date: formatDateString(date),
        count,
      }
    })

    // Format recent activity
    const recentActivity = testimonials.slice(0, 5).map((t) => ({
      id: t.id,
      name: t.name || "Anonymous",
      avatar: t.avatar || `/avatars/${Math.floor(Math.random() * 9) + 1}.png`,
      action: "submitted a testimonial",
      date: formatDateString(t.created_at || t.date || new Date()),
      rating: t.rating || 0,
      platform: (t.platform || t.source || "other").toLowerCase(),
    }))

    return {
      totalTestimonials,
      averageRating,
      bySource,
      byRating,
      submissionTrend,
      recentActivity,
    }
  }

  const analytics = calculateAnalytics()

  // Colors for the pie charts
  const COLORS = ["#7c5cff", "#ff5c8d", "#5cffb1", "#ffb15c", "#5cb9ff", "#c45cff"]

  // Platform icons
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "twitter":
      case "x":
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
        )
      case "google":
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#4285F4] shadow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </div>
        )
      case "facebook":
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
        )
      case "linkedin":
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </div>
        )
      case "instagram":
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </div>
        )
      case "yelp":
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.16 12.594l-4.995 1.433c-.96.276-1.94-.8-1.665-1.766l2.37-8.224c.276-.96 1.5-1.2 2.1-.346l3.534 5.07c.738 1.06-.385 3.557-1.344 3.833zm.835 2.66l-3.534 5.07c-.6.866-1.825.618-2.1-.346l-2.37-8.224c-.276-.96.703-2.04 1.666-1.766l4.994 1.434c.96.276 2.082 2.776 1.344 3.833zm-7.964 4.144l-6.655 4.83c-.832.603-1.857-.198-1.635-1.21l2.42-11.3c.22-1.01 1.542-1.352 2.173-.56l4.17 5.21c.714.892.36 2.43-.473 3.03zm-6.983-19.11l6.655 4.83c.832.603 1.186 2.14.474 3.03l-4.17 5.21c-.63.79-1.952.45-2.174-.56l-2.42-11.3c-.22-1.01.804-1.813 1.636-1.21zM12 12.04c.767 0 1.387.62 1.387 1.387 0 .767-.62 1.387-1.387 1.387-.767 0-1.387-.62-1.387-1.387 0-.767.62-1.387 1.387-1.387z" />
            </svg>
          </div>
        )
      case "pinterest":
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-white">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
        )
    }
  }

  return (
      <div className="p-6">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center text-sm">
          <Link href="/dashboard" className="flex items-center text-[#7c5cff]">
            <Home className="mr-1 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">Analytics</span>
        </div>

        {/* Page Header */}
        <div className="mb-6 flex flex-col items-center justify-center text-center">
          <div className="mb-2 inline-block rounded-full bg-[#f0eaff] px-4 py-1 text-sm text-[#7c5cff]">Insights</div>
          <h1 className="mb-2 text-4xl font-bold text-[#7c5cff]">Testimonial Analytics</h1>
          <p className="mb-6 text-gray-600">Track and analyze your testimonial performance</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6 flex justify-end">
          <div className="relative inline-block">
            <div className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
              <Calendar className="mr-2 h-4 w-4 text-gray-500" />
              <span>{timeRange}</span>
              <svg className="ml-2 h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Testimonials */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Testimonials</p>
                <h3 className="text-3xl font-bold text-gray-900">{analytics.totalTestimonials}</h3>
              </div>
              <div className="rounded-full bg-[#f0eaff] p-3 text-[#7c5cff]">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="flex items-center text-green-500">
                <ArrowUp className="mr-1 h-4 w-4" />
                12%
              </span>
              <span className="ml-2 text-gray-500">vs. last period</span>
            </div>
          </div>

          {/* Average Rating */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Rating</p>
                <h3 className="text-3xl font-bold text-gray-900">{analytics.averageRating.toFixed(1)}</h3>
              </div>
              <div className="rounded-full bg-[#fff0ea] p-3 text-[#ff7c5c]">
                <Star className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="flex items-center text-green-500">
                <ArrowUp className="mr-1 h-4 w-4" />
                3%
              </span>
              <span className="ml-2 text-gray-500">vs. last period</span>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                <h3 className="text-3xl font-bold text-gray-900">0%</h3>
              </div>
              <div className="rounded-full bg-[#eafff0] p-3 text-[#5cff7c]">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="flex items-center text-red-500">
                <ArrowDown className="mr-1 h-4 w-4" />
                2%
              </span>
              <span className="ml-2 text-gray-500">vs. last period</span>
            </div>
          </div>

          {/* Form Views */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Form Views</p>
                <h3 className="text-3xl font-bold text-gray-900">0</h3>
              </div>
              <div className="rounded-full bg-[#eaf0ff] p-3 text-[#5c7cff]">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="flex items-center text-green-500">
                <ArrowUp className="mr-1 h-4 w-4" />
                18%
              </span>
              <span className="ml-2 text-gray-500">vs. last period</span>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          {/* Testimonial Submission Trend */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Testimonial Submission Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.submissionTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#7c5cff" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Testimonials by Source */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Testimonials by Source</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.bySource}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {analytics.bySource.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Testimonials by Rating */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Testimonials by Rating</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.byRating} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ff7c5c" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Recent Activity</h3>
            <div className="space-y-4">
              {analytics.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="relative mr-3 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={activity.avatar || "/placeholder.svg"}
                      alt={activity.name}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{activity.name}</p>
                      <div className="flex items-center">{getPlatformIcon(activity.platform)}</div>
                    </div>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <div className="mt-1 flex items-center">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < activity.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-xs text-gray-500">{activity.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  )
}
