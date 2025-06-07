#!/bin/bash

# 🚀 Script de Integración de Módulos CoomÜnity SuperApp
# Facilita la integración de contenido extraído en módulos marcados como "en desarrollo"

set -e

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${PURPLE}🚀 CoomÜnity SuperApp - Integración de Módulos${NC}"
echo "======================================================"

# Función para mostrar ayuda
show_help() {
    echo "Uso: $0 [MÓDULO]"
    echo ""
    echo "Módulos disponibles para integración:"
    echo "  marketplace  - Integrar sistema de comercio (coomunity_merchant_dev)"
    echo "  uplay        - Integrar sistema de gigs/trabajos (coomunity_gigs_add)"
    echo "  social       - Integrar sistema de chat/gossip (coomunity_gossip)"
    echo "  pilgrim      - Integrar sistema de viajes (coomunity_pilgrim_demo)"
    echo "  ustats       - Integrar estadísticas (coomunity_search_params)"
    echo "  wallet       - Completar wallet (coomunity_wallet)"
    echo "  profile      - Crear sistema de perfiles"
    echo "  all          - Mostrar información de todos los módulos"
    echo ""
    echo "Ejemplo: $0 marketplace"
}

# Función para verificar prerrequisitos
check_prerequisites() {
    echo -e "${BLUE}🔍 Verificando prerrequisitos...${NC}"
    
    # Verificar que estamos en la raíz del proyecto
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ Este script debe ejecutarse desde la raíz del proyecto${NC}"
        exit 1
    fi
    
    # Verificar que existe la carpeta de contenido extraído
    if [ ! -d "data/extracted" ]; then
        echo -e "${RED}❌ No se encontró la carpeta data/extracted${NC}"
        exit 1
    fi
    
    # Verificar que existe la aplicación principal
    if [ ! -d "apps/superapp-unified" ]; then
        echo -e "${RED}❌ No se encontró la aplicación apps/superapp-unified${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Prerrequisitos verificados${NC}"
}

# Función para analizar contenido extraído
analyze_extracted_content() {
    local module_name=$1
    local extracted_folder=$2
    
    echo -e "${BLUE}📁 Analizando contenido extraído: ${extracted_folder}${NC}"
    
    if [ ! -d "data/extracted/$extracted_folder" ]; then
        echo -e "${RED}❌ No se encontró data/extracted/$extracted_folder${NC}"
        return 1
    fi
    
    local folder_path="data/extracted/$extracted_folder"
    
    # Contar archivos por tipo
    local html_count=$(find "$folder_path" -name "*.html" | wc -l)
    local css_count=$(find "$folder_path" -name "*.css" | wc -l) 
    local js_count=$(find "$folder_path" -name "*.js" | wc -l)
    local img_count=$(find "$folder_path" -name "*.png" -o -name "*.jpg" -o -name "*.svg" | wc -l)
    
    echo "   📄 Archivos HTML: $html_count"
    echo "   🎨 Archivos CSS: $css_count"
    echo "   ⚡ Archivos JS: $js_count"
    echo "   🖼️  Imágenes: $img_count"
    
    # Mostrar estructura principal
    echo "   📂 Estructura principal:"
    ls -la "$folder_path" | head -10 | sed 's/^/      /'
    
    # Verificar carpeta de assets
    if [ -d "$folder_path/assets" ]; then
        echo -e "${GREEN}   ✅ Carpeta assets encontrada${NC}"
        ls -la "$folder_path/assets" | sed 's/^/      /'
    else
        echo -e "${YELLOW}   ⚠️ No se encontró carpeta assets específica${NC}"
    fi
}

