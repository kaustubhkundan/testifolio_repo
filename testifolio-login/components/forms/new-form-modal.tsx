"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"

interface NewFormModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NewFormModal({ isOpen, onClose }: NewFormModalProps) {
  const [formName, setFormName] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formName.trim()) {
      // In a real app, we would create the form in the database here
      const formId = Date.now().toString()
      router.push(`/dashboard/collection-forms/${formId}`)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">New form</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <p className="mb-4 text-gray-600">
              Start by giving your form a name.
              <br />
              Once created, you&apos;ll be able to customize it.
            </p>
            <label className="mb-2 block text-sm font-medium text-gray-700">Form name</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
              placeholder="Enter form name"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-black px-4 py-3 text-center text-white hover:bg-gray-800"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  )
}
