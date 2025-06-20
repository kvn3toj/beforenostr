import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import {
  supabase,
  signInWithSupabase,
  signUpWithSupabase,
  signOutFromSupabase,
  getCurrentSupabaseUser,
  isSupabaseConfigured
} from '../lib/supabase'

interface SupabaseAuthState {
  user: User | null
  session: Session | null
  loading: boolean
  configured: boolean
}

interface SupabaseAuthActions {
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signUp: (email: string, password: string) => Promise<{ data: any; error: any }>
  signOut: () => Promise<{ error: any }>
  refreshSession: () => Promise<void>
}

export const useSupabaseAuth = (): SupabaseAuthState & SupabaseAuthActions => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [configured] = useState(isSupabaseConfigured())

  useEffect(() => {
    if (!configured) {
      setLoading(false)
      return
    }

    // 🔄 Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // 🎧 Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Supabase Auth Event:', event)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [configured])

  // 🔑 Sign In
  const signIn = async (email: string, password: string) => {
    if (!configured) {
      return {
        data: null,
        error: { message: 'Supabase not configured' }
      }
    }

    setLoading(true)
    try {
      const result = await signInWithSupabase(email, password)
      return result
    } catch (error) {
      return {
        data: null,
        error: { message: 'Sign in failed' }
      }
    } finally {
      setLoading(false)
    }
  }

  // 📝 Sign Up
  const signUp = async (email: string, password: string) => {
    if (!configured) {
      return {
        data: null,
        error: { message: 'Supabase not configured' }
      }
    }

    setLoading(true)
    try {
      const result = await signUpWithSupabase(email, password)
      return result
    } catch (error) {
      return {
        data: null,
        error: { message: 'Sign up failed' }
      }
    } finally {
      setLoading(false)
    }
  }

  // 🚪 Sign Out
  const signOut = async () => {
    if (!configured) {
      return { error: { message: 'Supabase not configured' } }
    }

    setLoading(true)
    try {
      const result = await signOutFromSupabase()
      return result
    } catch (error) {
      return { error: { message: 'Sign out failed' } }
    } finally {
      setLoading(false)
    }
  }

  // 🔄 Refresh Session
  const refreshSession = async () => {
    if (!configured) return

    try {
      const { data: { session } } = await supabase.auth.refreshSession()
      setSession(session)
      setUser(session?.user ?? null)
    } catch (error) {
      console.error('Error refreshing session:', error)
    }
  }

  return {
    // State
    user,
    session,
    loading,
    configured,
    // Actions
    signIn,
    signUp,
    signOut,
    refreshSession
  }
}

export default useSupabaseAuth
