"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  BarChart3,
  ChevronDown,
  Code,
  Copy,
  ExternalLink,
  FileText,
  Grid,
  LayoutDashboard,
  MessageSquare,
  Plus,
  Settings,
  Star,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function DashboardView() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen bg-[#f7f7f8]">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#e5e5e5] bg-white transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="flex h-16 items-center border-b border-[#e5e5e5] px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/images/testifolio-logo.png" alt="Testifolio Logo" width={32} height={32} />
            <span className="text-xl font-bold text-[#16151a]">Testifolio</span>
          </Link>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto p-4">
          <nav className="flex flex-1 flex-col gap-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-md bg-[#efe7ff] px-3 py-2 text-[#16151a] transition-colors hover:bg-[#efe7ff]"
            >
              <LayoutDashboard className="h-5 w-5 text-[#b69df8]" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/dashboard/testimonials"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-[#5b5772] transition-colors hover:bg-[#f7f7f8]"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Testimonials</span>
            </Link>
            <Link
              href="/dashboard/collection"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-[#5b5772] transition-colors hover:bg-[#f7f7f8]"
            >
              <FileText className="h-5 w-5" />
              <span>Collection Forms</span>
            </Link>
            <Link
              href="/dashboard/widgets"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-[#5b5772] transition-colors hover:bg-[#f7f7f8]"
            >
              <Code className="h-5 w-5" />
              <span>Display Widgets</span>
            </Link>
            <Link
              href="/dashboard/analytics"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-[#5b5772] transition-colors hover:bg-[#f7f7f8]"
            >
              <BarChart3 className="h-5 w-5" />
              <span>Analytics</span>
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-[#5b5772] transition-colors hover:bg-[#f7f7f8]"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        <div className="border-t border-[#e5e5e5] p-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-[#efe7ff]">
              <span className="absolute inset-0 flex items-center justify-center text-lg font-medium text-[#b69df8]">
                JD
              </span>
            </div>
            <div>
              <p className="font-medium text-[#16151a]">John Doe</p>
              <p className="text-xs text-[#5b5772]">Acme Inc</p>
            </div>
            <button className="ml-auto rounded-full p-1 hover:bg-[#f7f7f8]">
              <ChevronDown className="h-4 w-4 text-[#5b5772]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center border-b border-[#e5e5e5] bg-white px-4 md:px-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mr-4 rounded-md p-1.5 text-[#5b5772] hover:bg-[#f7f7f8] md:hidden"
          >
            <Grid className="h-5 w-5" />
          </button>
          <div className="ml-auto flex items-center gap-4">
            <Button variant="outline" size="sm" className="hidden gap-1.5 md:flex">
              <Plus className="h-4 w-4" />
              <span>New Testimonial</span>
            </Button>
            <Button size="sm" className="hidden gap-1.5 md:flex">
              <Plus className="h-4 w-4" />
              <span>Create Form</span>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full md:hidden">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="grid gap-6">
            <div>
              <h1 className="text-3xl font-bold text-[#16151a]">Dashboard</h1>
              <p className="text-[#5b5772]">Welcome back! Here's an overview of your testimonials.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      ></path>
                    </svg>
                    <span>12% from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
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

              <Card>
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

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#5b5772]">Conversion Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#16151a]">+23%</div>
                  <div className="mt-1 text-xs text-[#5b5772]">Estimated sales increase</div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="recent">
              <div className="flex items-center justify-between">
                <TabsList className="bg-transparent p-0">
                  <TabsTrigger
                    value="recent"
                    className="rounded-md px-3 py-1.5 text-[#5b5772] data-[state=active]:bg-[#efe7ff] data-[state=active]:text-[#16151a]"
                  >
                    Recent Testimonials
                  </TabsTrigger>
                  <TabsTrigger
                    value="forms"
                    className="rounded-md px-3 py-1.5 text-[#5b5772] data-[state=active]:bg-[#efe7ff] data-[state=active]:text-[#16151a]"
                  >
                    Collection Forms
                  </TabsTrigger>
                  <TabsTrigger
                    value="widgets"
                    className="rounded-md px-3 py-1.5 text-[#5b5772] data-[state=active]:bg-[#efe7ff] data-[state=active]:text-[#16151a]"
                  >
                    Display Widgets
                  </TabsTrigger>
                </TabsList>
                <div className="hidden md:block">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              </div>

              <TabsContent value="recent" className="mt-4">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Testimonial Cards */}
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-[#efe7ff]">
                            <Image
                              src="/images/testimonial-avatar.png"
                              alt="Avatar"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <CardTitle className="text-sm font-medium">Sarah Johnson</CardTitle>
                            <CardDescription className="text-xs">Marketing Director</CardDescription>
                          </div>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3.5 w-3.5 ${
                                star <= 5 ? "fill-[#ffc72a] text-[#ffc72a]" : "text-[#e5e5e5]"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-[#5b5772]">
                        "Testifolio has completely transformed how we collect and showcase customer testimonials. The
                        process is seamless, and the display widgets look fantastic on our website!"
                      </p>
                    </CardContent>
                    <CardFooter className="border-t border-[#e5e5e5] pt-3">
                      <div className="flex w-full items-center justify-between">
                        <span className="text-xs text-[#5b5772]">2 days ago</span>
                        <div className="flex gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                  <Copy className="h-4 w-4 text-[#5b5772]" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Copy testimonial</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                  <ExternalLink className="h-4 w-4 text-[#5b5772]" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View details</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-[#efe7ff]">
                            <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-[#b69df8]">
                              MR
                            </span>
                          </div>
                          <div>
                            <CardTitle className="text-sm font-medium">Michael Rodriguez</CardTitle>
                            <CardDescription className="text-xs">Small Business Owner</CardDescription>
                          </div>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3.5 w-3.5 ${
                                star <= 4 ? "fill-[#ffc72a] text-[#ffc72a]" : "text-[#e5e5e5]"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-[#5b5772]">
                        "As a small business owner, I was struggling to collect testimonials. Testifolio made it
                        incredibly easy, and I've seen a noticeable increase in conversions since adding the testimonial
                        widget to my site."
                      </p>
                    </CardContent>
                    <CardFooter className="border-t border-[#e5e5e5] pt-3">
                      <div className="flex w-full items-center justify-between">
                        <span className="text-xs text-[#5b5772]">1 week ago</span>
                        <div className="flex gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                  <Copy className="h-4 w-4 text-[#5b5772]" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Copy testimonial</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                  <ExternalLink className="h-4 w-4 text-[#5b5772]" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View details</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-[#efe7ff]">
                            <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-[#b69df8]">
                              AL
                            </span>
                          </div>
                          <div>
                            <CardTitle className="text-sm font-medium">Amanda Lee</CardTitle>
                            <CardDescription className="text-xs">E-commerce Manager</CardDescription>
                          </div>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3.5 w-3.5 ${
                                star <= 5 ? "fill-[#ffc72a] text-[#ffc72a]" : "text-[#e5e5e5]"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-[#5b5772]">
                        "The video testimonials feature is a game-changer! Our customers love being able to share their
                        experiences in a more personal way, and it's helped us build trust with new visitors."
                      </p>
                    </CardContent>
                    <CardFooter className="border-t border-[#e5e5e5] pt-3">
                      <div className="flex w-full items-center justify-between">
                        <span className="text-xs text-[#5b5772]">2 weeks ago</span>
                        <div className="flex gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                  <Copy className="h-4 w-4 text-[#5b5772]" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Copy testimonial</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                  <ExternalLink className="h-4 w-4 text-[#5b5772]" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View details</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="forms" className="mt-4">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Collection Form Cards */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-medium">General Feedback</CardTitle>
                        <div className="flex h-6 items-center rounded-full bg-[#efe7ff] px-2 text-xs font-medium text-[#b69df8]">
                          Active
                        </div>
                      </div>
                      <CardDescription>Default testimonial collection form</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-[#5b5772]">
                          <span className="font-medium text-[#16151a]">83</span> responses
                        </div>
                        <div className="text-[#5b5772]">
                          <span className="font-medium text-[#16151a]">4.7</span> avg. rating
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-[#e5e5e5] pt-3">
                      <div className="flex w-full items-center justify-between">
                        <Button variant="outline" size="sm">
                          <Copy className="mr-1.5 h-3.5 w-3.5" />
                          Copy Link
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                          View
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-medium">Post-Purchase</CardTitle>
                        <div className="flex h-6 items-center rounded-full bg-[#efe7ff] px-2 text-xs font-medium text-[#b69df8]">
                          Active
                        </div>
                      </div>
                      <CardDescription>Sent after customer completes purchase</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-[#5b5772]">
                          <span className="font-medium text-[#16151a]">42</span> responses
                        </div>
                        <div className="text-[#5b5772]">
                          <span className="font-medium text-[#16151a]">4.9</span> avg. rating
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-[#e5e5e5] pt-3">
                      <div className="flex w-full items-center justify-between">
                        <Button variant="outline" size="sm">
                          <Copy className="mr-1.5 h-3.5 w-3.5" />
                          Copy Link
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                          View
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>

                  <Card className="border-dashed border-[#d8d7e0] bg-transparent">
                    <CardContent className="flex h-full flex-col items-center justify-center p-6">
                      <div className="mb-3 rounded-full bg-[#efe7ff] p-3">
                        <Plus className="h-6 w-6 text-[#b69df8]" />
                      </div>
                      <h3 className="mb-1 text-base font-medium text-[#16151a]">Create New Form</h3>
                      <p className="mb-4 text-center text-sm text-[#5b5772]">
                        Customize a new form to collect testimonials
                      </p>
                      <Button>Create Form</Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="widgets" className="mt-4">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Widget Cards */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-medium">Testimonial Carousel</CardTitle>
                        <div className="flex h-6 items-center rounded-full bg-[#efe7ff] px-2 text-xs font-medium text-[#b69df8]">
                          Active
                        </div>
                      </div>
                      <CardDescription>Rotating testimonials for homepage</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-[#5b5772]">
                          <span className="font-medium text-[#16151a]">1,243</span> views
                        </div>
                        <div className="text-[#5b5772]">
                          <span className="font-medium text-[#16151a]">3.2%</span> CTR
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-[#e5e5e5] pt-3">
                      <div className="flex w-full items-center justify-between">
                        <Button variant="outline" size="sm">
                          <Code className="mr-1.5 h-3.5 w-3.5" />
                          Get Code
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                          Preview
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-medium">Video Wall</CardTitle>
                        <div className="flex h-6 items-center rounded-full bg-[#efe7ff] px-2 text-xs font-medium text-[#b69df8]">
                          Active
                        </div>
                      </div>
                      <CardDescription>Grid of video testimonials</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-[#5b5772]">
                          <span className="font-medium text-[#16151a]">856</span> views
                        </div>
                        <div className="text-[#5b5772]">
                          <span className="font-medium text-[#16151a]">4.7%</span> CTR
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-[#e5e5e5] pt-3">
                      <div className="flex w-full items-center justify-between">
                        <Button variant="outline" size="sm">
                          <Code className="mr-1.5 h-3.5 w-3.5" />
                          Get Code
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                          Preview
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>

                  <Card className="border-dashed border-[#d8d7e0] bg-transparent">
                    <CardContent className="flex h-full flex-col items  bg-transparent">
                    <CardContent className="flex h-full flex-col items-center justify-center p-6">
                      <div className="mb-3 rounded-full bg-[#efe7ff] p-3">
                        <Plus className="h-6 w-6 text-[#b69df8]" />
                      </div>
                      <h3 className="mb-1 text-base font-medium text-[#16151a]">Create New Widget</h3>
                      <p className="mb-4 text-center text-sm text-[#5b5772]">
                        Design a custom widget to display testimonials
                      </p>
                      <Button>Create Widget</Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks to help you get started</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center gap-4 rounded-lg border border-[#e5e5e5] p-3">
                    <div className="rounded-md bg-[#efe7ff] p-2">
                      <FileText className="h-5 w-5 text-[#b69df8]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-[#16151a]">Create Collection Form</h4>
                      <p className="text-xs text-[#5b5772]">Design a form to collect testimonials from customers</p>
                    </div>
                    <Button size="sm">Create</Button>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg border border-[#e5e5e5] p-3">
                    <div className="rounded-md bg-[#efe7ff] p-2">
                      <Code className="h-5 w-5 text-[#b69df8]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-[#16151a]">Add Widget to Website</h4>
                      <p className="text-xs text-[#5b5772]">Get code to display testimonials on your site</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Get Code
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg border border-[#e5e5e5] p-3">
                    <div className="rounded-md bg-[#efe7ff] p-2">
                      <Users className="h-5 w-5 text-[#b69df8]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-[#16151a]">Import Existing Testimonials</h4>
                      <p className="text-xs text-[#5b5772]">Upload testimonials you've already collected</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Import
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates and notifications</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex gap-4">
                    <div className="relative mt-0.5 h-9 w-9 shrink-0">
                      <div className="absolute h-9 w-9 rounded-full bg-[#efe7ff]">
                        <MessageSquare className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-[#b69df8]" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-[#16151a]">
                        <span className="font-medium">New testimonial</span> received from{" "}
                        <span className="font-medium">David Wilson</span>
                      </p>
                      <p className="text-xs text-[#5b5772]">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="relative mt-0.5 h-9 w-9 shrink-0">
                      <div className="absolute h-9 w-9 rounded-full bg-[#efe7ff]">
                        <Star className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-[#b69df8]" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-[#16151a]">
                        <span className="font-medium">Testimonial Carousel</span> widget has reached{" "}
                        <span className="font-medium">1,000+ views</span>
                      </p>
                      <p className="text-xs text-[#5b5772]">Yesterday</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="relative mt-0.5 h-9 w-9 shrink-0">
                      <div className="absolute h-9 w-9 rounded-full bg-[#efe7ff]">
                        <FileText className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-[#b69df8]" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-[#16151a]">
                        <span className="font-medium">Post-Purchase</span> form is performing well with a{" "}
                        <span className="font-medium">68% completion rate</span>
                      </p>
                      <p className="text-xs text-[#5b5772]">2 days ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
