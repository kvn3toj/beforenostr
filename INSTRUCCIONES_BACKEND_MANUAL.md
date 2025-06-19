# 🔧 Instrucciones para Localizar y Ejecutar Backend NestJS

## 🎯 Situación Actual

El **backend NestJS no se encuentra** en el workspace actual `/workspace`. Según los logs que proporcionaste, ejecutaste `npm run dev:backend` desde una ubicación diferente (`GAMIFIER-copy`).

## 📋 Posibles Ubicaciones del Backend

### 1. **Fuera del Workspace Actual**
El backend podría estar en:
- `/Users/kevinp/Movies/GAMIFIER copy/backend/`
- `/Users/kevinp/Movies/GAMIFIER-copy/backend/`
- Un directorio separado del proyecto frontend

### 2. **En el Project Layout Mencionado**
Según el `project_layout`, existe un directorio `backend/` que contiene:
```
backend/
  - Dockerfile
  - nest-cli.json
  - src/
    - app.controller.ts
    - app.module.ts
    - [muchos módulos más]
```

## 🔍 Pasos para Localizar el Backend

### Opción 1: Verificar Ubicación Completa del Proyecto

```bash
# Verificar dónde estás ubicado
pwd

# Si no estás en GAMIFIER-copy, navegar ahí
cd "/Users/kevinp/Movies/GAMIFIER copy"
# o
cd "/Users/kevinp/Movies/GAMIFIER-copy"

# Verificar que existe el backend
ls -la | grep backend
ls -la backend/
```

### Opción 2: Buscar en Todo el Sistema

```bash
# Buscar nest-cli.json en todo el sistema
find /Users/kevinp -name "nest-cli.json" 2>/dev/null

# Buscar package.json con NestJS
find /Users/kevinp -name "package.json" -exec grep -l "@nestjs/core" {} \; 2>/dev/null
```

### Opción 3: Verificar Procesos Activos

```bash
# Ver si el backend ya está ejecutándose
ps aux | grep -E "(nest|tsx|backend)" | grep -v grep

# Verificar puertos ocupados
lsof -i :3002
lsof -i :3000
```

## 🚀 Comandos para Ejecutar Backend

### Si el Backend está en GAMIFIER-copy/backend/

```bash
# Navegar al directorio correcto
cd "/Users/kevinp/Movies/GAMIFIER copy/backend"
# o 
cd "/Users/kevinp/Movies/GAMIFIER-copy/backend"

# Instalar dependencias (si es necesario)
npm install

# Ejecutar backend
npm run start:dev
```

### Si hay Script en el Proyecto Principal

```bash
# Desde el directorio principal GAMIFIER-copy
cd "/Users/kevinp/Movies/GAMIFIER copy"

# Verificar scripts disponibles
npm run

# Ejecutar backend
npm run dev:backend
# o
npm run start:backend
```

## 🧪 Verificar que el Backend Funciona

### 1. Health Check
```bash
curl http://localhost:3002/health
# Debería devolver: {"status":"ok","timestamp":"...","message":"Backend is running"}
```

### 2. Autenticación
```bash
curl -X POST "http://localhost:3002/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@gamifier.com", "password": "admin123"}'
# Debería devolver un token JWT
```

### 3. Endpoint de Videos
```bash
# Obtener token primero
TOKEN=$(curl -s -X POST "http://localhost:3002/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@gamifier.com", "password": "admin123"}' | \
  grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

# Probar endpoint de videos
curl -H "Authorization: Bearer $TOKEN" "http://localhost:3002/video-items"
```

## 🎯 Una Vez que Backend Esté Activo

### El sistema automáticamente:

1. **✅ Detectará backend disponible**
2. **✅ Hará login automático** con `admin@gamifier.com/admin123`
3. **✅ Cargará videos reales** desde PostgreSQL
4. **✅ Mostrará preguntas interactivas** funcionales
5. **✅ Eliminará banner de modo demo**

### Logs esperados en ÜPlay:
```
🔗 API Request: /video-items
✅ API Success: /video-items
🎉 Videos obtenidos del backend REAL: 6
📝 Preguntas obtenidas del backend REAL para video 7: 3
```

## 🚨 Troubleshooting

### Si Backend No Inicia:
1. **Verificar PostgreSQL**: `brew services list | grep postgresql`
2. **Verificar Redis**: `brew services list | grep redis`
3. **Revisar logs de error** en la terminal donde ejecutaste el backend
4. **Verificar .env** con variables de base de datos

### Si Aparecen Errores de Autenticación:
1. Verificar que `isMockMode = false` en `prisma.service.ts`
2. Verificar que la base de datos tiene datos de seed
3. Comprobar credenciales: `admin@gamifier.com / admin123`

### Si el Puerto Está Ocupado:
```bash
# Ver qué está usando el puerto 3002
lsof -i :3002

# Matar proceso si es necesario
kill -9 [PID]
```

## 🎉 Resultado Esperado

Una vez que el backend esté ejecutándose correctamente:

- **ÜPlay mostrará datos reales** en lugar del modo demo
- **Videos del backend PostgreSQL** aparecerán automáticamente
- **Preguntas interactivas** funcionarán
- **Autenticación real** estará activa
- **Banner de demo desaparecerá**

---

**💡 El frontend ya está configurado para detectar automáticamente cuando el backend esté disponible y hacer la transición sin intervención manual.**