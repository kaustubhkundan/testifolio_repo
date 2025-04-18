"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Home, Plus, Star } from "lucide-react"

import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { SocialMediaGenerator } from "@/components/creative-studio/social-media-generator"

export default function CreativeStudioPage() {
  const [showGenerator, setShowGenerator] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const templates = [
    { id: "minimal", name: "Minimal Clean", image: "/minimalclean.svg" },
    { id: "retro", name: "Retro Fun", image: "/retrofun.svg" },
    { id: "biz", name: "Biz Professional", image: "/biz.svg" },
    { id: "active", name: "Active Flex", image: "/active.svg" },
    { id: "nature", name: "Nature", image: "/nature.svg" },
  ]

  const handleCreateVisual = (templateId?: string) => {
    if (templateId) {
      setSelectedTemplate(templateId)
    }
    setShowGenerator(true)
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center text-sm">
          <Link href="/dashboard" className="flex items-center text-[#7c5cff]">
            <Home className="mr-1 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">Creative Studio</span>
        </div>

        {!showGenerator ? (
          <>
            {/* Page Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-2xl font-bold text-gray-800">Create Stunning Testimonial Visuals</h1>
                <p className="text-gray-600">
                  Pick a style, let AI do its magic, and share your amazing testimonials effortlessly.
                </p>
              </div>
              <button
                onClick={() => handleCreateVisual()}
                className="flex items-center gap-2 rounded-md bg-[#7c5cff] px-6 py-3 text-white hover:bg-[#6a4ddb]"
              >
                <Plus className="h-5 w-5" />
                <span>Create New Visual</span>
              </button>
            </div>

            {/* Template Grid */}
            <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="group cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-md"
                  onClick={() => handleCreateVisual(template.id)}
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={template.image || "/placeholder.svg"}
                      alt={template.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="font-medium text-gray-800">{template.name}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Pro Features Section */}
            <Image
              src="/image.png"
              alt="Collection form illustration"
              width={300}
              height={300}
              className="h-auto w-auto"
            />
          </>
        ) : (
          <SocialMediaGenerator onClose={() => setShowGenerator(false)} initialTemplate={selectedTemplate} />
        )}
      </div>
    </DashboardLayout>
  )
}
