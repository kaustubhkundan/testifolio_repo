import { supabase } from "@/lib/supabase"

interface FacebookReview {
  id: string
  reviewer: {
    name: string
    id: string
    profile_picture?: string
  }
  rating: number
  recommendation_type: string
  review_text: string
  created_time: string
  updated_time: string
}

interface FacebookReviewsResponse {
  data: FacebookReview[]
  paging?: {
    cursors: {
      before: string
      after: string
    }
    next?: string
  }
}

export class FacebookService {
  private static APP_ID = "548829271419261"
  private static APP_SECRET = "2bd6b2ba93a80863632c7d8e9853d60c"
  private static API_VERSION = "v18.0"
  private static API_BASE_URL = `https://graph.facebook.com/${FacebookService.API_VERSION}`
  private static OAUTH_URL = `https://www.facebook.com/${FacebookService.API_VERSION}/dialog/oauth`
  private static REDIRECT_URI =
    typeof window !== "undefined" ? `${window.location.origin}/api/auth/facebook/callback` : ""
  private static SCOPES = ["pages_show_list", "pages_read_engagement", "pages_read_user_content", "business_management"]

  private static async getAccessToken(userId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from("user_integrations")
        .select("access_token, page_access_token, expires_at")
        .eq("user_id", userId)
        .eq("provider", "facebook")
        .single()

      if (error || !data) {
        console.error("No Facebook integration found:", error)
        return null
      }

      // For Facebook, we use the page access token which doesn't expire
      return data.page_access_token || data.access_token
    } catch (error) {
      console.error("Error getting Facebook access token:", error)
      return null
    }
  }

  public static getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: FacebookService.APP_ID,
      redirect_uri: FacebookService.REDIRECT_URI,
      response_type: "code",
      scope: FacebookService.SCOPES.join(","),
    })

    return `${FacebookService.OAUTH_URL}?${params.toString()}`
  }

  public static async getPages(userId: string) {
    const accessToken = await FacebookService.getAccessToken(userId)
    if (!accessToken) {
      throw new Error("No access token available")
    }

    try {
      const response = await fetch(
        `${FacebookService.API_BASE_URL}/me/accounts?access_token=${accessToken}&fields=id,name,picture`,
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch pages: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching Facebook pages:", error)
      throw error
    }
  }

  public static async getReviews(
    userId: string,
    pageId: string,
    options: { limit?: number; after?: string; minRating?: number } = {},
  ): Promise<FacebookReviewsResponse> {
    const accessToken = await FacebookService.getAccessToken(userId)
    if (!accessToken) {
      throw new Error("No access token available")
    }

    try {
      const params = new URLSearchParams({
        access_token: accessToken,
        fields: "recommendation_type,review_text,created_time,updated_time,rating,reviewer{name,id,picture}",
      })

      if (options.limit) params.append("limit", options.limit.toString())
      if (options.after) params.append("after", options.after)

      const response = await fetch(`${FacebookService.API_BASE_URL}/${pageId}/ratings?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.statusText}`)
      }

      const data = await response.json()

      // Filter by minimum rating if specified
      if (options.minRating && data.data) {
        data.data = data.data.filter((review: any) => {
          const rating = review.rating || (review.recommendation_type === "positive" ? 5 : 1)
          return rating >= options.minRating
        })
      }

      return data
    } catch (error) {
      console.error("Error fetching Facebook reviews:", error)
      throw error
    }
  }

  public static async importReviews(userId: string, reviews: FacebookReview[]) {
    try {
      const formattedReviews = reviews.map((review) => ({
        user_id: userId,
        customer_name: review.reviewer.name,
        customer_company: "",
        testimonial_text:
          review.review_text ||
          `${review.recommendation_type === "positive" ? "Recommends" : "Doesn't recommend"} this business`,
        rating: review.rating || (review.recommendation_type === "positive" ? 5 : 1),
        source: "Facebook",
        status: "Pending",
        type: "text",
        customer_avatar: review.reviewer.profile_picture || null,
        date: review.created_time,
        external_id: review.id,
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
      console.error("Error importing Facebook reviews:", error)
      throw error
    }
  }
}
