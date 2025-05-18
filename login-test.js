import { createClient } from '@supabase/supabase-js'

// Usar la misma URL de Supabase remoto
const supabaseUrl = 'https://eozlymumznzzpqnhfhrk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvemx5bXVtem56enBxbmhmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI0OTM0MzYsImV4cCI6MjAyODA2OTQzNn0.37vdAEbSO9M5jCxA03IFMbJI70WGu4_46a0awDe9Dgg'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testLogin() {
  try {
    const email = 'admin@coomunity.co'
    const password = '123456'
    
    console.log(`Intentando iniciar sesión con: ${email}`)
    
    // Intentar iniciar sesión
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      console.error('Error al iniciar sesión:', error.message)
      return
    }
    
    console.log('Inicio de sesión exitoso!')
    console.log('Usuario ID:', data.user.id)
    console.log('Email:', data.user.email)
    console.log('Rol:', data.user.role)
    
    // Verificar si tiene perfil de administrador
    const { data: profileData, error: profileError } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()
    
    if (profileError) {
      console.error('Error al obtener perfil de administrador:', profileError.message)
      return
    }
    
    if (profileData) {
      console.log('Perfil de administrador encontrado:')
      console.log('Role:', profileData.role)
      console.log('Name:', profileData.full_name)
    } else {
      console.log('No se encontró perfil de administrador para este usuario.')
    }
    
  } catch (error) {
    console.error('Error inesperado:', error)
  }
}

// Ejecutar la prueba de inicio de sesión
testLogin() 