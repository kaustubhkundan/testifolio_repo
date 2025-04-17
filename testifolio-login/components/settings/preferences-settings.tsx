export default function PreferencesSettings() {
  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Testimonial Preferences</h2>

      <div className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
          <div>
            <h3 className="font-medium">AI Refinement</h3>
            <p className="text-sm text-gray-500">Allow customers to enhance testimonials with AI suggestions</p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" defaultChecked className="peer sr-only" />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#7c5cff] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
          </label>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
          <div>
            <h3 className="font-medium">New Testimonials Notifications</h3>
            <p className="text-sm text-gray-500">Receive email notifications for new testimonials.</p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" className="peer sr-only" />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#7c5cff] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
          </label>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
          <div>
            <h3 className="font-medium">Weekly Summary</h3>
            <p className="text-sm text-gray-500">Weekly summary reports via email.</p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" defaultChecked className="peer sr-only" />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#7c5cff] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
          </label>
        </div>
      </div>
    </div>
  )
}
