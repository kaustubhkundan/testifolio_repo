import { Copy, Facebook, Instagram, Linkedin } from "lucide-react"

export default function IntegrationsSettings() {
  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Integrations</h2>

      <div className="mb-8">
        <h3 className="mb-3 text-lg font-medium">Embed Code</h3>
        <div className="relative">
          <div className="flex items-center rounded-md border border-gray-300 bg-gray-50 px-3 py-2">
            <code className="flex-1 text-sm text-gray-800">
              &lt;script src="https://testifolio.com/embed.js"&gt;&lt;/script&gt;
            </code>
            <button className="ml-2 rounded-md p-1 hover:bg-gray-200">
              <Copy className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-medium">Social Media</h3>
        <div className="space-y-3">
          <button className="flex w-full items-center justify-between rounded-md border border-gray-300 px-4 py-3 hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <Facebook className="h-5 w-5 text-blue-600" />
              <span>Connect Facebook</span>
            </div>
          </button>

          <button className="flex w-full items-center justify-between rounded-md border border-gray-300 px-4 py-3 hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <Linkedin className="h-5 w-5 text-blue-700" />
              <span>Connect LinkedIn</span>
            </div>
          </button>

          <div className="flex w-full items-center justify-between rounded-md border border-gray-300 px-4 py-3">
            <div className="flex items-center gap-2">
              <Instagram className="h-5 w-5 text-pink-600" />
              <span>Connect Instagram</span>
            </div>
            <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  )
}
