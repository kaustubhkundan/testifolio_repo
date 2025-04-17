import Image from "next/image"
import Link from "next/link"

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-[#4a4a4a] md:text-5xl">What Businesses Are Saying</h2>
        </div>

        {/* Testimonials Grid */}
        <div className="mb-12 grid gap-8 md:grid-cols-3">
          {/* Testimonial 1 */}
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-4">
              <Image
                src="/sarah-johnson.jpg"
                alt="Sarah Johnson"
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold text-[#333]">Sarah Johnson</h3>
                <p className="text-[#666]">Marketing Director</p>
              </div>
            </div>
            <p className="text-lg text-[#4a4a4a]">
              "TestiFolio helped us increase conversions by 34 percent—we love it!"
            </p>
          </div>

          {/* Testimonial 2 */}
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-4">
              <Image
                src="/mike-chen.jpg"
                alt="Mike Chen"
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold text-[#333]">Mike Chen</h3>
                <p className="text-[#666]">CEO</p>
              </div>
            </div>
            <p className="text-lg text-[#4a4a4a]">
              "The AI-powered social posts have saved us countless hours of work."
            </p>
          </div>

          {/* Testimonial 3 */}
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-4">
              <Image
                src="/emma-davis.jpg"
                alt="Emma Davis"
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold text-[#333]">Emma Davis</h3>
                <p className="text-[#666]">Product Manager</p>
              </div>
            </div>
            <p className="text-lg text-[#4a4a4a]">"Our testimonial collection rate increased by 5x with TestiFolio."</p>
          </div>
        </div>

        {/* See More Link */}
        <div className="text-center">
          <Link
            href="/case-studies"
            className="inline-flex items-center text-lg font-medium text-[#7c5cff] hover:underline"
          >
            See More Case Studies
            <svg
              className="ml-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
