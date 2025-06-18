#!/bin/bash

# 🚀 CoomÜnity - Script de Inicio Completo del Ecosistema
# Orquesta backend independiente + frontends via Turborepo

set -e  # Salir en caso de error

echo "🎯 Iniciando ecosistema CoomÜnity..."

# 🔍 Pre-flight check
echo "🔍 Ejecutando pre-flight check..."

# Verificar ubicación
CURRENT_DIR=$(pwd)
EXPECTED_DIR="/Users/kevinp/Movies/GAMIFIER-copy"
if [ "$CURRENT_DIR" != "$EXPECTED_DIR" ]; then
  echo "❌ ERROR: Ubicación incorrecta"
  echo "📍 Actual: $CURRENT_DIR"
  echo "📍 Esperada: $EXPECTED_DIR"
  echo "🔧 Ejecuta: cd '$EXPECTED_DIR'"
  exit 1
fi

# Verificar PostgreSQL
echo "🗄️ Verificando PostgreSQL..."
POSTGRES_STATUS=$(brew services list | grep postgresql@15 | awk '{print $2}')
if [ "$POSTGRES_STATUS" != "started" ]; then
  echo "❌ PostgreSQL no está ejecutándose. Iniciando..."
  brew services start postgresql@15
  sleep 3
fi

# Limpiar procesos conflictivos
echo "🧹 Limpiando procesos conflictivos..."
pkill -f "vite" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "tsx" 2>/dev/null || true
sleep 2

# Limpiar puertos
echo "🔧 Liberando puertos..."
lsof -ti:3001,3002,3003,5173 | xargs kill -9 2>/dev/null || true

echo "✅ Pre-flight check completado"

# 🚀 Iniciar servicios
echo ""
echo "🚀 Iniciando servicios..."

# Función para manejar la terminación
cleanup() {
    echo ""
    echo "🛑 Deteniendo servicios..."
    pkill -f "tsx" 2>/dev/null || true
    pkill -f "vite" 2>/dev/null || true
    pkill -f "turbo" 2>/dev/null || true
    echo "✅ Servicios detenidos"
    exit 0
}

# Capturar señales de terminación
trap cleanup SIGINT SIGTERM

# Iniciar backend en background
echo "🔧 Iniciando backend NestJS..."
npm run dev:backend &
BACKEND_PID=$!

# Esperar un poco para que el backend inicie
sleep 5

# Verificar que el backend esté respondiendo
echo "🔍 Verificando backend..."
for i in {1..10}; do
    if curl -s http://localhost:1111/health > /dev/null; then
        echo "✅ Backend respondiendo en puerto 3002"
        break
    fi
    if [ $i -eq 10 ]; then
        echo "❌ Backend no responde después de 10 intentos"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
    echo "⏳ Esperando backend... (intento $i/10)"
    sleep 2
done

# Iniciar frontends con Turborepo
echo "🎨 Iniciando frontends..."
turbo run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 ¡Ecosistema CoomÜnity iniciado exitosamente!"
echo ""
echo "📋 Servicios disponibles:"
echo "🔧 Backend NestJS:     http://localhost:1111"
echo "🎯 SuperApp:           http://localhost:2222"
echo "⚙️ Admin Frontend:     http://localhost:3333"
echo ""
echo "💡 Presiona Ctrl+C para detener todos los servicios"

# Esperar a que terminen los procesos
wait $BACKEND_PID $FRONTEND_PID 