"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { getTemplates, type BannerbearTemplate } from "@/lib/bannerbear"

interface TemplateSelectorProps {
  onSelectTemplate: (template: BannerbearTemplate) => void
  selectedTemplateId?: string
}

export function TemplateSelector({ onSelectTemplate, selectedTemplateId }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<BannerbearTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    async function loadTemplates() {
      try {
        setLoading(true)
        const data = await getTemplates()
        setTemplates(data)
      } catch (err) {
        console.error("Error loading templates:", err)
        setError(err instanceof Error ? err : new Error("Failed to load templates"))
      } finally {
        setLoading(false)
      }
    }

    loadTemplates()
  }, [])

  // Filter templates based on tags
  const filteredTemplates =
    filter === "all" ? templates : templates.filter((template) => template.tags.includes(filter))

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#7c5cff] border-r-transparent"></div>
        <p className="mt-2 text-gray-600">Loading templates...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Failed to load templates. Please try again later.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Choose a Template</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-md px-3 py-1 text-sm ${filter === "all" ? "bg-[#7c5cff] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("testimonial")}
            className={`rounded-md px-3 py-1 text-sm ${filter === "testimonial" ? "bg-[#7c5cff] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Testimonials
          </button>
          <button
            onClick={() => setFilter("social")}
            className={`rounded-md px-3 py-1 text-sm ${filter === "social" ? "bg-[#7c5cff] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Social Media
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredTemplates.map((template) => (
          <div
            key={template.uid}
            className={`group cursor-pointer overflow-hidden rounded-lg border transition-all hover:shadow-md ${
              selectedTemplateId === template.uid ? "border-[#7c5cff] bg-purple-50" : "border-gray-200 bg-white"
            }`}
            onClick={() => onSelectTemplate(template)}
          >
            <div className="relative aspect-square w-full overflow-hidden">
              <Image
                src={template.preview_url || "/placeholder.svg?height=200&width=200&query=template"}
                alt={template.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="p-3 text-center">
              <h3 className="font-medium text-gray-800">{template.name}</h3>
              <p className="text-xs text-gray-500">
                {template.width} × {template.height}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
