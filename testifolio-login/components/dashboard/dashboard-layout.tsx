"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  BarChart3,
  ChevronDown,
  FileText,
  Grid,
  LayoutDashboard,
  MessageSquare,
  Moon,
  PaintbrushIcon as PaintBrush,
  Settings,
  Sun,
} from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false)

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

        {/* Page Content */}
        <main className="bg-[#f5f7ff] text-gray-900">{children}</main>
      </div>
    </div>
  )
}
