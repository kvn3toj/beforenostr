#!/bin/bash

# 🤖 Prepare Workspace for Background Agent
# Asegura que el workspace esté limpio para evitar conflictos

echo "🔧 Preparando workspace para Background Agent..."

# 1. Verificar ubicación correcta
EXPECTED_DIR="/Users/kevinp/Movies/GAMIFIER-copy"
CURRENT_DIR=$(pwd)
if [ "$CURRENT_DIR" != "$EXPECTED_DIR" ]; then
  echo "❌ ERROR: Debes ejecutar desde $EXPECTED_DIR"
  echo "📍 Actual: $CURRENT_DIR"
  exit 1
fi

# 2. Verificar rama principal
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "gamifier2.0" ]; then
  echo "⚠️ Cambiando a rama gamifier2.0..."
  git checkout gamifier2.0
fi

# 3. Verificar estado del working directory
if ! git diff --quiet || ! git diff --staged --quiet; then
  echo "⚠️ Hay cambios sin commitear. Creando commit automático..."
  
  # Mostrar cambios
  echo "📋 Cambios detectados:"
  git status --porcelain
  
  # Crear commit automático
  git add .
  TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
  git commit -m "auto: preparación para background agent - $TIMESTAMP

  📝 Commit automático antes de background agent session
  🔄 Cambios preservados para continuidad del trabajo
  ⏰ Timestamp: $TIMESTAMP"
  
  echo "✅ Commit automático creado"
else
  echo "✅ Working directory limpio"
fi

# 4. Verificar servicios críticos (opcional)
echo "🔍 Verificando servicios..."
if curl -s http://localhost:1111/health >/dev/null; then
  echo "✅ Backend (3002) disponible"
else
  echo "ℹ️ Backend (3002) no disponible (normal si no está iniciado)"
fi

if curl -s -I http://localhost:2222 >/dev/null; then
  echo "✅ SuperApp (3001) disponible"
else
  echo "ℹ️ SuperApp (3001) no disponible (normal si no está iniciada)"
fi

# 5. Push opcional para sincronizar
read -p "¿Hacer push a origin/gamifier2.0? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  git push origin gamifier2.0
  echo "✅ Push completado"
fi

echo "🎉 Workspace preparado para Background Agent"
echo "📋 Configuración recomendada:"
echo "   - Repository: kvn3toj/beforenostr"
echo "   - Branch: gamifier2.0"
echo "   - Working Directory: $EXPECTED_DIR" 