#!/bin/bash

# 🌐 Script de Inicio con Acceso de Red - CoomÜnity
# ================================================
# Inicia el ecosistema CoomÜnity configurado para acceso de red local

echo "🌐 CoomÜnity Network Access Setup"
echo "=================================="

# 1. PRE-FLIGHT CHECK
echo "🔍 1. Pre-flight check..."
CURRENT_DIR=$(pwd)
EXPECTED_DIR="/Users/kevinp/Movies/GAMIFIER-copy"

if [ "$CURRENT_DIR" != "$EXPECTED_DIR" ]; then
  echo "❌ ERROR: Ubicación incorrecta"
  echo "📍 Actual: $CURRENT_DIR"
  echo "📍 Esperada: $EXPECTED_DIR"
  exit 1
fi

# 2. DETECTAR IP DE RED
echo "🔍 2. Detectando IP de red..."
NETWORK_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)

if [ -z "$NETWORK_IP" ]; then
  echo "❌ ERROR: No se pudo detectar IP de red"
  exit 1
fi

echo "✅ IP de red detectada: $NETWORK_IP"

# 3. VERIFICAR DEPENDENCIAS CRÍTICAS
echo "🔍 3. Verificando dependencias críticas..."

# PostgreSQL
POSTGRES_STATUS=$(brew services list | grep postgresql@15 | awk '{print $2}')
if [ "$POSTGRES_STATUS" != "started" ]; then
  echo "🔧 Iniciando PostgreSQL..."
  brew services start postgresql@15
  sleep 3
fi

# Redis
REDIS_STATUS=$(brew services list | grep redis | awk '{print $2}')
if [ "$REDIS_STATUS" != "started" ]; then
  echo "🔧 Iniciando Redis..."
  brew services start redis
  sleep 3
fi

# 4. LIMPIAR PROCESOS PREVIOS
echo "🧹 4. Limpiando procesos previos..."
pkill -f "vite" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "turbo" 2>/dev/null || true
sleep 2

# 5. LIBERAR PUERTOS
echo "🔧 5. Liberando puertos..."
lsof -ti:3001,3002,3003,5173 | xargs kill -9 2>/dev/null || true

# 6. MOSTRAR INFORMACIÓN DE RED
echo ""
echo "📋 INFORMACIÓN DE ACCESO:"
echo "========================"
echo "🖥️  Localhost (desarrollo):"
echo "    Frontend: http://localhost:3001"
echo "    Backend:  http://localhost:3002"
echo ""
echo "🌐 Acceso de Red:"
echo "    Frontend: http://$NETWORK_IP:3001"
echo "    Backend:  http://$NETWORK_IP:3002"
echo ""

# 7. INICIAR SERVICIOS
echo "🚀 7. Iniciando servicios..."
echo "Backend en puerto 3002 (con acceso de red)..."

# Iniciar backend en background
npm run dev:backend &
BACKEND_PID=$!

# Esperar a que el backend esté listo
echo "⏳ Esperando que el backend esté listo..."
sleep 8

# Verificar backend
if curl -s http://localhost:3002/health > /dev/null; then
  echo "✅ Backend iniciado correctamente"
else
  echo "❌ ERROR: Backend no responde"
  kill $BACKEND_PID 2>/dev/null
  exit 1
fi

# Iniciar SuperApp
echo "🌐 Iniciando SuperApp en puerto 3001 (con acceso de red)..."
npm run dev:superapp &
SUPERAPP_PID=$!

# Esperar a que SuperApp esté lista
echo "⏳ Esperando que SuperApp esté lista..."
sleep 10

# Verificar SuperApp
if curl -s -I http://localhost:3001 > /dev/null; then
  echo "✅ SuperApp iniciada correctamente"
else
  echo "❌ ERROR: SuperApp no responde"
  kill $BACKEND_PID $SUPERAPP_PID 2>/dev/null
  exit 1
fi

# 8. RESUMEN FINAL
echo ""
echo "🎉 ECOSISTEMA INICIADO EXITOSAMENTE"
echo "==================================="
echo ""
echo "📱 ACCESO DESDE DISPOSITIVOS DE RED:"
echo "   Abre en cualquier dispositivo: http://$NETWORK_IP:3001"
echo ""
echo "🖥️  ACCESO DESDE ESTE EQUIPO:"
echo "   Desarrollo local: http://localhost:3001"
echo ""
echo "🔧 PARA DETENER LOS SERVICIOS:"
echo "   Ctrl+C en esta terminal o ejecuta: pkill -f \"vite\""
echo ""
echo "📊 MONITOREO EN TIEMPO REAL:"
echo "   Backend logs: Visible en esta terminal"
echo "   SuperApp logs: Visible en navegador (F12 > Console)"
echo ""

# Función para limpiar al salir
cleanup() {
  echo "🛑 Deteniendo servicios..."
  kill $BACKEND_PID $SUPERAPP_PID 2>/dev/null
  echo "✅ Servicios detenidos"
  exit 0
}

# Capturar señales para limpieza
trap cleanup SIGINT SIGTERM

# Mantener el script vivo
echo "⏸️  Presiona Ctrl+C para detener todos los servicios"
wait
