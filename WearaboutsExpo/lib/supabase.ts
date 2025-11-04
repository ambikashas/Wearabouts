import { createClient } from '@supabase/supabase-js'

// Use EXPO_PUBLIC_ prefix so Expo can access them
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string

// Create and export the client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)