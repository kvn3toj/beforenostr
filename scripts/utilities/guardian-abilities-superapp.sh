#!/bin/bash

# 🛡️ Script de Habilidades Evolucionadas de los Guardianes con ANA - Contexto SuperApp
# Este script simula las acciones de los Guardianes en el desarrollo del proyecto CoomÜnity,
# aplicando las habilidades definidas en NARRATIVA/06_SINFONIAS_FUTURAS/GUARDIANES_HABILIDADES_EVOLUCIONADAS.md
# y adaptado al contexto de la SuperApp y el Backend NestJS.

echo "🚀 Iniciando Protocolo de Habilidades de Guardianes para SuperApp..."

# --- OBLIGATORIO: PROTOCOLO PRE-FLIGHT CHECK ---
# Asegura que el entorno esté limpio y las dependencias críticas funcionando.

echo "🔍 INICIANDO PRE-FLIGHT CHECK CRÍTICO..."

# 1. VERIFICAR UBICACIÓN CORRECTA
CURRENT_DIR=$(pwd)
EXPECTED_DIR="/Users/kevinp/Movies/GAMIFIER-copy"
if [ "$CURRENT_DIR" != "$EXPECTED_DIR" ]; then
  echo "❌ ERROR: Ubicación incorrecta"
  echo "📍 Actual: $CURRENT_DIR"
  echo "📍 Esperada: $EXPECTED_DIR"
  echo "🔧 Ejecuta: cd '$EXPECTED_DIR'"
  exit 1
fi
echo "✅ Ubicación correcta verificada"

# 2. VERIFICAR DEPENDENCIAS CRÍTICAS DEL BACKEND
echo "🗄️ Verificando PostgreSQL..."
POSTGRES_STATUS=$(brew services list | grep postgresql@15 | awk '{print $2}')
if [ "$POSTGRES_STATUS" != "started" ]; then
  echo "❌ ERROR: PostgreSQL no está ejecutándose"
  echo "🔧 Ejecutando: brew services start postgresql@15"
  brew services start postgresql@15
  sleep 3
fi

# Verificar conectividad PostgreSQL
POSTGRES_RUNNING=$(lsof -i :5432 | grep LISTEN | wc -l)
if [ $POSTGRES_RUNNING -eq 0 ]; then
  echo "❌ ERROR: PostgreSQL no está escuchando en puerto 5432"
  echo "🔧 Reiniciando PostgreSQL..."
  brew services restart postgresql@15
  sleep 5
else
  echo "✅ PostgreSQL ejecutándose en puerto 5432"
fi

echo "🔧 Verificando Redis..."
REDIS_STATUS=$(brew services list | grep redis | awk '{print $2}')
if [ "$REDIS_STATUS" != "started" ]; then
  echo "❌ ERROR: Redis no está ejecutándose"
  echo "🔧 Ejecutando: brew services start redis"
  brew services start redis
  sleep 3
fi

# Verificar conectividad Redis
REDIS_RUNNING=$(lsof -i :6379 | grep LISTEN | wc -l)
if [ $REDIS_RUNNING -eq 0 ]; then
  echo "❌ ERROR: Redis no está escuchando en puerto 6379"
  echo "🔧 Reiniciando Redis..."
  brew services restart redis
  sleep 3
else
  echo "✅ Redis ejecutándose en puerto 6379"
fi

# 3. LIMPIAR PROCESOS MÚLTIPLES
echo "🧹 Limpiando procesos múltiples..."
pkill -f "vite" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "turbo" 2>/dev/null || true
sleep 2

# 4. VERIFICAR LIMPIEZA DE PROCESOS
RUNNING_PROCESSES=$(ps aux | grep -E "(vite|npm run dev)" | grep -v grep | wc -l)
if [ $RUNNING_PROCESSES -gt 0 ]; then
  echo "⚠️ ADVERTENCIA: Procesos aún ejecutándose:"
  ps aux | grep -E "(vite|npm run dev)" | grep -v grep
fi

# 5. LIMPIAR PUERTOS OCUPADOS
echo "🔧 Liberando puertos ocupados..."
lsof -ti:3000,3001,3002,3003,5173 | xargs kill -9 2>/dev/null || true

# 6. VERIFICAR CONFIGURACIÓN DE PUERTOS
echo "📋 Verificando configuración de puertos..."
if [ -f "Demo/apps/superapp-unified/.env" ]; then
  SUPERAPP_PORT=$(grep VITE_BASE_URL Demo/apps/superapp-unified/.env | cut -d':' -f3 | cut -d'/' -f1)
  if [ "$SUPERAPP_PORT" != "3001" ]; then
    echo "⚠️ ADVERTENCIA: Puerto SuperApp no es 3001 (actual: $SUPERAPP_PORT)"
  fi
fi

# 7. VERIFICAR TURBOREPO LOCAL
echo "🔧 Verificando Turborepo local..."
TURBO_LOCAL=$(npm ls turbo 2>/dev/null | grep turbo@ | cut -d@ -f2)
if [ -z "$TURBO_LOCAL" ]; then
  echo "⚠️ RECOMENDADO: Instalar Turborepo localmente"
  echo "🔧 Ejecuta: npm install turbo --save-dev --legacy-peer-deps"
else
  echo "✅ Turborepo local: v$TURBO_LOCAL"
fi

