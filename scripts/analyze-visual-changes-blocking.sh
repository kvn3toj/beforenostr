#!/bin/bash

# ================================================================
# 🔍 ANÁLISIS DE BLOQUEOS DE CAMBIOS VISUALES - COOMUNITY SUPERAPP
# ================================================================
# Investigación de por qué los cambios del Design System Cosmic 
# no se reflejan correctamente en la aplicación
# Fecha: $(date '+%Y-%m-%d %H:%M:%S')

echo "🔍 INICIANDO ANÁLISIS DE BLOQUEOS VISUALES..."
echo "================================================"

# 1. VERIFICAR CONFIGURACIÓN DE VARIABLES DE ENTORNO
echo ""
echo "1️⃣ VERIFICANDO CONFIGURACIÓN DE ENTORNO..."
echo "-------------------------------------------"

FORCE_YOUTUBE=$(grep "VITE_FORCE_YOUTUBE_VIDEOS" Demo/apps/superapp-unified/.env | cut -d'=' -f2)
MOCK_AUTH=$(grep "VITE_ENABLE_MOCK_AUTH" Demo/apps/superapp-unified/.env | cut -d'=' -f2)
BUILDER_KEY=$(grep "VITE_PUBLIC_BUILDER_KEY" Demo/apps/superapp-unified/.env | cut -d'=' -f2)

echo "✅ VITE_FORCE_YOUTUBE_VIDEOS: $FORCE_YOUTUBE"
echo "✅ VITE_ENABLE_MOCK_AUTH: $MOCK_AUTH"
echo "✅ VITE_PUBLIC_BUILDER_KEY: ${BUILDER_KEY:0:20}..."

if [ "$FORCE_YOUTUBE" = "true" ]; then
    echo "🚨 PROBLEMA DETECTADO: VITE_FORCE_YOUTUBE_VIDEOS=true fuerza datos mock"
    FORCE_YOUTUBE_ISSUE=true
else
    echo "✅ VITE_FORCE_YOUTUBE_VIDEOS está deshabilitado correctamente"
    FORCE_YOUTUBE_ISSUE=false
fi

# 2. VERIFICAR DETECCIÓN DE BUILDER.IO
echo ""
echo "2️⃣ VERIFICANDO DETECCIÓN DE BUILDER.IO..."
echo "------------------------------------------"

BUILDER_REFERENCES=$(find Demo/apps/superapp-unified/src -name "*.ts" -o -name "*.tsx" | xargs grep -l "builder\.io\|Builder\.io" | wc -l)
echo "📁 Archivos con referencias a Builder.io: $BUILDER_REFERENCES"

if [ $BUILDER_REFERENCES -gt 0 ]; then
    echo "🔍 Archivos problemáticos:"
    find Demo/apps/superapp-unified/src -name "*.ts" -o -name "*.tsx" | xargs grep -l "builder\.io\|Builder\.io" | head -5
    BUILDER_ISSUE=true
else
    echo "✅ No hay referencias problemáticas a Builder.io"
    BUILDER_ISSUE=false
fi

# 3. ANALIZAR DATOS MOCK EN USTATS
echo ""
echo "3️⃣ ANALIZANDO DATOS MOCK EN USTATS..."
echo "-------------------------------------"

USTATS_MAIN="Demo/apps/superapp-unified/src/components/modules/ustats/UStatsMain.tsx"
if [ -f "$USTATS_MAIN" ]; then
    MOCK_DATA_LINES=$(grep -n "const.*Data.*=" $USTATS_MAIN | wc -l)
    echo "📊 Líneas con datos mock en UStatsMain: $MOCK_DATA_LINES"
    
    echo "🔍 Tipos de datos mock encontrados:"
    grep -n "const.*Data.*=" $USTATS_MAIN | head -10 | sed 's/^/   /'
    
    HARDCODED_CHARTS=$(grep -c "barChartData\|pieChartData\|heatMapData" $USTATS_MAIN)
    echo "📈 Gráficos con datos hardcodeados: $HARDCODED_CHARTS"
    
    if [ $HARDCODED_CHARTS -gt 0 ]; then
        echo "🚨 PROBLEMA CRÍTICO: UStats usa datos completamente hardcodeados"
        USTATS_ISSUE=true
    else
        echo "✅ UStats no tiene datos hardcodeados"
        USTATS_ISSUE=false
    fi
else
    echo "❌ No se encontró el archivo UStatsMain.tsx"
    USTATS_ISSUE=true
fi

# 4. VERIFICAR HOOKS DE DATOS REALES
echo ""
echo "4️⃣ VERIFICANDO HOOKS DE DATOS REALES..."
echo "---------------------------------------"

REAL_DATA_HOOKS=$(find Demo/apps/superapp-unified/src/hooks -name "*Real*" -o -name "*Backend*" | wc -l)
echo "🎣 Hooks de datos reales encontrados: $REAL_DATA_HOOKS"

if [ -f "Demo/apps/superapp-unified/src/hooks/useRealBackendData.ts" ]; then
    BUILDER_CHECKS=$(grep -c "builder\.io\|Builder\.io" Demo/apps/superapp-unified/src/hooks/useRealBackendData.ts)
    echo "🏗️ Verificaciones de Builder.io en useRealBackendData: $BUILDER_CHECKS"
    
    if [ $BUILDER_CHECKS -gt 0 ]; then
        echo "🚨 PROBLEMA: Hook de datos reales tiene lógica de Builder.io que puede bloquear datos"
        HOOK_ISSUE=true
    else
        echo "✅ Hook de datos reales no tiene interferencias"
        HOOK_ISSUE=false
    fi
