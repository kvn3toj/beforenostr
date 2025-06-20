# 🗄️ Configuración Supabase - CoomÜnity Database

## 🎯 **PASO A PASO: CREAR PROYECTO SUPABASE**

### **1. Crear Cuenta y Proyecto**
1. Ve a [supabase.com](https://supabase.com)
2. **Sign up** con GitHub (recomendado)
3. **"New Project"**
4. **Configuración:**
   - **Name:** `coomunity-database`
   - **Database Password:** (genera una segura - guárdala)
   - **Region:** `West US (Oregon)` (misma que Railway)
   - **Plan:** **Free** ✅

### **2. Obtener Credenciales de Conexión**

Una vez creado el proyecto, ve a **Settings > Database**:

```bash
# 📋 CREDENCIALES QUE NECESITARÁS:
Host: db.xxx.supabase.co
Database: postgres
Port: 5432
User: postgres
Password: [tu-password-generada]

# 🔗 CONNECTION STRING COMPLETA:
postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres
```

### **3. Configurar Schema CoomÜnity**

En Supabase Dashboard > **SQL Editor**, ejecuta:

```sql
-- 🏗️ Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 🔒 Habilitar Row Level Security por defecto
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
```

### **4. Migrar Schema desde Prisma**

Desde tu proyecto local:

```bash
# 📝 Actualizar DATABASE_URL en backend/.env
DATABASE_URL="postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres"

# 🚀 Ejecutar migraciones
npx prisma db push

# 🌱 Poblar con datos iniciales
npx prisma db seed
```

### **5. Verificar Conexión**

En Supabase Dashboard:
- **Table Editor** → Deberías ver todas las tablas de CoomÜnity
- **Authentication** → Configurar si usarás Supabase Auth
- **API** → Obtener keys para el frontend (opcional)

## 🔐 **VARIABLES DE ENTORNO PARA RAILWAY**

```env
# 🗄️ Supabase Database
DATABASE_URL=postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres

# 🔑 Otros valores necesarios
JWT_SECRET=tu-super-secret-jwt-key-min-32-chars
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://coomunity-superapp.vercel.app
```

## ✅ **BENEFICIOS DE SUPABASE vs RENDER POSTGRES**

| Feature | Supabase Free | Render Postgres Free |
|---------|---------------|---------------------|
| **Storage** | 500 MB | 1 GB |
| **Conexiones** | 60 concurrent | 97 concurrent |
| **Backup** | 7 días | Manual |
| **Uptime** | 99.9% | Se elimina tras 90 días inactividad |
| **Dashboard** | ✅ Full SQL Editor | ❌ Solo logs |
| **Extensions** | ✅ Muchas disponibles | ❌ Limitadas |
| **Auth integrada** | ✅ Incluida | ❌ No incluida |

## 🚨 **LÍMITES A CONSIDERAR**

- **Database size:** 500 MB (suficiente para desarrollo/MVP)
- **API requests:** 50,000/mes
- **Realtime connections:** 200 concurrent
- **Storage:** 1 GB para archivos

**Para CoomÜnity esto es más que suficiente para empezar.** 
