import { createClient } from '@supabase/supabase-js'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

/**
 * Supabase client and thin helper layer
 *
 * Why a single module?
 * - Keeps API usage consistent across the app
 * - Makes it easy to swap in additional tables/helpers without scattering logic
 *
 * Future improvements:
 * - Move URL and anon key to env variables for production builds
 * - Introduce typed table models with Zod or Supabase typegen
 */

// Replace these with your actual Supabase project URL and anon key
const supabaseUrl = 'https://ctcvtyjmsdbdkrpaxnih.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0Y3Z0eWptc2RiZGtycGF4bmloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NTkxMjYsImV4cCI6MjA2OTEzNTEyNn0.Fic-8Ld-5hnK1LOobXbZVYkofiEL_p1b3NH_iM-0ULI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database helper functions
// Database helpers keep components lean and focus on intent
export const dbHelpers = {
  // Get user profile
  getUserProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  // Update user profile
  updateUserProfile: async (userId: string, updates: Record<string, unknown>) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({ 
        id: userId, 
        ...updates,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    return { data, error }
  },

  // Create user profile (called automatically by trigger, but here for manual use)
  createUserProfile: async (userId: string, profileData: Record<string, unknown>) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({ 
        id: userId, 
        ...profileData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    return { data, error }
  },

  // Get user's trip plans
  getTripPlans: async (userId: string) => {
    const { data, error } = await supabase
      .from('trip_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Create trip plan
  createTripPlan: async (userId: string, tripData: Record<string, unknown>) => {
    const { data, error } = await supabase
      .from('trip_plans')
      .insert({ user_id: userId, ...tripData })
      .select()
      .single()
    return { data, error }
  },

  // Get flight deals
  getFlightDeals: async (limit = 10) => {
    const { data, error } = await supabase
      .from('flight_deals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    return { data, error }
  },

  // Get trip suggestions for user (public suggestions fallback to null user)
  getTripSuggestions: async (userId: string, limit = 6) => {
    const { data, error } = await supabase
      .from('trip_suggestions')
      .select('*')
      .or(`user_id.eq.${userId},user_id.is.null`)
      .order('created_at', { ascending: false })
      .limit(limit)
    return { data, error }
  }
}

// Auth helper functions
export const authHelpers = {
  // Sign in with email and password
  signInWithEmail: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Sign up with email and password
  signUpWithEmail: async (email: string, password: string, metadata?: Record<string, unknown>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata || {}
      }
    })
    return { data, error }
  },

  // Sign in with Google OAuth
  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Listen to auth changes
  onAuthStateChange: (callback: (event: AuthChangeEvent, session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  }
} 