# Función para integrar módulo específico
integrate_module() {
    local module=$1
    
    case $module in
        marketplace)
            echo -e "${PURPLE}🛒 Integrando Marketplace${NC}"
            analyze_extracted_content "Marketplace" "coomunity_merchant_dev"
            echo ""
            echo "📋 Pasos sugeridos para completar Marketplace:"
            echo "   1. Revisar HTML en data/extracted/coomunity_merchant_dev/html/"
            echo "   2. Migrar assets: cp -r data/extracted/coomunity_merchant_dev/assets/* apps/superapp-unified/public/"
            echo "   3. Crear componentes React basados en HTML extraído"
            echo "   4. Adaptar CSS a sistema de estilos actual"
            echo "   5. Probar funcionalidad con: npx playwright test"
            ;;
            
        uplay)
            echo -e "${PURPLE}🎮 Integrando ÜPlay (Gigs/Trabajos)${NC}"
            analyze_extracted_content "ÜPlay" "coomunity_gigs_add"
            echo ""
            echo "📋 Pasos sugeridos para completar ÜPlay:"
            echo "   1. Revisar formularios de gigs en data/extracted/coomunity_gigs_add/"
            echo "   2. Migrar assets: cp -r data/extracted/coomunity_gigs_add/assets/* apps/superapp-unified/public/"
            echo "   3. Implementar sistema de creación de gigs/trabajos"
            echo "   4. Agregar sistema de aplicación a trabajos"
            echo "   5. Probar funcionalidad colaborativa"
            ;;
            
        social)
            echo -e "${PURPLE}💬 Integrando Social2 (Gossip/Chat)${NC}"
            analyze_extracted_content "Social2" "coomunity_gossip"
            echo ""
            echo "📋 Pasos sugeridos para completar Social2:"
            echo "   1. Revisar interfaces de chat en data/extracted/coomunity_gossip/"
            echo "   2. Migrar assets: cp -r data/extracted/coomunity_gossip/assets/* apps/superapp-unified/public/"
            echo "   3. Implementar sistema de mensajería"
            echo "   4. Agregar funcionalidades de gossip/comunicación"
            echo "   5. Integrar notificaciones en tiempo real"
            ;;
            
        pilgrim)
            echo -e "${PURPLE}🧭 Integrando Pilgrim (Viajes)${NC}"
            analyze_extracted_content "Pilgrim" "coomunity_pilgrim_demo"
            echo ""
            echo "📋 Pasos sugeridos para completar Pilgrim:"
            echo "   1. Revisar interfaces de viajes en data/extracted/coomunity_pilgrim_demo/"
            echo "   2. Migrar assets: cp -r data/extracted/coomunity_pilgrim_demo/assets/* apps/superapp-unified/public/"
            echo "   3. Implementar sistema de rutas y mapas"
            echo "   4. Agregar seguimiento de peregrinajes"
            echo "   5. Integrar sistema de logros de viajes"
            ;;
            
        ustats)
            echo -e "${PURPLE}📊 Integrando ÜStats (Estadísticas)${NC}"
            analyze_extracted_content "ÜStats" "coomunity_search_params"
            echo ""
            echo "📋 Pasos sugeridos para completar ÜStats:"
            echo "   1. Revisar dashboards en data/extracted/coomunity_search_params/"
            echo "   2. Migrar assets: cp -r data/extracted/coomunity_search_params/assets/* apps/superapp-unified/public/"
            echo "   3. Implementar métricas y análisis"
            echo "   4. Agregar gráficos y visualizaciones"
            echo "   5. Conectar con otros módulos para datos"
            ;;
            
        wallet)
            echo -e "${PURPLE}💰 Completando Wallet${NC}"
            analyze_extracted_content "Wallet" "coomunity_wallet"
            echo ""
            echo "📋 Pasos sugeridos para completar Wallet:"
            echo "   1. Revisar funcionalidades avanzadas en data/extracted/coomunity_wallet/"
            echo "   2. Migrar assets faltantes: cp -r data/extracted/coomunity_wallet/assets/* apps/superapp-unified/public/"
            echo "   3. Completar características pendientes (ya tiene 995 caracteres de contenido)"
            echo "   4. Agregar transacciones y historial"
            echo "   5. Integrar con otros módulos para pagos"
            ;;
            
        profile)
            echo -e "${PURPLE}👤 Creando Sistema de Perfiles${NC}"
            echo "⚠️ Este módulo requiere desarrollo desde cero (no hay contenido extraído específico)"
            echo ""
            echo "📋 Pasos sugeridos para crear Mi Perfil:"
            echo "   1. Diseñar componentes de perfil de usuario"
            echo "   2. Implementar edición de información personal"
            echo "   3. Agregar configuraciones de privacidad"
            echo "   4. Conectar con otros módulos para datos de usuario"
            echo "   5. Implementar avatar y personalización"
            ;;
            
        all)
            echo -e "${BLUE}📊 Información de todos los módulos:${NC}"
            echo ""
            integrate_module "marketplace"
            echo ""
            integrate_module "uplay"
            echo ""
            integrate_module "social"
            echo ""
            integrate_module "pilgrim"
            echo ""
            integrate_module "ustats"
            echo ""
            integrate_module "wallet"
            echo ""
            integrate_module "profile"
            ;;
            
        *)
            echo -e "${RED}❌ Módulo '$module' no reconocido${NC}"
            show_help
            exit 1
            ;;
    esac
}

# Función principal
main() {
    if [ $# -eq 0 ]; then
        show_help
        exit 1
    fi
    
    check_prerequisites
    echo ""
    
    integrate_module "$1"
    
    echo ""
    echo -e "${GREEN}✅ Análisis de integración completado${NC}"
    echo ""
    echo "🎯 Próximos pasos recomendados:"
    echo "   1. Ejecutar: npm run dev (para verificar que la app funciona)"
    echo "   2. Ejecutar: npx playwright test (para verificar estado actual)"
    echo "   3. Comenzar integración siguiendo los pasos sugeridos"
    echo "   4. Probar cada cambio incrementalmente"
    echo ""
    echo "📚 Documentación útil:"
    echo "   - Estado actual: docs/analysis/REPORTE_ESTADO_REAL_MODULOS.md"
    echo "   - Tests automatizados: tests/e2e/"
    echo "   - Monitoreo: scripts/maintenance/monitor-content-integration.sh"
}

# Ejecutar función principal
main "$@" 