"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export interface UserProfile {
  id: string
  email: string
  fullName: string
  companyName: string
  jobTitle: string
  bio: string
  website: string
  avatarUrl: string
  createdAt: string
  updatedAt: string
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setIsLoading(true)
        setError(null)

        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) throw userError

        if (!user) {
          setProfile(null)
          return
        }

        // Get profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (profileError && profileError.code !== "PGRST116") {
          throw profileError
        }

        // Format profile data
        const formattedProfile: UserProfile = {
          id: user.id,
          email: user.email || "",
          fullName: profileData?.full_name || user.user_metadata?.full_name || "",
          companyName: profileData?.company_name || user.user_metadata?.company || "",
          jobTitle: profileData?.job_title || user.user_metadata?.job_title || "",
          bio: profileData?.bio || "",
          website: profileData?.website || "",
          avatarUrl: profileData?.avatar_url || user.user_metadata?.avatar_url || "",
          createdAt: user.created_at || "",
          updatedAt: profileData?.updated_at || user.updated_at || "",
        }

        setProfile(formattedProfile)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error occurred"))
        console.error("Error fetching user profile:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const updateProfile = async (updatedProfile: Partial<UserProfile>) => {
    if (!profile) return { success: false, error: new Error("No user profile found") }

    try {
      // Update auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: updatedProfile.fullName,
          company: updatedProfile.companyName,
          job_title: updatedProfile.jobTitle,
        },
      })

      if (authError) throw authError

      // Update profile data
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: profile.id,
        full_name: updatedProfile.fullName || profile.fullName,
        company_name: updatedProfile.companyName || profile.companyName,
        job_title: updatedProfile.jobTitle || profile.jobTitle,
        bio: updatedProfile.bio || profile.bio,
        website: updatedProfile.website || profile.website,
        avatar_url: updatedProfile.avatarUrl || profile.avatarUrl,
        updated_at: new Date().toISOString(),
      })

      if (profileError) throw profileError

      // Update local state
      setProfile((prev) => (prev ? { ...prev, ...updatedProfile } : null))

      return { success: true }
    } catch (err) {
      console.error("Error updating profile:", err)
      return {
        success: false,
        error: err instanceof Error ? err : new Error("Unknown error occurred"),
      }
    }
  }

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      return { success: true }
    } catch (err) {
      console.error("Error updating password:", err)
      return {
        success: false,
        error: err instanceof Error ? err : new Error("Unknown error occurred"),
      }
    }
  }

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    updatePassword,
  }
}
