"use client"

import { useState } from "react"
import Image from "next/image"

export default function AccountSettings() {
  const [name, setName] = useState("Harsh")
  const [email, setEmail] = useState("harshalex@gmail.com")

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Account Information</h2>

      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-full">
            <Image src="/vibrant-street-market.png" alt="Profile" fill className="object-cover" />
          </div>
          <div>
            <h3 className="text-lg font-medium">Harsh Alex</h3>
            <p className="text-sm text-gray-500">harshalex@gmail.com</p>
          </div>
        </div>
        <button className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">
          Change Photo
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Name/Business Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Contact Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">
          Cancel
        </button>
        <button className="rounded-md bg-[#7c5cff] px-4 py-2 text-sm font-medium text-white hover:bg-[#6a4ddb]">
          Update Profile
        </button>
      </div>
    </div>
  )
}
