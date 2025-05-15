import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://thgosbnauranvpggnpjr.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoZ29zYm5hdXJhbnZwZ2ducGpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzIxNjEzNywiZXhwIjoyMDYyNzkyMTM3fQ.40bbH914iXLSPXMklGzF6T_617_HNlu3LXAVGvi0XXU"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export type UserProfile = {
  id: string
  user_id: string
  business_name?: string
  industry?: string
  website?: string
  onboarding_completed: boolean
  created_at: string
}
