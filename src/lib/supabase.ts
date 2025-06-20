import { createClient } from '@supabase/supabase-js'

// 🔄 Configuración Supabase para CoomÜnity
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// 🌟 Cliente Supabase con configuración optimizada
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce' // Recommended for web apps
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': '@supabase/ssr@latest'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// 🎯 Verificación de configuración
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://your-project.supabase.co' &&
         supabaseAnonKey !== 'your-anon-key'
}

// 📊 Helper para debugging
export const getSupabaseConfig = () => {
  return {
    url: supabaseUrl,
    keyConfigured: supabaseAnonKey !== 'your-anon-key',
    status: isSupabaseConfigured() ? 'configured' : 'needs-setup'
  }
}

// 🔐 Auth helpers
export const signInWithSupabase = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signUpWithSupabase = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })
  return { data, error }
}

export const signOutFromSupabase = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentSupabaseUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// 📱 Real-time helpers
export const subscribeToSupabaseChanges = (table: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`public:${table}`)
    .on('postgres_changes',
      { event: '*', schema: 'public', table: table },
      callback
    )
    .subscribe()
}

export default supabase
