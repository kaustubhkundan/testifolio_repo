import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"

export default function Signup() {
    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Left Section */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
                <div className="max-w-md w-full">
                    <div className="mb-10">
                        <Image src="/title1.svg" alt="TestiFolio Logo" width={60} height={60} className="mb-8 ml-[45%]" />

                        <h1 className="text-4xl font-bold text-[#16151a] mb-4 text-center">Welcome to Testifolio</h1>
                        <p className="text-[#5b5772] text-lg text-center mb-8">
                            With TestiFolio, you can easily request and showcase testimonials that convert. Start free!
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-[#16151a] font-medium mb-2">
                                Email address
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                className="w-full p-3 border border-[#d8d7e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b066ff]"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-[#16151a] font-medium mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder="******"
                                className="w-full p-3 border border-[#d8d7e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b066ff]"
                            />
                        </div>

                        <button className="w-full bg-[#b066ff] text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all">
                            Create new account
                        </button>

                        <div className="flex items-center justify-center my-4">
                            <div className="flex-grow h-px bg-[#d8d7e0]"></div>
                            <span className="px-4 text-[#706d8a]">OR</span>
                            <div className="flex-grow h-px bg-[#d8d7e0]"></div>
                        </div>

                        <button className="w-full bg-[#f7f7f8] border border-[#d8d7e0] text-[#403e4e] py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                            Sign up with Google
                            <Image src="/googleimg.svg" alt="Google" width={30} height={30} />

                        </button>

                        <p className="text-center mt-6 text-[#5b5772]">
                            Already have an account?{" "}
                            <Link href="/login" className="text-[#b066ff] font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="w-full md:w-1/2 bg-[#efe7ff] p-6 md:p-0 relative overflow-hidden">
            <Image src="/rightsection.svg" alt="TestiFolio Logo" width={600} height={600} />

            </div>
        </div>
    )
}
