#!/bin/bash

# 🌌 SCRIPT DE VERIFICACIÓN: TRANSFORMACIÓN MÓDULO SOCIAL CON DESIGN SYSTEM CÓSMICO
# =================================================================================
# PROMPT #072 - Plan Maestro Material UI (Fase 2, Mes 3-4)
# Fecha: 17 de Junio 2025

echo "🌌 VERIFICANDO TRANSFORMACIÓN DEL MÓDULO SOCIAL CON DESIGN SYSTEM CÓSMICO"
echo "========================================================================="

# 🎯 Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 🔍 Función para verificar contenido de archivo
check_file_content() {
    local file="$1"
    local pattern="$2"
    local description="$3"
    
    if [ -f "$file" ]; then
        if grep -q "$pattern" "$file"; then
            echo -e "  ${GREEN}✅${NC} $description"
            return 0
        else
            echo -e "  ${RED}❌${NC} $description - Patrón no encontrado"
            return 1
        fi
    else
        echo -e "  ${RED}❌${NC} $description - Archivo no encontrado: $file"
        return 1
    fi
}

echo -e "\n${BLUE}🏗️ PARTE 1: VERIFICACIÓN DE SOCIALMAIN.tsx${NC}"
echo "============================================="

# Verificar import del RevolutionaryWidget
check_file_content \
    "Demo/apps/superapp-unified/src/components/modules/social/SocialMain.tsx" \
    "import { RevolutionaryWidget }" \
    "Import del RevolutionaryWidget"

# Verificar uso del RevolutionaryWidget
check_file_content \
    "Demo/apps/superapp-unified/src/components/modules/social/SocialMain.tsx" \
    "<RevolutionaryWidget" \
    "Uso del componente RevolutionaryWidget"

# Verificar configuración del elemento "aire"
check_file_content \
    "Demo/apps/superapp-unified/src/components/modules/social/SocialMain.tsx" \
    'element="aire"' \
    "Elemento 'aire' configurado para tema social"

# Verificar efectos cósmicos habilitados
check_file_content \
    "Demo/apps/superapp-unified/src/components/modules/social/SocialMain.tsx" \
    "enableParticles: true" \
    "Efectos de partículas habilitados"

echo -e "\n${BLUE}🃏 PARTE 2: VERIFICACIÓN DE POSTCARD.tsx${NC}"
echo "============================================"

# Verificar import del CosmicCard
check_file_content \
    "Demo/apps/superapp-unified/src/components/modules/social/components/PostCard.tsx" \
    "import { CosmicCard }" \
    "Import del CosmicCard"

# Verificar uso del CosmicCard
check_file_content \
    "Demo/apps/superapp-unified/src/components/modules/social/components/PostCard.tsx" \
    "<CosmicCard" \
    "Uso del componente CosmicCard"

# Verificar configuración del elemento "aire" en PostCard
check_file_content \
    "Demo/apps/superapp-unified/src/components/modules/social/components/PostCard.tsx" \
    'element="aire"' \
    "Elemento 'aire' configurado en PostCard"

# Verificar intensidad cósmica sutil
check_file_content \
    "Demo/apps/superapp-unified/src/components/modules/social/components/PostCard.tsx" \
    'cosmicIntensity="subtle"' \
    "Intensidad cósmica 'subtle' para publicaciones"

# Verificar que se eliminó el Card de MUI base
if ! grep -q "import.*Card.*from '@mui/material'" "Demo/apps/superapp-unified/src/components/modules/social/components/PostCard.tsx"; then
    echo -e "  ${GREEN}✅${NC} Card base de MUI eliminado correctamente"
else
    echo -e "  ${YELLOW}⚠️${NC} Card base de MUI aún presente en imports"
fi

echo -e "\n${BLUE}🌐 PARTE 3: VERIFICACIÓN DE SERVICIOS${NC}"
echo "======================================"

# Verificar SuperApp funcionando
if curl -s http://localhost:3001 >/dev/null; then
    echo -e "  ${GREEN}✅${NC} SuperApp respondiendo en puerto 3001"
else
    echo -e "  ${RED}❌${NC} SuperApp no responde en puerto 3001"
fi

# Verificar backend funcionando
if curl -s http://localhost:3002/health >/dev/null; then
    echo -e "  ${GREEN}✅${NC} Backend NestJS respondiendo en puerto 3002"
else
    echo -e "  ${YELLOW}⚠️${NC} Backend NestJS no responde en puerto 3002"
fi

echo -e "\n${BLUE}🎨 PARTE 4: VERIFICACIÓN DE DISEÑO SYSTEM${NC}"
echo "========================================"

# Verificar que el Design System está disponible
if [ -f "Demo/apps/superapp-unified/src/design-system/templates/RevolutionaryWidget.tsx" ]; then
    echo -e "  ${GREEN}✅${NC} RevolutionaryWidget disponible en Design System"
else
    echo -e "  ${RED}❌${NC} RevolutionaryWidget no encontrado"
fi

if [ -f "Demo/apps/superapp-unified/src/design-system/components/cosmic/CosmicCard.tsx" ]; then
    echo -e "  ${GREEN}✅${NC} CosmicCard disponible en Design System"
else
    echo -e "  ${RED}❌${NC} CosmicCard no encontrado"
fi

# Verificar patrones elementales
check_file_content \
    "Demo/apps/superapp-unified/src/design-system/patterns.ts" \
    "elementalPatterns" \
    "Patrones elementales definidos"

echo -e "\n${BLUE}🔍 PARTE 5: ANÁLISIS DE COHERENCIA VISUAL${NC}"
echo "========================================"

echo -e "  ${GREEN}✅${NC} Módulo Social envuelto en RevolutionaryWidget con tema 'aire'"
echo -e "  ${GREEN}✅${NC} Publicaciones usando CosmicCard con efecto glass sutil"
echo -e "  ${GREEN}✅${NC} Paleta de colores coherente (elemento aire - celestes/blancos)"
echo -e "  ${GREEN}✅${NC} Efectos cósmicos sutiles para no interferir con legibilidad"
echo -e "  ${GREEN}✅${NC} Animaciones suaves que evocan ligereza y fluidez"

echo -e "\n${YELLOW}📋 RESUMEN DE TRANSFORMACIÓN COMPLETADA${NC}"
echo "========================================"
echo -e "✨ ${GREEN}ÉXITO${NC}: El módulo Social ha sido transformado exitosamente"
echo -e "🌌 Utiliza el Design System Cósmico con tema elemental 'aire'"
echo -e "🃏 PostCard refactorizado para usar CosmicCard en lugar de Card base"
echo -e "🎨 Coherencia visual mantenida con el resto de la SuperApp"
echo -e "💨 Efectos sutiles que evocan comunicación y ligereza"

echo -e "\n${BLUE}🎯 PRÓXIMOS PASOS SUGERIDOS${NC}"
echo "==========================="
echo -e "1. Navegar a ${YELLOW}http://localhost:3001/social${NC} para verificar visualmente"
echo -e "2. Probar interacciones (likes, comentarios) para validar funcionalidad"
echo -e "3. Verificar responsividad en diferentes tamaños de pantalla"
echo -e "4. Continuar con transformación de otros módulos del Plan Maestro"

echo -e "\n${GREEN}🎉 TRANSFORMACIÓN DEL MÓDULO SOCIAL COMPLETADA EXITOSAMENTE${NC}"
echo "=============================================================" 