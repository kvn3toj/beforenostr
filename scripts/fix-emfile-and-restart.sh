#!/bin/bash

# 🚨 SCRIPT DE EMERGENCIA - FIX EMFILE ERROR Y RESTART SUPERAPP
# =================================================================
# Este script resuelve errores "EMFILE: too many open files" en la SuperApp CoomÜnity
# Fecha: 19 Junio 2025

set -e  # Exit on any error

echo "🚨 INICIANDO RESOLUCIÓN DE EMFILE ERROR..."
echo "================================================"

# 1. VERIFICAR UBICACIÓN CORRECTA
EXPECTED_DIR="/Users/kevinp/Movies/GAMIFIER-copy"
CURRENT_DIR=$(pwd)

if [ "$CURRENT_DIR" != "$EXPECTED_DIR" ]; then
  echo "❌ ERROR: Ubicación incorrecta"
  echo "📍 Actual: $CURRENT_DIR"
  echo "📍 Esperada: $EXPECTED_DIR"
  echo "🔧 Ejecuta: cd '$EXPECTED_DIR'"
  exit 1
fi

echo "✅ Ubicación correcta verificada: $CURRENT_DIR"

# 2. VERIFICAR DEPENDENCIAS CRÍTICAS
echo ""
echo "🗄️ VERIFICANDO DEPENDENCIAS CRÍTICAS..."
echo "========================================="

# PostgreSQL
POSTGRES_STATUS=$(brew services list | grep postgresql@15 | awk '{print $2}')
if [ "$POSTGRES_STATUS" != "started" ]; then
  echo "❌ ERROR: PostgreSQL no está ejecutándose"
  echo "🔧 Iniciando PostgreSQL..."
  brew services start postgresql@15
  sleep 3
else
  echo "✅ PostgreSQL ejecutándose"
fi

# Redis
REDIS_STATUS=$(brew services list | grep redis | awk '{print $2}')
if [ "$REDIS_STATUS" != "started" ]; then
  echo "❌ ERROR: Redis no está ejecutándose"
  echo "🔧 Iniciando Redis..."
  brew services start redis
  sleep 3
else
  echo "✅ Redis ejecutándose"
fi

# 3. LIMPIEZA AGRESIVA DE PROCESOS
echo ""
echo "🧹 LIMPIEZA COMPLETA DE PROCESOS..."
echo "==================================="

# Matar procesos específicos que pueden causar EMFILE
echo "🔫 Eliminando procesos problemáticos..."

# Playwright test servers
pkill -f "playwright.*test-server" 2>/dev/null && echo "   ✅ Playwright test servers eliminados" || echo "   ℹ️ No hay test servers activos"

# Vite dev servers
pkill -f "vite.*dev" 2>/dev/null && echo "   ✅ Vite dev servers eliminados" || echo "   ℹ️ No hay vite dev servers activos"

# General vite processes
pkill -f "vite" 2>/dev/null && echo "   ✅ Procesos Vite eliminados" || echo "   ℹ️ No hay procesos vite activos"

# npm run dev processes
pkill -f "npm run dev" 2>/dev/null && echo "   ✅ npm run dev eliminados" || echo "   ℹ️ No hay npm run dev activos"

# turbo processes
pkill -f "turbo" 2>/dev/null && echo "   ✅ Procesos turbo eliminados" || echo "   ℹ️ No hay procesos turbo activos"

# 4. LIBERACIÓN AGRESIVA DE PUERTOS
echo ""
echo "🔧 LIBERANDO PUERTOS OCUPADOS..."
echo "================================="

PORTS_TO_CLEAR="3000 3001 3003 5173 4173"
for port in $PORTS_TO_CLEAR; do
  PID=$(lsof -ti:$port 2>/dev/null)
  if [ ! -z "$PID" ]; then
    kill -9 $PID 2>/dev/null && echo "   ✅ Puerto $port liberado (PID: $PID)" || echo "   ⚠️ No se pudo liberar puerto $port"
  else
    echo "   ℹ️ Puerto $port ya está libre"
  fi
done

# 5. LIMPIEZA COMPLETA DE CACHÉS VITE
echo ""
echo "🗑️ LIMPIEZA COMPLETA DE CACHÉS..."
echo "================================="

cd Demo/apps/superapp-unified/

# Eliminar todos los cachés de Vite
rm -rf node_modules/.vite && echo "   ✅ node_modules/.vite eliminado"
rm -rf dist && echo "   ✅ dist/ eliminado"
rm -rf .vite && echo "   ✅ .vite/ eliminado"

# Limpiar cachés de npm
npm cache clean --force 2>/dev/null && echo "   ✅ npm cache limpiado" || echo "   ⚠️ Error limpiando npm cache"

# 6. VERIFICAR ESTADO DEL SISTEMA
echo ""
echo "📊 VERIFICANDO ESTADO DEL SISTEMA..."
echo "===================================="

# File descriptors abiertos
OPEN_FDS=$(lsof -n | wc -l | tr -d ' ')
FD_LIMIT=$(ulimit -n)
echo "📁 File descriptors abiertos: $OPEN_FDS / $FD_LIMIT"

if [ $OPEN_FDS -gt 8000 ]; then
  echo "⚠️ ADVERTENCIA: Muchos file descriptors abiertos ($OPEN_FDS)"
else
  echo "✅ File descriptors en rango normal"
fi

# 7. VERIFICAR BACKEND
echo ""
echo "🔍 VERIFICANDO BACKEND..."
echo "========================="

BACKEND_HEALTH=$(curl -s http://localhost:3002/health | jq -r '.status' 2>/dev/null || echo "error")
if [ "$BACKEND_HEALTH" = "ok" ]; then
  echo "✅ Backend NestJS operacional (puerto 3002)"
else
  echo "❌ Backend no responde - necesita revisión"
  echo "💡 Comando: cd /Users/kevinp/Movies/GAMIFIER-copy && npm run start:backend:dev"
fi

# 8. ESPERAR Y REINICIAR SUPERAPP
echo ""
echo "🚀 INICIANDO SUPERAPP..."
echo "========================"

# Esperar que el sistema se estabilice
echo "⏱️ Esperando estabilización del sistema (5 segundos)..."
sleep 5

# Verificar workspace name correcto
WORKSPACE_NAME=$(grep '"name"' package.json | head -1 | sed 's/.*"name": "\([^"]*\)".*/\1/')
echo "📦 Workspace detectado: $WORKSPACE_NAME"

# Volver a la raíz del monorepo
cd /Users/kevinp/Movies/GAMIFIER-copy

# Iniciar SuperApp con configuración optimizada
echo "🎯 Iniciando SuperApp con configuración anti-EMFILE..."
echo ""
echo "COMANDO: npm run dev --workspace=$WORKSPACE_NAME"
echo ""
echo "📋 MONITOREO:"
echo "   - Si ves errores EMFILE, presiona Ctrl+C inmediatamente"
echo "   - Los primeros logs deben mostrar 'Local packages in node_modules/.vite'"
echo "   - El puerto debe ser 3001"
echo "   - Si funciona, verás 'Local: http://localhost:3001/'"
echo ""

# Ejecutar con variables de entorno optimizadas para EMFILE
NODE_OPTIONS="--max-old-space-size=4096" npm run dev --workspace=$WORKSPACE_NAME

echo ""
echo "�� SCRIPT COMPLETADO"
