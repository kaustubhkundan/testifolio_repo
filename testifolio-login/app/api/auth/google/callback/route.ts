import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const error = searchParams.get("error")
  const state = searchParams.get("state") // This should contain the user ID

  if (error) {
    return NextResponse.redirect(new URL(`/dashboard?error=${error}`, request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL("/dashboard?error=no_code", request.url))
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: "64574251379-tvptmpcv70v3c3ticmi7ast520r0u12i.apps.googleusercontent.com",
        client_secret: "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",
        code,
        grant_type: "authorization_code",
        redirect_uri: `${request.nextUrl.origin}/api/auth/google/callback`,
      }),
    })

    const tokens = await tokenResponse.json()

    if (!tokenResponse.ok) {
      throw new Error(tokens.error_description || "Failed to exchange code for tokens")
    }

    // Get user info from Google
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    const googleUserInfo = await userResponse.json()

    if (!userResponse.ok) {
      throw new Error("Failed to get user info")
    }

    // Calculate expiry time
    const expiresAt = new Date()
    expiresAt.setSeconds(expiresAt.getSeconds() + tokens.expires_in)

    // Get the current user from session/auth context
    // For now, we'll use a placeholder - you'll need to implement proper user session handling
    const currentUserId = state || "current-user-id" // This should come from your auth system

    // Store integration in database
    const { error: dbError } = await supabase.from("user_integrations").upsert(
      {
        user_id: currentUserId, // Use your actual user ID from session
        provider: "google",
        provider_user_id: googleUserInfo.id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: expiresAt.toISOString(),
        user_email: googleUserInfo.email,
        user_name: googleUserInfo.name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,provider" },
    )

    if (dbError) {
      console.error("Database error:", dbError)
      throw dbError
    }

    // Close popup and notify parent window
    return new NextResponse(
      `
      <script>
        if (window.opener) {
          window.opener.postMessage({ 
            type: 'GOOGLE_AUTH_SUCCESS',
            provider: 'google',
            user: {
              name: '${googleUserInfo.name}',
              email: '${googleUserInfo.email}'
            }
          }, '*');
          window.close();
        } else {
          window.location.href = '/dashboard/settings?success=google_connected';
        }
      </script>
      `,
      {
        headers: {
          "Content-Type": "text/html",
        },
      },
    )
  } catch (error) {
    console.error("Google OAuth error:", error)
    return new NextResponse(
      `
      <script>
        if (window.opener) {
          window.opener.postMessage({ 
            type: 'GOOGLE_AUTH_ERROR',
            error: 'Failed to connect Google account'
          }, '*');
          window.close();
        } else {
          window.location.href = '/dashboard/settings?error=google_failed';
        }
      </script>
      `,
      {
        headers: {
          "Content-Type": "text/html",
        },
      },
    )
  }
}
