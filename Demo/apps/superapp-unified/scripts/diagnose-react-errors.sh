#!/bin/bash

# 🔍 DIAGNÓSTICO DE ERRORES REACT DOM
# =====================================
# Script para identificar y resolver errores de React DOM como los mostrados en la consola

echo "🔍 INICIANDO DIAGNÓSTICO DE ERRORES REACT DOM..."
echo "================================================"

# 1. VERIFICAR SERVICIOS
echo "1️⃣ Verificando estado de servicios..."
echo "----------------------------------------"

# Backend
curl -s http://localhost:3002/health > /dev/null && echo "✅ Backend (3002): OK" || echo "❌ Backend (3002): ERROR"

# SuperApp
curl -s http://localhost:3001 -I > /dev/null && echo "✅ SuperApp (3001): OK" || echo "❌ SuperApp (3001): ERROR"

echo ""

# 2. DETECTAR MÚLTIPLES PROCESOS
echo "2️⃣ Detectando procesos múltiples..."
echo "------------------------------------"

VITE_PROCESSES=$(ps aux | grep vite | grep -v grep | wc -l | xargs)
NODE_PROCESSES=$(ps aux | grep "npm run dev" | grep -v grep | wc -l | xargs)

if [ "$VITE_PROCESSES" -gt 1 ]; then
  echo "⚠️ MÚLTIPLES procesos Vite detectados: $VITE_PROCESSES"
  echo "📋 Lista de procesos Vite:"
  ps aux | grep vite | grep -v grep | awk '{print "   PID: " $2 " - " $11 " " $12}'
  echo ""
  echo "💡 SOLUCIÓN: pkill -f 'vite' && npm run dev"
else
  echo "✅ Procesos Vite: $VITE_PROCESSES (normal)"
fi

if [ "$NODE_PROCESSES" -gt 2 ]; then
  echo "⚠️ MÚLTIPLES procesos npm run dev detectados: $NODE_PROCESSES"
  echo "📋 Lista de procesos npm run dev:"
  ps aux | grep "npm run dev" | grep -v grep | awk '{print "   PID: " $2 " - " $11 " " $12 " " $13}'
  echo ""
  echo "💡 SOLUCIÓN: pkill -f 'npm run dev' && npm run dev"
else
  echo "✅ Procesos npm run dev: $NODE_PROCESSES (normal)"
fi

echo ""

# 3. VERIFICAR DEPENDENCIAS CRÍTICAS
echo "3️⃣ Verificando dependencias críticas..."
echo "---------------------------------------"

cd Demo/apps/superapp-unified/

# React
REACT_VERSION=$(npm ls react --depth=0 2>/dev/null | grep react@ | cut -d@ -f2 | cut -d' ' -f1)
echo "📦 React: $REACT_VERSION"

# Material UI
MUI_VERSION=$(npm ls @mui/material --depth=0 2>/dev/null | grep @mui/material@ | cut -d@ -f2 | cut -d' ' -f1)
echo "📦 Material UI: $MUI_VERSION"

# TanStack Query
QUERY_VERSION=$(npm ls @tanstack/react-query --depth=0 2>/dev/null | grep @tanstack/react-query@ | cut -d@ -f2 | cut -d' ' -f1)
echo "📦 TanStack Query: $QUERY_VERSION"

# Sentry
SENTRY_VERSION=$(npm ls @sentry/react --depth=0 2>/dev/null | grep @sentry/react@ | cut -d@ -f2 | cut -d' ' -f1)
echo "📦 Sentry: $SENTRY_VERSION"

# Web Vitals
VITALS_VERSION=$(npm ls web-vitals --depth=0 2>/dev/null | grep web-vitals@ | cut -d@ -f2 | cut -d' ' -f1)
echo "📦 Web Vitals: $VITALS_VERSION"

cd ../../../

echo ""

# 4. ANALIZAR ERRORES ESPECÍFICOS
echo "4️⃣ Analizando patrones de errores específicos..."
echo "------------------------------------------------"

echo "🔍 Buscando patrones de errores conocidos..."

# Verificar strict mode en main.tsx
if grep -q "React.StrictMode" Demo/apps/superapp-unified/src/main.tsx; then
  echo "⚠️ React.StrictMode ACTIVO - puede causar doble ejecución de efectos"
  echo "📁 Archivo: Demo/apps/superapp-unified/src/main.tsx"
  echo "💡 CONSIDERACIÓN: Deshabilitar temporalmente para debugging"
else
  echo "✅ React.StrictMode no encontrado"
fi

# Verificar uso de performance APIs en PerformanceMonitor
if grep -q "performance.getEntriesByType" Demo/apps/superapp-unified/src/components/development/PerformanceMonitor.tsx; then
  echo "⚠️ Uso de Performance APIs detectado en PerformanceMonitor"
  echo "📁 Archivo: Demo/apps/superapp-unified/src/components/development/PerformanceMonitor.tsx"
  echo "💡 SOLUCIÓN: Ya se aplicaron protecciones en el código"
else
  echo "✅ PerformanceMonitor no encontrado o ya protegido"
fi

# Verificar intervalos sin cleanup
echo "🔍 Verificando potenciales memory leaks..."
INTERVAL_FILES=$(grep -r "setInterval" Demo/apps/superapp-unified/src/ --include="*.tsx" --include="*.ts" | grep -v "clearInterval" | wc -l | xargs)
if [ "$INTERVAL_FILES" -gt 0 ]; then
  echo "⚠️ Posibles intervalos sin cleanup detectados: $INTERVAL_FILES"
  echo "📋 Archivos con setInterval sin clearInterval aparente:"
  grep -r "setInterval" Demo/apps/superapp-unified/src/ --include="*.tsx" --include="*.ts" -l | while read file; do
    if ! grep -q "clearInterval" "$file"; then
      echo "   - $file"
    fi
  done
else
  echo "✅ No se detectaron intervalos problemáticos"
fi

echo ""

# 5. SOLUCIONES RECOMENDADAS
echo "5️⃣ Soluciones recomendadas..."
echo "------------------------------"

echo "🔧 SOLUCIONES INMEDIATAS:"
echo "1. Limpiar procesos múltiples:"
echo "   pkill -f 'vite' && pkill -f 'npm run dev'"
echo ""
echo "2. Reiniciar servicios limpio:"
echo "   npm run dev"
echo ""
echo "3. Deshabilitar StrictMode temporalmente:"
echo "   Comentar <React.StrictMode> en main.tsx"
echo ""
echo "4. Deshabilitar PerformanceMonitor:"
echo "   Comentar PerformanceMonitor en App.tsx"
echo ""

echo "🔧 SOLUCIONES A LARGO PLAZO:"
echo "1. Implementar Error Boundary más robusto"
echo "2. Optimizar useEffect dependencies"
echo "3. Implementar cleanup en todos los componentes con side effects"
echo "4. Considerar React 18+ Concurrent Features"
echo ""

echo "📊 ANÁLISIS COMPLETADO"
echo "====================="

exit 0 