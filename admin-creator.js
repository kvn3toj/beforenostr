import { createClient } from '@supabase/supabase-js'

// Credenciales de Supabase remoto
// NOTA: Reemplaza estas credenciales con las de tu proyecto Supabase
const supabaseUrl = 'https://eozlymumznzzpqnhfhrk.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvemx5bXVtem56enBxbmhmaHJrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMjQ5MzQzNiwiZXhwIjoyMDI4MDY5NDM2fQ.K29-DnIeXd4FuDZfG-EcvFNIRXFqaEQ8M3TE1ZwskRo'

console.log(`Usando URL de Supabase: ${supabaseUrl}`)

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdminUser() {
  try {
    // Datos del usuario administrador
    const email = 'admin@coomunity.co'
    const password = '123456'
    
    console.log(`Intentando crear usuario administrador: ${email}`)
    
    // Paso 1: Comprobar si el usuario ya existe
    const { data: existingUser, error: checkError } = await supabase.auth.admin.listUsers()
    
    if (checkError) {
      console.error('Error al verificar usuarios existentes:', checkError.message)
      return
    }
    
    const userExists = existingUser.users.some(user => user.email === email)
    
    if (userExists) {
      console.log(`El usuario con email ${email} ya existe.`)
      return
    }
    
    // Paso 2: Crear el usuario en auth.users
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true // Confirmar el email automáticamente
    })
    
    if (userError) {
      console.error('Error al crear usuario:', userError.message)
      return
    }
    
    console.log('Usuario creado exitosamente:', userData.user.id)
    
    // Paso 3: Crear perfil de administrador
    const { data: profileData, error: profileError } = await supabase
      .from('admin_profiles')
      .insert([
        {
          id: userData.user.id,
          email,
          role: 'admin',
          full_name: 'Administrador',
          created_at: new Date(),
          updated_at: new Date()
        }
      ])
      .select()
    
    if (profileError) {
      console.error('Error al crear perfil de administrador:', profileError.message)
      return
    }
    
    console.log('Perfil de administrador creado exitosamente')
    console.log('Proceso completado. El usuario administrador ha sido creado.')
    
  } catch (error) {
    console.error('Error inesperado:', error)
  }
}

// Ejecutar la función
createAdminUser() 