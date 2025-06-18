#!/bin/bash

# 🔍 MONITOR EN TIEMPO REAL - SUPERAPP COOMUNITY
# Script para monitorear cambios en tiempo real durante desarrollo con Builder.io
# Especialmente útil para detectar dependencias faltantes y componentes nuevos

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuración
SUPERAPP_DIR="Demo/apps/superapp-unified"
WATCH_DIRS=("src/components" "src/pages" "src/lib" "src/hooks" "src/types")
LOG_FILE="logs/superapp-changes-$(date +%Y%m%d-%H%M%S).log"
BUILDER_LOG_FILE="logs/builder-io-changes-$(date +%Y%m%d-%H%M%S).log"

# Crear directorio de logs si no existe
mkdir -p logs

echo -e "${CYAN}🔍 INICIANDO MONITOR EN TIEMPO REAL - SUPERAPP COOMUNITY${NC}"
echo -e "${BLUE}📁 Directorio: $SUPERAPP_DIR${NC}"
echo -e "${BLUE}📝 Log principal: $LOG_FILE${NC}"
echo -e "${BLUE}🏗️ Log Builder.io: $BUILDER_LOG_FILE${NC}"
echo -e "${BLUE}📂 Monitoreando: ${WATCH_DIRS[*]}${NC}"
echo ""

