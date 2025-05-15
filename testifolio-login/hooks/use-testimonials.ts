"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://thgosbnauranvpggnpjr.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoZ29zYm5hdXJhbnZwZ2ducGpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzIxNjEzNywiZXhwIjoyMDYyNzkyMTM3fQ.40bbH914iXLSPXMklGzF6T_617_HNlu3LXAVGvi0XXU"

const supabase = createClient(supabaseUrl, supabaseKey)



export interface Testimonial {
  id: string
  name: string
  text: string
  rating: number
  source: string
  avatar_url?: string
  company?: string
  job_title?: string
  created_at: string
}

export function useTestimonials(limit = 100) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        setLoading(true)

        // First try to fetch from form_responses table
        const { data: formResponses, error: formError } = await supabase
          .from("form_responses")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(limit)

        // If that fails, try the testimonials table
        if (formError) {
          console.log("Trying testimonials table instead:", formError.message)
          const { data: testimonialData, error: testimonialError } = await supabase
            .from("testimonials")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(limit)

          if (testimonialError) throw testimonialError

          // Map testimonials table data to our format
          const formattedTestimonials =
            testimonialData?.map((item) => ({
              id: item.id,
              name: item.name,
              text: item.text,
              rating: item.rating || 5,
              source: item.source || "Website",
              avatar_url: item.avatar_url || getDefaultAvatar(item.name),
              company: item.company,
              job_title: item.job_title,
              created_at: item.created_at,
            })) || []

          setTestimonials(formattedTestimonials)
        } else {
          // Map form_responses data to our format
          const formattedTestimonials =
            formResponses?.map((item) => ({
              id: item.id,
              name: item.customer_name,
              text: item.testimonial_text,
              rating: item.rating || 5,
              source: item.status || "Website",
              avatar_url: item.avatar_url || getDefaultAvatar(item.customer_name),
              company: item.customer_company,
              job_title: item.customer_job_title,
              created_at: item.created_at,
            })) || []

          setTestimonials(formattedTestimonials)
        }
      } catch (err) {
        console.error("Error fetching testimonials:", err)
        setError(err instanceof Error ? err : new Error("Failed to fetch testimonials"))

        // Always fall back to mock data if there's an error
        setTestimonials(getMockTestimonials())
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [limit])

  return { testimonials, loading, error }
}

// Helper function to get a default avatar based on name
function getDefaultAvatar(name: string): string {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  // Return a placeholder with initials
  return `/placeholder.svg?height=200&width=200&query=${initials}`
}

// Mock testimonials for development/fallback
function getMockTestimonials(): Testimonial[] {
  return [
    {
      id: "1",
      name: "Sarah Johnson",
      text: "This product has completely transformed our business. The customer service is outstanding and the features are exactly what we needed.",
      rating: 5,
      source: "Google",
      avatar_url: "/avatars/sara.png",
      company: "Johnson Design",
      job_title: "Creative Director",
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Michael Chen",
      text: "I was skeptical at first, but after using this service for a month, I can confidently say it's worth every penny. Highly recommended!",
      rating: 5,
      source: "Facebook",
      avatar_url: "/avatars/michael.png",
      company: "Tech Innovations",
      job_title: "CTO",
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Emily Davis",
      text: "The platform is intuitive and easy to use. It has saved us countless hours of manual work.",
      rating: 4,
      source: "Yelp",
      avatar_url: "/avatars/emily.png",
      company: "Davis Marketing",
      job_title: "Marketing Manager",
      created_at: new Date().toISOString(),
    },
    {
      id: "4",
      name: "David Wilson",
      text: "Great value for money. The features are comprehensive and the support team is always ready to help.",
      rating: 5,
      source: "Amazon",
      avatar_url: "/avatars/david.png",
      company: "Wilson Consulting",
      job_title: "Senior Consultant",
      created_at: new Date().toISOString(),
    },
    {
      id: "5",
      name: "Lisa Thompson",
      text: "This tool has become an essential part of our daily operations. I can't imagine working without it now.",
      rating: 5,
      source: "Google",
      avatar_url: "/avatars/lisa.png",
      company: "Global Solutions",
      job_title: "Operations Manager",
      created_at: new Date().toISOString(),
    },
    {
      id: "6",
      name: "James Anderson",
      text: "The customer support is exceptional. They helped me set everything up and were always available when I had questions.",
      rating: 5,
      source: "Trustpilot",
      avatar_url: "/avatars/james.png",
      company: "Anderson & Co",
      job_title: "Founder",
      created_at: new Date().toISOString(),
    },
    {
      id: "7",
      name: "Saira Selene",
      text: "I have been doing my taxes for more than 10 years and never have a problem with them. Always polite and available to help you no matter the day or time.",
      rating: 5,
      source: "Google",
      avatar_url: "/avatars/saira.png",
      created_at: new Date().toISOString(),
    },
    {
      id: "8",
      name: "Rosie Flores",
      text: "My family has been going to Medinas for years. It's always pleasurable. Rene and his staff are so friendly always.",
      rating: 5,
      source: "Google",
      avatar_url: "/avatars/rosie.png",
      created_at: new Date().toISOString(),
    },
    {
      id: "9",
      name: "Walter Moran",
      text: "I've been doing my Taxes for over 15 years with Medina's Tax Services Never had a problem with the I.R.S ! I highly recommend them!!",
      rating: 5,
      source: "Google",
      avatar_url: "/avatars/walter.png",
      created_at: new Date().toISOString(),
    },
  ]
}
