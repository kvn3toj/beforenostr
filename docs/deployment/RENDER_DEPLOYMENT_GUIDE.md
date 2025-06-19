# 🎯 CoomÜnity Backend - Render Deployment Guide

## **Estado Actual del Proyecto**
- ✅ **SuperApp Frontend**: Desplegada en Vercel → https://superapp-peach.vercel.app
- ✅ **Backend Local**: Funcionando en puerto 3002
- 🎯 **Objetivo**: Desplegar Backend NestJS en Render
- 💰 **Costo**: $0/mes (Free Plan)

## **Ventajas de Render vs Railway**
- ✅ **Track record estable** de builds NestJS
- ✅ **Documentación superior** 
- ✅ **Free tier confiable** (no experimental)
- ✅ **PostgreSQL incluido** en plan gratuito
- ✅ **SSL automático**
- ✅ **Deploy desde Git** automático

---

## 📋 **Pre-Requisitos**

### **1. Cuenta Render**
- Crear cuenta en: https://render.com
- Conectar con GitHub (repositorio: kvn3toj/beforenostr)

### **2. Verificar Backend Local**
```bash
# Verificar que funciona localmente
curl http://localhost:3002/health

# Respuesta esperada:
# {"status":"ok","timestamp":"...","message":"Backend is running"}
```

### **3. Archivos de Configuración**
- ✅ `package.json` - Scripts de build configurados
- ✅ `Dockerfile` - Para deployment
- ✅ `prisma/schema.prisma` - Base de datos configurada
- ✅ `.env.example` - Variables de entorno documentadas

---

## 🏗️ **Configuración de Render**

### **Step 1: Crear Web Service**
1. **Dashboard Render** → "New" → "Web Service"
2. **Connect Repository**: `kvn3toj/beforenostr`
3. **Branch**: `gamifier2.0`
4. **Root Directory**: `backend/`

### **Step 2: Build & Deploy Settings**
```yaml
# Configuración Render
Name: coomunity-backend
Environment: Node
Region: Oregon (US West)
Branch: gamifier2.0
Build Command: npm ci && npm run build
Start Command: npm run start:prod
```

### **Step 3: Variables de Entorno**
```bash
# Variables requeridas en Render Dashboard
NODE_ENV=production
PORT=10000
JWT_SECRET=tu_jwt_secret_seguro_aqui
CORS_ORIGIN=https://superapp-peach.vercel.app
DATABASE_URL=postgresql://user:pass@host:port/db  # Auto-generada por Render PostgreSQL
REDIS_URL=redis://user:pass@host:port  # Si necesitas Redis
```

### **Step 4: PostgreSQL Database**
1. **Dashboard Render** → "New" → "PostgreSQL"
2. **Name**: `coomunity-database`
3. **Plan**: Free
4. **Copiar** `Internal Database URL` → pegar en `DATABASE_URL`

---

## 📦 **Configuración del Proyecto**

### **1. Scripts package.json (Backend)**
```json
{
  "scripts": {
    "build": "nest build",
    "start": "node dist/main",
    "start:prod": "node dist/main",
    "postinstall": "prisma generate"
  }
}
```

### **2. Dockerfile Optimizado para Render**
```dockerfile
# backend/Dockerfile.render
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:10000/health || exit 1

# Start application
CMD ["npm", "run", "start:prod"]
```

### **3. Build Hook Script**
```bash
# backend/render-build.sh
#!/bin/bash
set -e

echo "🔧 Starting Render build process..."

# Install dependencies
npm ci

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Build NestJS application
npm run build

echo "✅ Build process completed!"
```

---

## 🔗 **Integración con SuperApp Vercel**

### **1. Actualizar Variables Vercel**
```bash
# En Vercel Dashboard para SuperApp
VITE_API_BASE_URL=https://coomunity-backend.onrender.com
VITE_ENABLE_MOCK_AUTH=false
VITE_ENABLE_MOCK_DATA=false
```

### **2. CORS Backend**
```typescript
// backend/src/main.ts
app.enableCors({
  origin: [
    'https://superapp-peach.vercel.app',
    'http://localhost:3001', // Para desarrollo local
  ],
  credentials: true,
});
```

