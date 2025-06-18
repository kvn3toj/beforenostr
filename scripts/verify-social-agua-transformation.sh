#!/bin/bash

# 🌊 SCRIPT DE VERIFICACIÓN: TRANSFORMACIÓN MÓDULO SOCIAL AL ELEMENTO AGUA
# ==========================================================================
# PROMPT #077 - Ajuste Final del Plan Maestro Material UI
# Fecha: 17 de Junio 2025

echo "🌊 VERIFICANDO TRANSFORMACIÓN DEL MÓDULO SOCIAL AL ELEMENTO AGUA"
echo "================================================================="

# 🎯 Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
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

# 🎯 Función para verificar AUSENCIA de contenido (elemento anterior)
check_file_absence() {
    local file="$1"
    local pattern="$2"
    local description="$3"
    
    if [ -f "$file" ]; then
        if ! grep -q "$pattern" "$file"; then
            echo -e "  ${GREEN}✅${NC} $description"
            return 0
        else
            echo -e "  ${YELLOW}⚠️${NC} $description - Patrón anterior aún presente"
            return 1
        fi
    else
        echo -e "  ${RED}❌${NC} $description - Archivo no encontrado: $file"
        return 1
    fi
}

echo -e "\n${CYAN}🌊 PARTE 1: VERIFICACIÓN DE SOCIALMAIN.tsx CON ELEMENTO AGUA${NC}"
echo "============================================================="

# Verificar elemento agua en lugar de aire
check_file_content \
    "Demo/apps/superapp-unified/src/components/modules/social/SocialMain.tsx" \
    'element="agua"' \
    "Elemento 'agua' configurado correctamente"

# Verificar que NO quede elemento aire
check_file_absence \
    "Demo/apps/superapp-unified/src/components/modules/social/SocialMain.tsx" \
    'element="aire"' \
    "Elemento 'aire' anterior eliminado"

# Verificar título actualizado con emoji de agua
check_file_content \
    "Demo/apps/superapp-unified/src/components/modules/social/SocialMain.tsx" \
    'title="🌊 Conexiones CoomÜnity"' \
    "Título actualizado con emoji de agua"

# Verificar efectos de partículas acuáticas
check_file_content \
    "Demo/apps/superapp-unified/src/components/modules/social/SocialMain.tsx" \
    'particleTheme: .waterRipples.' \
    "Efectos de partículas 'waterRipples' configurados"

# Verificar intensidad ajustada para agua
check_file_content \
    "Demo/apps/superapp-unified/src/components/modules/social/SocialMain.tsx" \
    'glowIntensity: 0.7' \
    "Intensidad de brillo ajustada para tema agua"

# Verificar comentario descriptivo actualizado
check_file_content \
    "Demo/apps/superapp-unified/src/components/modules/social/SocialMain.tsx" \
    'fluidez, conexión y profundidad emocional' \
    "Comentario descriptivo del elemento agua"

echo -e "\n${CYAN}🌊 PARTE 2: VERIFICACIÓN DE POSTCARD.tsx CON ELEMENTO AGUA${NC}"
echo "==========================================================="

# Verificar elemento agua en PostCard
check_file_content \
    "Demo/apps/superapp-unified/src/components/modules/social/components/PostCard.tsx" \
    'element="agua"' \
    "Elemento 'agua' configurado en PostCard"

# Verificar que NO quede elemento aire en PostCard
check_file_absence \
    "Demo/apps/superapp-unified/src/components/modules/social/components/PostCard.tsx" \
    'element="aire"' \
    "Elemento 'aire' anterior eliminado de PostCard"

# Verificar comentario descriptivo en PostCard
check_file_content \
    "Demo/apps/superapp-unified/src/components/modules/social/components/PostCard.tsx" \
    'fluidez y conexión emocional' \
    "Comentario descriptivo del agua en PostCard"

echo -e "\n${CYAN}🌊 PARTE 3: VERIFICACIÓN DE IMPORTS Y DEPENDENCIES${NC}"
echo "=================================================="

