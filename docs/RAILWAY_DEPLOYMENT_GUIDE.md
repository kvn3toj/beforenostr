# 🚂 Railway Deployment - CoomÜnity Backend

## 🎯 **CONFIGURACIÓN PASO A PASO**

### **1. Crear Cuenta Railway**
1. Ve a [railway.app](https://railway.app)
2. **"Login with GitHub"** (recomendado)
3. **Verificar** que tienes $5 en créditos gratuitos

### **2. Crear Nuevo Proyecto**
1. **"New Project"**
2. **"Deploy from GitHub repo"**
3. Selecciona: `kvn3toj/beforenostr` (tu repo)
4. **Branch:** `gamifier2.0`

### **3. Configurar Build Settings**
En Railway Dashboard:

```bash
# 🏗️ BUILD SETTINGS
Root Directory: backend/
Build Command: npm install --legacy-peer-deps && npm run build
Start Command: node dist/main.js

# 🔧 DOCKERFILE (alternativo)
# Railway detectará automáticamente backend/Dockerfile.render
```

### **4. Variables de Entorno CRÍTICAS**

En Railway > **Variables**:

```env
# 🗄️ DATABASE (Supabase)
DATABASE_URL=postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres

# 🔑 AUTHENTICATION
JWT_SECRET=tu-super-secret-jwt-key-minimo-32-caracteres-aqui

# 🌐 NETWORK
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://coomunity-superapp.vercel.app

# 📡 API SETTINGS
API_BASE_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
REDIS_URL=redis://localhost:6379
```

### **5. Configurar Dominio Público**

Railway asigna automáticamente un dominio como:
```
https://backend-production-xxxx.up.railway.app
```

**Guarda esta URL** - la necesitarás para Vercel.

### **6. Verificar Deployment**

Una vez deployado, verifica:

```bash
# 🏥 Health Check
curl https://tu-railway-domain.up.railway.app/health

# Respuesta esperada:
{
  "status": "ok",
  "timestamp": "2025-06-20T...",
  "message": "Backend is running"
}
```

## 📊 **MONITOREO Y LOGS**

### **Logs en Tiempo Real**
Railway Dashboard > **Deployments** > **View Logs**

```bash
# 🔍 Logs importantes a monitorear:
✅ "Server running on port 3000"
✅ "Database connection established"
✅ "Prisma Client generated"
❌ "ECONNREFUSED" (problema de DB)
❌ "JWT_SECRET not defined" (variable faltante)
```

### **Métricas de Uso**
- **CPU Usage:** Debería estar <50% en promedio
- **Memory:** ~200-300 MB para CoomÜnity
- **Network:** Dependiente del tráfico

## 💰 **GESTIÓN DE CRÉDITOS GRATUITOS**

### **$5 USD Iniciales:**
- **Duración estimada:** 1-2 meses para desarrollo
- **Uso típico:** $2-3/mes para backend pequeño
- **Monitoreo:** Railway Dashboard > **Usage**

### **Optimización de Costos:**
```bash
# 🔧 Tips para reducir uso:
1. Usar Supabase (no Railway Postgres)
2. Optimizar consultas de DB
3. Implementar caching
4. Monitorear logs regularmente
```

## 🚨 **TROUBLESHOOTING COMÚN**

### **Error: Build Failed**
```bash
# Solución:
1. Verificar package.json en /backend
2. Asegurar Dockerfile.render existe
3. Revisar logs de build en Railway
```

### **Error: Database Connection**
```bash
# Verificar:
1. DATABASE_URL correcta
2. Supabase permite conexiones externas
3. Prisma client generado correctamente
```

### **Error: CORS**
```bash
# Verificar:
1. CORS_ORIGIN apunta a dominio Vercel correcto
2. Headers configurados en main.ts
```

## ✅ **CHECKLIST FINAL**

- [ ] Railway proyecto creado
- [ ] Variables de entorno configuradas
- [ ] Build exitoso
- [ ] Health check responde 200
- [ ] Logs sin errores críticos
- [ ] Dominio público funcionando
- [ ] Conexión a Supabase OK 