---

## 🚀 **Proceso de Deployment**

### **Phase 1: Preparación (5 min)**
```bash
# 1. Crear archivos de configuración
echo "# Render deployment config" > backend/.render.yaml

# 2. Verificar build local
cd backend/
npm run build
npm run start:prod  # Test local
```

### **Phase 2: Database Setup (3 min)**
1. **Crear PostgreSQL** en Render
2. **Copiar DATABASE_URL** interna
3. **Configurar variables** de entorno

### **Phase 3: Web Service (7 min)**
1. **Crear Web Service** con configuración
2. **Triggerar deployment** manual
3. **Monitorear logs** de build

### **Phase 4: Verification (2 min)**
```bash
# Verificar endpoints
curl https://coomunity-backend.onrender.com/health
curl https://coomunity-backend.onrender.com/api/auth/login
```

---

## 📊 **Monitoreo y Logs**

### **Health Checks**
```bash
# Endpoint principal
GET https://coomunity-backend.onrender.com/health

# Respuesta esperada:
{
  "status": "ok",
  "timestamp": "2025-06-19T22:15:00Z",
  "message": "Backend is running",
  "database": "connected"
}
```

### **Logs en Tiempo Real**
- **Render Dashboard** → Service → "Logs"
- **Eventos**: Deploy, Runtime, Database connections
- **Debugging**: Error tracking y performance

---

## 🎯 **Resultado Final**

### **Arquitectura Completa**
```
┌─────────────────────────────────────────────────┐
│                COOMUNITY ECOSYSTEM              │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────┐    ┌──────────────────┐   │
│  │   SuperApp       │    │    Backend       │   │
│  │   (Vercel)       │◄──►│   (Render)       │   │
│  │   Port: 443      │    │   Port: 10000    │   │
│  │   $0/mes         │    │   $0/mes         │   │
│  └──────────────────┘    └──────────────────┘   │
│           │                        │            │
│  https://superapp-         https://coomunity-   │
│  peach.vercel.app          backend.onrender.com │
│                                    │            │
│                            ┌───────▼──────┐     │
│                            │ PostgreSQL   │     │
│                            │ (Render)     │     │
│                            │ $0/mes       │     │
│                            └──────────────┘     │
└─────────────────────────────────────────────────┘
```

### **URLs Finales**
- 🌐 **SuperApp**: https://superapp-peach.vercel.app
- 🔗 **Backend API**: https://coomunity-backend.onrender.com
- 📊 **Health Check**: https://coomunity-backend.onrender.com/health
- 💾 **Database**: PostgreSQL en Render (interno)

### **Beneficios Alcanzados**
- ✅ **EMFILE resuelto** - Frontend en cloud
- ✅ **$0/mes total** - Free tiers ambos servicios  
- ✅ **SSL automático** - HTTPS en ambos
- ✅ **Escalabilidad** - Auto-scaling incluido
- ✅ **Integración completa** - SuperApp ↔ Backend
- ✅ **Monitoreo** - Logs y métricas incluidas

---

## 🛠️ **Troubleshooting**

### **Build Failures**
```bash
# Verificar dependencies
npm audit
npm outdated

# Limpiar caché
npm ci
rm -rf node_modules package-lock.json
npm install
```

### **Database Connection**
```bash
# Test conexión
npx prisma db push --preview-feature
npx prisma migrate deploy
```

### **CORS Issues**
```typescript
// Verificar origin en main.ts
app.enableCors({
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3001'
});
```

---

## 📈 **Next Steps**

1. **Custom Domain** (opcional): Configurar dominio personalizado
2. **Monitoring**: Integrar con Sentry para error tracking
3. **Performance**: Configurar CDN para assets estáticos
4. **Security**: Implementar rate limiting y WAF
5. **Scaling**: Monitorear uso y configurar auto-scaling

---

**¿Listo para implementar? El proceso completo toma ~15-20 minutos y tendremos toda la arquitectura funcionando en cloud con $0/mes.** 
