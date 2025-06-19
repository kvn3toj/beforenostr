# 🚀 CoomÜnity Backend Deployment en Railway

## ✅ Estado Actual (Actualizado - 19 Junio 2025)
- **Backend Local**: ✅ Funcionando (puerto 3002)
- **SuperApp Vercel**: ✅ Desplegada (https://superapp-peach.vercel.app)
- **Railway CLI**: ✅ Instalado (v3.x)
- **Configuración**: ✅ railway.json y .env.example preparados

## 🎯 Objetivo
Desplegar el backend NestJS en Railway para conectar la SuperApp desplegada con datos reales.

## 📋 Pre-requisitos ✅ COMPLETADOS

1. **✅ Cuenta Railway**: https://railway.app (gratis)
2. **✅ GitHub conectado**: El proyecto debe estar en GitHub
3. **✅ Variables de entorno**: Preparadas para producción
4. **✅ Railway CLI**: Instalado y verificado

## 🛠️ Pasos de Deployment

### ✅ Paso 1: Preparación del Backend (COMPLETADO)

```bash
cd backend

# ✅ Archivo de configuración Railway creado
cat railway.json
# {
#   "$schema": "https://railway.app/railway.schema.json",
#   "build": { "builder": "NIXPACKS" },
#   "deploy": { "numReplicas": 1, "sleepApplication": false, "restartPolicyType": "ON_FAILURE" }
# }

# ✅ Variables de entorno de ejemplo creadas
cat .env.example
# DATABASE_URL=postgresql://...
# JWT_SECRET=your-super-secret-jwt-key-here
# CORS_ORIGIN=https://superapp-peach.vercel.app
# PORT=3002
# NODE_ENV=production
```

### 🔄 Paso 2: Autenticación Railway (PENDIENTE)

```bash
# Iniciar sesión en Railway
railway login

# Esto abrirá el navegador para autenticación
# Autoriza la aplicación en GitHub/Railway
```

### 🔄 Paso 3: Crear Proyecto Railway (PENDIENTE)

```bash
# Inicializar proyecto Railway
railway init

# Seleccionar opciones:
# - Create new project
# - Nombre: "coomunity-backend"
# - Environment: Production
```

### 🔄 Paso 4: Configurar Base de Datos (PENDIENTE)

```bash
# Agregar PostgreSQL addon
railway add postgresql

# Railway automáticamente:
# ✅ Crea instancia PostgreSQL
# ✅ Genera DATABASE_URL
# ✅ Configura conexión automática
```

### 🔄 Paso 5: Configurar Variables de Entorno (PENDIENTE)

```bash
# Configurar variables de entorno críticas
railway variables set JWT_SECRET="tu-secret-super-seguro-aqui"
railway variables set CORS_ORIGIN="https://superapp-peach.vercel.app"
railway variables set NODE_ENV="production"
railway variables set PORT="3002"

# Verificar variables configuradas
railway variables
```

### 🔄 Paso 6: Deploy Inicial (PENDIENTE)

```bash
# Desplegar backend
railway deploy

# Railway automáticamente:
# 🔧 Detecta NestJS
# 📦 Instala dependencias (npm install)
# 🏗️ Compila TypeScript (npm run build)
# 🚀 Inicia aplicación (npm run start:prod)
```

### 🔄 Paso 7: Verificar Deployment (PENDIENTE)

```bash
# Obtener URL del backend desplegado
railway status

# Verificar health check
curl https://coomunity-backend-production.up.railway.app/health

# Respuesta esperada:
# {"status":"ok","timestamp":"...","message":"Backend is running"}
```

### 🔄 Paso 8: Conectar SuperApp con Backend Railway (PENDIENTE)

```bash
# Actualizar .env.production en SuperApp
cd ../Demo/apps/superapp-unified
echo "VITE_API_BASE_URL=https://coomunity-backend-production.up.railway.app" > .env.production
echo "VITE_ENABLE_MOCK_AUTH=false" >> .env.production
echo "VITE_ENABLE_MOCK_DATA=false" >> .env.production

# Redesplegar SuperApp en Vercel
vercel --prod
```

## 🔧 Configuración Railway Detallada

### railway.json (COMPLETADO ✅)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "sleepApplication": false,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### Variables de Entorno Críticas
- **DATABASE_URL**: Auto-generada por Railway PostgreSQL
- **JWT_SECRET**: Generar secreto seguro
- **CORS_ORIGIN**: URL de la SuperApp en Vercel
- **PORT**: 3002 (o $PORT auto-asignado por Railway)
- **NODE_ENV**: production

## 📊 Monitoreo y Logs

```bash
# Ver logs en tiempo real
railway logs

# Ver métricas del servicio
railway status

# Conectar a base de datos
railway connect postgresql
```

## 🚨 Troubleshooting

### Problema: Build Fails
```bash
# Verificar logs detallados
railway logs --deployment

# Verificar variables de entorno
railway variables
```

### Problema: Database Connection
```bash
# Verificar status de PostgreSQL
railway status

# Regenerar DATABASE_URL si es necesario
railway variables set DATABASE_URL="$(railway variables get DATABASE_URL)"
```

### Problema: CORS Errors
```bash
# Verificar CORS_ORIGIN
railway variables get CORS_ORIGIN

# Actualizar si es necesario
railway variables set CORS_ORIGIN="https://superapp-peach.vercel.app"
```

## 💰 Costos Railway

- **Plan Hobby**: $0/mes
  - 512 MB RAM
  - 1 GB disco
  - Shared CPU
  - Perfecto para desarrollo/pruebas

- **Plan Pro**: $20/mes
  - 8 GB RAM
  - 100 GB disco
  - Dedicated CPU
  - Para producción

## 🎯 Estado Final Esperado

✅ **Backend Railway**: `https://coomunity-backend-production.up.railway.app`  
✅ **SuperApp Vercel**: `https://superapp-peach.vercel.app`  
✅ **Base de Datos**: PostgreSQL en Railway  
✅ **Integración**: SuperApp → Backend Railway  

---

## 📋 Comandos Rápidos

```bash
# Deployment completo en un comando
railway login && railway init && railway add postgresql && railway deploy

# Verificación post-deployment
railway status && railway logs --tail
```

## 🎉 Próximos Pasos

Una vez completado el deployment:
1. ✅ Backend en Railway funcionando
2. ✅ SuperApp conectada a backend real
3. ✅ Base de datos PostgreSQL en la nube
4. ✅ Arquitectura completamente escalable

**¿Listo para proceder con `railway login`?** 
