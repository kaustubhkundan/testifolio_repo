import Image from "next/image"
import Link from "next/link"

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <div className="mb-20 text-left">
          <h2 className="text-7xl font-bold text-[#002b5b] mb-4 relative inline-block">
            How it Works
            <div className="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-[#7c5cff] to-[#cd5cff]"></div>
          </h2>
        </div>

        {/* Feature 1 - Send a Testimonial Request */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24 items-center ml-[40%]">         
          <div className="order-2 md:order-2">
            <h3 className="text-3xl font-bold text-[#002b5b] mb-4">Send a Testimonial Request</h3>
            <p className="text-lg text-[#5b5772]">Share your forms with a simple link via email, SMS, or QR code.</p>
          </div>
          <div className="order-2 md:order-1">
            <Image src="/howitworks1.svg" alt="Testimonial request form" width={320} height={400} className="mx-auto" />
          </div>
        </div>

        {/* Feature 2 - AI Helps Customers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24 items-center mr-[30%]">
          <div>
            <Image src="/howitworks2.svg" alt="AI robot character" width={300} height={300} className="mx-auto" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-[#002b5b] mb-4">AI Helps Customers Write Better Testimonials</h3>
            <p className="text-lg text-[#5b5772] mb-6">
              AI guides customers so they know exactly what to say. They can refine their review with AI for clarity and
              impact before submitting.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center text-[#002b5b] font-medium border-2 border-[#002b5b] rounded-full px-6 py-2 hover:bg-[#002b5b] hover:text-white transition-colors"
            >
              Start Free Trial
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

        {/* Feature 3 - Generate & Share */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24 items-center ml-[40%]">
          <div className="order-2 md:order-1 text-right md:text-left">
            <h3 className="text-3xl font-bold text-[#002b5b] mb-4">
              Generate & Share
              <br />
              on Social Media
            </h3>
            <p className="text-lg text-[#5b5772]">
              Instantly transforms testimonials into social media-ready posts, optimized for engagement and conversions.
            </p>
          </div>
          <div className="order-1 md:order-2">
            <Image
              src="/howitworks3.svg"
              alt="Phone showing testimonial"
              width={300}
              height={400}
              className="mx-auto"
            />
          </div>
        </div>

        {/* Feature 4 - Turn Existing Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24 items-center mr-[40%]">
          <div>
            <Image
              src="/howitworks4.svg"
              alt="Star character on skateboard"
              width={300}
              height={300}
              className="mx-auto"
            />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-[#002b5b] mb-4">
              Turn Existing Reviews into Scroll-Stopping Content
            </h3>
            <p className="text-lg text-[#5b5772]">
              Already have testimonials? Easily import them from Google, Amazon, Shopify, and more. Testifolio
              transforms them into stunning social media posts.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-[#002b5b] mb-8">
            Effortless Testimonials,
            <br />
            Instant Social Proof
          </h3>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#7c5cff] to-[#cd5cff] px-8 py-3 text-lg font-medium text-white transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#7c5cff] focus:ring-offset-2"
          >
            Get Started Today
          </Link>
        </div>
      </div>
    </section>
  )
}
