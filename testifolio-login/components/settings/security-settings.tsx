"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Loader2, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

export function SecuritySettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [sessions, setSessions] = useState<any[]>([])

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Fetch security data
  useEffect(() => {
    async function fetchSecurityData() {
      setIsLoading(true)
      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          // Get user's security settings
          const { data: securitySettings, error: settingsError } = await supabase
            .from("user_settings")
            .select("two_factor_enabled")
            .eq("user_id", user.id)
            .single()

          if (securitySettings) {
            setTwoFactorEnabled(securitySettings.two_factor_enabled || false)
          }

          // Get user's sessions
          const {
            data: { sessions: userSessions },
            error: sessionsError,
          } = await supabase.auth.getSessions()

          if (userSessions) {
            // Format sessions data
            const formattedSessions = userSessions.map((session) => {
              const createdAt = new Date(session.created_at)
              const lastUsedAt = session.last_used_at ? new Date(session.last_used_at) : createdAt

              return {
                id: session.id,
                device: getBrowserInfo(session.user_agent || ""),
                location: "Unknown Location", // Would need IP geolocation service for accurate data
                lastActive: formatTimeAgo(lastUsedAt),
                isCurrentSession: session.id === userSessions[0]?.id,
              }
            })

            setSessions(formattedSessions)
          }
        }
      } catch (error) {
        console.error("Error fetching security data:", error)
        toast({
          title: "Error",
          description: "Failed to load security data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSecurityData()
  }, [toast])

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      // Update password
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Your password has been updated",
      })

      // Clear form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      console.error("Error updating password:", error)
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleTwoFactorToggle = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Update two factor setting
        const { error } = await supabase.from("user_settings").upsert({
          user_id: user.id,
          two_factor_enabled: !twoFactorEnabled,
          updated_at: new Date(),
        })

        if (error) throw error

        setTwoFactorEnabled(!twoFactorEnabled)

        toast({
          title: "Success",
          description: `Two-factor authentication ${!twoFactorEnabled ? "enabled" : "disabled"}`,
        })
      }
    } catch (error) {
      console.error("Error toggling 2FA:", error)
      toast({
        title: "Error",
        description: "Failed to update two-factor authentication",
        variant: "destructive",
      })
    }
  }

  const handleSessionRevoke = async (sessionId: string) => {
    try {
      // Revoke the specific session
      const { error } = await supabase.auth.signOut({
        scope: "others",
        sessionId: sessionId,
      })

      if (error) throw error

      // Update sessions list
      setSessions((prev) => prev.filter((session) => session.id !== sessionId))

      toast({
        title: "Success",
        description: "Session has been revoked",
      })
    } catch (error) {
      console.error("Error revoking session:", error)
      toast({
        title: "Error",
        description: "Failed to revoke session",
        variant: "destructive",
      })
    }
  }

  // Helper function to get browser and OS info from user agent
  function getBrowserInfo(userAgent: string) {
    let browser = "Unknown Browser"
    let os = "Unknown OS"

    // Detect browser
    if (userAgent.includes("Firefox")) {
      browser = "Firefox"
    } else if (userAgent.includes("Chrome")) {
      browser = "Chrome"
    } else if (userAgent.includes("Safari")) {
      browser = "Safari"
    } else if (userAgent.includes("Edge")) {
      browser = "Edge"
    } else if (userAgent.includes("MSIE") || userAgent.includes("Trident/")) {
      browser = "Internet Explorer"
    }

    // Detect OS
    if (userAgent.includes("Windows")) {
      os = "Windows"
    } else if (userAgent.includes("Mac")) {
      os = "macOS"
    } else if (userAgent.includes("Linux")) {
      os = "Linux"
    } else if (userAgent.includes("Android")) {
      os = "Android"
    } else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
      os = "iOS"
    }

    return `${browser} on ${os}`
  }

  // Helper function to format time ago
  function formatTimeAgo(date: Date) {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return "Just now"
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours > 1 ? "s" : ""} ago`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} day${days > 1 ? "s" : ""} ago`
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
    <div className="space-y-8">
      {/* Password Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Change Password</h3>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                name="currentPassword"
                type={showPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                className="pr-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                className="pr-10"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
          </div>
          <Switch checked={twoFactorEnabled} onCheckedChange={handleTwoFactorToggle} />
        </div>
        {twoFactorEnabled && (
          <div className="rounded-lg border border-[#7c5cff]/20 bg-[#7c5cff]/5 p-4">
            <div className="flex items-start space-x-3">
              <Shield className="mt-0.5 h-5 w-5 text-[#7c5cff]" />
              <div>
                <p className="font-medium text-gray-900">Two-factor authentication is enabled</p>
                <p className="text-sm text-gray-500">Your account is protected with an additional layer of security.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Active Sessions</h3>
        <div className="space-y-3">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div className="space-y-1">
                <p className="font-medium text-gray-900">
                  {session.device} {session.isCurrentSession && "(Current)"}
                </p>
                <p className="text-sm text-gray-500">
                  {session.location} • Last active {session.lastActive}
                </p>
              </div>
              {!session.isCurrentSession && (
                <Button variant="outline" size="sm" onClick={() => handleSessionRevoke(session.id)}>
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
