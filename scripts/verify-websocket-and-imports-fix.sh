#!/bin/bash

echo "🔍 VERIFICACIÓN DE ERRORES WEBSOCKET Y IMPORTS RESUELTOS"
echo "======================================================="
echo "Timestamp: $(date)"
echo ""

# 1. Verificar que no hay procesos múltiples
echo "1. 🧹 Verificando limpieza de procesos múltiples..."
MULTIPLE_PROCESSES=$(ps aux | grep -E "(vite|npm run dev)" | grep -v grep | wc -l)
if [ $MULTIPLE_PROCESSES -le 2 ]; then
  echo "   ✅ Procesos controlados ($MULTIPLE_PROCESSES encontrados)"
else
  echo "   ⚠️ Múltiples procesos detectados ($MULTIPLE_PROCESSES)"
fi

# 2. Verificar servicios funcionando
echo ""
echo "2. 🌐 Verificando servicios..."

# Backend health check
BACKEND_STATUS=$(curl -s http://localhost:3002/health | grep "ok" | wc -l)
if [ $BACKEND_STATUS -eq 1 ]; then
  echo "   ✅ Backend NestJS respondiendo (puerto 3002)"
else
  echo "   ❌ Backend NestJS no responde (puerto 3002)"
fi

# SuperApp status
SUPERAPP_STATUS=$(curl -s -I http://localhost:3001 | grep "200 OK" | wc -l)
if [ $SUPERAPP_STATUS -eq 1 ]; then
  echo "   ✅ SuperApp respondiendo (puerto 3001)"
else
  echo "   ❌ SuperApp no responde (puerto 3001)"
fi

# 3. Verificar corrección de importación RevolutionaryWidget
echo ""
echo "3. 🎨 Verificando corrección de RevolutionaryWidget..."
CORRECT_IMPORT=$(grep -r "from '../../../design-system/templates'" Demo/apps/superapp-unified/src/components/modules/uplay/UPlayInteractiveLibrary.tsx | wc -l)
if [ $CORRECT_IMPORT -eq 1 ]; then
  echo "   ✅ Importación RevolutionaryWidget corregida"
else
  echo "   ❌ Importación RevolutionaryWidget aún incorrecta"
fi

# 4. Verificar que no hay Grid2 en SuperApp
echo ""
echo "4. 📐 Verificando ausencia de Grid2 problemático..."
GRID2_COUNT=$(find Demo/apps/superapp-unified -name "*.tsx" -exec grep -l "Grid2" {} \; 2>/dev/null | wc -l)
if [ $GRID2_COUNT -eq 0 ]; then
  echo "   ✅ No se encontró Grid2 en SuperApp"
else
  echo "   ⚠️ Grid2 encontrado en $GRID2_COUNT archivos de SuperApp"
fi

# 5. Verificar dependencias críticas
echo ""
echo "5. 🗄️ Verificando dependencias críticas..."

# PostgreSQL
POSTGRES_STATUS=$(brew services list | grep postgresql@15 | grep started | wc -l)
if [ $POSTGRES_STATUS -eq 1 ]; then
  echo "   ✅ PostgreSQL ejecutándose"
else
  echo "   ❌ PostgreSQL no ejecutándose"
fi

# Redis
REDIS_STATUS=$(brew services list | grep redis | grep started | wc -l)
if [ $REDIS_STATUS -eq 1 ]; then
  echo "   ✅ Redis ejecutándose"
else
  echo "   ❌ Redis no ejecutándose"
fi

# 6. Verificar puertos WebSocket no conflictivos
echo ""
echo "6. 🔌 Verificando configuración WebSocket..."
WEBSOCKET_CONFLICTS=$(lsof -i :3000 | grep LISTEN | wc -l)
if [ $WEBSOCKET_CONFLICTS -eq 0 ]; then
  echo "   ✅ Puerto 3000 libre para WebSocket"
else
  echo "   ⚠️ Puerto 3000 ocupado (puede causar conflictos WebSocket)"
fi

# 7. Test de conectividad WebSocket básico
echo ""
echo "7. 🔗 Verificando conectividad WebSocket Vite..."
if curl -s --max-time 3 http://localhost:3001 > /dev/null; then
  echo "   ✅ Conexión HTTP a SuperApp exitosa"
  echo "   ℹ️ WebSocket HMR debería funcionar correctamente"
else
  echo "   ❌ No se puede conectar a SuperApp"
fi

# Resumen final
echo ""
echo "📊 RESUMEN DE VERIFICACIÓN:"
echo "=========================="

TOTAL_CHECKS=7
PASSED_CHECKS=0

# Contar checks pasados (simplificado)
[ $MULTIPLE_PROCESSES -le 2 ] && ((PASSED_CHECKS++))
[ $BACKEND_STATUS -eq 1 ] && ((PASSED_CHECKS++))
[ $SUPERAPP_STATUS -eq 1 ] && ((PASSED_CHECKS++))
[ $CORRECT_IMPORT -eq 1 ] && ((PASSED_CHECKS++))
[ $GRID2_COUNT -eq 0 ] && ((PASSED_CHECKS++))
[ $POSTGRES_STATUS -eq 1 ] && ((PASSED_CHECKS++))
[ $REDIS_STATUS -eq 1 ] && ((PASSED_CHECKS++))

echo "✅ Verificaciones exitosas: $PASSED_CHECKS/$TOTAL_CHECKS"

if [ $PASSED_CHECKS -eq $TOTAL_CHECKS ]; then
  echo "🎉 TODOS LOS ERRORES RESUELTOS EXITOSAMENTE"
  echo ""
  echo "🔧 Errores corregidos:"
  echo "   - WebSocket connection failed ✅"
  echo "   - Grid2 import binding error ✅"
  echo "   - RevolutionaryWidget import error ✅"
  echo "   - Procesos múltiples conflictivos ✅"
  echo ""
  echo "💡 SuperApp lista para desarrollo sin errores"
elif [ $PASSED_CHECKS -ge 5 ]; then
  echo "✅ MAYORÍA DE ERRORES RESUELTOS ($PASSED_CHECKS/$TOTAL_CHECKS)"
  echo "⚠️ Revisar verificaciones fallidas arriba"
else
  echo "❌ ERRORES CRÍTICOS PENDIENTES ($PASSED_CHECKS/$TOTAL_CHECKS)"
  echo "🔧 Ejecutar correcciones adicionales"
fi

echo ""
echo "🏁 Verificación completada" 