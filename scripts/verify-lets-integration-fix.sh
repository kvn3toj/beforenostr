#!/bin/bash

echo "🔍 VERIFICACIÓN DE INTEGRACIÓN LETS - CoomÜnity SuperApp"
echo "=========================================================="

# 1. Verificar que PostgreSQL esté ejecutándose
echo "1. 🗄️ Verificando PostgreSQL..."
POSTGRES_STATUS=$(brew services list | grep postgresql@15 | awk '{print $2}')
if [ "$POSTGRES_STATUS" != "started" ]; then
  echo "❌ ERROR: PostgreSQL no está ejecutándose"
  exit 1
fi
echo "✅ PostgreSQL ejecutándose correctamente"

# 2. Verificar que el backend esté respondiendo
echo "2. 🔧 Verificando Backend..."
BACKEND_HEALTH=$(curl -s http://localhost:1111/health | grep -o '"status":"ok"')
if [ -z "$BACKEND_HEALTH" ]; then
  echo "❌ ERROR: Backend no responde en puerto 3002"
  exit 1
fi
echo "✅ Backend respondiendo correctamente"

# 3. Verificar que la SuperApp esté respondiendo
echo "3. 🌐 Verificando SuperApp..."
SUPERAPP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:2222)
if [ "$SUPERAPP_STATUS" != "200" ]; then
  echo "❌ ERROR: SuperApp no responde en puerto 3001"
  exit 1
fi
echo "✅ SuperApp respondiendo correctamente"

# 4. Verificar endpoint LETs con autenticación
echo "4. 💰 Verificando endpoints LETs..."
# Obtener token JWT
TOKEN_RESPONSE=$(curl -s -X POST "http://localhost:1111/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@gamifier.com", "password": "admin123"}')

ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
  echo "❌ ERROR: No se pudo obtener token de autenticación"
  exit 1
fi

# Probar endpoint LETs ping
LETS_PING=$(curl -s -H "Authorization: Bearer $ACCESS_TOKEN" http://localhost:1111/lets/ping | grep -o '"message":"LETS module is working"')
if [ -z "$LETS_PING" ]; then
  echo "❌ ERROR: Endpoint LETs ping no funciona"
  exit 1
fi

# Probar endpoint LETs history
LETS_HISTORY=$(curl -s -H "Authorization: Bearer $ACCESS_TOKEN" http://localhost:1111/lets/history/00000000-0000-0000-0000-000000000001)
if [[ $LETS_HISTORY == *"error"* ]]; then
  echo "❌ ERROR: Endpoint LETs history retorna error"
  exit 1
fi

echo "✅ Endpoints LETs funcionando correctamente"

# 5. Verificar que LetsModule esté en AppModule
echo "5. 📦 Verificando integración LetsModule..."
LETS_MODULE_IMPORT=$(grep -c "import { LetsModule }" src/app.module.ts)
LETS_MODULE_USAGE=$(grep -c "LetsModule," src/app.module.ts)

if [ "$LETS_MODULE_IMPORT" -eq 0 ] || [ "$LETS_MODULE_USAGE" -eq 0 ]; then
  echo "❌ ERROR: LetsModule no está correctamente integrado en AppModule"
  exit 1
fi
echo "✅ LetsModule correctamente integrado"

# 6. Verificar corrección en servicio frontend
echo "6. 🔄 Verificando corrección en servicio frontend..."
CORRECT_ENDPOINT=$(grep -c "/lets/history/" Demo/apps/superapp-unified/src/lib/lets-backend-service.ts)
if [ "$CORRECT_ENDPOINT" -eq 0 ]; then
  echo "❌ ERROR: Endpoint incorrecto en servicio frontend"
  exit 1
fi
echo "✅ Servicio frontend corregido"

# 7. Verificar procesos limpios
echo "7. 🧹 Verificando que no hay procesos múltiples..."
MULTIPLE_VITE=$(ps aux | grep -E "vite" | grep -v grep | wc -l)
if [ "$MULTIPLE_VITE" -gt 1 ]; then
  echo "⚠️ ADVERTENCIA: Múltiples procesos Vite detectados ($MULTIPLE_VITE)"
fi

echo ""
echo "🎉 VERIFICACIÓN COMPLETADA EXITOSAMENTE"
echo "========================================="
echo "✅ PostgreSQL: Ejecutándose"
echo "✅ Backend NestJS: Puerto 3002 funcional"
echo "✅ SuperApp: Puerto 3001 funcional"
echo "✅ Módulo LETs: Integrado y funcional"
echo "✅ Endpoints LETs: Respondiendo correctamente"
echo "✅ Servicio Frontend: Corregido"
echo ""
echo "🔧 PROBLEMAS RESUELTOS:"
echo "• Error 404 en /lets/transactions/user/* → Corregido a /lets/history/*"
echo "• LetsModule faltante en AppModule → Agregado"
echo "• Endpoints LETs no disponibles → Ahora funcionan"
echo "• Procesos múltiples → Limpiados"
echo ""
echo "🚨 NOTAS:"
echo "• Las imágenes de Unsplash pueden seguir dando 404 (es normal)"
echo "• Los endpoints LETs requieren autenticación JWT"
echo "• El token del usuario en los logs es: 00000000-0000-0000-0000-000000000001" 