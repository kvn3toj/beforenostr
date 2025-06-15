#!/bin/bash

# 🔍 PRE-FLIGHT CHECK CRÍTICO - PROYECTO COOMUNITY
# Este script verifica que el workspace esté en estado correcto antes de desarrollo
# Basado en aprendizajes costosos y experiencias reales del proyecto

echo "🔍 INICIANDO PRE-FLIGHT CHECK CRÍTICO..."
echo "==============================================="

# 1. VERIFICAR UBICACIÓN CORRECTA
echo "📍 Verificando ubicación del workspace..."
CURRENT_DIR=$(pwd)
EXPECTED_DIR="/Users/kevinp/Movies/GAMIFIER copy"
if [ "$CURRENT_DIR" != "$EXPECTED_DIR" ]; then
  echo "❌ ERROR: Ubicación incorrecta"
  echo "📍 Actual: $CURRENT_DIR"
  echo "📍 Esperada: $EXPECTED_DIR"
  echo "🔧 Ejecuta: cd '$EXPECTED_DIR'"
  exit 1
fi
echo "✅ Ubicación correcta verificada"

# 2. LIMPIAR PROCESOS MÚLTIPLES
echo ""
echo "🧹 Limpiando procesos múltiples..."
PROCESSES_BEFORE=$(ps aux | grep -E "(vite|npm run dev)" | grep -v grep | wc -l)
if [ $PROCESSES_BEFORE -gt 0 ]; then
  echo "⚠️ Detectados $PROCESSES_BEFORE procesos conflictivos. Limpiando..."
  pkill -f "vite" 2>/dev/null || true
  pkill -f "npm run dev" 2>/dev/null || true
  sleep 3
else
  echo "✅ No hay procesos conflictivos detectados"
fi

# 3. VERIFICAR LIMPIEZA DE PROCESOS
echo ""
echo "🔍 Verificando limpieza de procesos..."
RUNNING_PROCESSES=$(ps aux | grep -E "(vite|npm run dev)" | grep -v grep | wc -l)
if [ $RUNNING_PROCESSES -gt 0 ]; then
  echo "⚠️ ADVERTENCIA: $RUNNING_PROCESSES procesos aún ejecutándose:"
  ps aux | grep -E "(vite|npm run dev)" | grep -v grep
  echo "🔧 Puede ser necesario eliminarlos manualmente"
else
  echo "✅ Todos los procesos conflictivos eliminados"
fi

# 4. LIMPIAR PUERTOS OCUPADOS
echo ""
echo "🔧 Liberando puertos ocupados..."
PORTS_KILLED=0
for port in 3000 3001 3002 3003 5173; do
  if lsof -i :$port >/dev/null 2>&1; then
    echo "🔧 Liberando puerto $port..."
    lsof -ti:$port | xargs kill -9 2>/dev/null || true
    PORTS_KILLED=$((PORTS_KILLED + 1))
  fi
done

if [ $PORTS_KILLED -gt 0 ]; then
  echo "✅ $PORTS_KILLED puertos liberados"
  sleep 2
else
  echo "✅ Todos los puertos están libres"
fi

# 5. VERIFICAR CONFIGURACIÓN DE PUERTOS
echo ""
echo "📋 Verificando configuración de puertos..."
if [ -f "Demo/apps/superapp-unified/.env" ]; then
  SUPERAPP_PORT=$(grep VITE_BASE_URL Demo/apps/superapp-unified/.env 2>/dev/null | cut -d':' -f3 | cut -d'/' -f1)
  if [ "$SUPERAPP_PORT" = "3001" ]; then
    echo "✅ Puerto SuperApp correcto: 3001"
  elif [ -n "$SUPERAPP_PORT" ]; then
    echo "⚠️ ADVERTENCIA: Puerto SuperApp no es 3001 (actual: $SUPERAPP_PORT)"
  else
    echo "⚠️ ADVERTENCIA: No se pudo leer configuración de puerto SuperApp"
  fi
else
  echo "⚠️ ADVERTENCIA: Archivo .env de SuperApp no encontrado"
fi

