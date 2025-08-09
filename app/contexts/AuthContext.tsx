/**
 * Authentication and profile context
 *
 * Central place to access the current user, session, and profile. Also exposes
 * helper methods for sign-in/-up, OAuth, and profile updates.
 *
 * Why a context?
 * - Avoids prop drilling auth state through routes
 * - Makes it easy for new components to adopt the same auth contract
 *
 * Extension ideas:
 * - Add role/permission helpers when we introduce corporate roles
 * - Persist user preferences (theme, locale) near the profile
 */
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { authHelpers, dbHelpers } from '~/lib/supabase'

interface UserProfile {
  id: string
  full_name: string | null
  email: string | null
  country: string | null
  state: string | null
  user_type: 'individual' | 'corporate' | null
  avatar_url: string | null
  work_days_count: number
  last_break_date: string | null
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ data: unknown; error: { message?: string } | null }>
  signUp: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<{ data: unknown; error: { message?: string } | null }>
  signInWithGoogle: () => Promise<{ data: unknown; error: { message?: string } | null }>
  signOut: () => Promise<{ error: { message?: string } | null }>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ data: UserProfile | null; error: { message?: string } | null }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user profile from database
  const loadUserProfile = async (userId: string) => {
    // We purposely do not throw here; profile fetch is best-effort to avoid
    // blocking the initial experience if the network is slow.
    try {
      console.log('🔍 Loading profile for user:', userId)
      const { data: profile, error } = await dbHelpers.getUserProfile(userId)
      console.log('📊 Profile data:', profile, 'Error:', error)
      if (error) {
        console.error('Error loading user profile:', error)
        return
      }
      setUserProfile(profile)
      console.log('✅ Profile loaded successfully')
    } catch (error) {
      console.error('❌ Error loading user profile:', error)
    }
  }

  useEffect(() => {
    // Failsafe timeout — keep the UI responsive even if Supabase hiccups
    const failsafeTimeout = setTimeout(() => {
      console.log('⚠️ Failsafe timeout - forcing loading to false')
      setLoading(false)
    }, 5000) // 5 second max loading time

    // Initial session load on app start
    const getInitialSession = async () => {
      console.log('🔄 Getting initial session...')
      try {
        const { user: currentUser, error } = await authHelpers.getCurrentUser()
        console.log('👤 Current user:', currentUser?.email || 'No user', 'Error:', error)
        setUser(currentUser)
        
        if (currentUser) {
          console.log('📝 Loading user profile...')
          // Don't await profile loading to prevent blocking the auth flow
          loadUserProfile(currentUser.id).catch(err => {
            console.error('Profile loading failed:', err)
          })
        }
        
        console.log('✅ Initial session loaded, setting loading to false')
        setLoading(false)
        clearTimeout(failsafeTimeout) // Clear failsafe since we succeeded
      } catch (err) {
        console.error('❌ Error getting initial session:', err)
        setLoading(false)
        clearTimeout(failsafeTimeout)
      }
    }

    getInitialSession()

    // Subscribe to Supabase auth changes to keep state in sync across tabs
    const { data: { subscription } } = authHelpers.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Don't await profile loading to prevent blocking
          loadUserProfile(session.user.id).catch(err => {
            console.error('Profile loading failed:', err)
          })
        } else {
          setUserProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
      clearTimeout(failsafeTimeout)
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    const result = await authHelpers.signInWithEmail(email, password)
    
    if (result.data?.user && !result.error) {
      await loadUserProfile(result.data.user.id)
    }
    
    setLoading(false)
    return result
  }

  const signUp = async (email: string, password: string, metadata?: Record<string, unknown>) => {
    setLoading(true)
    const result = await authHelpers.signUpWithEmail(email, password, metadata)
    
    // Profile will be created automatically by the database trigger
    // and loaded when the auth state changes
    
    setLoading(false)
    return result
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    const result = await authHelpers.signInWithGoogle()
    setLoading(false)
    return result
  }

  const signOut = async () => {
    setLoading(true)
    const result = await authHelpers.signOut()
    setUser(null)
    setUserProfile(null)
    setSession(null)
    setLoading(false)
    return result
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return { data: null, error: { message: 'No user logged in' } as { message?: string } }
    }

    const result = await dbHelpers.updateUserProfile(user.id, updates)
    
    if (result.data && !result.error) {
      setUserProfile(result.data)
    }
    
    return result
  }

  const refreshProfile = async () => {
    if (user) {
      await loadUserProfile(user.id)
    }
  }

  const value = {
    user,
    userProfile,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateProfile,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 