"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Camera, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

export function AccountSettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    companyName: "",
    jobTitle: "",
    bio: "",
    website: "",
    avatar: "",
  })

  // Fetch user data from Supabase
  useEffect(() => {
    async function fetchUserProfile() {
      setIsLoading(true)
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          // Get profile data from profiles table
          const { data: profile, error } = await supabase.from("profiles").select("*").eq("user_id", user.id).single()

          if (profile) {
            setUser(user)
            setFormData({
              fullName: profile.full_name || user.user_metadata?.full_name || "",
              email: user.email || "",
              companyName: profile.company_name || user.user_metadata?.company || "",
              jobTitle: profile.job_title || user.user_metadata?.job_title || "",
              bio: profile?.bio || "",
              website: profile?.website || "",
              avatar: profile.avatar_url || user.user_metadata?.avatar_url || "",
            })
          } else {
            // If no profile exists, use auth data
            setUser(user)
            setFormData({
              fullName: user.user_metadata?.full_name || "",
              email: user.email || "",
              companyName: user.user_metadata?.company || "",
              jobTitle: user.user_metadata?.job_title || "",
              bio: "",
              website: "",
              avatar: user.user_metadata?.avatar_url || "",
            })
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setIsUploading(true)
    try {
      // Create a unique file name
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage.from("profiles").upload(filePath, file)

      if (uploadError) throw uploadError

      // Get the public URL
      const { data: publicURL } = supabase.storage.from("profiles").getPublicUrl(filePath)

      if (publicURL) {
        // Update the avatar URL in the form data
        setFormData((prev) => ({ ...prev, avatar: publicURL.publicUrl }))

        toast({
          title: "Success",
          description: "Avatar uploaded successfully",
        })
      }
    } catch (error) {
      console.error("Error uploading avatar:", error)
      toast({
        title: "Error",
        description: "Failed to upload avatar",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Update auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          company: formData.companyName,
          job_title: formData.jobTitle,
          avatar_url: formData.avatar, // Also update avatar in auth metadata
        },
      })

      if (authError) throw authError

      // Update or insert profile data
      const { error: profileError } = await supabase.from("profiles").update({
        full_name: formData.fullName, 
        company_name: formData.companyName,
        job_title: formData.jobTitle,
        bio: formData.bio,
        website: formData.website,
        avatar_url: formData.avatar,
        updated_at: new Date(),
      }).eq("user_id", user.id)

      if (profileError) throw profileError

      toast({
        title: "Success",
        description: "Your profile has been updated",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#7c5cff]" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-[#7c5cff] bg-gray-100">
              <Image
                src={formData.avatar || "/placeholder.svg?height=96&width=96&query=user"}
                alt="Profile"
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#7c5cff] text-white hover:bg-[#6a4ddb]"
              disabled={isUploading}
            >
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            </button>
            <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900">{formData.fullName}</p>
            <p className="text-xs text-gray-500">{formData.email}</p>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                disabled
              />
              <p className="text-xs text-gray-500">Contact support to change your email address</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Your company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="Your job title"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving || isUploading}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
