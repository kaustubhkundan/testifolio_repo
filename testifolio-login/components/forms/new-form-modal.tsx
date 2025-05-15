"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2, X } from "lucide-react"

import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"

interface NewFormModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NewFormModal({ isOpen, onClose }: NewFormModalProps) {
  const { user } = useAuth()
  const [formName, setFormName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formName.trim()) {
      setError("Please enter a form name")
      return
    }

    if (!user) {
      setError("You must be logged in to create a form")
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Create the form in Supabase
      const { data, error: insertError } = await supabase
        .from("collection_forms")
        .insert([
          {
            name: formName.trim(),
            user_id: user.id,
            // Default values are set in the database schema
          },
        ])
        .select()

      if (insertError) {
        throw insertError
      }

      // Get the created form ID
      const formId = data?.[0]?.id

      if (!formId) {
        throw new Error("Failed to create form")
      }

      // Redirect to the form editor
      router.push(`/dashboard/collection-forms/${formId}`)
      onClose()
    } catch (err) {
      console.error("Error creating form:", err)
      setError("Failed to create form. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          disabled={loading}
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
              disabled={loading}
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-black px-4 py-3 text-center text-white hover:bg-gray-800 disabled:opacity-70"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </span>
            ) : (
              "Create"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
