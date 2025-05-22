"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronRight, Edit, Eye, FileText, MessageSquare, Plus, Send, Share2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import DashboardLayout from "@/components/dashboard/dashboard-layout"

// Define types for our data
type Testimonial = {
  id: number
  customer_name: string
  customer_company: string
  customer_avatar: string
  type: string
  status: "Approved" | "Pending" | "Published"
  engagement: string
  ai_score: string
  created_at: string
}

type DashboardStats = {
  totalTestimonials: number
  awaitingApproval: number
  newTestimonials: number
  conversionImpact: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTestimonials: 0,
    awaitingApproval: 0,
    newTestimonials: 0,
    conversionImpact: 0,
  })
  const [recentTestimonials, setRecentTestimonials] = useState<Testimonial[]>([])
  const [isStatsLoading, setIsStatsLoading] = useState(true)
  const [isTestimonialsLoading, setIsTestimonialsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, profile } = useAuth()
  const router = useRouter()

  // Memoize the fetchDashboardStats function to prevent unnecessary re-renders
  const fetchDashboardStats = useCallback(async () => {
    if (!user) return

    try {
      setIsStatsLoading(true)

      // Get total testimonials count
      const { count: totalCount, error: totalError } = await supabase
        .from("testimonials")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)

      if (totalError) throw totalError

      // Get awaiting approval count
      const { count: pendingCount, error: pendingError } = await supabase
        .from("testimonials")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "Pending")

      if (pendingError) throw pendingError

      // Get new testimonials in last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { count: newCount, error: newError } = await supabase
        .from("testimonials")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", thirtyDaysAgo.toISOString())

      if (newError) throw newError

      // For conversion impact, we would typically calculate this based on analytics
      // For now, we'll use a placeholder value or calculate it based on available data
      const conversionImpact = Math.round((totalCount || 0) > 0 ? ((newCount || 0) / (totalCount || 1)) * 100 : 0)

      setStats({
        totalTestimonials: totalCount || 0,
        awaitingApproval: pendingCount || 0,
        newTestimonials: newCount || 0,
        conversionImpact: conversionImpact > 0 ? conversionImpact : 0,
      })
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      setError("Failed to load dashboard statistics")
    } finally {
      setIsStatsLoading(false)
    }
  }, [user])

  // Memoize the fetchRecentTestimonials function to prevent unnecessary re-renders
  const fetchRecentTestimonials = useCallback(async () => {
    if (!user) return

    try {
      setIsTestimonialsLoading(true)

      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(4)

      if (error) throw error

      if (data) {
        // Map the database data to our component format
        const formattedTestimonials = data.map((item) => ({
          id: item.id,
          customer_name: item.customer_name,
          customer_company: item.customer_company,
          customer_avatar: item.customer_avatar || "/stylized-jc-initials.png", // Default avatar if none
          type: item.type || "Written Testimonials",
          status: item.status || "Pending",
          engagement: item.engagement || "0",
          ai_score: item.ai_score || "0%",
          created_at: item.created_at,
        }))

        setRecentTestimonials(formattedTestimonials)
      } else {
        // If no data, set empty array (not dummy data)
        setRecentTestimonials([])
      }
    } catch (error) {
      console.error("Error fetching recent testimonials:", error)
      setError("Failed to load recent testimonials")
      setRecentTestimonials([]) // Set empty array, not dummy data
    } finally {
      setIsTestimonialsLoading(false)
    }
  }, [user])

  // Fetch dashboard stats and testimonials
  useEffect(() => {
    if (recentTestimonials.length > 0 && !isTestimonialsLoading) return

    if (user) {
      // Fetch data in parallel
      Promise.all([fetchDashboardStats(), fetchRecentTestimonials()]).catch((error) => {
        console.error("Error fetching dashboard data:", error)
      })
    }
  }, [user, fetchDashboardStats, fetchRecentTestimonials])

  // Set up real-time subscription for testimonials
  useEffect(() => {
    if (!user) return

    // Subscribe to changes in the testimonials table
    const subscription = supabase
      .channel("testimonials-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "testimonials",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          // Refresh the testimonials data when changes occur
          fetchRecentTestimonials()
          fetchDashboardStats()
        },
      )
      .subscribe()

    // Cleanup function to remove the subscription
    return () => {
      supabase.removeChannel(subscription)
    }
  }, [user, fetchRecentTestimonials, fetchDashboardStats])

  // Redirect if not authenticated
  useEffect(() => {
    if (!user && !isStatsLoading && !isTestimonialsLoading) {
      router.push("/login")
    }
  }, [user, isStatsLoading, isTestimonialsLoading, router])

  return (
    <>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-medium text-gray-800">
            Welcome back, {profile?.business_name || user?.email?.split("@")[0] || "User"}! Here&apos;s what&apos;s
            happening with your testimonials.
          </h2>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Stats Card 1 */}
          <div className="rounded-lg bg-[#a5b4fc] p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                {isStatsLoading ? (
                  <div className="h-10 w-16 animate-pulse rounded bg-[#818cf8]/50"></div>
                ) : (
                  <div className="text-4xl font-bold">{stats.totalTestimonials.toLocaleString()}</div>
                )}
                <div className="mt-1 text-sm">Total Testimonials</div>
              </div>
              <div className="rounded-full bg-[#818cf8] p-2">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Stats Card 2 */}
          <div className="rounded-lg bg-[#a5b4fc] p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                {isStatsLoading ? (
                  <div className="h-10 w-16 animate-pulse rounded bg-[#818cf8]/50"></div>
                ) : (
                  <div className="text-4xl font-bold">{stats.awaitingApproval}</div>
                )}
                <div className="mt-1 text-sm">Awaiting Approval</div>
              </div>
              <div className="rounded-full bg-[#818cf8] p-2">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Stats Card 3 */}
          <div className="rounded-lg bg-[#a5b4fc] p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                {isStatsLoading ? (
                  <div className="h-10 w-16 animate-pulse rounded bg-[#818cf8]/50"></div>
                ) : (
                  <div className="text-4xl font-bold">{stats.newTestimonials}</div>
                )}
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

          {/* Stats Card 4 */}
          <div className="rounded-lg bg-[#a5b4fc] p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                {isStatsLoading ? (
                  <div className="h-10 w-16 animate-pulse rounded bg-[#818cf8]/50"></div>
                ) : (
                  <div className="text-4xl font-bold">{stats.conversionImpact}%</div>
                )}
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
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#7c5cff]">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <h3 className="mb-2 text-lg font-medium">Create a New Form</h3>
            <p className="mb-4 text-sm text-gray-600">
              Use forms to collect testimonials and feedback from your customers.
            </p>
            <Link href="/dashboard/collection-forms" className="block w-full">
              <button className="w-full rounded-lg bg-[#a5b4fc] py-2 text-center text-white hover:bg-[#818cf8]">
                View Forms
              </button>
            </Link>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#7c5cff]">
              <Send className="h-5 w-5 text-white" />
            </div>
            <h3 className="mb-2 text-lg font-medium">Send a Testimonial Request</h3>
            <p className="mb-4 text-sm text-gray-600">Reach out to customers for new testimonials</p>
            <Link href="/dashboard/testimonials" className="block w-full">
              <button className="w-full rounded-lg bg-[#a5b4fc] py-2 text-center text-white hover:bg-[#818cf8]">
                Request a Testimonial
              </button>
            </Link>
          </div>

          <div className="rounded-lg border border-[#7c5cff] bg-white p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#7c5cff]">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <h3 className="mb-2 text-lg font-medium">Create a Social Post</h3>
            <p className="mb-4 text-sm text-gray-600">Craft engaging content to share with your audience.</p>
            <Link href="/dashboard/creative-studio" className="block w-full">
              <button className="w-full rounded-lg bg-[#a5b4fc] py-2 text-center text-white hover:bg-[#818cf8]">
                Create a Social Post
              </button>
            </Link>
          </div>
        </div>

        {/* Recent Testimonials */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-medium text-gray-800">Recent Testimonials</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button className="flex items-center gap-2 rounded-md bg-gray-200 px-3 py-1.5 text-sm text-gray-700">
                  <span>Recent</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <Link href="/dashboard/testimonials">
                <button className="flex items-center gap-2 rounded-md bg-gray-800 px-3 py-1.5 text-sm text-white">
                  <Plus className="h-4 w-4" />
                  <span>Add New</span>
                </button>
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            {isTestimonialsLoading ? (
              <div className="p-6">
                <div className="flex animate-pulse space-x-4">
                  <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 w-3/4 rounded bg-gray-300"></div>
                    <div className="space-y-2">
                      <div className="h-4 rounded bg-gray-300"></div>
                      <div className="h-4 w-5/6 rounded bg-gray-300"></div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex animate-pulse space-x-4">
                  <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 w-3/4 rounded bg-gray-300"></div>
                    <div className="space-y-2">
                      <div className="h-4 rounded bg-gray-300"></div>
                      <div className="h-4 w-5/6 rounded bg-gray-300"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">
                <p>{error}</p>
                <button
                  onClick={() => {
                    setError(null)
                    fetchRecentTestimonials()
                  }}
                  className="mt-2 text-sm text-[#7c5cff] hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-left text-sm text-gray-600">
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
                  <tbody className="divide-y divide-gray-200">
                    {recentTestimonials.length > 0 ? (
                      recentTestimonials.map((testimonial) => (
                        <tr key={testimonial.id} className="text-gray-700">
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                                <Image
                                  src={testimonial.customer_avatar || "/placeholder.svg"}
                                  alt={testimonial.customer_name}
                                  fill
                                />
                              </div>
                              <div>
                                <div className="font-medium">{testimonial.customer_name}</div>
                                <div className="text-sm text-gray-500">{testimonial.customer_company}</div>
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
                          <td className="whitespace-nowrap px-6 py-4">{testimonial.ai_score}</td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex items-center gap-2" onClick={() => window.open("/dashboard/testimonials", "_self")}>
                              <button className="rounded-full bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="rounded-full bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="rounded-full bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200">
                                <Share2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center">
                          <div className="mx-auto max-w-md">
                            <div className="mb-4 text-center">
                              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f0eaff]">
                                <MessageSquare className="h-6 w-6 text-[#7c5cff]" />
                              </div>
                              <h3 className="text-lg font-medium text-gray-900">No testimonials yet</h3>
                              <p className="mt-1 text-sm text-gray-500">
                                Get started by collecting testimonials from your customers.
                              </p>
                            </div>
                            <Link href="/dashboard/testimonials" className="block w-full">
                              <button className="mx-auto flex items-center justify-center gap-2 rounded-md bg-[#7c5cff] px-4 py-2 text-sm font-medium text-white hover:bg-[#6a4ddb]">
                                <Plus className="h-4 w-4" />
                                <span>Collect Your First Testimonial</span>
                              </button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
