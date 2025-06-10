"use client"

import { useState, useEffect } from "react"
import { Copy, Facebook, Instagram, Linkedin, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { GoogleService } from "@/lib/services/google-service"
import { FacebookService } from "@/lib/services/facebook-service"

interface Integration {
  id: string
  provider: string
  provider_user_id: string
  user_email: string
  user_name: string
  connected_at: string
  expires_at?: string
}

export default function IntegrationsSettings() {
  const { user } = useAuth()
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchIntegrations()
    }
  }, [user])

  const fetchIntegrations = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from("user_integrations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      setIntegrations(data || [])
    } catch (err) {
      console.error("Error fetching integrations:", err)
      setError("Failed to load integrations")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleConnect = async () => {
    try {
      setConnectingProvider("google")
      setError(null)

      const authUrl = GoogleService.getAuthUrl()
      const popup = window.open(authUrl, "google-auth", "width=500,height=600")

      // Listen for messages from popup
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === "GOOGLE_AUTH_SUCCESS") {
          setConnectingProvider(null)
          setSuccess(`Google account connected successfully! (${event.data.user.email})`)
          fetchIntegrations()
          setTimeout(() => setSuccess(null), 5000)
          window.removeEventListener("message", handleMessage)
        } else if (event.data.type === "GOOGLE_AUTH_ERROR") {
          setConnectingProvider(null)
          setError(event.data.error || "Failed to connect Google account")
          window.removeEventListener("message", handleMessage)
        }
      }

      window.addEventListener("message", handleMessage)

      // Fallback: Check if popup was closed manually
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed)
          setConnectingProvider(null)
          window.removeEventListener("message", handleMessage)
        }
      }, 1000)

      // Stop checking after 5 minutes
      setTimeout(() => {
        clearInterval(checkClosed)
        setConnectingProvider(null)
        window.removeEventListener("message", handleMessage)
      }, 300000)
    } catch (err) {
      console.error("Error connecting Google:", err)
      setError("Failed to connect Google account")
      setConnectingProvider(null)
    }
  }

  const handleFacebookConnect = async () => {
    try {
      setConnectingProvider("facebook")
      setError(null)

      const authUrl = FacebookService.getAuthUrl()
      const popup = window.open(authUrl, "facebook-auth", "width=500,height=600")

      // Listen for messages from popup
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === "FACEBOOK_AUTH_SUCCESS") {
          setConnectingProvider(null)
          setSuccess(`Facebook account connected successfully! (${event.data.user.name})`)
          fetchIntegrations()
          setTimeout(() => setSuccess(null), 5000)
          window.removeEventListener("message", handleMessage)
        } else if (event.data.type === "FACEBOOK_AUTH_ERROR") {
          setConnectingProvider(null)
          setError(event.data.error || "Failed to connect Facebook account")
          window.removeEventListener("message", handleMessage)
        }
      }

      window.addEventListener("message", handleMessage)

      // Fallback: Check if popup was closed manually
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed)
          setConnectingProvider(null)
          window.removeEventListener("message", handleMessage)
        }
      }, 1000)

      // Stop checking after 5 minutes
      setTimeout(() => {
        clearInterval(checkClosed)
        setConnectingProvider(null)
        window.removeEventListener("message", handleMessage)
      }, 300000)
    } catch (err) {
      console.error("Error connecting Facebook:", err)
      setError("Failed to connect Facebook account")
      setConnectingProvider(null)
    }
  }

  const handleDisconnect = async (provider: string) => {
    if (!user) return

    try {
      setError(null)

      const { error } = await supabase
        .from("user_integrations")
        .delete()
        .eq("user_id", user.id)
        .eq("provider", provider)

      if (error) throw error

      setSuccess(`${provider.charAt(0).toUpperCase() + provider.slice(1)} account disconnected`)
      fetchIntegrations()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error("Error disconnecting:", err)
      setError(`Failed to disconnect ${provider} account`)
    }
  }

  const copyEmbedCode = () => {
    const embedCode = `<script src="https://testifolio.com/embed.js"></script>`
    navigator.clipboard.writeText(embedCode)
    setSuccess("Embed code copied to clipboard!")
    setTimeout(() => setSuccess(null), 2000)
  }

  const getIntegrationStatus = (provider: string) => {
    return integrations.find((integration) => integration.provider === provider)
  }

  const isTokenExpired = (integration: Integration) => {
    if (!integration.expires_at) return false
    return new Date(integration.expires_at) <= new Date()
  }

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Integrations</h2>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700 flex items-center">
          <CheckCircle className="h-4 w-4 mr-2" />
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </div>
      )}

      <div className="mb-8">
        <h3 className="mb-3 text-lg font-medium">Embed Code</h3>
        <p className="mb-3 text-sm text-gray-600">
          Add this code to your website to display testimonials automatically.
        </p>
        <div className="relative">
          <div className="flex items-center rounded-md border border-gray-300 bg-gray-50 px-3 py-2">
            <code className="flex-1 text-sm text-gray-800">
              &lt;script src="https://testifolio.com/embed.js"&gt;&lt;/script&gt;
            </code>
            <button onClick={copyEmbedCode} className="ml-2 rounded-md p-1 hover:bg-gray-200">
              <Copy className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-medium">Social Media & Review Platforms</h3>
        <p className="mb-4 text-sm text-gray-600">
          Connect your accounts to import testimonials and reviews automatically.
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading integrations...</span>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Google Integration */}
            <div className="flex w-full items-center justify-between rounded-md border border-gray-300 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </div>
                <div>
                  <span className="font-medium">Google My Business</span>
                  {(() => {
                    const googleIntegration = getIntegrationStatus("google")
                    if (googleIntegration) {
                      const expired = isTokenExpired(googleIntegration)
                      return (
                        <div className="text-xs text-gray-500">
                          Connected as {googleIntegration.user_name}
                          {expired && <span className="text-red-500 ml-1">(Token Expired)</span>}
                        </div>
                      )
                    }
                    return <div className="text-xs text-gray-500">Import reviews from Google My Business</div>
                  })()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {(() => {
                  const googleIntegration = getIntegrationStatus("google")
                  if (googleIntegration) {
                    const expired = isTokenExpired(googleIntegration)
                    return (
                      <>
                        {expired ? (
                          <span className="rounded-md bg-red-100 px-2 py-1 text-xs text-red-600">Expired</span>
                        ) : (
                          <span className="rounded-md bg-green-100 px-2 py-1 text-xs text-green-600 flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Connected
                          </span>
                        )}
                        <button
                          onClick={() => handleDisconnect("google")}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Disconnect
                        </button>
                      </>
                    )
                  }
                  return (
                    <button
                      onClick={handleGoogleConnect}
                      disabled={connectingProvider === "google"}
                      className="rounded-md bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700 disabled:opacity-50 flex items-center"
                    >
                      {connectingProvider === "google" ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        "Connect"
                      )}
                    </button>
                  )
                })()}
              </div>
            </div>

            {/* Facebook Integration */}
            <div className="flex w-full items-center justify-between rounded-md border border-gray-300 px-4 py-3">
              <div className="flex items-center gap-3">
                <Facebook className="h-6 w-6 text-blue-600" />
                <div>
                  <span className="font-medium">Facebook</span>
                  {(() => {
                    const facebookIntegration = getIntegrationStatus("facebook")
                    if (facebookIntegration) {
                      return <div className="text-xs text-gray-500">Connected as {facebookIntegration.user_name}</div>
                    }
                    return <div className="text-xs text-gray-500">Import reviews from Facebook pages</div>
                  })()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {(() => {
                  const facebookIntegration = getIntegrationStatus("facebook")
                  if (facebookIntegration) {
                    return (
                      <>
                        <span className="rounded-md bg-green-100 px-2 py-1 text-xs text-green-600 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Connected
                        </span>
                        <button
                          onClick={() => handleDisconnect("facebook")}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Disconnect
                        </button>
                      </>
                    )
                  }
                  return (
                    <button
                      onClick={handleFacebookConnect}
                      disabled={connectingProvider === "facebook"}
                      className="rounded-md bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700 disabled:opacity-50 flex items-center"
                    >
                      {connectingProvider === "facebook" ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        "Connect"
                      )}
                    </button>
                  )
                })()}
              </div>
            </div>

            {/* LinkedIn Integration */}
            <div className="flex w-full items-center justify-between rounded-md border border-gray-300 px-4 py-3">
              <div className="flex items-center gap-3">
                <Linkedin className="h-6 w-6 text-blue-700" />
                <div>
                  <span className="font-medium">LinkedIn</span>
                  <div className="text-xs text-gray-500">Import recommendations and endorsements</div>
                </div>
              </div>
              <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">Coming Soon</span>
            </div>

            {/* Instagram Integration */}
            <div className="flex w-full items-center justify-between rounded-md border border-gray-300 px-4 py-3">
              <div className="flex items-center gap-3">
                <Instagram className="h-6 w-6 text-pink-600" />
                <div>
                  <span className="font-medium">Instagram</span>
                  <div className="text-xs text-gray-500">Import comments and mentions</div>
                </div>
              </div>
              <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">Coming Soon</span>
            </div>
          </div>
        )}

        {/* Integration Stats */}
        {!isLoading && integrations.length > 0 && (
          <div className="mt-6 rounded-md bg-gray-50 p-4">
            <h4 className="mb-2 font-medium text-gray-900">Connected Accounts</h4>
            <div className="space-y-2">
              {integrations.map((integration) => (
                <div key={integration.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {integration.provider.charAt(0).toUpperCase() + integration.provider.slice(1)}
                  </span>
                  <span className="text-gray-500">
                    Connected {new Date(integration.connected_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
