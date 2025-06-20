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
export const isSupabaseConfigured = (): boolean => {
  return supabaseUrl !== 'https://your-project.supabase.co' &&
         supabaseAnonKey !== 'your-anon-key' &&
         supabaseUrl.includes('.supabase.co') &&
         supabaseAnonKey.length > 20
}

// 📊 Obtener configuración actual
export const getSupabaseConfig = () => ({
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
  configured: isSupabaseConfigured()
})

// 🔐 Funciones de autenticación
export const signInWithSupabase = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password })
}

export const signUpWithSupabase = async (email: string, password: string) => {
  return await supabase.auth.signUp({ email, password })
}

export const signOutFromSupabase = async () => {
  return await supabase.auth.signOut()
}

export const getCurrentSupabaseUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// 🗄️ Funciones de base de datos (ejemplos)
export const getSupabaseData = async (table: string) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  const { data, error } = await supabase
    .from(table)
    .select('*')

  if (error) throw error
  return data
}

export const insertSupabaseData = async (table: string, data: any) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  const { data: result, error } = await supabase
    .from(table)
    .insert(data)
    .select()

  if (error) throw error
  return result
}

// 🔄 Real-time subscriptions
export const subscribeToSupabaseTable = (
  table: string,
  callback: (payload: any) => void
) => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured - subscription ignored')
    return null
  }

  return supabase
    .channel(`public:${table}`)
    .on('postgres_changes',
      { event: '*', schema: 'public', table },
      callback
    )
    .subscribe()
}

// 🎯 Health check
export const checkSupabaseConnection = async (): Promise<{
  status: 'connected' | 'error' | 'not_configured'
  message: string
  details?: any
}> => {
  if (!isSupabaseConfigured()) {
    return {
      status: 'not_configured',
      message: 'Supabase not configured - missing URL or anon key'
    }
  }

  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      return {
        status: 'error',
        message: `Connection error: ${error.message}`,
        details: error
      }
    }

    return {
      status: 'connected',
      message: 'Supabase connection successful',
      details: {
        hasSession: !!data.session,
        url: supabaseUrl,
        configuredAt: new Date().toISOString()
      }
    }
  } catch (error) {
    return {
      status: 'error',
      message: `Unexpected error: ${error}`,
      details: error
    }
  }
}

// 🎉 Funciones de Storage (si necesario)
export const uploadFileToSupabase = async (
  bucket: string,
  fileName: string,
  file: File
) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file)

  if (error) throw error
  return data
}

export const downloadFileFromSupabase = async (
  bucket: string,
  fileName: string
) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .download(fileName)

  if (error) throw error
  return data
}