# Función para verificar dependencias
check_dependencies() {
    local file=$1
    echo -e "${YELLOW}🔍 Verificando dependencias en: $file${NC}" | tee -a "$LOG_FILE"
    
    # Verificar imports de Material UI
    if grep -q "@mui/material" "$file" 2>/dev/null; then
        echo -e "${CYAN}📦 Material UI imports detectados${NC}" | tee -a "$LOG_FILE"
        grep "@mui/material" "$file" | sed 's/^/   /' | tee -a "$LOG_FILE"
    fi
    
    # Verificar imports de iconos (común problema con Builder.io)
    if grep -q "@mui/icons" "$file" 2>/dev/null; then
        echo -e "${CYAN}🎯 Icon imports detectados${NC}" | tee -a "$LOG_FILE"
        grep "@mui/icons" "$file" | sed 's/^/   /' | tee -a "$LOG_FILE"
        
        # Verificar si usa la ruta incorrecta
        if grep -q "@mui/material/icons" "$file" 2>/dev/null; then
            echo -e "${RED}⚠️ PROBLEMA: Importación incorrecta de iconos detectada!${NC}" | tee -a "$LOG_FILE"
            echo -e "${RED}   Debería ser: @mui/icons-material${NC}" | tee -a "$LOG_FILE"
        fi
    fi
    
    # Verificar dependencias potencialmente faltantes
    local missing_deps=()
    
    if grep -q "framer-motion" "$file" 2>/dev/null && ! npm ls framer-motion >/dev/null 2>&1; then
        missing_deps+=("framer-motion")
    fi
    
    if grep -q "react-hook-form" "$file" 2>/dev/null && ! npm ls react-hook-form >/dev/null 2>&1; then
        missing_deps+=("react-hook-form")
    fi
    
    if grep -q "@emotion" "$file" 2>/dev/null && ! npm ls @emotion/react >/dev/null 2>&1; then
        missing_deps+=("@emotion/react" "@emotion/styled")
    fi
    
    if [ ${#missing_deps[@]} -gt 0 ]; then
        echo -e "${RED}❌ DEPENDENCIAS FALTANTES DETECTADAS:${NC}" | tee -a "$LOG_FILE"
        printf '%s\n' "${missing_deps[@]}" | sed 's/^/   /' | tee -a "$LOG_FILE"
        echo -e "${YELLOW}💡 Comando sugerido: npm install ${missing_deps[*]} --legacy-peer-deps${NC}" | tee -a "$LOG_FILE"
    fi
}

# Función para analizar componentes nuevos
analyze_new_component() {
    local file=$1
    echo -e "${GREEN}🆕 COMPONENTE NUEVO DETECTADO: $file${NC}" | tee -a "$BUILDER_LOG_FILE"
    
    # Verificar si es un componente de Builder.io
    if grep -q "builder" "$file" 2>/dev/null || grep -q "Builder" "$file" 2>/dev/null; then
        echo -e "${PURPLE}🏗️ COMPONENTE BUILDER.IO DETECTADO${NC}" | tee -a "$BUILDER_LOG_FILE"
    fi
    
    # Extraer props y exports
    if grep -q "interface.*Props" "$file" 2>/dev/null; then
        echo -e "${CYAN}📋 Props detectadas:${NC}" | tee -a "$BUILDER_LOG_FILE"
        grep "interface.*Props" "$file" -A 10 | sed 's/^/   /' | tee -a "$BUILDER_LOG_FILE"
    fi
    
    if grep -q "export.*default" "$file" 2>/dev/null; then
        echo -e "${CYAN}📤 Export default detectado${NC}" | tee -a "$BUILDER_LOG_FILE"
        grep "export.*default" "$file" | sed 's/^/   /' | tee -a "$BUILDER_LOG_FILE"
    fi
    
    check_dependencies "$file"
}

# Función para verificar errores de compilación
check_compilation_errors() {
    echo -e "${YELLOW}🔧 Verificando errores de compilación...${NC}"
    
    cd "$SUPERAPP_DIR"
    
    # Verificar TypeScript
    if npx tsc --noEmit --skipLibCheck 2>&1 | grep -q "error"; then
        echo -e "${RED}❌ ERRORES DE TYPESCRIPT DETECTADOS:${NC}" | tee -a "$LOG_FILE"
        npx tsc --noEmit --skipLibCheck 2>&1 | grep "error" | sed 's/^/   /' | tee -a "$LOG_FILE"
    else
        echo -e "${GREEN}✅ TypeScript: Sin errores${NC}" | tee -a "$LOG_FILE"
    fi
    
    cd - >/dev/null
}

# Función para verificar estado de servicios
check_services_status() {
    echo -e "${CYAN}🌐 Estado de servicios:${NC}"
    
    # Backend
    if curl -s http://localhost:1111/health >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend (3002): OK${NC}"
    else
        echo -e "${RED}❌ Backend (3002): NO DISPONIBLE${NC}"
    fi
    
    # SuperApp
    if curl -s -I http://localhost:2222 >/dev/null 2>&1; then
        echo -e "${GREEN}✅ SuperApp (3001): OK${NC}"
    else
        echo -e "${RED}❌ SuperApp (3001): NO DISPONIBLE${NC}"
    fi
    
    echo ""
}

# Función principal de monitoreo
monitor_changes() {
    cd "$SUPERAPP_DIR"
    
    echo -e "${GREEN}🚀 Iniciando monitoreo con fswatch...${NC}"
    echo -e "${YELLOW}📝 Presiona Ctrl+C para detener${NC}"
    echo ""
    
    # Verificar estado inicial
    check_services_status
    check_compilation_errors
    
    # Iniciar monitoreo con fswatch (macOS) o inotifywait (Linux)
    if command -v fswatch >/dev/null 2>&1; then
        fswatch -o "${WATCH_DIRS[@]}" | while read num; do
            timestamp=$(date '+%Y-%m-%d %H:%M:%S')
            echo -e "${CYAN}[$timestamp] 🔄 CAMBIO DETECTADO${NC}" | tee -a "$LOG_FILE"
            
            # Encontrar archivos modificados recientemente (últimos 5 segundos)
            for dir in "${WATCH_DIRS[@]}"; do
                find "$dir" -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" | while read file; do
                    if [ -f "$file" ] && [ $(stat -f %m "$file") -gt $(($(date +%s) - 5)) ]; then
                        echo -e "${BLUE}📄 Archivo modificado: $file${NC}" | tee -a "$LOG_FILE"
                        
                        # Si es un archivo nuevo
                        if [ $(stat -f %m "$file") -gt $(($(date +%s) - 2)) ]; then
                            analyze_new_component "$file"
                        else
                            check_dependencies "$file"
                        fi
                    fi
                done
            done
            
            # Verificar compilación después de cambios
            check_compilation_errors
            echo -e "${CYAN}----------------------------------------${NC}" | tee -a "$LOG_FILE"
        done
    elif command -v inotifywait >/dev/null 2>&1; then
        inotifywait -m -r -e modify,create,delete "${WATCH_DIRS[@]}" --format '%w%f %e %T' --timefmt '%Y-%m-%d %H:%M:%S' | while read file event timestamp; do
            echo -e "${CYAN}[$timestamp] 🔄 $event: $file${NC}" | tee -a "$LOG_FILE"
            
            if [[ "$file" =~ \.(tsx|ts|jsx|js)$ ]]; then
                if [ "$event" = "CREATE" ]; then
                    analyze_new_component "$file"
                else
                    check_dependencies "$file"
                fi
                
                check_compilation_errors
            fi
            echo -e "${CYAN}----------------------------------------${NC}" | tee -a "$LOG_FILE"
        done
    else
        echo -e "${RED}❌ Error: fswatch (macOS) o inotify-tools (Linux) no están instalados${NC}"
        echo -e "${YELLOW}💡 Instalación:${NC}"
        echo -e "${YELLOW}   macOS: brew install fswatch${NC}"
        echo -e "${YELLOW}   Linux: sudo apt-get install inotify-tools${NC}"
        exit 1
    fi
}

# Función de cleanup
cleanup() {
    echo -e "\n${YELLOW}🛑 Deteniendo monitor...${NC}"
    echo -e "${GREEN}📝 Logs guardados en:${NC}"
    echo -e "${GREEN}   - $LOG_FILE${NC}"
    echo -e "${GREEN}   - $BUILDER_LOG_FILE${NC}"
    exit 0
}

# Configurar trap para cleanup
trap cleanup SIGINT SIGTERM

# Verificar si estamos en el directorio correcto
if [ ! -d "$SUPERAPP_DIR" ]; then
    echo -e "${RED}❌ Error: Directorio $SUPERAPP_DIR no encontrado${NC}"
    echo -e "${YELLOW}💡 Ejecuta este script desde la raíz del monorepo${NC}"
    exit 1
fi

# Iniciar monitoreo
monitor_changes 