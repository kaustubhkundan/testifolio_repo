"use client"

import { useState } from "react"
import { ArrowUp, Eye, FileText, Check, Clock, Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DashboardLayout from "@/components/dashboard/dashboard-layout"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7")
  const [activityFilter, setActivityFilter] = useState("all")

  return (
    <DashboardLayout>
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <div className="flex items-center text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6.66669 13.3333L10 8.00001L6.66669 2.66667"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>/ Dashboard / Analytics</span>
          </span>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Testimonials"
          value="1,482"
          change={18.34}
          icon={<FileText className="h-5 w-5 text-[#4a3aff]" />}
        />
        <MetricCard
          title="Pending Testimonials"
          value="1,482"
          change={3.2}
          icon={<Clock className="h-5 w-5 text-[#f59e0b]" />}
        />
        <MetricCard
          title="Completed Testimonials"
          value="296"
          change={15.3}
          icon={<Check className="h-5 w-5 text-[#34c759]" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Form Insights</CardTitle>
            <div className="flex items-center gap-4 text-sm mt-2">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[#f6220e]"></span>
                <span>Views</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[#4a3aff]"></span>
                <span>Submissions</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <FormInsightsChart />
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Most Effective Form</div>
              <div className="text-lg font-medium mt-1">Product Review</div>
              <div className="text-sm mt-1">85% Conversion Rate</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">Customer Ratings</CardTitle>
              <div className="flex items-center text-sm text-green-500">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span>12% vs last month</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">4.0</div>
              <div className="flex">
                {[1, 2, 3, 4].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <div className="h-[180px] mt-4">
              <RatingsChart />
            </div>
            <div className="flex justify-between mt-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[#4a3aff]"></span>
                <span>5 star</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[#34c759]"></span>
                <span>4 star</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[#f59e0b]"></span>
                <span>3 star</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[#ffcc00]"></span>
                <span>2 star</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[#f6220e]"></span>
                <span>1 star</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
            <div className="flex gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[140px] h-8 text-sm">
                  <SelectValue placeholder="Last 7 days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Select value={activityFilter} onValueChange={setActivityFilter}>
                <SelectTrigger className="w-[100px] h-8 text-sm">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Form Type</TableHead>
                <TableHead>Ratings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Jhon Anderson</TableCell>
                <TableCell>Feb 02, 2025</TableCell>
                <TableCell>Product Review</TableCell>
                <TableCell>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    <Check className="w-3 h-3 mr-1" /> Approved
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Sara Miller</TableCell>
                <TableCell>Jan 02, 2025</TableCell>
                <TableCell>Service Feedback</TableCell>
                <TableCell>
                  <div className="flex">
                    {[1, 2, 3, 4].map((star) => (
                      <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    <Clock className="w-3 h-3 mr-1" /> Pending
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>David Wilson</TableCell>
                <TableCell>March 02, 2025</TableCell>
                <TableCell>Customer Feedback</TableCell>
                <TableCell>
                  <div className="flex">
                    {[1, 2, 3].map((star) => (
                      <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    {[1, 2].map((star) => (
                      <svg key={star} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                    <Send className="w-3 h-3 mr-1" /> Published
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Emma Davis</TableCell>
                <TableCell>Feb 02, 2025</TableCell>
                <TableCell>Product Review</TableCell>
                <TableCell>
                  <div className="flex">
                    {[1, 2, 3, 4].map((star) => (
                      <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    <Check className="w-3 h-3 mr-1" /> Approved
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-500">New Testimonials This Week</div>
              <div className="flex items-center text-green-500 text-sm">
                <ArrowUp className="h-3 w-3 mr-1" />
                <span>12% Increase</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">127</div>
              <div className="w-24 h-12">
                <MiniChart color="#34c759" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-500">Growth Rate</div>
              <div className="flex items-center text-green-500 text-sm">
                <ArrowUp className="h-3 w-3 mr-1" />
                <span>3.2% vs previous period</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">15.4%</div>
              <div className="w-24 h-12">
                <MiniChart color="#4a3aff" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </DashboardLayout>
  )
}

function MetricCard({ title, value, change, icon }) {
  return (
    <Card className="bg-[#4a3aff]/10">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-gray-500">{title}</div>
            <div className="text-3xl font-bold mt-2">{value}</div>
          </div>
          <div className="p-2 rounded-full bg-white">{icon}</div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <div className="flex items-center text-green-500">
            <ArrowUp className="h-3 w-3 mr-1" />
            <span>{change}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function FormInsightsChart() {
  return (
    <svg viewBox="0 0 500 200" className="w-full h-full">
      {/* Grid lines */}
      <line x1="0" y1="0" x2="500" y2="0" stroke="#f1f1f1" />
      <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f1f1" />
      <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f1f1" />
      <line x1="0" y1="150" x2="500" y2="150" stroke="#f1f1f1" />
      <line x1="0" y1="200" x2="500" y2="200" stroke="#f1f1f1" />

      {/* Views line (red) */}
      <path
        d="M0,100 C50,80 100,120 150,60 C200,20 250,40 300,20 C350,40 400,80 450,100"
        fill="none"
        stroke="#f6220e"
        strokeWidth="3"
      />

      {/* Submissions line (blue) */}
      <path
        d="M0,120 C50,80 100,60 150,100 C200,120 250,100 300,80 C350,100 400,120 450,140"
        fill="none"
        stroke="#4a3aff"
        strokeWidth="3"
      />

      {/* X-axis labels */}
      <text x="0" y="220" fontSize="12" fill="#6c757d">
        Jan
      </text>
      <text x="83" y="220" fontSize="12" fill="#6c757d">
        Feb
      </text>
      <text x="166" y="220" fontSize="12" fill="#6c757d">
        Mar
      </text>
      <text x="249" y="220" fontSize="12" fill="#6c757d">
        Apr
      </text>
      <text x="332" y="220" fontSize="12" fill="#6c757d">
        May
      </text>
      <text x="415" y="220" fontSize="12" fill="#6c757d">
        Jun
      </text>
    </svg>
  )
}

function RatingsChart() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Donut chart */}
      <circle cx="100" cy="100" r="60" fill="white" />

      {/* 5 star (blue) - 25% */}
      <path d="M100,100 L100,40 A60,60 0 0,1 152,70 Z" fill="#4a3aff" />

      {/* 4 star (green) - 20% */}
      <path d="M100,100 L152,70 A60,60 0 0,1 160,130 Z" fill="#34c759" />

      {/* 3 star (orange) - 35% */}
      <path d="M100,100 L160,130 A60,60 0 0,1 70,150 Z" fill="#f59e0b" />

      {/* 2 star (yellow) - 15% */}
      <path d="M100,100 L70,150 A60,60 0 0,1 60,80 Z" fill="#ffcc00" />

      {/* 1 star (red) - 5% */}
      <path d="M100,100 L60,80 A60,60 0 0,1 100,40 Z" fill="#f6220e" />

      {/* Center circle */}
      <circle cx="100" cy="100" r="30" fill="white" />
    </svg>
  )
}

function MiniChart({ color }) {
  return (
    <svg viewBox="0 0 100 50" className="w-full h-full">
      <path d="M0,40 C10,35 20,38 30,30 C40,22 50,25 60,20 C70,15 80,10 90,5 L90,50 L0,50 Z" fill={`${color}10`} />
      <path
        d="M0,40 C10,35 20,38 30,30 C40,22 50,25 60,20 C70,15 80,10 90,5"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  )
}
