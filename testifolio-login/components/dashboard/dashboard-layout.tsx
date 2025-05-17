"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Bell,
  ChevronDown,
  Grid3X3,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Moon,
  PenTool,
  Settings,
  Star,
  Sun,
  User,
} from "lucide-react"

import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayoutViews({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { user, signOut } = useAuth()
  const [userName, setUserName] = useState<string>("User")
  const [userInitials, setUserInitials] = useState<string>("U")
  const [isLoading, setIsLoading] = useState(true)

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setIsDarkMode(true)
    }
  }, [])

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light")
  }, [isDarkMode])

  useEffect(() => {
    if (user) {
      // Get user's name from metadata or email
      const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User"

      setUserName(name)

      // Create initials from name
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)

      setUserInitials(initials)
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [user])

  const handleLogout = async () => {
    await signOut()
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Testimonials", href: "/dashboard/testimonials", icon: MessageSquare },
    { name: "Collection Forms", href: "/dashboard/collection-forms", icon: Grid3X3 },
    { name: "Creative Studio", href: "/dashboard/creative-studio", icon: PenTool },
    { name: "Widgets", href: "/dashboard/widgets", icon: Star },
    { name: "Analytics", href: "/dashboard/analytics", icon: Home },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-[#1a1a1a]" : "bg-[#f5f7ff]"}`}>
      {/* Mobile menu */}
      <div className="lg:hidden">
        <div
          className={`flex items-center justify-between border-b ${isDarkMode ? "border-gray-700 bg-[#1a1a1a]" : "border-gray-200 bg-white"
            } px-4 py-3`}
        >
          <div className={`flex h-12 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"} px-4`}>
            <Link href="/dashboard" className="relative w-[100%] h-full">
              <Image src="/logosbg.svg" alt="Testifolio" fill className="object-contain" />
            </Link>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`rounded-md p-2 ${isDarkMode ? "text-gray-400 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"}`}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className={`border-b ${isDarkMode ? "border-gray-700 bg-[#1a1a1a]" : "border-gray-200 bg-white"}`}>
            <div className="space-y-1 px-2 py-3">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname?.startsWith(`${item.href}/`));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                      isActive
                        ? isDarkMode
                          ? "bg-[#2d2d3a] text-[#a5b4fc]"
                          : "bg-[#f0eaff] text-[#7c5cff]"
                        : isDarkMode
                          ? "text-gray-300 hover:bg-gray-800"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div
          className={`flex min-h-0 flex-1 flex-col border-r ${isDarkMode ? "border-gray-700 bg-[#1a1a1a]" : "border-gray-200 bg-white"
            }`}
        >
          <div className={`flex h-16 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"} px-4`}>
            <Link href="/dashboard" className="relative w-[100%] h-full">
              <Image src="/logosbg.svg" alt="Testifolio" fill className="object-contain" />
            </Link>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <nav className="mt-5 flex-1 space-y-1 px-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center rounded-md px-3 py-2 text-sm font-medium",
                      isActive
                        ? isDarkMode
                          ? "bg-[#2d2d3a] text-[#a5b4fc]"
                          : "bg-[#f0eaff] text-[#7c5cff]"
                        : isDarkMode
                          ? "text-gray-300 hover:bg-gray-800"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        isActive
                          ? isDarkMode
                            ? "text-[#a5b4fc]"
                            : "text-[#7c5cff]"
                          : isDarkMode
                            ? "text-gray-400"
                            : "text-gray-400 group-hover:text-gray-500",
                      )}
                    />
                    {item.name}
                  </Link>
                )
              })}
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
                  className={`flex h-4 w-4 items-center justify-center rounded-full transition-all ${isDarkMode ? "ml-6 bg-[#7c5cff]" : "bg-white"
                    }`}
                >
                  {isDarkMode ? <Moon className="h-3 w-3 text-white" /> : <Sun className="h-3 w-3 text-gray-600" />}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div
          className={`sticky top-0 z-10 flex h-16 flex-shrink-0 border-b ${isDarkMode ? "border-gray-700 bg-[#1a1a1a]" : "border-gray-200 bg-white"
            }`}
        >
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1"></div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* Notification bell */}


              {/* Profile dropdown */}
              <div className="relative ml-3">
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`flex max-w-xs items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5cff] focus:ring-offset-2 ${isDarkMode ? "bg-[#1a1a1a]" : "bg-white"
                      }`}
                    id="user-menu-button"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    {isLoading ? (
                      <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
                    ) : user?.user_metadata?.avatar_url ? (
                      <Image
                        className="h-8 w-8 rounded-full"
                        src={user.user_metadata.avatar_url || "/placeholder.svg"}
                        alt=""
                        width={32}
                        height={32}
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7c5cff] text-xs font-medium text-white">
                        {userInitials}
                      </div>
                    )}
                    <span
                      className={`ml-2 hidden text-sm font-medium md:block ${isDarkMode ? "text-white" : "text-gray-700"
                        }`}
                    >
                      {isLoading ? "Loading..." : userName}
                    </span>
                    <ChevronDown className={`ml-1 h-4 w-4 ${isDarkMode ? "text-gray-400" : "text-gray-400"}`} />
                  </button>
                </div>

                {isUserMenuOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-48 origin-top-right rounded-md py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${isDarkMode ? "bg-gray-800" : "bg-white"
                      }`}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex={-1}
                  >
               
                    <Link
                      href="/dashboard/settings"
                      className={`flex items-center px-4 py-2 text-sm ${isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"
                        }`}
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-1"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="mr-3 h-4 w-4" />
                     Account Settings
                    </Link>
                    <div className={`my-1 h-px ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}></div>
                    <button
                      className={`flex w-full items-center px-4 py-2 text-left text-sm ${isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"
                        }`}
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-2"
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        handleLogout()
                      }}
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <main>{children}</main>
      </div>
    </div>
  )
}
