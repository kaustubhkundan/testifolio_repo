import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Check if Supabase environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://thgosbnauranvpggnpjr.supabase.co"
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoZ29zYm5hdXJhbnZwZ2ducGpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzIxNjEzNywiZXhwIjoyMDYyNzkyMTM3fQ.40bbH914iXLSPXMklGzF6T_617_HNlu3LXAVGvi0XXU"

  // If environment variables are not set, just proceed without auth checks
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables are not set. Authentication will not work.")
    return res
  }

  try {
    const supabase = createMiddlewareClient({ req, res })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If user is logged in and trying to access the landing page, redirect to dashboard
    if (session && req.nextUrl.pathname === "/") {
      const redirectUrl = new URL("/dashboard", req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // If user is not logged in and trying to access protected routes
    if (
      !session &&
      (req.nextUrl.pathname.startsWith("/dashboard") ||
        req.nextUrl.pathname.startsWith("/business-details") ||
        req.nextUrl.pathname.startsWith("/goals"))
    ) {
      const redirectUrl = new URL("/login", req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // If user is logged in but hasn't completed onboarding
    if (session) {
      // Check if user has completed onboarding
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("user_id", session.user.id)
        .single()

      // If user hasn't completed onboarding and is trying to access dashboard
      if (profile && !profile.onboarding_completed && req.nextUrl.pathname.startsWith("/dashboard")) {
        const redirectUrl = new URL("/business-details", req.url)
        return NextResponse.redirect(redirectUrl)
      }
    }
  } catch (error) {
    console.error("Error in middleware:", error)
  }

  return res
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/business-details", "/goals", "/login", "/signup"],
}
