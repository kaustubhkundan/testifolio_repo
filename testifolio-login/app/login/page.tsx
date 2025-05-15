"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { error } = await signIn(email, password)

      if (error) {
        setError(error.message)
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Section */}
      <div className="flex w-full items-center justify-center p-6 md:w-1/2 md:p-12">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <Image src="/title1.svg" alt="TestiFolio Logo" width={60} height={60} className="mb-8 ml-[45%]" />

            <h1 className="mb-4 text-center text-4xl font-bold text-[#16151a]">Welcome to Testifolio</h1>
            <p className="mb-8 text-center text-lg text-[#5b5772]">
              With TestiFolio, you can easily request and showcase testimonials that convert. Start free!
            </p>
          </div>

          {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block font-medium text-[#16151a]">
                Email address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-[#d8d7e0] p-3 focus:outline-none focus:ring-2 focus:ring-[#b066ff]"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block font-medium text-[#16151a]">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-[#d8d7e0] p-3 focus:outline-none focus:ring-2 focus:ring-[#b066ff]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[#b066ff] py-3 font-medium text-white transition-all hover:bg-opacity-90 disabled:opacity-70"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <div className="my-4 flex items-center justify-center">
              <div className="h-px flex-grow bg-[#d8d7e0]"></div>
              <span className="px-4 text-[#706d8a]">OR</span>
              <div className="h-px flex-grow bg-[#d8d7e0]"></div>
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#d8d7e0] bg-[#f7f7f8] py-3 font-medium text-[#403e4e] transition-all hover:bg-gray-50"
            >
              Sign up with Google
              <Image src="/googleimg.svg" alt="Google" width={30} height={30} />
            </button>

            <p className="mt-6 text-center text-[#5b5772]">
              Don't have an account?{" "}
              <Link href="/signup" className="font-medium text-[#b066ff]">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Section */}
      <div className="relative w-full overflow-hidden bg-[#efe7ff] p-6 md:w-1/2 md:p-0">
        <Image src="/rightsection.svg" alt="TestiFolio Logo" width={600} height={600} />
      </div>
    </div>
  )
}
