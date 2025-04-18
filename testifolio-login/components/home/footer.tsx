import Link from "next/link"
import { Facebook, Linkedin, Twitter } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-[#111827] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Logo and Tagline */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <Link href="/" className="flex items-center">
                <div className="flex items-center">
                  <Image
                    src="/footericon.svg"
                    alt="Testimonials illustration"
                    width={600}
                    height={600}
                    className="h-auto w-full"
                    priority
                  />                </div>
              </Link>
            </div>
            <p className="text-sm text-gray-400">Transform customer testimonials into powerful marketing content.</p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="mb-4 text-lg font-medium">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="text-sm text-gray-400 hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-gray-400 hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="text-sm text-gray-400 hover:text-white">
                  Integrations
                </Link>
              </li>
              <li>
                <Link href="/enterprise" className="text-sm text-gray-400 hover:text-white">
                  Enterprise
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-4 text-lg font-medium">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-400 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-gray-400 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-gray-400 hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-400 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-4 text-lg font-medium">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-gray-400 hover:text-white">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-400 hover:text-white">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-sm text-gray-400 hover:text-white">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px w-full bg-gray-800"></div>

        {/* Copyright and Social */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-gray-400">© 2025 TestiFolio. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link href="https://twitter.com" className="text-gray-400 hover:text-white">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="https://linkedin.com" className="text-gray-400 hover:text-white">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link href="https://facebook.com" className="text-gray-400 hover:text-white">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
