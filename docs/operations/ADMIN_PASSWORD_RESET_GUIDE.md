# 🔐 Guía de Restablecimiento de Contraseña de Admin

## Contexto de Seguridad

Por diseño de seguridad, las contraseñas se almacenan como **hashes criptográficos irreversibles** usando bcrypt. Esto significa que:

- ❌ **No es posible "recuperar" la contraseña original**
- ✅ **Solo es posible "restablecer" con una nueva contraseña**
- 🔒 **El hash almacenado (`$2b$10$...`) es matemáticamente irreversible**

## 🎯 Solución: Restablecimiento de Contraseña

### Método 1: Usando el Script de Seed (Recomendado)

#### Paso 1: Verificar los Cambios

Los cambios ya están implementados en el archivo `backend/src/prisma/seed.ts`:

```typescript
{
  email: 'admin@gamifier.com',
  password: 'CoomUnity2025!Admin', // 🔐 Nueva contraseña segura
  roleNames: ['admin'],
  // ...
}
```

#### Paso 2: Subir los Cambios a GitHub

```bash
git add backend/src/prisma/seed.ts
git commit -m "feat(security): Update admin password for production reset"
git push origin main
```

#### Paso 3: Ejecutar en Producción (Render)

```bash
# Conectar a la instancia de Render
render ssh --service srv-d1jfou6mcj7s73dc7lhg

# Una vez dentro de la terminal de Render
npm run db:seed:prod
```

### Método 2: Usando el Script Específico

#### Paso 1: Subir el Script

```bash
git add backend/scripts/reset-admin-password.js
git add backend/package.json
git commit -m "feat(security): Add admin password reset script"
git push origin main
```

#### Paso 2: Ejecutar en Producción

```bash
# Conectar a Render
render ssh --service srv-d1jfou6mcj7s73dc7lhg

# Ejecutar el script específico
npm run db:reset-admin
```

## 🔑 Credenciales Actualizadas

### Nueva Contraseña de Admin

- **Email**: `admin@gamifier.com`
- **Contraseña**: `CoomUnity2025!Admin`

### Verificación de Acceso

1. Ir a: https://superapp-unified-iota.vercel.app/login
2. Usar las credenciales actualizadas
3. Verificar acceso completo al panel de administración

## 🛡️ Consideraciones de Seguridad

### Después del Restablecimiento

1. **Cambiar la contraseña inmediatamente** después del primer login
2. **Usar una contraseña única** que no esté en el código fuente
3. **Activar autenticación de dos factores** si está disponible
4. **Documentar el cambio** en los registros de seguridad

### Mejores Prácticas

- ✅ **Nunca almacenar contraseñas en texto plano** en el código
- ✅ **Usar variables de entorno** para credenciales sensibles
- ✅ **Implementar rotación regular** de contraseñas administrativas
- ✅ **Monitorear accesos** a cuentas administrativas

## 🚨 Troubleshooting

### Error: "User not found"

```bash
# Verificar que el usuario existe
psql $DATABASE_URL -c "SELECT id, email, name FROM \"User\" WHERE email = 'admin@gamifier.com';"
```

### Error: "Permission denied"

```bash
# Verificar roles del usuario
psql $DATABASE_URL -c "
SELECT u.email, r.name as role
FROM \"User\" u
JOIN \"UserRole\" ur ON u.id = ur.\"userId\"
JOIN \"Role\" r ON ur.\"roleId\" = r.id
WHERE u.email = 'admin@gamifier.com';
"
```

### Error: "Cannot connect to database"

```bash
# Verificar variables de entorno
echo $DATABASE_URL
# Verificar conectividad
pg_isready -d $DATABASE_URL
```

## 📋 Checklist de Verificación

- [ ] Cambios subidos a GitHub
- [ ] Script ejecutado en producción
- [ ] Login exitoso con nueva contraseña
- [ ] Acceso a funciones administrativas confirmado
- [ ] Contraseña temporal cambiada por una definitiva
- [ ] Documentación actualizada
- [ ] Equipo notificado del cambio

## 🔄 Comandos de Referencia Rápida

```bash
# Conectar a Render
render ssh --service srv-d1jfou6mcj7s73dc7lhg

# Ejecutar seed completo
npm run db:seed:prod

# Ejecutar solo reset de admin
npm run db:reset-admin

# Verificar usuario en base de datos
psql $DATABASE_URL -c "SELECT email, name, \"updatedAt\" FROM \"User\" WHERE email = 'admin@gamifier.com';"
```

---

**Nota**: Esta guía asume que tienes acceso SSH a la instancia de Render y permisos para ejecutar comandos en el servidor de producción.
