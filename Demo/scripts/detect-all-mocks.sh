#!/bin/bash

# 🔍 SCRIPT DE DETECCIÓN COMPLETA DE MOCKS - PROYECTO COOMUNITY
# Detecta sistemáticamente todos los archivos mock que bloquean efectos visuales

echo "🚨 INICIANDO DETECCIÓN COMPLETA DE MOCKS EN COOMUNITY SUPERAPP"
echo "============================================================="
echo ""

# 1. Archivos mock por nombre
echo "📁 ARCHIVOS MOCK POR NOMBRE:"
echo "├── Archivos con patrón '*mock*':"
find Demo/apps/superapp-unified/src -name "*mock*" -type f 2>/dev/null | sort
echo ""
echo "├── Archivos con patrón '*Mock*':"  
find Demo/apps/superapp-unified/src -name "*Mock*" -type f 2>/dev/null | sort
echo ""

# 2. Archivos con referencias mock en contenido
echo "📝 ARCHIVOS CON REFERENCIAS MOCK EN CONTENIDO:"
MOCK_REF_FILES=$(find Demo/apps/superapp-unified/src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec grep -l "mockData\|Mock.*Data\|fallback.*mock" {} \; 2>/dev/null | sort)
echo "├── Total archivos con referencias mock: $(echo "$MOCK_REF_FILES" | wc -l)"
echo "$MOCK_REF_FILES" | head -15
if [ $(echo "$MOCK_REF_FILES" | wc -l) -gt 15 ]; then
    echo "├── ... y $(( $(echo "$MOCK_REF_FILES" | wc -l) - 15 )) archivos más"
fi
echo ""

# 3. Archivos con lógica de bypass
echo "🔄 ARCHIVOS CON LÓGICA DE BYPASS:"
BYPASS_FILES=$(find Demo/apps/superapp-unified/src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec grep -l "VITE_ENABLE_MOCK_AUTH\|safe_mode\|Builder\.io.*Safe.*Mode\|isBuilderEnvironment" {} \; 2>/dev/null | sort)
echo "├── Total archivos con bypass logic: $(echo "$BYPASS_FILES" | wc -l)"
echo "$BYPASS_FILES"
echo ""

# 4. Conteo de líneas en archivos críticos
echo "📏 TAMAÑO DE ARCHIVOS CRÍTICOS:"
echo "├── Análisis de líneas por archivo:"

CRITICAL_FILES=(
    "Demo/apps/superapp-unified/src/data/marketplaceMockData.ts"
    "Demo/apps/superapp-unified/src/hooks/useRealBackendData.ts"
    "Demo/apps/superapp-unified/src/hooks/useEnhancedGroupsData.ts"
    "Demo/apps/superapp-unified/src/hooks/useLetsIntegration.ts"
    "Demo/apps/superapp-unified/src/hooks/useUPlayMockData.ts"
    "Demo/apps/superapp-unified/src/lib/lets-mock-service.ts"
)

TOTAL_LINES=0
for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        LINES=$(wc -l < "$file" 2>/dev/null || echo "0")
        TOTAL_LINES=$((TOTAL_LINES + LINES))
        echo "│   ├── $(basename "$file"): $LINES líneas"
    else
        echo "│   ├── $(basename "$file"): ❌ NO EXISTE"
    fi
done
echo "│   └── TOTAL LÍNEAS MOCK: $TOTAL_LINES líneas"
echo ""

# 5. Análisis por módulos
echo "🗂️ ANÁLISIS POR MÓDULOS:"
echo "├── MARKETPLACE:"
echo "│   ├── marketplaceMockData.ts: $([ -f "Demo/apps/superapp-unified/src/data/marketplaceMockData.ts" ] && echo "✅ DETECTADO" || echo "❌ NO DETECTADO")"
grep -r "marketplaceMockData" Demo/apps/superapp-unified/src/ 2>/dev/null | wc -l | xargs -I {} echo "│   └── Referencias en código: {} archivos"

echo "├── ÜPLAY:"
echo "│   ├── useUPlayMockData.ts: $([ -f "Demo/apps/superapp-unified/src/hooks/useUPlayMockData.ts" ] && echo "✅ DETECTADO" || echo "❌ NO DETECTADO")"
grep -r "UPlayMockData\|useUPlayMockData" Demo/apps/superapp-unified/src/ 2>/dev/null | wc -l | xargs -I {} echo "│   └── Referencias en código: {} líneas"

echo "├── SOCIAL:" 
echo "│   ├── useEnhancedGroupsData.ts: $([ -f "Demo/apps/superapp-unified/src/hooks/useEnhancedGroupsData.ts" ] && echo "✅ DETECTADO" || echo "❌ NO DETECTADO")"

echo "├── LETS:"
echo "│   ├── lets-mock-service.ts: $([ -f "Demo/apps/superapp-unified/src/lib/lets-mock-service.ts" ] && echo "✅ DETECTADO" || echo "❌ NO DETECTADO")"
echo "│   ├── useLetsIntegration.ts: $([ -f "Demo/apps/superapp-unified/src/hooks/useLetsIntegration.ts" ] && echo "✅ DETECTADO" || echo "❌ NO DETECTADO")"
echo "│   └── useLetsMarketplace.ts: $([ -f "Demo/apps/superapp-unified/src/hooks/useLetsMarketplace.ts" ] && echo "✅ DETECTADO" || echo "❌ NO DETECTADO")"

echo "└── CONFIGURACIÓN:"
echo "    ├── useRealBackendData.ts: $([ -f "Demo/apps/superapp-unified/src/hooks/useRealBackendData.ts" ] && echo "✅ DETECTADO" || echo "❌ NO DETECTADO")"
echo "    └── VITE_ENABLE_MOCK_AUTH: $(echo "$BYPASS_FILES" | wc -l) archivos afectados"
echo ""

# 6. Resumen ejecutivo
echo "📊 RESUMEN EJECUTIVO:"
echo "├── 🔥 Archivos mock críticos: $(find Demo/apps/superapp-unified/src -name "*mock*" -o -name "*Mock*" | wc -l)"
echo "├── 📝 Archivos con referencias mock: $(echo "$MOCK_REF_FILES" | wc -l)"
echo "├── 🔄 Archivos con bypass logic: $(echo "$BYPASS_FILES" | wc -l)"
echo "├── 📏 Total líneas de mock code: $TOTAL_LINES+"
echo "└── 🚫 Impacto: BLOQUEO COMPLETO de efectos visuales"
echo ""

echo "🎯 PRÓXIMO PASO: Ejecutar ./Demo/scripts/eliminate-mocks-phase1.sh"
echo "============================================================="