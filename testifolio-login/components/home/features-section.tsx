import Image from "next/image"
import Link from "next/link"

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-12 md:flex-row md:items-start md:justify-between">
          {/* Left side - Cloud character */}
          <div className="w-full max-w-xs md:w-1/3">
            <Image
              src="/homepage2.svg"
              alt="Cloud character with star wand"
              width={300}
              height={300}
              className="h-auto w-full"
            />
          </div>

          {/* Right side - Content */}
          <div className="w-full mr-[20%] mt-8">
            <h2 className="mb-6 text-center text-3xl font-bold text-[#002b5b] md:text-4xl lg:text-5xl">
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
            <div className="mb-12">
              <div className="mb-8 flex justify-center">
                <div className="inline-flex rounded-full bg-gray-100 p-1">
                  <button className="rounded-full bg-[#7c5cff] px-6 py-2 text-sm font-medium text-white">Before</button>
                  <button className="rounded-full px-6 py-2 text-sm font-medium text-[#5b5772]">After</button>
                </div>
              </div>

              <div className="flex flex-col gap-8 md:flex-row">
                {/* Left side - Before */}
                <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:w-1/2">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-full">
                      <Image src="/confident-professional.png" alt="Bill Johnson" width={48} height={48} />
                    </div>
                    <div>
                      <p className="font-medium text-[#16151a]">Bill Johnson</p>
                      <p className="text-sm text-[#5b5772]">Marketing Director, TechCorp</p>
                    </div>
                    <div className="ml-auto">
                      <Image src="/google-logo.jpg" alt="Google" width={24} height={24} />
                    </div>
                  </div>
                  <p className="text-[#16151a]">
                    "This product has completely transformed how we handle customer feedback. The interface is
                    intuitive, and the results are remarkable!"
                  </p>
                  <div className="mt-4 flex justify-center">
                    <button className="flex items-center gap-2 rounded-md border border-[#7c5cff] bg-white px-4 py-2 text-sm font-medium text-[#7c5cff]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M3 17L9 11L13 15L21 7"
                          stroke="#7c5cff"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17 7H21V11"
                          stroke="#7c5cff"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Refine with AI
                    </button>
                  </div>
                </div>

                {/* Right side - After */}
                <div className="w-full md:w-1/2">
                  <div className="relative">
                    <div className="rounded-xl bg-[#7c5cff] p-4">
                      <div className="rounded-lg bg-white p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="h-6 w-24 rounded bg-[#7c5cff]/20"></div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className="h-4 w-4 text-[#ffc72a]"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <div className="mb-4 flex gap-4">
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full">
                            <Image src="/confident-professional.png" alt="Bill Johnson" width={80} height={80} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#7c5cff]">Client Testimonial</p>
                            <p className="text-[#16151a]">
                              "This product has completely transformed how we handle customer feedback. The interface is
                              intuitive, and the results are remarkable!"
                            </p>
                            <p className="mt-2 text-sm font-medium text-[#16151a]">Bill Johnson</p>
                            <p className="text-xs text-[#5b5772]">Marketing Director</p>
                          </div>
                        </div>
                      </div>
                    </div>
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
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#7c5cff] to-[#cd5cff] px-8 py-3 text-base font-medium text-white transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#7c5cff] focus:ring-offset-2"
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
