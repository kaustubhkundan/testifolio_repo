import { ArrowRight, Book, FileText, HelpCircle, MessageSquare, Shield } from "lucide-react"

export default function SupportSettings() {
  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Support & Resources</h2>

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <Book className="h-6 w-6 text-[#7c5cff]" />
          </div>
          <h3 className="mb-2 text-lg font-medium">Knowledge Base</h3>
          <p className="mb-4 text-sm text-gray-500">
            Detailed guides and documentation to help you make the most of our platform.
          </p>
          <a href="#" className="inline-flex items-center text-sm font-medium text-[#7c5cff] hover:underline">
            Explore Articles
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </div>

        <div className="rounded-lg border border-gray-200 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
            <HelpCircle className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="mb-2 text-lg font-medium">Frequently Asked Questions</h3>
          <p className="mb-4 text-sm text-gray-500">
            Find quick answers to common questions about our platform and services.
          </p>
          <a href="#" className="inline-flex items-center text-sm font-medium text-[#7c5cff] hover:underline">
            Explore FAQs
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </div>

        <div className="rounded-lg border border-gray-200 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
            <MessageSquare className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="mb-2 text-lg font-medium">Contact Support</h3>
          <p className="mb-4 text-sm text-gray-500">Get in touch with our support team for personalized help.</p>
          <a href="#" className="inline-flex items-center text-sm font-medium text-[#7c5cff] hover:underline">
            Contact Support
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <MessageSquare className="h-3 w-3" />
            <span>Live chat support coming soon</span>
          </div>
        </div>
      </div>

      <h3 className="mb-4 text-xl font-medium">Legal Information</h3>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-6">
          <div className="mb-4 flex items-center gap-3">
            <FileText className="h-6 w-6 text-[#7c5cff]" />
            <h4 className="text-lg font-medium">Terms of Services</h4>
          </div>
          <p className="mb-4 text-sm text-gray-500">Read our terms and conditions.</p>
          <a href="#" className="inline-flex items-center text-sm font-medium text-[#7c5cff] hover:underline">
            Read Terms
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </div>

        <div className="rounded-lg border border-gray-200 p-6">
          <div className="mb-4 flex items-center gap-3">
            <Shield className="h-6 w-6 text-[#7c5cff]" />
            <h4 className="text-lg font-medium">Privacy Policy</h4>
          </div>
          <p className="mb-4 text-sm text-gray-500">Learn about data protection.</p>
          <a href="#" className="inline-flex items-center text-sm font-medium text-[#7c5cff] hover:underline">
            Read Privacy Policy
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
