#!/bin/bash

# ============================================================================
# 🎯 VERIFICACIÓN DE PRIORIDADES DE REFACTORIZACIÓN - COOMUNITY SUPERAPP
# ============================================================================
# Script para identificar qué módulos requieren refactorización urgente
# basado en el análisis de datos mock y hardcodeados

echo "🎯 VERIFICANDO PRIORIDADES DE REFACTORIZACIÓN..."
echo "=================================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Función para verificar un módulo específico
check_module_priority() {
    local module_name=$1
    local module_path=$2
    local critical_files=("${@:3}")
    
    echo ""
    echo -e "${CYAN}🔍 VERIFICANDO: $module_name${NC}"
    echo "📁 Ruta: $module_path"
    echo "----------------------------------------"
    
    if [ ! -d "$module_path" ]; then
        echo -e "${RED}❌ Módulo no encontrado${NC}"
        return 1
    fi
    
    local priority="BAJO"
    local issues_found=0
    local recommendations=()
    
    # Verificar archivos críticos específicos
    for file_pattern in "${critical_files[@]}"; do
        local files_found=$(find "$module_path" -name "$file_pattern" 2>/dev/null)
        
        if [ -n "$files_found" ]; then
            while IFS= read -r file; do
                if [ -f "$file" ]; then
                    echo "🔍 Analizando: $(basename "$file")"
                    
                    # Verificar patrones específicos según el módulo
                    case $module_name in
                        "UPLAY")
                            # Buscar getMockQuestions
                            if grep -q "getMockQuestions" "$file"; then
                                echo -e "   ${RED}🚨 CRÍTICO: getMockQuestions encontrado${NC}"
                                priority="ALTO"
                                issues_found=$((issues_found + 1))
                                recommendations+=("Eliminar getMockQuestions y crear useVideoQuestions hook")
                            fi
                            
                            # Buscar backend comentado
                            if grep -q "// const backendQuestions" "$file"; then
                                echo -e "   ${YELLOW}⚠️ Backend integration comentado${NC}"
                                issues_found=$((issues_found + 1))
                                recommendations+=("Habilitar integración con backend de preguntas")
                            fi
                            
                            # Buscar setQuestionsData con mock
                            if grep -q "setQuestionsData(getMockQuestions" "$file"; then
                                echo -e "   ${RED}🚨 Uso directo de datos mock${NC}"
                                priority="ALTO"
                                issues_found=$((issues_found + 1))
                            fi
                            ;;
                            
                        "HOME")
                            # Buscar configuraciones hardcodeadas
                            if grep -q "const elementConfig" "$file"; then
                                echo -e "   ${YELLOW}⚠️ Configuraciones elementales hardcodeadas${NC}"
                                if [ "$priority" != "ALTO" ]; then
                                    priority="MEDIO"
                                fi
                                issues_found=$((issues_found + 1))
                                recommendations+=("Migrar configuraciones elementales al backend")
                            fi
                            
                            # Buscar datos simulados
                            if grep -q "mockData\|simulados\|hardcoded" "$file"; then
                                echo -e "   ${YELLOW}⚠️ Datos simulados detectados${NC}"
                                issues_found=$((issues_found + 1))
                                recommendations+=("Reemplazar datos simulados con hooks dinámicos")
                            fi
                            ;;
                            
                        "SOCIAL"|"MARKETPLACE"|"WALLET"|"CHALLENGES")
                            # Verificar integración con backend
                            local backend_hooks=$(grep -c "useQuery\|useMutation" "$file" 2>/dev/null || echo 0)
                            local mock_data=$(grep -c "mockData\|hardcoded" "$file" 2>/dev/null || echo 0)
                            
                            if [ $mock_data -gt 0 ]; then
                                echo -e "   ${YELLOW}⚠️ $mock_data referencias a datos mock${NC}"
                                issues_found=$((issues_found + 1))
                            fi
                            
                            if [ $backend_hooks -gt 0 ]; then
                                echo -e "   ${GREEN}✅ $backend_hooks hooks de backend encontrados${NC}"
                            fi
                            ;;
                    esac
                    
                    # Verificar uso de Design System Cosmic
                    local cosmic_usage=$(grep -c "CosmicCard\|RevolutionaryWidget\|cosmic\." "$file" 2>/dev/null || echo 0)
                    if [ $cosmic_usage -gt 0 ]; then
                        echo -e "   ${GREEN}✅ Design System Cosmic: $cosmic_usage usos${NC}"
                    else
                        echo -e "   ${BLUE}ℹ️ Sin uso de Design System Cosmic detectado${NC}"
                    fi
                fi
            done <<< "$files_found"
        fi
    done
    
    # Verificar configuración de environment
    if [ "$module_name" = "UPLAY" ]; then
        if grep -q "VITE_FORCE_YOUTUBE_VIDEOS=true" Demo/apps/superapp-unified/.env 2>/dev/null; then
            echo -e "   ${RED}🚨 VITE_FORCE_YOUTUBE_VIDEOS=true (fuerza mocks)${NC}"
            priority="ALTO"
            issues_found=$((issues_found + 1))
            recommendations+=("Cambiar VITE_FORCE_YOUTUBE_VIDEOS=false")
        fi
    fi
    
    # Mostrar evaluación final
    echo ""
    echo "📋 EVALUACIÓN FINAL:"
    case $priority in
        "ALTO")
            echo -e "   ${RED}🔥 PRIORIDAD ALTA - $issues_found issues críticos${NC}"
            ;;
        "MEDIO")
            echo -e "   ${YELLOW}⚠️ PRIORIDAD MEDIA - $issues_found issues moderados${NC}"
            ;;
        "BAJO")
            echo -e "   ${GREEN}✅ PRIORIDAD BAJA - $issues_found issues menores${NC}"
            ;;
    esac
    
    if [ ${#recommendations[@]} -gt 0 ]; then
        echo "   💡 Recomendaciones:"
        for rec in "${recommendations[@]}"; do
            echo -e "      • $rec"
        done
    fi
    
    # Guardar resultado para resumen
    echo "$module_name|$priority|$issues_found|${#recommendations[@]}" >> /tmp/priority_results.txt
    
    return 0
}

# Limpiar archivo de resultados
rm -f /tmp/priority_results.txt

echo -e "${GREEN}🚀 INICIANDO VERIFICACIÓN DE PRIORIDADES...${NC}"

# Verificar módulos en orden de prioridad esperada

# 1. UPLAY MODULE (Esperado: PRIORIDAD ALTA)
check_module_priority "UPLAY" \
    "Demo/apps/superapp-unified/src/components/modules/uplay" \
    "EnhancedInteractiveVideoPlayer.tsx" \
    "InteractiveVideoPlayer.tsx" \
    "*Main.tsx"

# 2. HOME MODULE (Esperado: PRIORIDAD MEDIA)
check_module_priority "HOME" \
    "Demo/apps/superapp-unified/src/components/home" \
    "AyniMetricsCard.tsx" \
    "AyniBalanceVisualization.tsx" \
    "*Dashboard.tsx"

# 3. SOCIAL MODULE (Esperado: PRIORIDAD BAJA)
check_module_priority "SOCIAL" \
    "Demo/apps/superapp-unified/src/components/modules/social" \
    "*Main.tsx" \
    "*Card.tsx"

# 4. MARKETPLACE MODULE (Esperado: PRIORIDAD BAJA)
check_module_priority "MARKETPLACE" \
    "Demo/apps/superapp-unified/src/components/modules/marketplace" \
    "*Main.tsx" \
    "*Dashboard.tsx"

# 5. WALLET MODULE (Esperado: PRIORIDAD BAJA)
check_module_priority "WALLET" \
    "Demo/apps/superapp-unified/src/components/modules/wallet" \
    "*.tsx"

# 6. CHALLENGES MODULE (Esperado: PRIORIDAD BAJA)
check_module_priority "CHALLENGES" \
    "Demo/apps/superapp-unified/src/components/modules/challenges" \
    "*.tsx"

echo ""
echo "============================================"
echo "📊 RESUMEN DE PRIORIDADES"
echo "============================================"

if [ -f /tmp/priority_results.txt ]; then
    declare -A priority_counts
    priority_counts["ALTO"]=0
    priority_counts["MEDIO"]=0
    priority_counts["BAJO"]=0
    
    total_issues=0
    total_recommendations=0
    
    echo "📋 Resultados por módulo:"
    echo ""
    
    while IFS='|' read -r module priority issues recs; do
        priority_counts["$priority"]=$((${priority_counts["$priority"]} + 1))
        total_issues=$((total_issues + issues))
        total_recommendations=$((total_recommendations + recs))
        
        case $priority in
            "ALTO")
                echo -e "   ${RED}🔥 $module: $issues issues, $recs recomendaciones (PRIORIDAD ALTA)${NC}"
                ;;
            "MEDIO")
                echo -e "   ${YELLOW}⚠️ $module: $issues issues, $recs recomendaciones (PRIORIDAD MEDIA)${NC}"
                ;;
            "BAJO")
                echo -e "   ${GREEN}✅ $module: $issues issues, $recs recomendaciones (PRIORIDAD BAJA)${NC}"
                ;;
        esac
    done < /tmp/priority_results.txt
    
    echo ""
    echo "📊 ESTADÍSTICAS GENERALES:"
    echo -e "   ${RED}🔥 Módulos prioridad alta: ${priority_counts["ALTO"]}${NC}"
    echo -e "   ${YELLOW}⚠️ Módulos prioridad media: ${priority_counts["MEDIO"]}${NC}"
    echo -e "   ${GREEN}✅ Módulos prioridad baja: ${priority_counts["BAJO"]}${NC}"
    echo -e "   📄 Total de issues encontrados: $total_issues"
    echo -e "   💡 Total de recomendaciones: $total_recommendations"
    
    echo ""
    echo "🎯 PLAN DE ACCIÓN RECOMENDADO:"
    echo "=============================="
    
    if [ ${priority_counts["ALTO"]} -gt 0 ]; then
        echo -e "${RED}🚨 ACCIÓN INMEDIATA REQUERIDA:${NC}"
        while IFS='|' read -r module priority issues recs; do
            if [ "$priority" = "ALTO" ]; then
                echo -e "   1. Refactorizar $module (siguiendo patrón UStats exitoso)"
                echo -e "      • Eliminar datos mock hardcodeados"
                echo -e "      • Crear hooks dinámicos con React Query"
                echo -e "      • Integrar con backend NestJS"
                echo -e "      • Activar Design System Cosmic"
            fi
        done < /tmp/priority_results.txt
        echo ""
    fi
    
    if [ ${priority_counts["MEDIO"]} -gt 0 ]; then
        echo -e "${YELLOW}⚠️ PLANIFICAR PARA PRÓXIMA ITERACIÓN:${NC}"
        while IFS='|' read -r module priority issues recs; do
            if [ "$priority" = "MEDIO" ]; then
                echo -e "   2. Optimizar $module"
                echo -e "      • Migrar configuraciones críticas al backend"
                echo -e "      • Implementar estados de carga dinámicos"
            fi
        done < /tmp/priority_results.txt
        echo ""
    fi
    
    echo -e "${GREEN}✅ MÓDULOS LISTOS PARA DESIGN SYSTEM COSMIC:${NC}"
    while IFS='|' read -r module priority issues recs; do
        if [ "$priority" = "BAJO" ]; then
            echo -e "   • $module (arquitectura limpia, listo para transformación visual)"
        fi
    done < /tmp/priority_results.txt
    
    # Limpiar archivo temporal
    rm -f /tmp/priority_results.txt
    
    echo ""
    echo -e "${GREEN}✅ VERIFICACIÓN DE PRIORIDADES COMPLETADA${NC}"
    echo "Fecha: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "=============================================="
    
    # Determinar código de salida basado en prioridades
    if [ ${priority_counts["ALTO"]} -gt 0 ]; then
        echo -e "${RED}⚠️ ATENCIÓN: Se encontraron módulos de prioridad alta que requieren refactorización inmediata${NC}"
        exit 2
    elif [ ${priority_counts["MEDIO"]} -gt 0 ]; then
        echo -e "${YELLOW}ℹ️ INFO: Se encontraron módulos de prioridad media para planificación futura${NC}"
        exit 1
    else
        echo -e "${GREEN}🎉 EXCELENTE: Todos los módulos están en buen estado${NC}"
        exit 0
    fi
    
else
    echo -e "${RED}❌ Error: No se pudieron generar resultados de prioridades${NC}"
    exit 3
fi 