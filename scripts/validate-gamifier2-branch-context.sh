#!/bin/bash

echo "🎯 VALIDACIÓN DEL CONTEXTO RAMA GAMIFIER2.0"
echo "============================================="

# Verificar rama actual
CURRENT_BRANCH=$(git branch --show-current)
EXPECTED_BRANCH="gamifier2.0"

echo "1. 🌿 Verificando contexto de rama..."
if [[ "$CURRENT_BRANCH" == "$EXPECTED_BRANCH" ]]; then
    echo "   ✅ Rama correcta: $CURRENT_BRANCH"
else
    echo "   ⚠️  Advertencia: Rama actual ($CURRENT_BRANCH) ≠ esperada ($EXPECTED_BRANCH)"
    echo "   🔧 ¿Deseas cambiar a la rama $EXPECTED_BRANCH? (y/n)"
    read -r response
    if [[ "$response" == "y" ]]; then
        git checkout "$EXPECTED_BRANCH"
        echo "   ✅ Cambiado a rama $EXPECTED_BRANCH"
    else
        echo "   ⚠️  Continuando en rama $CURRENT_BRANCH"
    fi
fi

# Verificar repositorio remoto
echo -e "\n2. 📡 Verificando repositorio remoto..."
REMOTE_URL=$(git remote get-url origin)
if [[ "$REMOTE_URL" == *"beforenostr"* ]]; then
    echo "   ✅ Repositorio correcto: beforenostr"
    echo "   📍 URL: $REMOTE_URL"
else
    echo "   ⚠️  Advertencia: Repositorio remoto no es beforenostr"
    echo "   📍 URL actual: $REMOTE_URL"
fi

# Verificar archivos modificados específicos de gamifier2.0
echo -e "\n3. 📝 Verificando cambios específicos de gamifier2.0..."
MODIFIED_COUNT=$(git status --porcelain | wc -l)
echo "   📊 Archivos modificados: $MODIFIED_COUNT"

if [[ $MODIFIED_COUNT -gt 0 ]]; then
    echo "   📋 Archivos principales modificados:"
    git status --porcelain | head -10 | while read -r line; do
        echo "      $line"
    done
    
    if [[ $MODIFIED_COUNT -gt 10 ]]; then
        echo "      ... y $((MODIFIED_COUNT - 10)) archivos más"
    fi
fi

