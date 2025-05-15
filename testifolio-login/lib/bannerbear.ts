// Bannerbear API service using direct API calls

// Types based on the official Bannerbear API documentation
export interface BannerbearTemplate {
    uid: string
    name: string
    preview_url: string
    width: number
    height: number
    tags: string[]
    created_at: string
    modified_at: string
    base_width: number
    base_height: number
    is_approved: boolean
    is_print: boolean
    is_video: boolean
  }
  
  export interface BannerbearModification {
    name: string
    text?: string
    color?: string
    image_url?: string
    hide?: boolean
    border_width?: number
    border_color?: string
    font_family?: string
    font_size?: number
    font_weight?: string
    text_align?: string
    text_color?: string
    text_tracking?: number
    text_line_height?: number
    text_background_color?: string
    text_transform?: string
    text_shadow_color?: string
    text_shadow_offset_x?: number
    text_shadow_offset_y?: number
    text_shadow_blur?: number
    text_shadow_opacity?: number
    text_background_padding?: number
    text_background_border_radius?: number
    text_background_border_width?: number
    text_background_border_color?: string
    text_decoration?: string
    text_decoration_color?: string
    text_decoration_thickness?: number
    opacity?: number
    rotation?: number
    scale?: number
    flip_x?: boolean
    flip_y?: boolean
    preserve_text_colors?: boolean
    child_modifications?: BannerbearModification[]
  }
  
  export interface BannerbearImageParams {
    template: string
    modifications: BannerbearModification[]
    webhook_url?: string
    metadata?: Record<string, any>
    transparent?: boolean
    synchronous?: boolean
  }
  
  export interface BannerbearImageResponse {
    uid: string
    created_at: string
    status: "pending" | "completed" | "error"
    self_url?: string
    image_url?: string
    image_url_png?: string
    image_url_jpg?: string
    template?: string
    modifications?: BannerbearModification[]
    webhook_url?: string
    metadata?: Record<string, any>
    error?: string
  }
  
  // API configuration
  const API_KEY = process.env.NEXT_PUBLIC_BANNERBEAR_API_KEY || "bb_pr_497a3e60bc8b288109eb2e4ebb7a82"
  const API_URL = "https://api.bannerbear.com/v2"
  
  /**
   * Get all templates from the Bannerbear account
   */
  export async function getTemplates(): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/templates`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      })
  
      if (!response.ok) {
        throw new Error(`Failed to fetch templates: ${response.status}`)
      }
  
      const templates = await response.json()
      console.log("templates===",templates)
      return templates
    } catch (error) {
      console.error("Error fetching Bannerbear templates:", error)
      // Return mock templates for development/fallback
    }
  }
  
  /**
   * Get a specific template by ID
   */
  export async function getTemplateById(templateId: string): Promise<BannerbearTemplate | null> {
    try {
      const response = await fetch(`${API_URL}/templates/${templateId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      })
  
      if (!response.ok) {
        throw new Error(`Failed to fetch template: ${response.status}`)
      }
  
      const template = await response.json()
      return template
    } catch (error) {
      console.error(`Error fetching Bannerbear template ${templateId}:`, error)
      return null
    }
  }
  
  /**
   * Create an image using the Bannerbear API
   */
  export async function createImage(params: BannerbearImageParams): Promise<BannerbearImageResponse> {
    try {
      // Use exactly the data structure shown in the example
      const data = {
        template: params.template,
        modifications: params.modifications,
      }
  
      // Use the exact fetch pattern provided in the example
      const response = await fetch("https://api.bannerbear.com/v2/images", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      })
  
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to create image: ${response.status} - ${errorText}`)
      }
  
      const image = await response.json()
      return image
    } catch (error) {
      console.error("Error creating Bannerbear image:", error)
      throw error
    }
  }
  
  /**
   * Poll for image status until it's completed or errored
   */
  async function pollImageStatus(imageId: string, maxAttempts = 10): Promise<BannerbearImageResponse> {
    let attempts = 0
  
    while (attempts < maxAttempts) {
      const image = await getImage(imageId)
  
      if (image.status === "completed" || image.status === "error") {
        return image
      }
  
      // Wait for 1 second before trying again
      await new Promise((resolve) => setTimeout(resolve, 1000))
      attempts++
    }
  
    throw new Error(`Image generation timed out after ${maxAttempts} attempts`)
  }
  
  /**
   * Get an image by ID
   */
  export async function getImage(imageId: string): Promise<BannerbearImageResponse> {
    try {
      const response = await fetch(`${API_URL}/images/${imageId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      })
  
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`)
      }
  
      const image = await response.json()
      return image
    } catch (error) {
      console.error(`Error fetching Bannerbear image ${imageId}:`, error)
      throw error
    }
  }
  
  /**
   * List all collections
   */
  export async function getCollections() {
    try {
      const response = await fetch(`${API_URL}/collections`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      })
  
      if (!response.ok) {
        throw new Error(`Failed to fetch collections: ${response.status}`)
      }
  
      const collections = await response.json()
      return collections
    } catch (error) {
      console.error("Error fetching Bannerbear collections:", error)
      return []
    }
  }
  
  /**
   * Create a screenshot using Bannerbear
   */
  export async function createScreenshot(url: string, options: any = {}) {
    try {
      const requestBody = {
        url,
        ...options,
      }
  
      const response = await fetch(`${API_URL}/screenshots`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
  
      if (!response.ok) {
        throw new Error(`Failed to create screenshot: ${response.status}`)
      }
  
      const screenshot = await response.json()
      return screenshot
    } catch (error) {
      console.error("Error creating screenshot:", error)
      throw error
    }
  }
  
  /**
   * Create an animated GIF using Bannerbear
   */
  export async function createAnimatedGif(params: any) {
    try {
      const response = await fetch(`${API_URL}/animated_gifs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      })
  
      if (!response.ok) {
        throw new Error(`Failed to create animated GIF: ${response.status}`)
      }
  
      const gif = await response.json()
      return gif
    } catch (error) {
      console.error("Error creating animated GIF:", error)
      throw error
    }
  }
  
  /**
   * Create a video using Bannerbear
   */
  export async function createVideo(params: any) {
    try {
      const response = await fetch(`${API_URL}/videos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      })
  
      if (!response.ok) {
        throw new Error(`Failed to create video: ${response.status}`)
      }
  
      const video = await response.json()
      return video
    } catch (error) {
      console.error("Error creating video:", error)
      throw error
    }
  }
  
  // Mock templates for development/fallback

  