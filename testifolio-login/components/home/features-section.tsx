import Image from "next/image"
import Link from "next/link"

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-12 md:flex-row md:items-start md:justify-between">
          {/* Left side - Cloud character */}
          <div className="w-full max-w-xs md:w-1/2">
            <Image
              src="/homepage2.svg"
              alt="Cloud character with star wand"
              width={400}
              height={400}
              className="h-auto w-full"
            />
          </div>

          {/* Right side - Content */}
          <div className="w-full mr-[20%] mt-8">
            <h2 className="mb-6 text-center text-3xl font-bold text-[#002b5b] md:text-4xl lg:text-4xl">
              Better Testimonials,
              <br />
              Instant Social Posts,{" "}
              <span className="relative">
                More Sales.<span className="absolute bottom-0 left-0 h-1 w-full bg-[#7c5cff]"></span>
              </span>
            </h2>

            <p className="mx-auto mb-8 max-w-3xl text-center text-lg text-[#5b5772]">
              Most businesses struggle to collect authentic, well-structured testimonials because customers{" "}
              <strong>don't know what to say</strong>. Testifolio guides them with <strong>AI-powered prompts</strong>{" "}
              to refine their words into engaging, high-converting testimonials. Then, turn them into branded social
              media posts, <strong>ready to share!</strong>
            </p>

            {/* Before/After Tabs and Preview */}
            <div className="mb-12 -mt-20 -mr-60">
              <div className="mb-8 flex justify-end">
                <div className="inline-flex rounded-sm bg-gray-100 p-1">
                  <button className="rounded-sm bg-[#7c5cff] px-6 py-2 text-sm font-medium text-white">Before</button>
                  <button className="rounded-sm px-6 py-2 text-sm font-medium text-[#5b5772]">After</button>
                </div>
              </div>

              <div className="flex flex-col gap-8 md:flex-row mt-10">
              <Image src="/confident-3.svg" className="-ml-[42%]" alt="Bill Johnson" width={400} height={400} />

              <Image src="/confident-2.svg" alt="Bill Johnson" width={400} height={400} />


                {/* Right side - After */}
                <div className="w-full md:w-1/2">
                  <div className="relative">
                  <Image src="/confident-1.svg" alt="Bill Johnson" width={400} height={400} />

                  </div>

                  <div className="mt-8">
                    <p className="mb-2 text-sm font-medium text-[#16151a]">Choose Format</p>
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="mb-1 rounded bg-[#7c5cff] p-2">
                          <div className="h-6 w-6 rounded bg-white"></div>
                        </div>
                        <span className="text-xs text-[#5b5772]">Square</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="mb-1 rounded bg-white p-2">
                          <div className="h-6 w-3 rounded bg-gray-200"></div>
                        </div>
                        <span className="text-xs text-[#5b5772]">Story</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="mb-1 rounded bg-white p-2">
                          <div className="h-3 w-6 rounded bg-gray-200"></div>
                        </div>
                        <span className="text-xs text-[#5b5772]">Landscape</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#7c5cff] to-[#cd5cff] px-8 py-3 text-base font-medium text-white transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#7c5cff] focus:ring-offset-2"
              >
                Start Collecting AI-Enhanced Testimonials
                <svg
                  className="ml-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
