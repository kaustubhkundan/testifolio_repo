import { Copy, ExternalLink, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Marketing Director",
    avatar: "/images/testimonial-avatar.png",
    rating: 5,
    content:
      "Testifolio has completely transformed how we collect and showcase customer testimonials. The process is seamless, and the display widgets look fantastic on our website!",
    date: "2 days ago",
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Small Business Owner",
    avatar: null,
    initials: "MR",
    rating: 4,
    content:
      "As a small business owner, I was struggling to collect testimonials. Testifolio made it incredibly easy, and I've seen a noticeable increase in conversions since adding the testimonial widget to my site.",
    date: "1 week ago",
  },
  {
    id: 3,
    name: "Amanda Lee",
    role: "E-commerce Manager",
    avatar: null,
    initials: "AL",
    rating: 5,
    content:
      "The video testimonials feature is a game-changer! Our customers love being able to share their experiences in a more personal way, and it's helped us build trust with new visitors.",
    date: "2 weeks ago",
  },
]

export function RecentTestimonials() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#16151a]">Recent Testimonials</h2>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative h-8 w-8 overflow-hidden rounded-full bg-[#efe7ff]">
                    {testimonial.avatar ? (
                      <img
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-[#b69df8]">
                        {testimonial.initials}
                      </span>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium">{testimonial.name}</CardTitle>
                    <p className="text-xs text-[#5b5772]">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3.5 w-3.5 ${
                        star <= testimonial.rating ? "fill-[#ffc72a] text-[#ffc72a]" : "text-[#e5e5e5]"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#5b5772]">"{testimonial.content}"</p>
            </CardContent>
            <CardFooter className="border-t border-[#e5e5e5] pt-3">
              <div className="flex w-full items-center justify-between">
                <span className="text-xs text-[#5b5772]">{testimonial.date}</span>
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
        ))}
      </div>
    </div>
  )
}
