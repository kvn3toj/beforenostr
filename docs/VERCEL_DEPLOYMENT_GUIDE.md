# ⚡ Vercel Deployment - CoomÜnity SuperApp

## 🎯 **CONFIGURACIÓN PASO A PASO**

### **1. Crear Cuenta Vercel**
1. Ve a [vercel.com](https://vercel.com)
2. **"Continue with GitHub"** (recomendado)
3. **Autorizar** acceso a repositorios

### **2. Importar Proyecto**
1. **"Add New Project"**
2. **"Import Git Repository"**
3. Busca: `kvn3toj/beforenostr`
4. **"Import"**

### **3. Configurar Build Settings**

```bash
# 🏗️ PROJECT SETTINGS
Framework Preset: Vite
Root Directory: Demo/apps/superapp-unified
Build Command: npm run build
Output Directory: dist
Install Command: npm install --legacy-peer-deps
```

### **4. Variables de Entorno CRÍTICAS**

En Vercel Dashboard > **Settings > Environment Variables**:

```env
# 🌐 API CONNECTION
VITE_API_BASE_URL=https://tu-railway-domain.up.railway.app
VITE_BASE_URL=https://coomunity-superapp.vercel.app

# 🔑 AUTHENTICATION
VITE_ENABLE_MOCK_AUTH=false

# 🚀 PRODUCTION SETTINGS
NODE_ENV=production
VITE_APP_ENV=production
```

### **5. Configurar Dominio**

Vercel asigna automáticamente:
```
https://coomunity-superapp.vercel.app
```

**O puedes usar uno personalizado:**
- Vercel Dashboard > **Settings > Domains**
- **Add Domain** > `tudominio.com`

### **6. Deploy y Verificar**

1. **"Deploy"** (automático tras configuración)
2. **Esperar build** (~2-3 minutos)
3. **Verificar** en el dominio asignado

```bash
# 🏥 Health Check
curl -I https://coomunity-superapp.vercel.app

# Respuesta esperada:
HTTP/2 200
content-type: text/html
```

## 🔧 **CONFIGURACIONES AVANZADAS**

### **Optimización de Build**

Actualizar `vercel.json` (ya configurado):

```json
{
  "framework": "vite",
  "buildCommand": "cd Demo/apps/superapp-unified && npm run build",
  "outputDirectory": "Demo/apps/superapp-unified/dist",
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### **Preview Deployments**

Vercel crea automáticamente **preview deployments** para:
- ✅ **Pull Requests** → URL única por PR
- ✅ **Push a branches** → URL por branch
- ✅ **Commits** → URL por commit

### **Performance Optimizations**

```bash
# 🚀 Vercel automáticamente optimiza:
✅ Image optimization
✅ Static file caching
✅ CDN global distribution
✅ Gzip compression
✅ HTTP/2 support
```

## 📊 **MONITOREO Y ANALYTICS**

### **Vercel Analytics (Gratis)**
- **Page views**
- **Unique visitors**
- **Performance metrics**
- **Core Web Vitals**

### **Logs y Debugging**
Vercel Dashboard > **Functions** > **View Logs**

```bash
# 🔍 Logs importantes:
✅ "Build completed"
✅ "Deployment ready"
❌ "Build failed" (revisar dependencies)
❌ "Runtime error" (revisar env vars)
```

## 🌐 **CONECTAR CON RAILWAY BACKEND**

### **Verificar Conexión API**

Una vez ambos deployados:

```bash
# 🔗 Test de conectividad
curl https://coomunity-superapp.vercel.app/api/health
# Debe hacer proxy a Railway backend
```

### **CORS Configuration**

Asegurar que Railway tenga:
```env
CORS_ORIGIN=https://coomunity-superapp.vercel.app
```

## 💰 **PLAN GRATUITO VERCEL**

### **Límites Generosos:**
- ✅ **100 GB bandwidth/mes**
- ✅ **100 deployments/día**
- ✅ **Unlimited** static sites
- ✅ **Custom domains**
- ✅ **SSL certificates**
- ✅ **Global CDN**

### **Funciones Serverless:**
- ✅ **12 segundos** execution time
- ✅ **1,000 invocations/día**
- ✅ **100 GB-hours** compute time

## 🚨 **TROUBLESHOOTING COMÚN**

### **Error: Build Failed**
```bash
# Verificar:
1. package.json en SuperApp existe
2. Dependencies instaladas correctamente
3. Build command correcto
4. Node.js version compatible
```

### **Error: Environment Variables**
```bash
# Verificar:
1. VITE_API_BASE_URL apunta a Railway
2. Variables no tienen espacios extra
3. Redeploy después de cambiar env vars
```

### **Error: 404 en rutas**
```bash
# Solución:
1. Verificar vercel.json tiene SPA routing
2. Confirmar "routes" configuration
3. Revisar que dist/ contiene index.html
```

## ✅ **CHECKLIST FINAL**

- [ ] Vercel proyecto importado
- [ ] Build settings configurados
- [ ] Variables de entorno añadidas
- [ ] Deploy exitoso
- [ ] Dominio funcionando
- [ ] Conexión a Railway OK
- [ ] Routing SPA funcionando
- [ ] Performance optimizada 