# 6. VERIFICAR DEPENDENCIAS CRÍTICAS
echo ""
echo "📦 Verificando dependencias críticas..."
if [ -d "Demo/apps/superapp-unified" ]; then
  cd Demo/apps/superapp-unified/
  
  MISSING_DEPS=0
  
  if npm ls @sentry/react >/dev/null 2>&1; then
    echo "✅ @sentry/react instalado"
  else
    echo "⚠️ FALTA: @sentry/react"
    MISSING_DEPS=$((MISSING_DEPS + 1))
  fi
  
  if npm ls web-vitals >/dev/null 2>&1; then
    echo "✅ web-vitals instalado"
  else
    echo "⚠️ FALTA: web-vitals"
    MISSING_DEPS=$((MISSING_DEPS + 1))
  fi
  
  if npm ls @playwright/test >/dev/null 2>&1; then
    echo "✅ @playwright/test instalado"
  else
    echo "⚠️ FALTA: @playwright/test"
    MISSING_DEPS=$((MISSING_DEPS + 1))
  fi
  
  if [ $MISSING_DEPS -gt 0 ]; then
    echo "⚠️ Total dependencias faltantes: $MISSING_DEPS"
    echo "🔧 Para instalar: npm install @sentry/react web-vitals @playwright/test --legacy-peer-deps"
  fi
  
  cd ../../../
else
  echo "❌ ERROR: Directorio SuperApp no encontrado"
fi

# 7. VERIFICAR SERVICIOS (si están ejecutándose)
echo ""
echo "🌐 Verificando servicios disponibles..."
if curl -s http://localhost:3002/health >/dev/null 2>&1; then
  echo "✅ Backend (3002) disponible y funcionando"
else
  echo "ℹ️ Backend (3002) no disponible (normal si no está iniciado)"
fi

if curl -s -I http://localhost:3001 >/dev/null 2>&1; then
  echo "✅ SuperApp (3001) disponible y funcionando"
else
  echo "ℹ️ SuperApp (3001) no disponible (normal si no está iniciada)"
fi

# 8. VERIFICAR ESTRUCTURA DE ARCHIVOS
echo ""
echo "📂 Verificando estructura de archivos..."
ROOT_FILES=$(find . -maxdepth 1 -type f | wc -l)
if [ $ROOT_FILES -le 30 ]; then
  echo "✅ Directorio raíz organizado ($ROOT_FILES archivos ≤ 30)"
else
  echo "⚠️ ADVERTENCIA: Directorio raíz desorganizado ($ROOT_FILES archivos > 30)"
  echo "🔧 Considera mover archivos a directorios organizacionales"
fi

# 9. VERIFICAR TURBOREPO
echo ""
echo "🚀 Verificando Turborepo..."
if npm ls turbo >/dev/null 2>&1; then
  echo "✅ Turborepo instalado y disponible"
else
  echo "⚠️ ADVERTENCIA: Turborepo no encontrado"
  echo "🔧 Para instalar: npm install turbo"
fi

# RESUMEN FINAL
echo ""
echo "🏁 PRE-FLIGHT CHECK COMPLETADO"
echo "==============================================="

# Verificar estado general
WARNINGS=0
ERRORS=0

if [ "$CURRENT_DIR" != "$EXPECTED_DIR" ]; then
  ERRORS=$((ERRORS + 1))
fi

if [ $RUNNING_PROCESSES -gt 0 ]; then
  WARNINGS=$((WARNINGS + 1))
fi

if [ $MISSING_DEPS -gt 0 ]; then
  WARNINGS=$((WARNINGS + 1))
fi

if [ $ROOT_FILES -gt 30 ]; then
  WARNINGS=$((WARNINGS + 1))
fi

# Mostrar resumen
if [ $ERRORS -gt 0 ]; then
  echo "❌ ERRORES CRÍTICOS: $ERRORS - NO proceder hasta resolver"
  exit 1
elif [ $WARNINGS -gt 0 ]; then
  echo "⚠️ ADVERTENCIAS: $WARNINGS - Recomendado resolver antes de continuar"
  echo "▶️ Puedes proceder con: npm run dev"
  exit 0
else
  echo "✅ ESTADO PERFECTO - Listo para desarrollo"
  echo "▶️ Ejecuta: npm run dev"
  exit 0
fi 