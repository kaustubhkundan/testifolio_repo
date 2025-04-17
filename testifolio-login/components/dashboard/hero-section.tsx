"use client"
import Image from "next/image"
import { ArrowRight, Copy, ExternalLink, Plus, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function HeroSection() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#16151a]">Welcome back, John!</h1>
          <p className="text-[#5b5772]">Here's what's happening with your testimonials today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Testimonial</span>
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Create Form</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#5b5772]">Total Testimonials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#16151a]">127</div>
            <div className="mt-1 flex items-center text-xs text-green-500">
              <svg
                className="mr-1 h-3 w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
              </svg>
              <span>12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#5b5772]">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#16151a]">4.8</div>
            <div className="mt-1 flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${star <= 4 ? "fill-[#ffc72a] text-[#ffc72a]" : "fill-[#ffc72a] text-[#ffc72a]"}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#5b5772]">Collection Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#16151a]">68%</div>
            <div className="mt-1">
              <Progress value={68} className="h-2 bg-[#e5e5e5]" indicatorClassName="bg-[#b69df8]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#5b5772]">Conversion Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#16151a]">+23%</div>
            <div className="mt-1 text-xs text-[#5b5772]">Estimated sales increase</div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Testimonial */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Featured Testimonial</CardTitle>
              <Button variant="ghost" size="sm" className="gap-1">
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>Your highest rated testimonial this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-[#efe7ff] sm:h-32 sm:w-32">
                <Image src="/images/testimonial-avatar.png" alt="Avatar" fill className="object-cover" />
              </div>
              <div className="flex flex-col">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-[#ffc72a] text-[#ffc72a]" />
                    ))}
                  </div>
                  <span className="text-sm text-[#5b5772]">5.0</span>
                </div>
                <p className="mb-3 text-[#5b5772]">
                  "Testifolio has completely transformed how we collect and showcase customer testimonials. The process
                  is seamless, and the display widgets look fantastic on our website! I've seen a significant increase
                  in conversions since implementing their solution."
                </p>
                <div>
                  <h4 className="font-medium text-[#16151a]">Sarah Johnson</h4>
                  <p className="text-sm text-[#5b5772]">Marketing Director, TechCorp</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-[#e5e5e5] pt-3">
            <div className="flex w-full items-center justify-between">
              <span className="text-xs text-[#5b5772]">Received 2 days ago</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </Button>
                <Button size="sm" className="gap-1.5">
                  <ExternalLink className="h-4 w-4" />
                  <span>Share</span>
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Collection Progress</CardTitle>
            <CardDescription>This month's testimonial goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium text-[#16151a]">Monthly Goal</span>
                <span className="text-sm text-[#5b5772]">15/20</span>
              </div>
              <Progress value={75} className="h-2 bg-[#e5e5e5]" indicatorClassName="bg-[#b69df8]" />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium text-[#16151a]">Video Testimonials</span>
                <span className="text-sm text-[#5b5772]">4/10</span>
              </div>
              <Progress value={40} className="h-2 bg-[#e5e5e5]" indicatorClassName="bg-[#b69df8]" />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium text-[#16151a]">5-Star Ratings</span>
                <span className="text-sm text-[#5b5772]">12/15</span>
              </div>
              <Progress value={80} className="h-2 bg-[#e5e5e5]" indicatorClassName="bg-[#b69df8]" />
            </div>
          </CardContent>
          <CardFooter className="border-t border-[#e5e5e5] pt-3">
            <Button variant="outline" className="w-full">
              View Detailed Analytics
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
