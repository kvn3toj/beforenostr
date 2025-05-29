-- Actualizar la contraseña del usuario admin existente
-- Hash para "admin123" usando bcrypt con salt rounds 10
UPDATE users 
SET password = '$2b$10$PMNIwfGy0mY/ojU/rJPlm.CbBXdcQfv4N.ci5UbmPgo64kS9LWx7O' 
WHERE email = 'admin@gamifier.com'; 