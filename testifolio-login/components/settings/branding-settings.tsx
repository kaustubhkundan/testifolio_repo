import { ChevronDown, Shield, Trash2 } from "lucide-react"

export default function BrandingSettings() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Brand Settings</h2>
        <span className="rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-white">Pro Only</span>
      </div>

      <div className="mb-8">
        <h3 className="mb-3 text-lg font-medium">Brand Colors</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded bg-[#3A4EFF]"></div>
            <input
              type="text"
              defaultValue="#3A4EFF"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded bg-[#F77CFF]"></div>
            <input
              type="text"
              defaultValue="#F77CFF"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded bg-[#4F46E5]"></div>
            <input
              type="text"
              defaultValue="#4F46E5"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="mb-3 text-lg font-medium">Upload Logo</h3>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <div className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
              <p className="mb-2 text-center text-sm text-blue-500">Click to Upload</p>
              <p className="text-xs text-gray-500">or drag and drop</p>
              <p className="mt-1 text-xs text-gray-500">(Max. File size: 25 MB)</p>
            </div>
          </div>
          <div className="flex-1">
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Company Logo.png</p>
                  <p className="text-xs text-gray-500">2.4MB</p>
                </div>
              </div>
              <button className="mt-2 flex h-8 w-8 items-center justify-center rounded-full text-red-500 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-medium">Brand Font</h3>
        <div className="relative">
          <select className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 focus:border-[#7c5cff] focus:outline-none">
            <option>Inter</option>
            <option>Roboto</option>
            <option>Open Sans</option>
            <option>Montserrat</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        </div>
      </div>
    </div>
  )
}