# 8. VERIFICAR DEPENDENCIAS CRÍTICAS DE LA SUPERAPP
echo "📦 Verificando dependencias críticas de la SuperApp..."
cd Demo/apps/superapp-unified/
npm ls @sentry/react >/dev/null 2>&1 || echo "⚠️ FALTA: @sentry/react"
npm ls web-vitals >/dev/null 2>&1 || echo "⚠️ FALTA: web-vitals"
npm ls @playwright/test >/dev/null 2>&1 || echo "⚠️ FALTA: @playwright/test"
cd ../../../

# 9. VERIFICAR SERVICIOS CON DEPENDENCIA DE BD
echo "🌐 Verificando servicios disponibles..."
echo "🗄️ Verificando backend con PostgreSQL..."
curl -s http://localhost:3002/health >/dev/null && echo "✅ Backend (3002) disponible" || echo "⚠️ Backend (3002) no disponible - verificar PostgreSQL"
curl -s -I http://localhost:3001 >/dev/null && echo "✅ SuperApp (3001) disponible" || echo "ℹ️ SuperApp (3001) no iniciada"

echo "🏁 PRE-FLIGHT CHECK COMPLETADO"
echo "---------------------------------"

# --- SIMULACIÓN DE HABILIDADES DE GUARDIANES EN CONTEXTO SUPERAPP ---

# 1. Phoenix – Guardian del Código + ANA
echo "\n🔥 Phoenix (Guardian del Código) y ANA (Curadora Cósmica) en acción:"
echo "🔎 Consultando a ANA para contexto histórico de un módulo crítico (ej. Marketplace):"
# Simula buscar historial de cambios en el módulo de marketplace en el backend
git log --oneline backend/src/marketplace/

echo "📚 ANA sugiere revisar documentación relevante para refactorización:"
# Simula consultar documentación relevante sobre refactorización
cat docs/development/practices/CLEAN_CODE_GUIDELINES.md 2>/dev/null || echo "Documento CLEAN_CODE_GUIDELINES.md no encontrado. Asegúrate de que exista."

# 2. Aria – Guardiana de la Experiencia (UX/UI) + ANA
echo "\n✨ Aria (Guardiana de la Experiencia) y ANA (Curadora Cósmica) en acción:"
echo "📊 Accediendo a análisis de ANA sobre patrones de uso en la SuperApp (ej. UPlay):"
# Simula analizar patrones de uso en la UI de UPlay
cat Demo/apps/superapp-unified/docs/analysis/UPLAY_USER_FLOW_ANALYSIS.MD 2>/dev/null || echo "Documento UPLAY_USER_FLOW_ANALYSIS.MD no encontrado. Asegúrate de que exista."

echo "💡 ANA sugiere mejoras de accesibilidad en los componentes de la SuperApp (Ej. Botones):"
# Simula buscar recomendaciones de accesibilidad [[memory:6998341476761920864]]
cat docs/accessibility/ACCESSIBILITY_FINDINGS.md 2>/dev/null || echo "Documento ACCESSIBILITY_FINDINGS.md no encontrado. Asegúrate de que exista."

# 3. Sage – Guardian de la Economía (Lükas, Méritos) + ANA
echo "\n💰 Sage (Guardian de la Economía) y ANA (Curadora Cósmica) en acción:"
echo "📈 Consultando a ANA para analizar el impacto de cambios en la economía interna (ej. Méritos):"
# Simula analizar el impacto de cambios en los méritos en el backend
grep -r "merit" backend/src/merits-and-wallet/ 2>/dev/null || echo "No se encontraron referencias a méritos en el módulo. Asegúrate de que exista el módulo."

echo "🚨 ANA alerta sobre efectos colaterales en módulos interrelacionados (ej. Social):"
# Simula buscar dependencias con el módulo social
grep -r "social" backend/src/merits-and-wallet/ 2>/dev/null || echo "No se encontraron dependencias con el módulo social. Asegúrate de que existan."

# 4. Atlas – Guardian de la Integración y QA + ANA
echo "\n🛠️ Atlas (Guardian de la Integración y QA) y ANA (Curadora Cósmica) en acción:"
echo "🐛 Recibiendo recomendaciones de ANA sobre áreas críticas para testing (ej. E2E de SuperApp):"
# Simula buscar reportes de tests E2E de la SuperApp
cat Demo/apps/superapp-unified/tests/e2e/marketplace-creation-flow.spec.ts 2>/dev/null || echo "Archivo marketplace-creation-flow.spec.ts no encontrado. Asegúrate de que exista."

echo "📊 ANA provee resúmenes del estado de cobertura y sugerencias de mejora:"
# Simula buscar un reporte de cobertura de tests (si existiera)
cat docs/testing/COMPONENT_TESTING_SUMMARY.md 2>/dev/null || echo "Documento COMPONENT_TESTING_SUMMARY.md no encontrado. Asegúrate de que exista."

# 5. CIO – Agente Guardian Orquestador + ANA
echo "\n👑 CIO (Agente Guardian Orquestador) y ANA (Curadora Cósmica) en acción:"
echo "📋 Orquestando la colaboración y tomando decisiones informadas con ANA:"
# Simula obtener resumen de reportes clave de ANA
cat NARRATIVA/06_SINFONIAS_FUTURAS/GUARDIANES_HABILIDADES_EVOLUCIONADAS.md | grep "Anexo: Resumen Manual de Recomendaciones y Reportes Clave de ANA" -A 15

echo "🏁 Finalizado el Protocolo de Habilidades de Guardianes para SuperApp."
