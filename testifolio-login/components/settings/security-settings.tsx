export default function SecuritySettings() {
  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Security Settings</h2>

      <div className="mb-8">
        <h3 className="mb-4 text-lg font-medium">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              defaultValue="••••••••"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              placeholder="New Password"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">
            Cancel
          </button>
          <button className="rounded-md bg-[#7c5cff] px-4 py-2 text-sm font-medium text-white hover:bg-[#6a4ddb]">
            Update Password
          </button>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Two Factor Authentication</h3>
        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
          <div>
            <h4 className="font-medium">2FA Status</h4>
            <p className="text-sm text-gray-500">Enhance your account security</p>
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
