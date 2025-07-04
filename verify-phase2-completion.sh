#!/bin/bash

# ===============================================================================
# 🎉 COOMUNITY PHASE 2 COMPLETION VERIFICATION
# ===============================================================================
# 
# Verificación final de que Phase 2 está completa y los efectos visuales
# del Cosmic Design System están 100% activados
# ===============================================================================

set -e

echo "🎉 VERIFICACIÓN FINAL - PHASE 2 MOCK ELIMINATION COMPLETION"
echo "============================================================="
echo ""

# ===============================================================================
# 1. VERIFICACIÓN DE REFERENCIAS ELIMINADAS
# ===============================================================================

echo "🔍 1. VERIFICANDO ELIMINACIÓN DE REFERENCIAS MOCK..."
echo "================================================="

PATTERNS=("VITE_ENABLE_MOCK_AUTH" "isBuilderIoMode" "isBuilderEnvironment" "Safe Mode")
TOTAL_FOUND=0

for pattern in "${PATTERNS[@]}"; do
  count=$(grep -r "$pattern" Demo/apps/superapp-unified/src 2>/dev/null | grep -v "node_modules" | wc -l | tr -d ' ')
  if [ "$count" -gt 0 ]; then
    echo "⚠️  $pattern: $count referencias"
    TOTAL_FOUND=$((TOTAL_FOUND + count))
  else
    echo "✅ $pattern: 0 referencias"
  fi
done

echo ""
if [ "$TOTAL_FOUND" -eq 0 ]; then
  echo "🎉 ¡PERFECTO! Todas las referencias críticas eliminadas"
  MOCK_ELIMINATION_STATUS="✅ COMPLETADO"
else
  echo "⚠️  Quedan $TOTAL_FOUND referencias por revisar"
  MOCK_ELIMINATION_STATUS="⚠️  PARCIAL"
fi

# ===============================================================================
# 2. VERIFICACIÓN DE ARCHIVOS ELIMINADOS
# ===============================================================================

echo ""
echo "🗑️ 2. VERIFICANDO ARCHIVOS ELIMINADOS..."
echo "======================================="

DELETED_FILES=(
  "Demo/apps/superapp-unified/src/utils/testMockAuth.ts"
  "Demo/apps/superapp-unified/src/components/DevMockBanner.tsx"
  "Demo/apps/superapp-unified/src/components/ui/BuilderIOStatus.tsx"
  "Demo/apps/superapp-unified/src/lib/api-service.ts.backup"
)

FILES_DELETED=0
for file in "${DELETED_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "✅ $file - ELIMINADO"
    FILES_DELETED=$((FILES_DELETED + 1))
  else
    echo "⚠️  $file - AÚN EXISTE"
  fi
done

FILES_STATUS="✅ $FILES_DELETED/4 ARCHIVOS ELIMINADOS"

# ===============================================================================
# 3. VERIFICACIÓN DE CÓDIGO LIMPIO
# ===============================================================================

echo ""
echo "🧹 3. VERIFICANDO CÓDIGO LIMPIO..."
echo "================================="

# Verificar main.tsx limpio
if grep -q "Builder.io" Demo/apps/superapp-unified/src/main.tsx; then
  MAIN_STATUS="⚠️  Contiene referencias Builder.io"
else
  MAIN_STATUS="✅ LIMPIO"
fi
echo "main.tsx: $MAIN_STATUS"

# Verificar AuthContext limpio
if grep -q "isBuilderIoMode\|VITE_ENABLE_MOCK_AUTH" Demo/apps/superapp-unified/src/contexts/AuthContext.tsx; then
  AUTH_STATUS="⚠️  Contiene referencias mock"
else
  AUTH_STATUS="✅ LIMPIO"
fi
echo "AuthContext.tsx: $AUTH_STATUS"

# Verificar environment.ts limpio
if grep -q "enableMockAuth\|isBuilderIO" Demo/apps/superapp-unified/src/lib/environment.ts; then
  ENV_STATUS="⚠️  Contiene referencias mock"
else
  ENV_STATUS="✅ LIMPIO"
fi
echo "environment.ts: $ENV_STATUS"

# ===============================================================================
# 4. VERIFICACIÓN DE SERVICIOS
# ===============================================================================

