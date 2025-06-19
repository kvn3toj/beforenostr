#!/bin/bash

# 🔍 VERIFICACIÓN DE CORRECCIONES APLICADAS
# =========================================
# Script para verificar que las correcciones de errores React DOM han funcionado

echo "🔍 VERIFICANDO CORRECCIONES APLICADAS..."
echo "========================================"

# 1. VERIFICAR PROCESOS
echo "1️⃣ Verificando procesos únicos..."
echo "---------------------------------"

VITE_COUNT=$(ps aux | grep vite | grep -v grep | wc -l | xargs)
NPM_COUNT=$(ps aux | grep "npm run dev" | grep -v grep | wc -l | xargs)

echo "🔄 Procesos Vite: $VITE_COUNT"
echo "🔄 Procesos npm run dev: $NPM_COUNT"

if [ "$VITE_COUNT" -le 1 ] && [ "$NPM_COUNT" -le 3 ]; then
  echo "✅ Procesos normalizados"
else
  echo "⚠️ Múltiples procesos aún detectados"
fi

echo ""

# 2. VERIFICAR STRICT MODE DESHABILITADO
echo "2️⃣ Verificando React.StrictMode..."
echo "----------------------------------"

if grep -q "// <React.StrictMode>" Demo/apps/superapp-unified/src/main.tsx; then
  echo "✅ React.StrictMode deshabilitado correctamente"
else
  echo "❌ React.StrictMode aún activo"
fi

echo ""

# 3. VERIFICAR PERFORMANCE MONITOR DESHABILITADO
echo "3️⃣ Verificando PerformanceMonitor..."
echo "------------------------------------"

if grep -q "/* {process.env.NODE_ENV === 'development'" Demo/apps/superapp-unified/src/App.tsx; then
  echo "✅ PerformanceMonitor deshabilitado correctamente"
else
  echo "❌ PerformanceMonitor aún activo"
fi

echo ""

# 4. ESPERAR Y VERIFICAR SERVICIOS
echo "4️⃣ Verificando servicios (30s timeout)..."
echo "-------------------------------------------"

# Esperar servicios
for i in {1..30}; do
  echo -n "🔄 Verificando servicios... ($i/30) "
  
  # Verificar SuperApp
  if curl -s http://localhost:3001 -I > /dev/null 2>&1; then
    SUPERAPP_STATUS="✅"
  else
    SUPERAPP_STATUS="⏳"
  fi
  
  # Verificar Backend
  if curl -s http://localhost:3002/health > /dev/null 2>&1; then
    BACKEND_STATUS="✅"
  else
    BACKEND_STATUS="⏳"
  fi
  
  echo "SuperApp: $SUPERAPP_STATUS | Backend: $BACKEND_STATUS"
  
  # Si ambos están listos, salir del loop
  if [ "$SUPERAPP_STATUS" = "✅" ] && [ "$BACKEND_STATUS" = "✅" ]; then
    break
  fi
  
  sleep 1
done

echo ""

# 5. RESUMEN FINAL
echo "5️⃣ Resumen de correcciones..."
echo "------------------------------"

STRICT_MODE_OK=$(grep -q "// <React.StrictMode>" Demo/apps/superapp-unified/src/main.tsx && echo "✅" || echo "❌")
PERF_MONITOR_OK=$(grep -q "/* {process.env.NODE_ENV === 'development'" Demo/apps/superapp-unified/src/App.tsx && echo "✅" || echo "❌")
SUPERAPP_OK=$(curl -s http://localhost:3001 -I > /dev/null 2>&1 && echo "✅" || echo "❌")
BACKEND_OK=$(curl -s http://localhost:3002/health > /dev/null 2>&1 && echo "✅" || echo "❌")

echo "📋 Estado de correcciones:"
echo "   - React.StrictMode deshabilitado: $STRICT_MODE_OK"
echo "   - PerformanceMonitor deshabilitado: $PERF_MONITOR_OK"
echo "   - SuperApp (3001) funcionando: $SUPERAPP_OK"
echo "   - Backend (3002) funcionando: $BACKEND_OK"

# Calcular éxito total
TOTAL_OK=0
[ "$STRICT_MODE_OK" = "✅" ] && ((TOTAL_OK++))
[ "$PERF_MONITOR_OK" = "✅" ] && ((TOTAL_OK++))
[ "$SUPERAPP_OK" = "✅" ] && ((TOTAL_OK++))
[ "$BACKEND_OK" = "✅" ] && ((TOTAL_OK++))

SUCCESS_RATE=$((TOTAL_OK * 100 / 4))

echo ""
echo "📊 TASA DE ÉXITO: $SUCCESS_RATE% ($TOTAL_OK/4)"

if [ "$SUCCESS_RATE" -ge 75 ]; then
  echo "🎉 CORRECCIONES EXITOSAS - Los errores React DOM deberían haberse resuelto"
  echo "💡 Ahora puedes recasar el navegador para ver la aplicación sin errores"
elif [ "$SUCCESS_RATE" -ge 50 ]; then
  echo "⚠️ CORRECCIONES PARCIALES - Algunos errores pueden persistir"
  echo "💡 Revisa la consola del navegador para errores restantes"
else
  echo "❌ CORRECCIONES FALLIDAS - Se requiere investigación adicional"
  echo "💡 Revisa logs de servicios y vuelve a ejecutar diagnóstico"
fi

echo ""
echo "🔗 PRÓXIMOS PASOS:"
echo "1. Recargar la página en el navegador (Cmd+R o F5)"
echo "2. Abrir DevTools y verificar la consola"
echo "3. Los errores 'enqueueJob' y 'setProp' deberían haber desaparecido"
echo "4. Reactivar StrictMode cuando la aplicación esté estable"

exit 0 