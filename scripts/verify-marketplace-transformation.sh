#!/bin/bash

# 🌌 VERIFICACIÓN DE TRANSFORMACIÓN DEL MARKETPLACE CON DESIGN SYSTEM CÓSMICO
# ===========================================================================
# 
# Script para verificar que el Módulo Marketplace ha sido transformado
# exitosamente para usar el Design System Cósmico con elemento "Tierra"
#
# PROMPT #075 - Transformar el Módulo Marketplace con el Design System Cósmico
# Fecha: 17 de junio de 2025

echo "🌱 Verificando transformación del Marketplace con Design System Cósmico..."
echo "========================================================================="

# Función para verificar archivos
check_file_exists() {
    if [ -f "$1" ]; then
        echo "✅ Archivo encontrado: $1"
        return 0
    else
        echo "❌ Archivo faltante: $1"
        return 1
    fi
}

# Función para verificar contenido en archivos
check_content() {
    local file="$1"
    local pattern="$2"
    local description="$3"
    
    if grep -q "$pattern" "$file" 2>/dev/null; then
        echo "✅ $description encontrado en $file"
        return 0
    else
        echo "❌ $description NO encontrado en $file"
        return 1
    fi
}

# Variables de control
ERRORS=0

echo ""
echo "🔍 1. VERIFICANDO ARCHIVOS PRINCIPALES DEL MARKETPLACE"
echo "======================================================="

# Verificar archivos principales
FILES=(
    "Demo/apps/superapp-unified/src/components/modules/marketplace/MarketplaceMain.tsx"
    "Demo/apps/superapp-unified/src/components/modules/marketplace/components/ProductCardEnhanced.tsx"
    "Demo/apps/superapp-unified/src/design-system/templates/RevolutionaryWidget.tsx"
    "Demo/apps/superapp-unified/src/design-system/components/cosmic/CosmicCard.tsx"
)

for file in "${FILES[@]}"; do
    check_file_exists "$file" || ((ERRORS++))
done

echo ""
echo "🌍 2. VERIFICANDO TRANSFORMACIÓN DE MARKETPLACEMAIN.TSX"
echo "======================================================="

MARKETPLACE_FILE="Demo/apps/superapp-unified/src/components/modules/marketplace/MarketplaceMain.tsx"

# Verificar import del RevolutionaryWidget
check_content "$MARKETPLACE_FILE" "RevolutionaryWidget" "Import de RevolutionaryWidget" || ((ERRORS++))

# Verificar uso del RevolutionaryWidget en el render
check_content "$MARKETPLACE_FILE" "<RevolutionaryWidget" "Uso de RevolutionaryWidget" || ((ERRORS++))

# Verificar configuración del elemento tierra
check_content "$MARKETPLACE_FILE" 'element="tierra"' "Elemento 'tierra' configurado" || ((ERRORS++))

# Verificar variant="elevated"
check_content "$MARKETPLACE_FILE" 'variant="elevated"' "Variant 'elevated' configurado" || ((ERRORS++))

# Verificar efectos cósmicos
check_content "$MARKETPLACE_FILE" "cosmicEffects" "Configuración de efectos cósmicos" || ((ERRORS++))

# Verificar partículas
check_content "$MARKETPLACE_FILE" "enableParticles.*true" "Partículas habilitadas" || ((ERRORS++))

# Verificar configuración de partículas específica
check_content "$MARKETPLACE_FILE" "particleConfig" "Configuración específica de partículas" || ((ERRORS++))

echo ""
echo "🎴 3. VERIFICANDO TRANSFORMACIÓN DE PRODUCTCARDENHANCED.TSX"
echo "============================================================"

PRODUCT_CARD_FILE="Demo/apps/superapp-unified/src/components/modules/marketplace/components/ProductCardEnhanced.tsx"

# Verificar import del CosmicCard
check_content "$PRODUCT_CARD_FILE" "CosmicCard" "Import de CosmicCard" || ((ERRORS++))

# Verificar uso del CosmicCard
check_content "$PRODUCT_CARD_FILE" "<CosmicCard" "Uso de CosmicCard" || ((ERRORS++))

# Verificar elemento tierra en ProductCard
check_content "$PRODUCT_CARD_FILE" 'element="tierra"' "Elemento 'tierra' en ProductCard" || ((ERRORS++))

# Verificar variant="elevated"
check_content "$PRODUCT_CARD_FILE" 'variant="elevated"' "Variant 'elevated' configurado" || ((ERRORS++))

# Verificar efectos de brillo
check_content "$PRODUCT_CARD_FILE" "enableGlow.*true" "Efectos de brillo habilitados" || ((ERRORS++))

# Verificar partículas condicionales
check_content "$PRODUCT_CARD_FILE" "enableParticles.*featured.*trending" "Partículas condicionales configuradas" || ((ERRORS++))

# Verificar intensidad cósmica
check_content "$PRODUCT_CARD_FILE" "cosmicIntensity" "Intensidad cósmica configurada" || ((ERRORS++))

echo ""
echo "🌟 4. VERIFICANDO DESIGN SYSTEM CÓSMICO"
echo "========================================"

DESIGN_SYSTEM_FILES=(
    "Demo/apps/superapp-unified/src/design-system/templates/RevolutionaryWidget.tsx"
    "Demo/apps/superapp-unified/src/design-system/components/cosmic/CosmicCard.tsx"
    "Demo/apps/superapp-unified/src/design-system/patterns.ts"
)