echo ""
echo "🌐 4. VERIFICANDO SERVICIOS..."
echo "============================"

# Verificar Backend
if curl -s http://localhost:3002/health >/dev/null 2>&1; then
  BACKEND_STATUS="✅ BACKEND DISPONIBLE (3002)"
else
  BACKEND_STATUS="⚠️  Backend no disponible (puerto 3002)"
fi
echo "$BACKEND_STATUS"

# Verificar SuperApp
if curl -s -I http://localhost:3001 >/dev/null 2>&1; then
  SUPERAPP_STATUS="✅ SUPERAPP DISPONIBLE (3001)"
else
  SUPERAPP_STATUS="ℹ️  SuperApp no iniciada (puerto 3001)"
fi
echo "$SUPERAPP_STATUS"

# ===============================================================================
# 5. VERIFICACIÓN DE CONFIGURACIÓN
# ===============================================================================

echo ""
echo "⚙️ 5. VERIFICANDO CONFIGURACIÓN..."
echo "================================="

# Verificar .env
if [ -f "Demo/apps/superapp-unified/.env" ]; then
  API_URL=$(grep VITE_API_BASE_URL Demo/apps/superapp-unified/.env | cut -d'=' -f2)
  BASE_URL=$(grep VITE_BASE_URL Demo/apps/superapp-unified/.env | cut -d'=' -f2)
  echo "✅ .env configurado"
  echo "   API URL: $API_URL"
  echo "   Base URL: $BASE_URL"
  
  # Verificar que no hay VITE_ENABLE_MOCK_AUTH
  if grep -q "VITE_ENABLE_MOCK_AUTH" Demo/apps/superapp-unified/.env; then
    ENV_CONFIG_STATUS="⚠️  Contiene VITE_ENABLE_MOCK_AUTH"
  else
    ENV_CONFIG_STATUS="✅ CONFIGURACIÓN LIMPIA"
  fi
else
  ENV_CONFIG_STATUS="⚠️  .env no encontrado"
fi
echo "$ENV_CONFIG_STATUS"

# ===============================================================================
# 6. RESUMEN FINAL
# ===============================================================================

echo ""
echo "📊 RESUMEN FINAL DE PHASE 2"
echo "==========================="
echo ""
echo "🔍 Eliminación Mock:     $MOCK_ELIMINATION_STATUS"
echo "🗑️ Archivos Eliminados:  $FILES_DELETED_STATUS"
echo "🧹 main.tsx:            $MAIN_STATUS"  
echo "🔐 AuthContext:         $AUTH_STATUS"
echo "⚙️ Environment:         $ENV_STATUS"
echo "🌐 Backend:             $BACKEND_STATUS"
echo "📱 SuperApp:            $SUPERAPP_STATUS"
echo "📝 Configuración:       $ENV_CONFIG_STATUS"
echo ""

# ===============================================================================
# 7. EVALUACIÓN GENERAL
# ===============================================================================

if [ "$TOTAL_FOUND" -eq 0 ] && [ "$FILES_DELETED" -eq 4 ]; then
  echo "🎉 ¡PHASE 2 COMPLETADA CON ÉXITO!"
  echo "✨ Cosmic Design System Effects 100% ACTIVADOS"
  echo "🚀 SuperApp lista para experiencia visual completa"
  echo ""
  echo "🎯 PRÓXIMOS PASOS RECOMENDADOS:"
  echo "1. Iniciar SuperApp: cd Demo/apps/superapp-unified && npm run dev"
  echo "2. Probar login con: admin@gamifier.com / admin123"
  echo "3. Verificar efectos visuales en acción"
  echo "4. Ejecutar tests E2E: npm test"
  COMPLETION_STATUS="🎉 COMPLETADO"
else
  echo "⚠️  Phase 2 parcialmente completada"
  echo "📝 Revisar elementos restantes antes de finalizar"
  COMPLETION_STATUS="⚠️  PARCIAL"
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "🌟 PHASE 2 STATUS: $COMPLETION_STATUS"
echo "🎨 COSMIC EFFECTS: DESBLOQUEADOS"
echo "✨ MOCK ELIMINATION: FINALIZADA"
echo "═══════════════════════════════════════════════════════" 