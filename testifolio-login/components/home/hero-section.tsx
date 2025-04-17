import Image from "next/image"
import Link from "next/link"

export function HeroSection() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="flex flex-col items-center gap-12 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h1 className="mb-6 text-4xl font-bold leading-tight text-[#7c5cff] md:text-5xl lg:text-6xl">
            Turn Customer Words into High-Converting Content
          </h1>
          <p className="mb-8 text-xl text-[#5b5772]">
            Your Portfolio of Testimonials. AI-Powered to Build Trust & Drive Sales... without the hassle.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-full bg-[#2d3748] px-8 py-3 text-base font-medium text-white transition-colors hover:bg-[#1a202c] focus:outline-none focus:ring-2 focus:ring-[#7c5cff] focus:ring-offset-2"
            >
              Start Free Trial
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center rounded-full border-2 border-[#7c5cff] px-8 py-3 text-base font-medium text-[#7c5cff] transition-colors hover:bg-[#f5f3ff] focus:outline-none focus:ring-2 focus:ring-[#7c5cff] focus:ring-offset-2"
            >
              See How It Works
            </Link>
          </div>
          <div className="mt-8">
            <p className="mb-3 text-sm text-[#5b5772]">Trusted by 1,500+ businesses</p>
            <div className="flex items-center gap-6">
              <Image src="/shopify-leaf-grayscale.png" alt="Shopify" width={30} height={30} className="opacity-70" />
              <Image src="/stripe-logo-grayscale.png" alt="Stripe" width={60} height={30} className="opacity-70" />
              <Image src="/slack-grayscale-logo.png" alt="Slack" width={60} height={30} className="opacity-70" />
            </div>
          </div>
        </div>
        <div className="relative w-full max-w-lg">
          <Image
            src="/homepage1.svg"
            alt="Testimonials illustration"
            width={600}
            height={600}
            className="h-auto w-full"
            priority
          />
        </div>
      </div>
    </div>
  )
}
