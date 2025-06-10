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
    // Exchange code for access token
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?` +
        new URLSearchParams({
          client_id: "548829271419261",
          client_secret: "2bd6b2ba93a80863632c7d8e9853d60c",
          redirect_uri: `${request.nextUrl.origin}/api/auth/facebook/callback`,
          code,
        }),
    )

    const tokens = await tokenResponse.json()

    if (!tokenResponse.ok) {
      throw new Error(tokens.error?.message || "Failed to exchange code for tokens")
    }

    // Get user info
    const userResponse = await fetch(
      `https://graph.facebook.com/v18.0/me?fields=id,name,email&access_token=${tokens.access_token}`,
    )

    const facebookUserInfo = await userResponse.json()

    if (!userResponse.ok) {
      throw new Error("Failed to get user info")
    }

    // Get user's pages with long-lived page tokens
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${tokens.access_token}`,
    )

    const pagesData = await pagesResponse.json()
    const pageAccessToken = pagesData.data?.[0]?.access_token || null

    // Get the current user from session/auth context
    const currentUserId = state || "current-user-id" // This should come from your auth system

    // Store integration in database
    const { error: dbError } = await supabase.from("user_integrations").upsert(
      {
        user_id: currentUserId, // Use your actual user ID from session
        provider: "facebook",
        provider_user_id: facebookUserInfo.id,
        access_token: tokens.access_token,
        page_access_token: pageAccessToken,
        expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
        user_email: facebookUserInfo.email,
        user_name: facebookUserInfo.name,
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
            type: 'FACEBOOK_AUTH_SUCCESS',
            provider: 'facebook',
            user: {
              name: '${facebookUserInfo.name}',
              email: '${facebookUserInfo.email || ""}'
            }
          }, '*');
          window.close();
        } else {
          window.location.href = '/dashboard/settings?success=facebook_connected';
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
    console.error("Facebook OAuth error:", error)
    return new NextResponse(
      `
      <script>
        if (window.opener) {
          window.opener.postMessage({ 
            type: 'FACEBOOK_AUTH_ERROR',
            error: 'Failed to connect Facebook account'
          }, '*');
          window.close();
        } else {
          window.location.href = '/dashboard/settings?error=facebook_failed';
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