# Verificar import del RevolutionaryWidget
check_file_content \
    "Demo/apps/superapp-unified/src/components/modules/social/SocialMain.tsx" \
    "import { RevolutionaryWidget }" \
    "Import del RevolutionaryWidget presente"

# Verificar import del CosmicCard
check_file_content \
    "Demo/apps/superapp-unified/src/components/modules/social/components/PostCard.tsx" \
    "import { CosmicCard }" \
    "Import del CosmicCard presente"

echo -e "\n${CYAN}🌊 PARTE 4: VERIFICACIÓN DE SERVICIOS ACTIVOS${NC}"
echo "=============================================="

# Verificar que la SuperApp esté funcionando
echo -n "  🌐 Verificando SuperApp en puerto 3001... "
SUPERAPP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:2222 2>/dev/null)
if [ "$SUPERAPP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ SuperApp activa (HTTP $SUPERAPP_STATUS)${NC}"
else
    echo -e "${YELLOW}⚠️ SuperApp no responde o en puerto diferente (HTTP $SUPERAPP_STATUS)${NC}"
fi

# Verificar acceso específico a la página social
echo -n "  🤝 Verificando página Social... "
SOCIAL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:2222/social 2>/dev/null)
if [ "$SOCIAL_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Página Social accesible (HTTP $SOCIAL_STATUS)${NC}"
else
    echo -e "${YELLOW}⚠️ Página Social no accesible (HTTP $SOCIAL_STATUS)${NC}"
fi

echo -e "\n${CYAN}🌊 PARTE 5: VERIFICACIÓN DE DOCUMENTACIÓN${NC}"
echo "=========================================="

# Verificar que existe la documentación actualizada
check_file_content \
    "docs/implementation/SOCIAL_DESIGN_SYSTEM_TRANSFORMATION_SUMMARY.md" \
    "ELEMENTO AGUA" \
    "Documentación actualizada con elemento agua"

# Verificar que el script de verificación existe
if [ -f "scripts/verify-social-agua-transformation.sh" ]; then
    echo -e "  ${GREEN}✅${NC} Script de verificación creado"
else
    echo -e "  ${YELLOW}⚠️${NC} Script de verificación no encontrado"
fi

echo -e "\n${CYAN}🌊 PARTE 6: RESUMEN DE CRITERIOS DE ACEPTACIÓN${NC}"
echo "=============================================="

# Contador de criterios cumplidos
criterios_cumplidos=0
total_criterios=8

echo -e "\n${BLUE}📋 Criterios de Aceptación del PROMPT #077:${NC}"

# Criterio 1: Elemento agua aplicado
if grep -q 'element="agua"' "Demo/apps/superapp-unified/src/components/modules/social/SocialMain.tsx"; then
    echo -e "  ${GREEN}✅${NC} SocialMain usa elemento 'agua'"
    ((criterios_cumplidos++))
else
    echo -e "  ${RED}❌${NC} SocialMain NO usa elemento 'agua'"
fi

# Criterio 2: PostCard con elemento agua
if grep -q 'element="agua"' "Demo/apps/superapp-unified/src/components/modules/social/components/PostCard.tsx"; then
    echo -e "  ${GREEN}✅${NC} PostCard usa elemento 'agua'"
    ((criterios_cumplidos++))
else
    echo -e "  ${RED}❌${NC} PostCard NO usa elemento 'agua'"
fi

# Criterio 3: Efectos de partículas acuáticas
if grep -q 'waterRipples' "Demo/apps/superapp-unified/src/components/modules/social/SocialMain.tsx"; then
    echo -e "  ${GREEN}✅${NC} Efectos de partículas acuáticas configurados"
    ((criterios_cumplidos++))
else
    echo -e "  ${RED}❌${NC} Efectos de partículas acuáticas NO configurados"
fi

# Criterio 4: Título actualizado
if grep -q '🌊 Conexiones CoomÜnity' "Demo/apps/superapp-unified/src/components/modules/social/SocialMain.tsx"; then
    echo -e "  ${GREEN}✅${NC} Título actualizado con emoji de agua"
    ((criterios_cumplidos++))
else
    echo -e "  ${RED}❌${NC} Título NO actualizado"
fi

# Criterio 5: Eliminación elemento aire
if ! grep -q 'element="aire"' "Demo/apps/superapp-unified/src/components/modules/social/SocialMain.tsx"; then
    echo -e "  ${GREEN}✅${NC} Elemento 'aire' eliminado de SocialMain"
    ((criterios_cumplidos++))
else
    echo -e "  ${RED}❌${NC} Elemento 'aire' AÚN presente en SocialMain"
fi

# Criterio 6: Eliminación elemento aire en PostCard
if ! grep -q 'element="aire"' "Demo/apps/superapp-unified/src/components/modules/social/components/PostCard.tsx"; then
    echo -e "  ${GREEN}✅${NC} Elemento 'aire' eliminado de PostCard"
    ((criterios_cumplidos++))
else
    echo -e "  ${RED}❌${NC} Elemento 'aire' AÚN presente en PostCard"
fi

# Criterio 7: Servicios funcionando
if [ "$SUPERAPP_STATUS" = "200" ] && [ "$SOCIAL_STATUS" = "200" ]; then
    echo -e "  ${GREEN}✅${NC} Servicios de SuperApp funcionando correctamente"
    ((criterios_cumplidos++))
else
    echo -e "  ${YELLOW}⚠️${NC} Algunos servicios no están completamente activos"
fi

# Criterio 8: Documentación actualizada
if grep -q "ELEMENTO AGUA" "docs/implementation/SOCIAL_DESIGN_SYSTEM_TRANSFORMATION_SUMMARY.md" 2>/dev/null; then
    echo -e "  ${GREEN}✅${NC} Documentación actualizada"
    ((criterios_cumplidos++))
else
    echo -e "  ${YELLOW}⚠️${NC} Documentación pendiente de actualización"
fi

# Cálculo de porcentaje de éxito
porcentaje_exito=$((criterios_cumplidos * 100 / total_criterios))

echo -e "\n${CYAN}🏆 RESULTADO FINAL${NC}"
echo "=================="
echo -e "${BLUE}Criterios cumplidos:${NC} $criterios_cumplidos de $total_criterios"
echo -e "${BLUE}Porcentaje de éxito:${NC} $porcentaje_exito%"

if [ $criterios_cumplidos -eq $total_criterios ]; then
    echo -e "\n${GREEN}🎉 ¡TRANSFORMACIÓN AL ELEMENTO AGUA COMPLETADA EXITOSAMENTE!${NC}"
    echo -e "${GREEN}🌊 El módulo Social ahora refleja perfectamente la fluidez y conexión emocional${NC}"
    echo -e "${GREEN}🎯 100% alineado con las especificaciones del Plan Maestro Material UI${NC}"
elif [ $criterios_cumplidos -ge 6 ]; then
    echo -e "\n${YELLOW}⚠️ TRANSFORMACIÓN MAYORMENTE COMPLETADA${NC}"
    echo -e "${YELLOW}🔧 Revisar criterios faltantes para completar la implementación${NC}"
else
    echo -e "\n${RED}❌ TRANSFORMACIÓN INCOMPLETA${NC}"
    echo -e "${RED}🔧 Se requieren correcciones adicionales${NC}"
fi

echo -e "\n${CYAN}📋 PRÓXIMOS PASOS SEGÚN PLAN MAESTRO:${NC}"
echo "1. 🎬 ÜPlay Module - Elemento 'fuego' para energía y creatividad"
echo "2. 🛍️ Marketplace Module - Elemento 'tierra' para estabilidad"
echo "3. 🔗 Cross-Module Integration - Navegación cósmica unificada"

echo -e "\n${CYAN}🌊 Verificación completada - Elemento Agua aplicado al Módulo Social${NC}"
echo "======================================================================" 