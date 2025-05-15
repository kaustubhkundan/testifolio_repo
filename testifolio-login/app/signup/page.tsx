"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { error } = await signUp(email, password)

      if (error) {
        setError(error.message)
      } else {
        // Redirect to the first step of onboarding
        router.push("/business-details")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Signup Form */}
      <div className="flex w-full flex-col justify-center px-4 sm:w-1/2 sm:px-6 md:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex justify-center">
            <Link href="/">
              <div className="flex items-center">
                <div className="mr-1 h-6 w-6 rounded-full bg-[#7c5cff] text-white">
                  <span className="flex h-full w-full items-center justify-center text-xs font-bold">T</span>
                </div>
                <span className="text-2xl font-bold text-[#7c5cff]">testifolio</span>
              </div>
            </Link>
          </div>

          <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">Create your account</h2>

          {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#7c5cff] focus:outline-none focus:ring-[#7c5cff]"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#7c5cff] focus:outline-none focus:ring-[#7c5cff]"
              />
              <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md border border-transparent bg-[#7c5cff] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#6a4ddb] focus:outline-none focus:ring-2 focus:ring-[#7c5cff] focus:ring-offset-2 disabled:opacity-75"
              >
                {isLoading ? "Creating account..." : "Create account"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[#7c5cff] hover:text-[#6a4ddb]">
              Sign in
            </Link>
          </p>
        </div>
      </div>

            {/* Right Section */}
            <div className="w-full md:w-1/2 bg-[#efe7ff] p-6 md:p-0 relative overflow-hidden">
            <Image src="/rightsection.svg" alt="TestiFolio Logo" width={600} height={600} />

            </div>
        </div>
    )
}
