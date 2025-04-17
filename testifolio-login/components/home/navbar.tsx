"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="flex items-center">
            <div className="mr-1 h-6 w-6 rounded-full bg-[#7c5cff] text-white">
              <span className="flex h-full w-full items-center justify-center text-xs font-bold">T</span>
            </div>
            <span className="text-2xl font-bold text-[#7c5cff]">testifolio</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-10">
            <li>
              <Link href="/features" className="text-base text-gray-700 hover:text-gray-900">
                Features
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-base text-gray-700 hover:text-gray-900">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/customers" className="text-base text-gray-700 hover:text-gray-900">
                Customers
              </Link>
            </li>
            <li>
              <Link href="/resources" className="text-base text-gray-700 hover:text-gray-900">
                Resources
              </Link>
            </li>
          </ul>
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden items-center space-x-4 md:flex">
        <Link
            href="/dashboard"
            className="rounded-full bg-[#2d3748] px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1a202c]"
          >
            Dashboard
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-[#2d3748] px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1a202c]"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-[#7c5cff] px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#6a4ddb]"
          >
            Sign up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-gray-100 md:hidden">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/features" className="text-base text-gray-700 hover:text-gray-900">
                Features
              </Link>
              <Link href="/pricing" className="text-base text-gray-700 hover:text-gray-900">
                Pricing
              </Link>
              <Link href="/customers" className="text-base text-gray-700 hover:text-gray-900">
                Customers
              </Link>
              <Link href="/resources" className="text-base text-gray-700 hover:text-gray-900">
                Resources
              </Link>
              <div className="flex flex-col space-y-3 pt-4">
                <Link
                  href="/login"
                  className="rounded-full bg-[#2d3748] px-8 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-[#1a202c]"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-[#7c5cff] px-8 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-[#6a4ddb]"
                >
                  Sign up
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
