-- supabase/seed.sql
-- Este script se ejecuta automáticamente después de las migraciones en `supabase db reset`.
-- Inserta datos de desarrollo esenciales.

-- 1. Crear usuario admin si no existe
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'devadmin@example.com') THEN
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      role
    ) VALUES (
      '00000000-0000-0000-0000-000000000001',
      'devadmin@example.com',
      crypt('password123', gen_salt('bf')),
      now(),
      now(),
      now(),
      'authenticated'
    );
  END IF;
END $$;

-- 2. Crear perfil de admin si no existe
INSERT INTO public.admin_profiles (
  id,
  email,
  role,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'devadmin@example.com',
  'admin',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- 3. Crear Mundo por defecto si no existe
INSERT INTO public.mundos (
  id,
  name,
  description,
  created_by,
  created_at,
  updated_at
) VALUES (
  '74cccd93-2053-4ece-8dee-6bc18852e71a',
  'Mundo Principal',
  'Mundo por defecto para administración',
  '00000000-0000-0000-0000-000000000001',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Puedes añadir aquí INSERTs para otros datos de seed si lo necesitas (playlists, carpetas, etc.)
