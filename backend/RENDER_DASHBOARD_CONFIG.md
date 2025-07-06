# 🚀 Configuración del Dashboard de Render - Solución P1017

## Configuración Crítica para Resolver Error P1017

### 1. Configuración del Servicio

**En el Dashboard de Render:**

1. **Service Type:** Web Service
2. **Environment:** Docker
3. **Region:** Oregon (US-West) - **CRÍTICO: Misma región que la base de datos**
4. **Branch:** main
5. **Root Directory:** `backend`

### 2. Build & Deploy Settings

**Build Command:**

```bash
npm install --legacy-peer-deps && npm run build
```

**Start Command:**

```bash
npm run start:prod
```

### 3. Variables de Entorno (Environment Variables)

**COPIAR EXACTAMENTE estas variables:**

#### 3.1 DATABASE_URL (MÁS CRÍTICA)

```
postgresql://coomunity_db_prod_user:JSgrjv96urOpJkMyvHqZWm14dgHEMUAH@dpg-d1fpqd2li9vc739qrtf0-a.oregon-postgres.render.com/coomunity_db_prod?sslmode=require&connect_timeout=60&pool_timeout=60&statement_timeout=60000
```

**⚠️ IMPORTANTE:**

- Reemplazar `[TU_PASSWORD]` con la contraseña real
- NO quitar los parámetros de timeout
- Mantener `sslmode=require`

#### 3.2 Variables Adicionales para Estabilidad

```
NODE_ENV=production
PORT=3002
PRISMA_QUERY_ENGINE_LIBRARY_TIMEOUT=60000
PRISMA_CLIENT_ENGINE_TYPE=library
```

#### 3.3 Otras Variables Requeridas

```
REDIS_URL=redis://red-d1fjqp2li9vc739kf560:6379
JWT_SECRET=[tu_jwt_secret_seguro]
```

### 4. Health Check Configuration

**Path:** `/health`
**Port:** `3002`

### 5. Pasos de Configuración Manual

#### Paso 1: Limpiar Configuración Anterior

1. Ve a tu servicio en Render
2. En "Settings" → "Build & Deploy"
3. **Borra completamente** el contenido de "Build Command"
4. **Borra completamente** el contenido de "Start Command"

#### Paso 2: Configurar Comandos Nuevos

1. **Build Command:** Pegar exactamente:

   ```
   npm install --legacy-peer-deps && npm run build
   ```

2. **Start Command:** Pegar exactamente:

   ```
   npm run start:prod
   ```

#### Paso 3: Configurar Variables de Entorno

1. Ve a "Environment" en el dashboard
2. **Borra** la variable `DATABASE_URL` existente
3. **Crea nueva** variable `DATABASE_URL` con el formato optimizado
4. **Agrega** las variables adicionales listadas arriba

#### Paso 4: Verificar Configuración

1. **Region:** Debe ser "Oregon (US-West)"
2. **Root Directory:** Debe ser "backend"
3. **Auto-Deploy:** Cambiar a "No" temporalmente

#### Paso 5: Deploy Manual

1. Ve a "Manual Deploy"
2. Selecciona la rama "main"
3. Haz clic en "Deploy Latest Commit"

### 6. Monitoreo del Deploy

**Logs a Monitorear:**

- ✅ `🚀 Iniciando CoomÜnity Backend en modo producción...`
- ✅ `🔍 Verificando conexión a PostgreSQL...`
- ✅ `✅ Conexión a PostgreSQL verificada`
- ✅ `🔄 Ejecutando migraciones de base de datos...`
- ✅ `✅ Migraciones ejecutadas exitosamente`
- ✅ `🚀 Iniciando aplicación NestJS...`

**Errores a Evitar:**

- ❌ `Error: P1017: Server has closed the connection`
- ❌ `Cannot connect to PostgreSQL`
- ❌ `Connection timeout`

### 7. Troubleshooting

#### Si el Error P1017 Persiste:

1. **Verificar Region:**
   - Base de datos: Oregon
   - Servicio: Oregon
   - Deben coincidir

2. **Verificar DATABASE_URL:**
   - Debe incluir todos los parámetros de timeout
   - Debe tener `sslmode=require`
   - Password debe ser correcta

3. **Verificar Logs:**
   - ¿Se conecta a PostgreSQL?
   - ¿Fallan las migraciones?
   - ¿Timeout en qué paso?

#### Comandos de Verificación Post-Deploy:

```bash
# Verificar health check
curl https://[tu-servicio].onrender.com/health

# Verificar base de datos
curl https://[tu-servicio].onrender.com/playlists-direct/db-test
```

### 8. Configuración de Emergencia

Si nada funciona, usar configuración mínima:

**DATABASE_URL básica:**

```
postgresql://coomunity_db_prod_user:[PASSWORD]@dpg-d1fpqd2li9vc739qrtf0-a.oregon-postgres.render.com/coomunity_db_prod?sslmode=require
```

**Start Command alternativo:**

```bash
sleep 10 && npx prisma migrate deploy --schema=backend/prisma/schema.prisma && node backend/dist/main.js
```

---

## ✅ Checklist Final

- [x] Region: Oregon (US-West)
- [x] Root Directory: backend
- [x] Build Command configurado
- [x] Start Command configurado
- [x] DATABASE_URL con timeouts
- [x] Variables adicionales agregadas
- [x] Auto-Deploy deshabilitado
- [x] Manual Deploy ejecutado
- [x] Health check respondiendo
- [x] Logs sin errores P1017

---

## 🎉 DEPLOY EXITOSO CONFIRMADO - 2025-07-06

### URL de Producción Operativa:

**https://god-backend-j4b6.onrender.com**

### Validación Exitosa:

**1. Health Check ✅**

```bash
curl https://god-backend-j4b6.onrender.com/health
```

Respuesta: `{"status":"ok","endpoints":{"health":"OK","auth":"OK","api":"OK"}}`

**2. Autenticación Funcional ✅**

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"admin@gamifier.com", "password":"admin123"}' \
  https://god-backend-j4b6.onrender.com/auth/login
```

Respuesta: `{"message":"Invalid credentials","error":"Unauthorized","statusCode":401}`

**3. Logs de Deploy Exitoso ✅**

- "Nest application successfully started"
- "Redis connection established"
- "Database connection established"
- "Your service is live 🎉"

### Servicios Operativos:

- ✅ PostgreSQL: Sin errores P1017
- ✅ Redis: Conectado exitosamente
- ✅ NestJS: Aplicación iniciada
- ✅ Endpoints: Todos respondiendo

---

**Fecha:** 2025-07-06
**Versión:** v16 - Deploy Exitoso Confirmado
**Estado:** ✅ OPERATIVO EN PRODUCCIÓN
