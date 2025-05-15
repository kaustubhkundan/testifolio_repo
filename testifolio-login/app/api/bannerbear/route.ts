import { NextResponse } from "next/server"
import { createImage } from "@/lib/bannerbear"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { template_id, modifications, transparent, metadata } = body

    // Validate required fields
    if (!template_id) {
      return NextResponse.json({ error: "Template ID is required" }, { status: 400 })
    }

    // Create the image using the Bannerbear API
    const image = await createImage({
      template: template_id,
      modifications: modifications || [],
      transparent: transparent || false,
      metadata: metadata || {},
      synchronous: true, // Wait for the image to be generated
    })

    return NextResponse.json(image)
  } catch (error) {
    console.error("Error in Bannerbear API route:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 },
    )
  }
}