# Verificar configuración específica del backend NestJS
echo -e "\n4. 🏗️ Verificando configuración backend NestJS..."
if curl -s http://localhost:1111/health >/dev/null 2>&1; then
    echo "   ✅ Backend NestJS disponible en puerto 3002"
    
    # Verificar endpoints específicos de gamifier2.0
    echo "   🔍 Verificando endpoints críticos..."
    
    # Verificar LETS (crítico en gamifier2.0)
    LETS_STATUS=$(curl -s -w "%{http_code}" -o /dev/null http://localhost:1111/lets/ping)
    if [[ $LETS_STATUS -eq 200 ]] || [[ $LETS_STATUS -eq 401 ]]; then
        echo "      ✅ LETS endpoints disponibles"
    else
        echo "      ❌ LETS endpoints no disponibles (status: $LETS_STATUS)"
    fi
    
    # Verificar Marketplace (crítico en gamifier2.0)
    MARKETPLACE_STATUS=$(curl -s -w "%{http_code}" -o /dev/null http://localhost:1111/marketplace/ping)
    if [[ $MARKETPLACE_STATUS -eq 200 ]]; then
        echo "      ✅ Marketplace endpoints disponibles"
    else
        echo "      ❌ Marketplace endpoints no disponibles (status: $MARKETPLACE_STATUS)"
    fi
    
    # Verificar Social (crítico en gamifier2.0)
    SOCIAL_STATUS=$(curl -s -w "%{http_code}" -o /dev/null http://localhost:1111/social/publications)
    if [[ $SOCIAL_STATUS -eq 200 ]]; then
        echo "      ✅ Social endpoints disponibles"
    else
        echo "      ❌ Social endpoints no disponibles (status: $SOCIAL_STATUS)"
    fi
    
else
    echo "   ❌ Backend NestJS no disponible"
    echo "   🔧 Ejecuta: npm run dev:backend"
fi

# Verificar SuperApp frontend
echo -e "\n5. 🎨 Verificando SuperApp frontend..."
if curl -s -I http://localhost:2222 >/dev/null 2>&1; then
    echo "   ✅ SuperApp disponible en puerto 3001"
else
    echo "   ❌ SuperApp no disponible"
    echo "   🔧 Ejecuta: npm run dev:superapp"
fi

# Verificar archivos específicos de la integración gamifier2.0
echo -e "\n6. 🔗 Verificando archivos de integración específicos..."

INTEGRATION_FILES=(
    "Demo/apps/superapp-unified/src/hooks/analytics/useDashboardAnalytics.ts"
    "Demo/apps/superapp-unified/src/hooks/useLetsIntegration.ts"
    "Demo/apps/superapp-unified/src/services/analytics.service.ts"
    "Demo/apps/superapp-unified/src/lib/lets-backend-service.ts"
    "Demo/apps/superapp-unified/src/lib/api-service.ts"
)

for file in "${INTEGRATION_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file (faltante)"
    fi
done

# Generar reporte específico para gamifier2.0
echo -e "\n7. 📊 Generando reporte específico gamifier2.0..."

# Verificar últimos commits específicos
RECENT_COMMITS=$(git log --oneline --since="3 days ago" | wc -l)
echo "   📈 Commits recientes (3 días): $RECENT_COMMITS"

if [[ $RECENT_COMMITS -gt 0 ]]; then
    echo "   🔍 Últimos commits relevantes:"
    git log --oneline --since="3 days ago" | head -5 | while read -r commit; do
        echo "      • $commit"
    done
fi

# Verificar si hay conflictos o issues específicos
echo -e "\n8. ⚠️ Verificando posibles conflictos..."

# Verificar conflictos de merge
if git status | grep -q "Unmerged paths\|both modified"; then
    echo "   ❌ Conflictos de merge detectados"
    echo "   🔧 Resuelve conflictos antes de continuar"
else
    echo "   ✅ No hay conflictos de merge"
fi

# Verificar dependencias críticas
echo -e "\n9. 📦 Verificando dependencias críticas..."
cd Demo/apps/superapp-unified/

# Verificar React Query (crítico para integración)
if npm ls @tanstack/react-query >/dev/null 2>&1; then
    echo "   ✅ React Query instalado"
else
    echo "   ❌ React Query no instalado"
fi

# Verificar Material UI (crítico para Design System)
if npm ls @mui/material >/dev/null 2>&1; then
    echo "   ✅ Material UI instalado"
else
    echo "   ❌ Material UI no instalado"
fi

# Verificar Playwright (crítico para testing)
if npm ls @playwright/test >/dev/null 2>&1; then
    echo "   ✅ Playwright instalado"
else
    echo "   ❌ Playwright no instalado"
fi

cd ../../../

# Resumen y recomendaciones específicas para gamifier2.0
echo -e "\n📋 RESUMEN PARA RAMA GAMIFIER2.0:"
echo "=================================="

echo "🎯 PRIORIDADES ESPECÍFICAS GAMIFIER2.0:"
echo "   1. 💰 LETS Integration - Sistema de intercambio de valor"
echo "   2. 🛒 Marketplace - Plataforma de productos/servicios" 
echo "   3. 👥 Social - Interacciones comunitarias"
echo "   4. 📊 Analytics - Métricas y dashboard"
echo "   5. 🎮 UStats - Estadísticas gamificadas"

echo -e "\n🔄 ESTRATEGIA DE INTEGRACIÓN RECOMENDADA:"
echo "   Fase 1: Conectar frontend con endpoints backend EXISTENTES (80%)"
echo "   Fase 2: Implementar solo endpoints analytics faltantes (20%)"

echo -e "\n🚀 PRÓXIMOS PASOS ESPECÍFICOS:"
echo "   1. Ejecutar agente Slack actualizado para gamifier2.0"
echo "   2. Conectar useLetsIntegration con endpoints LETS existentes"
echo "   3. Configurar autenticación JWT en todas las requests"
echo "   4. Verificar flujo completo de datos backend → frontend"

echo -e "\n✅ Validación completada para rama gamifier2.0" 