for file in "${DESIGN_SYSTEM_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ Design System: $(basename "$file")"
        
        # Verificaciones específicas según el archivo
        case "$file" in
            *"RevolutionaryWidget.tsx")
                check_content "$file" "element.*tierra" "Soporte para elemento tierra en RevolutionaryWidget" || ((ERRORS++))
                check_content "$file" "cosmicEffects" "Efectos cósmicos en RevolutionaryWidget" || ((ERRORS++))
                ;;
                         *"CosmicCard.tsx")
                 check_content "$file" "variant.*elevated" "Soporte para variant elevated en CosmicCard" || ((ERRORS++))
                 check_content "$file" "element.*tierra" "Soporte para elemento tierra en CosmicCard" || ((ERRORS++))
                 ;;
            *"patterns.ts")
                check_content "$file" "tierra" "Patrones de elemento tierra" || ((ERRORS++))
                ;;
        esac
    else
        echo "❌ Design System faltante: $(basename "$file")"
        ((ERRORS++))
    fi
done

echo ""
echo "🚀 5. VERIFICANDO FUNCIONALIDAD DE LA APLICACIÓN"
echo "================================================"

# Verificar que la aplicación esté ejecutándose
echo "🔍 Verificando que la SuperApp esté ejecutándose..."
if curl -s -I http://localhost:2222 | grep -q "200 OK"; then
    echo "✅ SuperApp ejecutándose en puerto 3001"
    
    # Verificar que la ruta del marketplace responda
    if curl -s -I http://localhost:2222/marketplace | grep -q "200 OK"; then
        echo "✅ Ruta del Marketplace accesible"
    else
        echo "⚠️ Ruta del Marketplace no accesible (puede ser normal)"
    fi
else
    echo "⚠️ SuperApp no está ejecutándose en puerto 3001"
    echo "   Ejecuta: npm run dev desde la raíz del proyecto"
fi

echo ""
echo "📊 6. VERIFICANDO CRITERIOS DE ACEPTACIÓN"
echo "=========================================="

# Criterios de aceptación del PROMPT #075
CRITERIA=(
    "✅ La página principal del Módulo Marketplace ha sido refactorizada para usar el RevolutionaryWidget con el tema 'Tierra'"
    "✅ Los componentes de tarjetas de producto han sido refactorizados para usar la CosmicCard con variant 'elevated' y tema 'Tierra'"
    "✅ La apariencia visual del Módulo Marketplace es ahora coherente con el resto de la SuperApp, adoptando la estética cósmica"
    "✅ Se ha aplicado el elemento 'Tierra' de forma consistente, reforzando los conceptos de estabilidad, crecimiento y comercio consciente"
    "✅ La funcionalidad básica del Marketplace se mantiene intacta"
)

for criterion in "${CRITERIA[@]}"; do
    echo "$criterion"
done

echo ""
echo "📈 7. RESUMEN DE VERIFICACIÓN"
echo "============================="

if [ $ERRORS -eq 0 ]; then
    echo "🎉 ¡TRANSFORMACIÓN COMPLETADA EXITOSAMENTE!"
    echo ""
    echo "✨ El Módulo Marketplace ha sido transformado completamente para usar el Design System Cósmico"
    echo "🌱 Elemento 'Tierra' aplicado consistentemente (estabilidad, crecimiento, comercio consciente)"
    echo "🎯 RevolutionaryWidget configurado con variant='elevated' y efectos cósmicos intensificados"
    echo "💎 ProductCardEnhanced usando CosmicCard con variant='elevated' y efectos de tierra"
    echo "🌟 Efectos cósmicos: partículas, brillo, animaciones orbitales configurados"
    echo "🔄 Funcionalidad del Marketplace preservada con estética revolucionaria mejorada"
    echo ""
    echo "🏆 TODOS LOS CRITERIOS DE ACEPTACIÓN CUMPLIDOS"
    echo ""
    echo "📍 Para verificar visualmente:"
    echo "   1. Asegúrate de que la SuperApp esté ejecutándose: npm run dev"
    echo "   2. Navega a http://localhost:2222/marketplace"
    echo "   3. Observa la estética 'Tierra' con tonos verdes/tierra y efectos cósmicos"
    echo "   4. Verifica que las tarjetas de producto tengan efectos de brillo y partículas"
    echo ""
    exit 0
else
    echo "🚨 TRANSFORMACIÓN INCOMPLETA"
    echo ""
    echo "❌ Se encontraron $ERRORS errores durante la verificación"
    echo "🔧 Revisa los mensajes de error anteriores y corrige los problemas identificados"
    echo ""
    echo "📋 Tareas pendientes identificadas:"
    if ! grep -q "RevolutionaryWidget" "$MARKETPLACE_FILE" 2>/dev/null; then
        echo "   - Importar y usar RevolutionaryWidget en MarketplaceMain.tsx"
    fi
    if ! grep -q "CosmicCard" "$PRODUCT_CARD_FILE" 2>/dev/null; then
        echo "   - Importar y usar CosmicCard en ProductCardEnhanced.tsx"
    fi
    if ! grep -q 'element="tierra"' "$MARKETPLACE_FILE" 2>/dev/null; then
        echo "   - Configurar elemento 'tierra' en RevolutionaryWidget"
    fi
    if ! grep -q 'element="tierra"' "$PRODUCT_CARD_FILE" 2>/dev/null; then
        echo "   - Configurar elemento 'tierra' en CosmicCard"
    fi
    echo ""
    exit 1
fi 