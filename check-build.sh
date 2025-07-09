#!/bin/bash

# Script de validación para git bisect
# Detecta si un commit permite que el backend compile y ejecute correctamente

set -e  # Salir en caso de error

echo "🔍 [CRONOS] Iniciando validación del commit $(git rev-parse --short HEAD)"

# Navegar al directorio del backend
cd backend

echo "🧹 [CRONOS] Limpiando entorno..."
rm -rf dist node_modules
rm -f build.log server.log

echo "📦 [CRONOS] Instalando dependencias..."
npm install --silent --no-progress > /dev/null 2>&1

if [ $? -ne 0 ]; then
  echo "❌ [CRONOS] Error al instalar dependencias. Commit es MALO."
  exit 1
fi

echo "🔨 [CRONOS] Compilando proyecto..."
npm run build > build.log 2>&1

# Verificar si la compilación fue exitosa
if [ $? -ne 0 ]; then
  echo "❌ [CRONOS] Error de compilación. Commit es MALO."
  cat build.log
  exit 1
fi

# Verificar que el archivo main.js existe
if [ ! -f "dist/backend/src/main.js" ]; then
  echo "❌ [CRONOS] Archivo dist/backend/src/main.js no encontrado. Commit es MALO."
  echo "📁 [CRONOS] Contenido de dist/:"
  ls -la dist/ || echo "Directorio dist/ no existe"
  echo "📁 [CRONOS] Contenido de dist/backend/:"
  ls -la dist/backend/ || echo "Directorio dist/backend/ no existe"
  exit 1
fi

echo "🚀 [CRONOS] Iniciando servidor en segundo plano..."
timeout 30 npm run start:prod > server.log 2>&1 &
SERVER_PID=$!

# Darle tiempo al servidor para iniciar
echo "⏳ [CRONOS] Esperando inicio del servidor..."
sleep 10

echo "🩺 [CRONOS] Verificando salud del servidor..."
# Usar curl para verificar si el servidor responde
if curl -s --max-time 5 http://localhost:3002/health | grep -q "ok\|OK\|running"; then
  echo "✅ [CRONOS] Servidor OK. Commit es BUENO."
  kill $SERVER_PID 2>/dev/null || true
  exit 0
else
  echo "❌ [CRONOS] Servidor no respondió. Commit es MALO."
  echo "📋 [CRONOS] Log del servidor:"
  cat server.log
  kill $SERVER_PID 2>/dev/null || true
  exit 1
fi
