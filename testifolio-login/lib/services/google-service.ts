import { supabase } from "@/lib/supabase"

interface GoogleReview {
  name: string
  reviewId: string
  reviewer: {
    displayName: string
    profilePhotoUrl?: string
  }
  starRating: number
  comment: string
  createTime: string
  updateTime: string
}

interface GoogleReviewsResponse {
  reviews: GoogleReview[]
  nextPageToken?: string
}

export class GoogleService {
  private static PROJECT_ID = "64574251379"
  private static CLIENT_ID = "64574251379-tvptmpcv70v3c3ticmi7ast520r0u12i.apps.googleusercontent.com"
  private static CLIENT_SECRET = "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"
  private static API_BASE_URL = "https://mybusinessbusinessinformation.googleapis.com/v1"
  private static REVIEWS_API_URL = "https://mybusinessaccountmanagement.googleapis.com/v1"
  private static OAUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
  private static TOKEN_URL = "https://oauth2.googleapis.com/token"
  private static REDIRECT_URI =
    typeof window !== "undefined" ? `${window.location.origin}/api/auth/google/callback` : ""
  private static SCOPES = [
    "https://www.googleapis.com/auth/business.manage",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ]

  private static async getAccessToken(userId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from("user_integrations")
        .select("access_token, refresh_token, expires_at")
        .eq("user_id", userId)
        .eq("provider", "google")
        .single()

      if (error || !data) {
        console.error("No Google integration found:", error)
        return null
      }

      // Check if token is expired
      if (new Date(data.expires_at) <= new Date()) {
        return await GoogleService.refreshToken(userId, data.refresh_token)
      }

      return data.access_token
    } catch (error) {
      console.error("Error getting Google access token:", error)
      return null
    }
  }

  private static async refreshToken(userId: string, refreshToken: string): Promise<string | null> {
    try {
      const response = await fetch(GoogleService.TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: GoogleService.CLIENT_ID,
          client_secret: GoogleService.CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error_description || "Failed to refresh token")
      }

      // Calculate expiry time
      const expiresAt = new Date()
      expiresAt.setSeconds(expiresAt.getSeconds() + data.expires_in)

      // Update token in database
      const { error } = await supabase
        .from("user_integrations")
        .update({
          access_token: data.access_token,
          expires_at: expiresAt.toISOString(),
        })
        .eq("user_id", userId)
        .eq("provider", "google")

      if (error) {
        console.error("Error updating Google token:", error)
        return null
      }

      return data.access_token
    } catch (error) {
      console.error("Error refreshing Google token:", error)
      return null
    }
  }

  public static getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: GoogleService.CLIENT_ID,
      redirect_uri: GoogleService.REDIRECT_URI,
      response_type: "code",
      scope: GoogleService.SCOPES.join(" "),
      access_type: "offline",
      prompt: "consent",
    })

    return `${GoogleService.OAUTH_URL}?${params.toString()}`
  }

  public static async getLocations(userId: string) {
    const accessToken = await GoogleService.getAccessToken(userId)
    if (!accessToken) {
      throw new Error("No access token available")
    }

    try {
      // First get accounts
      const accountsResponse = await fetch(`${GoogleService.REVIEWS_API_URL}/accounts`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!accountsResponse.ok) {
        throw new Error(`Failed to fetch accounts: ${accountsResponse.statusText}`)
      }

      const accountsData = await accountsResponse.json()

      if (!accountsData.accounts || accountsData.accounts.length === 0) {
        return { locations: [] }
      }

      // Get locations for the first account
      const accountName = accountsData.accounts[0].name
      const locationsResponse = await fetch(`${GoogleService.API_BASE_URL}/${accountName}/locations`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!locationsResponse.ok) {
        throw new Error(`Failed to fetch locations: ${locationsResponse.statusText}`)
      }

      return await locationsResponse.json()
    } catch (error) {
      console.error("Error fetching Google locations:", error)
      throw error
    }
  }

  public static async getReviews(
    userId: string,
    locationId: string,
    options: { pageSize?: number; pageToken?: string; minRating?: number } = {},
  ): Promise<GoogleReviewsResponse> {
    const accessToken = await GoogleService.getAccessToken(userId)
    if (!accessToken) {
      throw new Error("No access token available")
    }

    try {
      const params = new URLSearchParams()
      if (options.pageSize) params.append("pageSize", options.pageSize.toString())
      if (options.pageToken) params.append("pageToken", options.pageToken)

      const response = await fetch(`${GoogleService.API_BASE_URL}/${locationId}/reviews?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.statusText}`)
      }

      const data = await response.json()

      // Filter by minimum rating if specified
      if (options.minRating && data.reviews) {
        data.reviews = data.reviews.filter((review: any) => review.starRating >= options.minRating)
      }

      return data
    } catch (error) {
      console.error("Error fetching Google reviews:", error)
      throw error
    }
  }

  public static async importReviews(userId: string, reviews: GoogleReview[]) {
    try {
      const formattedReviews = reviews.map((review) => ({
        user_id: userId,
        customer_name: review.reviewer.displayName,
        customer_company: "",
        testimonial_text: review.comment,
        rating: review.starRating,
        source: "Google",
        status: "Pending",
        type: "text",
        customer_avatar: review.reviewer.profilePhotoUrl || null,
        date: review.createTime,
        external_id: review.reviewId,
      }))

      const { data, error } = await supabase
        .from("testimonials")
        .upsert(formattedReviews, { onConflict: "external_id" })
        .select()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error("Error importing Google reviews:", error)
      throw error
    }
  }
}
