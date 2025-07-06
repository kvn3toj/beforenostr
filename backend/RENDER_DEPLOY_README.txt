RENDER CONFIGURACIÓN RECOMENDADA - ACTUALIZADA P1017 FIX

Root Directory: backend
Build Command: npm install --legacy-peer-deps && npm run build
Start Command: npm run start:prod

=================================================================
VARIABLES DE ENTORNO CRÍTICAS PARA RESOLVER ERROR P1017
=================================================================

1. DATABASE_URL (FORMATO OPTIMIZADO):
   postgresql://[user]:[password]@[host]/[database]?sslmode=require&connect_timeout=60&pool_timeout=60&statement_timeout=60000

   Ejemplo:
   postgresql://coomunity_db_prod_user:password123@dpg-d1fpqd2li9vc739qrtf0-a.oregon-postgres.render.com/coomunity_db_prod?sslmode=require&connect_timeout=60&pool_timeout=60&statement_timeout=60000

2. REDIS_URL:
   redis://red-d1fjqp2li9vc739kf560:6379

3. JWT_SECRET:
   [tu_jwt_secret_seguro]

4. VARIABLES ADICIONALES PARA ESTABILIDAD:
   NODE_ENV=production
   PORT=3002
   PRISMA_QUERY_ENGINE_LIBRARY_TIMEOUT=60000
   PRISMA_CLIENT_ENGINE_TYPE=library

=================================================================
CONFIGURACIÓN ESPECÍFICA PARA RENDER
=================================================================

1. En el Dashboard de Render:
   - Service Type: Web Service
   - Environment: Docker
   - Region: Oregon (mismo que la base de datos)
   - Instance Type: Starter (mínimo)

2. Build Settings:
   - Build Command: npm install --legacy-peer-deps && npm run build
   - Start Command: npm run start:prod

3. Health Check:
   - Path: /health
   - Port: 3002

=================================================================
SOLUCIÓN ESPECÍFICA PARA ERROR P1017
=================================================================

El error P1017 "Server has closed the connection" se resuelve con:

1. TIMEOUTS EXTENDIDOS:
   - connect_timeout=60 (60 segundos para conectar)
   - pool_timeout=60 (60 segundos para pool)
   - statement_timeout=60000 (60 segundos para queries)

2. CONFIGURACIÓN SSL:
   - sslmode=require (forzar SSL)

3. RETRY LOGIC:
   - El script start-production.sh incluye reintentos automáticos
   - Máximo 5 intentos con backoff exponencial

4. VERIFICACIÓN DE CONECTIVIDAD:
   - Test de conexión antes de ejecutar migraciones
   - Validación de puerto y host

=================================================================
TROUBLESHOOTING ADICIONAL
=================================================================

Si el problema persiste:

1. Verificar que la base de datos esté en la misma región (Oregon)
2. Confirmar que el usuario tiene permisos completos
3. Verificar que no hay firewall bloqueando la conexión
4. Revisar los logs de PostgreSQL en Render

Para debugging manual:
1. Conectar por SSH al contenedor
2. Ejecutar: nc -z [host] [port] para verificar conectividad
3. Verificar variables de entorno: echo $DATABASE_URL

=================================================================
COMANDOS DE VERIFICACIÓN
=================================================================

Para verificar la configuración localmente:
```bash
# Test de conexión
curl -X GET http://localhost:3002/health

# Test de base de datos
curl -X GET http://localhost:3002/playlists-direct/db-test
```

=================================================================
HISTORIAL DE CAMBIOS
=================================================================

v15 (2025-07-06):
- Agregado script robusto de inicio (start-production.sh)
- Configuración optimizada de timeouts para PostgreSQL
- Retry logic para migraciones
- Verificación de conectividad previa
- Manejo específico del error P1017

v14:
- Configuración básica de monorepo
- Dockerfile multi-stage
- Configuración inicial de variables de entorno


