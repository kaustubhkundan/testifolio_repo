"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { Testimonial } from "@/hooks/use-testimonials"

interface WidgetConfig {
  layout: "grid" | "stack"
  theme: "light" | "dark" | "minimal" | "colorful"
  primaryColor: string
  showRating: boolean
  showSource: boolean
  showAvatar: boolean
  maxItems: number
  sortBy: "newest" | "oldest" | "highest" | "lowest" | "random"
  minRating: number
  borderRadius: number
  padding: number
  font: string
}

interface WidgetCustomizerProps {
  testimonials: Testimonial[]
  config: WidgetConfig
  onConfigChange: (config: WidgetConfig) => void
}

export function WidgetCustomizer({ testimonials, config, onConfigChange }: WidgetCustomizerProps) {
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>([])

  useEffect(() => {
    // Filter testimonials based on minRating
    let filtered = testimonials.filter((testimonial) => testimonial.rating >= config.minRating)

    // Sort testimonials based on sortBy
    switch (config.sortBy) {
      case "newest":
        filtered = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case "oldest":
        filtered = filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break
      case "highest":
        filtered = filtered.sort((a, b) => b.rating - a.rating)
        break
      case "lowest":
        filtered = filtered.sort((a, b) => a.rating - b.rating)
        break
      case "random":
        filtered = [...filtered].sort(() => Math.random() - 0.5)
        break
    }

    // Limit to maxItems
    filtered = filtered.slice(0, config.maxItems)

    setFilteredTestimonials(filtered)
  }, [testimonials, config.minRating, config.sortBy, config.maxItems])

  const handleConfigChange = (key: keyof WidgetConfig, value: any) => {
    onConfigChange({
      ...config,
      [key]: value,
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-gray-50 rounded-lg p-6 border">
          <h3 className="text-lg font-medium mb-4">Preview</h3>
          <div
            className={`rounded-lg overflow-hidden border ${config.theme === "dark" ? "bg-gray-900" : "bg-white"}`}
            style={{
              padding: `${config.padding}px`,
              borderRadius: `${config.borderRadius}px`,
            }}
          >
            {filteredTestimonials.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                No testimonials match your current filters
              </div>
            ) : config.layout === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredTestimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className={`p-4 rounded-lg ${
                      config.theme === "dark" ? "bg-gray-800 text-white" : "bg-white border"
                    }`}
                    style={{
                      borderRadius: `${config.borderRadius}px`,
                      fontFamily: config.font,
                    }}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      {config.showAvatar && testimonial.avatar && (
                        <div className="flex-shrink-0">
                          <img
                            src={testimonial.avatar || "/placeholder.svg"}
                            alt={testimonial.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        {config.showSource && testimonial.source && (
                          <p className={`text-xs ${config.theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                            {testimonial.source}
                          </p>
                        )}
                      </div>
                    </div>
                    {config.showRating && (
                      <div className="flex mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill={i < testimonial.rating ? config.primaryColor : "none"}
                            stroke={i < testimonial.rating ? config.primaryColor : "#ccc"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                    )}
                    <p className={`text-sm ${config.theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      {testimonial.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredTestimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className={`p-4 rounded-lg ${
                      config.theme === "dark" ? "bg-gray-800 text-white" : "bg-white border"
                    }`}
                    style={{
                      borderRadius: `${config.borderRadius}px`,
                      fontFamily: config.font,
                    }}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      {config.showAvatar && testimonial.avatar && (
                        <div className="flex-shrink-0">
                          <img
                            src={testimonial.avatar || "/placeholder.svg"}
                            alt={testimonial.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">{testimonial.name}</p>
                          {config.showRating && (
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <svg
                                  key={i}
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill={i < testimonial.rating ? config.primaryColor : "none"}
                                  stroke={i < testimonial.rating ? config.primaryColor : "#ccc"}
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="mr-1"
                                >
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                              ))}
                            </div>
                          )}
                        </div>
                        {config.showSource && testimonial.source && (
                          <p className={`text-xs ${config.theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                            {testimonial.source}
                          </p>
                        )}
                        <p className={`text-sm mt-2 ${config.theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                          {testimonial.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Customize Widget</h3>
          <Tabs defaultValue="layout" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>
            <TabsContent value="layout" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="layout-type">Layout Type</Label>
                  <Select
                    value={config.layout}
                    onValueChange={(value) => handleConfigChange("layout", value as "grid" | "stack")}
                  >
                    <SelectTrigger id="layout-type">
                      <SelectValue placeholder="Select layout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid View</SelectItem>
                      <SelectItem value="stack">Vertical Stack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="border-radius" className="mb-2 block">
                    Border Radius: {config.borderRadius}px
                  </Label>
                  <Slider
                    id="border-radius"
                    min={0}
                    max={24}
                    step={1}
                    value={[config.borderRadius]}
                    onValueChange={(value) => handleConfigChange("borderRadius", value[0])}
                  />
                </div>

                <div>
                  <Label htmlFor="padding" className="mb-2 block">
                    Padding: {config.padding}px
                  </Label>
                  <Slider
                    id="padding"
                    min={0}
                    max={32}
                    step={4}
                    value={[config.padding]}
                    onValueChange={(value) => handleConfigChange("padding", value[0])}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="style" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={config.theme}
                    onValueChange={(value) =>
                      handleConfigChange("theme", value as "light" | "dark" | "minimal" | "colorful")
                    }
                  >
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="colorful">Colorful</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => handleConfigChange("primaryColor", e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={config.primaryColor}
                      onChange={(e) => handleConfigChange("primaryColor", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="font">Font</Label>
                  <Select value={config.font} onValueChange={(value) => handleConfigChange("font", value)}>
                    <SelectTrigger id="font">
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="georgia">Georgia</SelectItem>
                      <SelectItem value="arial">Arial</SelectItem>
                      <SelectItem value="verdana">Verdana</SelectItem>
                      <SelectItem value="system-ui">System UI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="max-items" className="mb-2 block">
                    Number of Testimonials: {config.maxItems}
                  </Label>
                  <Slider
                    id="max-items"
                    min={1}
                    max={12}
                    step={1}
                    value={[config.maxItems]}
                    onValueChange={(value) => handleConfigChange("maxItems", value[0])}
                  />
                </div>

                <div>
                  <Label htmlFor="min-rating" className="mb-2 block">
                    Minimum Rating: {config.minRating}
                  </Label>
                  <Slider
                    id="min-rating"
                    min={1}
                    max={5}
                    step={1}
                    value={[config.minRating]}
                    onValueChange={(value) => handleConfigChange("minRating", value[0])}
                  />
                </div>

                <div>
                  <Label htmlFor="sort-by">Sort By</Label>
                  <Select
                    value={config.sortBy}
                    onValueChange={(value) =>
                      handleConfigChange("sortBy", value as "newest" | "oldest" | "highest" | "lowest" | "random")
                    }
                  >
                    <SelectTrigger id="sort-by">
                      <SelectValue placeholder="Select sorting" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="highest">Highest Rating</SelectItem>
                      <SelectItem value="lowest">Lowest Rating</SelectItem>
                      <SelectItem value="random">Random</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show-rating">Show Rating</Label>
                  <Switch
                    id="show-rating"
                    checked={config.showRating}
                    onCheckedChange={(checked) => handleConfigChange("showRating", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show-source">Show Source</Label>
                  <Switch
                    id="show-source"
                    checked={config.showSource}
                    onCheckedChange={(checked) => handleConfigChange("showSource", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show-avatar">Show Avatar</Label>
                  <Switch
                    id="show-avatar"
                    checked={config.showAvatar}
                    onCheckedChange={(checked) => handleConfigChange("showAvatar", checked)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
