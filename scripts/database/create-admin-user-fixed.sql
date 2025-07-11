-- Crear usuario admin si no existe
-- IMPORTANTE: Este script debe ejecutarse con permisos de administrador en la base de datos
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@coomunity.co') THEN
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      role
    ) VALUES (
      gen_random_uuid(), -- Generar UUID aleatorio para el ID
      'admin@coomunity.co',
      crypt('123456', gen_salt('bf')), -- Encriptar la contraseña
      now(), -- Email confirmado
      now(), -- Fecha de creación
      now(), -- Fecha de actualización
      'authenticated' -- Rol autenticado
    );
    RAISE NOTICE 'Usuario admin@coomunity.co creado exitosamente.';
  ELSE
    RAISE NOTICE 'El usuario con email admin@coomunity.co ya existe.';
  END IF;
END $$;

-- Obtener el ID del usuario recién creado
DO $$
DECLARE
  admin_id UUID;
BEGIN
  -- Obtener el ID del usuario
  SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@coomunity.co';
  
  -- Crear perfil de admin si no existe
  IF NOT EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = admin_id) THEN
    INSERT INTO public.admin_profiles (
      id,
      role,
      full_name,
      created_at,
      updated_at
    ) VALUES (
      admin_id,
      'admin',
      'Administrador',
      now(),
      now()
    );
    RAISE NOTICE 'Perfil de administrador creado exitosamente.';
  ELSE
    RAISE NOTICE 'El perfil de administrador ya existe.';
  END IF;
END $$;

-- Actualizar la contraseña del usuario admin existente
-- Hash para "admin123" usando bcrypt con salt rounds 10
UPDATE users 
SET password = '$2b$10$EixZaYVK1fsbw1ZcfRHAu.Q4.X1pLkllX.iDo3TxOqRqoqAh5PQ6.' 
WHERE email = 'admin@gamifier.com';

-- Verificar que el usuario existe
SELECT id, email, name FROM users WHERE email = 'admin@gamifier.com'; 