else
    echo "❌ No se encontró useRealBackendData.ts"
    HOOK_ISSUE=true
fi

# 5. VERIFICAR INTEGRACIÓN DE DESIGN SYSTEM
echo ""
echo "5️⃣ VERIFICANDO INTEGRACIÓN DE DESIGN SYSTEM..."
echo "----------------------------------------------"

COSMIC_IMPORTS=$(find Demo/apps/superapp-unified/src -name "*.tsx" | xargs grep -l "CosmicCard\|RevolutionaryWidget" | wc -l)
echo "🌌 Archivos que usan componentes Cosmic: $COSMIC_IMPORTS"

DESIGN_SYSTEM_INDEX="Demo/apps/superapp-unified/src/design-system/index.ts"
if [ -f "$DESIGN_SYSTEM_INDEX" ]; then
    COSMIC_EXPORTS=$(grep -c "CosmicCard\|RevolutionaryWidget" $DESIGN_SYSTEM_INDEX)
    echo "📦 Exportaciones Cosmic en design-system: $COSMIC_EXPORTS"
    
    if [ $COSMIC_EXPORTS -gt 0 ]; then
        echo "✅ Design System exporta componentes Cosmic correctamente"
        DESIGN_SYSTEM_ISSUE=false
    else
        echo "🚨 PROBLEMA: Design System no exporta componentes Cosmic"
        DESIGN_SYSTEM_ISSUE=true
    fi
else
    echo "❌ No se encontró el índice del Design System"
    DESIGN_SYSTEM_ISSUE=true
fi

# 6. VERIFICAR ESTADO DE SERVICIOS
echo ""
echo "6️⃣ VERIFICANDO ESTADO DE SERVICIOS..."
echo "------------------------------------"

# Backend check
if curl -s http://localhost:1111/health > /dev/null 2>&1; then
    echo "✅ Backend está ejecutándose en puerto 3002"
    BACKEND_ISSUE=false
else
    echo "🚨 PROBLEMA: Backend no responde en puerto 3002"
    BACKEND_ISSUE=true
fi

# Frontend check
if curl -s http://localhost:2222 > /dev/null 2>&1; then
    echo "✅ SuperApp está ejecutándose en puerto 3001"
    FRONTEND_ISSUE=false
else
    echo "🚨 PROBLEMA: SuperApp no responde en puerto 3001"
    FRONTEND_ISSUE=true
fi

# 7. RESUMEN DE PROBLEMAS ENCONTRADOS
echo ""
echo "📋 RESUMEN DE ANÁLISIS..."
echo "========================"

TOTAL_ISSUES=0

if [ "$FORCE_YOUTUBE_ISSUE" = "true" ]; then
    echo "❌ CONFIGURACIÓN: Variable VITE_FORCE_YOUTUBE_VIDEOS fuerza datos mock"
    ((TOTAL_ISSUES++))
fi

if [ "$BUILDER_ISSUE" = "true" ]; then
    echo "❌ BUILDER.IO: Detección automática interfiere con datos reales"
    ((TOTAL_ISSUES++))
fi

if [ "$USTATS_ISSUE" = "true" ]; then
    echo "❌ USTATS: Datos completamente hardcodeados en componente principal"
    ((TOTAL_ISSUES++))
fi

if [ "$HOOK_ISSUE" = "true" ]; then
    echo "❌ HOOKS: Lógica de Builder.io bloquea datos del backend"
    ((TOTAL_ISSUES++))
fi

if [ "$DESIGN_SYSTEM_ISSUE" = "true" ]; then
    echo "❌ DESIGN SYSTEM: Componentes Cosmic no están bien exportados"
    ((TOTAL_ISSUES++))
fi

if [ "$BACKEND_ISSUE" = "true" ]; then
    echo "❌ SERVICIOS: Backend no está disponible"
    ((TOTAL_ISSUES++))
fi

if [ "$FRONTEND_ISSUE" = "true" ]; then
    echo "❌ SERVICIOS: Frontend no está disponible"
    ((TOTAL_ISSUES++))
fi

echo ""
echo "🎯 TOTAL DE PROBLEMAS DETECTADOS: $TOTAL_ISSUES"
echo ""

# 8. RECOMENDACIONES DE SOLUCIÓN
echo "💡 RECOMENDACIONES DE SOLUCIÓN..."
echo "================================="

if [ "$USTATS_ISSUE" = "true" ]; then
    echo "1️⃣ ALTA PRIORIDAD - UStats Hardcoded Data:"
    echo "   • Reemplazar datos mock estáticos con hooks de datos reales"
    echo "   • Integrar useRealBackendData para métricas dinámicas"
    echo "   • Mantener datos mock solo como fallback"
    echo ""
fi

if [ "$BUILDER_ISSUE" = "true" ]; then
    echo "2️⃣ MEDIA PRIORIDAD - Builder.io Detection:"
    echo "   • Revisar environment.ts para lógica de detección"
    echo "   • Deshabilitar modo Builder.io en desarrollo local"
    echo "   • Crear variable específica para activar modo Builder.io"
    echo ""
fi

if [ "$HOOK_ISSUE" = "true" ]; then
    echo "3️⃣ MEDIA PRIORIDAD - Hook Data Integration:"
    echo "   • Verificar useRealBackendData no tenga bloqueos"
    echo "   • Asegurar que los componentes usen hooks correctos"
    echo "   • Eliminar bypasses automáticos de Builder.io"
    echo ""
fi

echo "✅ ANÁLISIS COMPLETADO"
echo "Fecha: $(date '+%Y-%m-%d %H:%M:%S')"
echo "================================================" 