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
              <div className="h-[280px] ml-[20%] mt-4">
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
    <div>
      <svg width="274" height="274" viewBox="0 0 274 274" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M257.073 136.782C258.852 136.782 260.611 137.156 262.236 137.88C263.861 138.604 265.315 139.661 266.505 140.984C267.695 142.306 268.593 143.864 269.142 145.556C269.691 147.248 269.877 149.036 269.69 150.805C267.568 170.858 260.92 190.167 250.25 207.278C239.579 224.388 225.163 238.853 208.089 249.581C191.015 260.309 171.728 267.022 151.682 269.212C131.636 271.402 111.355 269.013 92.3669 262.225C90.6919 261.626 89.1616 260.682 87.8752 259.453C86.5888 258.225 85.5751 256.739 84.8999 255.094C84.2248 253.448 83.9032 251.679 83.956 249.901C84.0089 248.123 84.4351 246.376 85.2069 244.773L117.031 178.689C118.239 176.181 120.238 174.14 122.719 172.881C125.201 171.621 128.028 171.212 130.765 171.717C139.524 173.334 148.571 171.601 156.113 166.862C163.655 162.123 169.141 154.724 171.485 146.131C172.218 143.446 173.813 141.076 176.024 139.387C178.236 137.697 180.942 136.782 183.725 136.782H257.073Z" fill="#F9994B" stroke="white" stroke-width="7.61244" stroke-linejoin="round" />
        <path d="M85.2121 244.773C84.4403 246.376 83.3402 247.798 81.983 248.948C80.6259 250.098 79.0422 250.949 77.3346 251.448C75.627 251.946 73.8337 252.079 72.0711 251.84C70.3086 251.6 68.6161 250.992 67.1036 250.056C42.7635 234.99 23.9237 212.485 13.3751 185.873C2.82642 159.262 1.13007 129.961 8.53729 102.31C8.99757 100.592 9.81399 98.99 10.9336 97.6078C12.0532 96.2255 13.4509 95.0942 15.0361 94.2871C16.6212 93.48 18.3584 93.0153 20.1348 92.9231C21.9112 92.8308 23.6871 93.1132 25.3473 93.7518L93.8057 120.084C96.4033 121.083 98.6003 122.909 100.058 125.279C101.516 127.65 102.154 130.435 101.874 133.204C101.3 138.866 102.096 144.583 104.193 149.873C106.29 155.164 109.628 159.873 113.925 163.604C116.026 165.429 117.469 167.895 118.031 170.62C118.594 173.346 118.244 176.181 117.037 178.689L85.2121 244.773Z" fill="#04CE00" stroke="white" stroke-width="7.61244" stroke-linejoin="round" />
        <path d="M25.3454 93.752C23.6852 93.1134 22.1778 92.1328 20.9211 90.8739C19.6644 89.615 18.6864 88.106 18.0507 86.4447C17.415 84.7834 17.1357 83.0069 17.231 81.2307C17.3263 79.4545 17.794 77.7181 18.6038 76.1344C28.4803 56.8185 42.9247 40.2069 60.6816 27.7433C78.4385 15.2798 98.9706 7.34146 120.493 4.61824C122.258 4.39495 124.05 4.54524 125.753 5.05935C127.456 5.57345 129.032 6.43989 130.378 7.60242C131.724 8.76495 132.811 10.1976 133.568 11.8074C134.325 13.4171 134.735 15.168 134.771 16.9465L136.267 90.2792C136.324 93.0617 135.464 95.7858 133.82 98.0316C132.176 100.277 129.84 101.92 127.17 102.707C119.714 104.906 113.185 109.488 108.584 115.753C106.937 117.996 104.597 119.635 101.926 120.418C99.2554 121.201 96.4013 121.083 93.8037 120.084L25.3454 93.752Z" fill="#3A4EFF" stroke="white" stroke-width="7.61244" stroke-linejoin="round" />
        <path d="M134.772 16.9462C134.736 15.1678 135.074 13.4016 135.764 11.7623C136.455 10.123 137.482 8.64721 138.78 7.43074C140.078 6.21426 141.617 5.28427 143.298 4.70114C144.978 4.118 146.762 3.89475 148.535 4.04587C182.952 6.98044 214.884 23.1685 237.594 49.1953C238.764 50.5356 239.638 52.1068 240.161 53.807C240.684 55.5072 240.844 57.2983 240.629 59.0641C240.415 60.83 239.832 62.5311 238.918 64.057C238.004 65.5829 236.779 66.8996 235.323 67.9215L175.288 110.06C173.01 111.659 170.269 112.465 167.488 112.353C164.708 112.241 162.041 111.217 159.899 109.44C155.811 106.05 151.016 103.619 145.865 102.326C143.165 101.648 140.764 100.102 139.029 97.9251C137.295 95.7482 136.325 93.0615 136.268 90.2789L134.772 16.9462Z" fill="#FFBD72" stroke="white" stroke-width="7.61244" stroke-linejoin="round" />
        <path d="M235.322 67.9216C236.778 66.8996 238.432 66.1953 240.178 65.8542C241.924 65.5131 243.722 65.543 245.455 65.9418C247.189 66.3406 248.819 67.0995 250.24 68.1692C251.661 69.2389 252.842 70.5955 253.705 72.1509C262.375 87.7772 267.812 104.988 269.693 122.759C269.88 124.528 269.694 126.317 269.145 128.009C268.596 129.701 267.698 131.258 266.508 132.581C265.318 133.903 263.864 134.96 262.239 135.684C260.614 136.408 258.855 136.782 257.076 136.782H183.728C180.945 136.782 178.239 135.867 176.027 134.178C173.815 132.488 172.22 130.119 171.488 127.433C171.241 126.526 170.957 125.629 170.638 124.744C169.695 122.126 169.639 119.27 170.479 116.616C171.319 113.963 173.008 111.659 175.286 110.06L235.322 67.9216Z" fill="#FF2D55" stroke="white" stroke-width="7.61244" stroke-linejoin="round" />
      </svg>
    </div>
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
