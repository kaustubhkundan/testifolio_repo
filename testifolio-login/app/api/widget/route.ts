import { supabase } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  // Get configuration from query parameters
  const layout = searchParams.get("layout") || "grid"
  const theme = searchParams.get("theme") || "light"
  const primaryColor = searchParams.get("primaryColor") || "#6366f1"
  const showRating = searchParams.get("showRating") !== "false"
  const showSource = searchParams.get("showSource") !== "false"
  const showAvatar = searchParams.get("showAvatar") !== "false"
  const maxItems = Number.parseInt(searchParams.get("maxItems") || "6", 10)
  const sortBy = searchParams.get("sortBy") || "newest"
  const minRating = Number.parseInt(searchParams.get("minRating") || "1", 10)
  const borderRadius = Number.parseInt(searchParams.get("borderRadius") || "8", 10)
  const padding = Number.parseInt(searchParams.get("padding") || "16", 10)
  const font = searchParams.get("font") || "inter"

  try {
    // Create Supabase client

    // Fetch testimonials
    const query = supabase.from("testimonials").select("*").gte("rating", minRating).limit(maxItems)

    const { data: testimonials, error } = await query

    if (error) {
      throw error
    }

    // Sort testimonials
    const sortedTestimonials = [...(testimonials || [])]

    switch (sortBy) {
      case "newest":
        sortedTestimonials.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case "oldest":
        sortedTestimonials.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case "highest":
        sortedTestimonials.sort((a, b) => b.rating - a.rating)
        break
      case "lowest":
        sortedTestimonials.sort((a, b) => a.rating - b.rating)
        break
      case "random":
        sortedTestimonials.sort(() => Math.random() - 0.5)
        break
    }

    // Generate HTML
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Testimonials Widget</title>
        <style>
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: ${font}, system-ui, sans-serif;
            background-color: transparent;
          }
          
          .container {
            padding: ${padding}px;
          }
          
          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 16px;
          }
          
          .stack {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          
          .testimonial {
            background-color: ${theme === "dark" ? "#1f2937" : "#ffffff"};
            color: ${theme === "dark" ? "#ffffff" : "#000000"};
            border-radius: ${borderRadius}px;
            padding: 16px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            border: ${theme === "dark" ? "none" : "1px solid #e5e7eb"};
          }
          
          .header {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
          }
          
          .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
            margin-right: 12px;
          }
          
          .name {
            font-weight: 600;
            margin-bottom: 2px;
          }
          
          .source {
            font-size: 12px;
            color: ${theme === "dark" ? "#9ca3af" : "#6b7280"};
          }
          
          .rating {
            display: flex;
            margin-bottom: 8px;
          }
          
          .star {
            color: ${primaryColor};
            margin-right: 2px;
          }
          
          .text {
            font-size: 14px;
            line-height: 1.5;
            color: ${theme === "dark" ? "#d1d5db" : "#374151"};
          }
          
          .footer {
            margin-top: 16px;
            font-size: 12px;
            text-align: center;
            color: ${theme === "dark" ? "#9ca3af" : "#6b7280"};
          }
          
          .footer a {
            color: ${primaryColor};
            text-decoration: none;
          }
          
          @media (max-width: 640px) {
            .grid {
              grid-template-columns: 1fr;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="${layout === "grid" ? "grid" : "stack"}">
            ${sortedTestimonials
              .map(
                (testimonial) => `
              <div class="testimonial">
                <div class="header">
                  ${
                    showAvatar && testimonial.avatar
                      ? `
                    <img class="avatar" src="${testimonial.avatar}" alt="${testimonial.name}" />
                  `
                      : ""
                  }
                  <div>
                    <div class="name">${testimonial.name}</div>
                    ${
                      showSource && testimonial.source
                        ? `
                      <div class="source">${testimonial.source}</div>
                    `
                        : ""
                    }
                  </div>
                </div>
                ${
                  showRating
                    ? `
                  <div class="rating">
                    ${Array.from({ length: 5 })
                      .map(
                        (_, i) => `
                      <span class="star">${i < testimonial.rating ? "★" : "☆"}</span>
                    `,
                      )
                      .join("")}
                  </div>
                `
                    : ""
                }
                <div class="text">${testimonial.text}</div>
              </div>
            `,
              )
              .join("")}
          </div>
          <div class="footer">
            Powered by <a href="https://testifolio.com" target="_blank">Testifolio</a>
          </div>
        </div>
        <script>
          // Adjust iframe height to fit content
          window.addEventListener('load', function() {
            const height = document.body.scrollHeight;
            window.parent.postMessage({ type: 'resize', height }, '*');
          });
        </script>
      </body>
      </html>
    `

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
      },
    })
  } catch (error) {
    console.error("Widget error:", error)
    return NextResponse.json({ error: "Failed to load testimonials" }, { status: 500 })
  }
}
