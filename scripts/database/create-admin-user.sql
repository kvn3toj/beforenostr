-- Crear usuario administrador
INSERT INTO users (id, email, password, name, isActive, createdAt, updatedAt)
VALUES ('admin-user-001', 'admin@gamifier.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', true, '2025-05-29 00:00:00', '2025-05-29 00:00:00');

-- Crear rol de administrador
INSERT INTO roles (id, name, description, createdAt, updatedAt)
VALUES ('admin-role-001', 'admin', 'Administrator role with full access', '2025-05-29 00:00:00', '2025-05-29 00:00:00');

-- Asignar rol de administrador al usuario
INSERT INTO user_roles (userId, roleId, assignedAt)
VALUES ('admin-user-001', 'admin-role-001', '2025-05-29 00:00:00');

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
      email,
      role,
      full_name,
      created_at,
      updated_at
    ) VALUES (
      admin_id,
      'admin@coomunity.co',
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