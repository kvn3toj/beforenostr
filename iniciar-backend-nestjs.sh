#!/bin/bash

echo "🔍 LOCALIZANDO Y EJECUTANDO BACKEND NESTJS - CoomÜnity"
echo "======================================================"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "\n${BLUE}📋 1. BÚSQUEDA DEL BACKEND NESTJS${NC}"
echo "--------------------------------"

# Buscar archivos característicos de NestJS
echo "🔍 Buscando archivos de configuración NestJS..."

NEST_CLI=$(find . -name "nest-cli.json" -not -path "*/node_modules/*" 2>/dev/null | head -1)
MAIN_TS=$(find . -name "main.ts" -path "*/src/*" -not -path "*/node_modules/*" 2>/dev/null | head -1)
PACKAGE_JSON_BACKEND=$(find . -name "package.json" -not -path "*/node_modules/*" -exec grep -l "@nestjs/core" {} \; 2>/dev/null | head -1)

if [ -n "$NEST_CLI" ]; then
    echo -e "${GREEN}✅ nest-cli.json encontrado: $NEST_CLI${NC}"
    BACKEND_DIR=$(dirname "$NEST_CLI")
elif [ -n "$MAIN_TS" ]; then
    echo -e "${GREEN}✅ main.ts encontrado: $MAIN_TS${NC}"
    BACKEND_DIR=$(dirname $(dirname "$MAIN_TS"))
elif [ -n "$PACKAGE_JSON_BACKEND" ]; then
    echo -e "${GREEN}✅ package.json con NestJS encontrado: $PACKAGE_JSON_BACKEND${NC}"
    BACKEND_DIR=$(dirname "$PACKAGE_JSON_BACKEND")
else
    echo -e "${YELLOW}⚠️ No se encontró configuración de NestJS en este workspace${NC}"
    BACKEND_DIR=""
fi

echo -e "\n${BLUE}📋 2. VERIFICACIÓN DE SCRIPTS DISPONIBLES${NC}"
echo "-------------------------------------------"

# Verificar scripts en package.json del proyecto principal
echo "🔍 Verificando scripts en package.json principal..."
if grep -q "dev.*backend" package.json 2>/dev/null; then
    echo -e "${GREEN}✅ Script dev:backend encontrado en package.json principal${NC}"
    SCRIPT_AVAILABLE="main"
elif [ -n "$BACKEND_DIR" ] && [ -f "$BACKEND_DIR/package.json" ]; then
    echo "🔍 Verificando scripts en $BACKEND_DIR/package.json..."
    
    if grep -q "start:dev" "$BACKEND_DIR/package.json" 2>/dev/null; then
        echo -e "${GREEN}✅ Script start:dev encontrado en $BACKEND_DIR${NC}"
        SCRIPT_AVAILABLE="backend"
    elif grep -q "dev" "$BACKEND_DIR/package.json" 2>/dev/null; then
        echo -e "${GREEN}✅ Script dev encontrado en $BACKEND_DIR${NC}"  
        SCRIPT_AVAILABLE="backend"
    else
        echo -e "${YELLOW}⚠️ No se encontraron scripts de desarrollo en $BACKEND_DIR${NC}"
        SCRIPT_AVAILABLE=""
    fi
else
    echo -e "${YELLOW}⚠️ No se encontraron scripts de backend${NC}"
    SCRIPT_AVAILABLE=""
fi

echo -e "\n${BLUE}📋 3. EJECUTAR BACKEND${NC}"
echo "---------------------"

if [ "$SCRIPT_AVAILABLE" = "main" ]; then
    echo "🚀 Ejecutando backend desde package.json principal..."
    echo "Comando: npm run dev:backend"
    npm run dev:backend
    
elif [ "$SCRIPT_AVAILABLE" = "backend" ] && [ -n "$BACKEND_DIR" ]; then
    echo "🚀 Ejecutando backend desde $BACKEND_DIR..."
    cd "$BACKEND_DIR"
    
    if grep -q "start:dev" package.json; then
        echo "Comando: npm run start:dev"
        npm run start:dev
    else
        echo "Comando: npm run dev" 
        npm run dev
    fi
    
else
    echo -e "${YELLOW}⚠️ BACKEND NO ENCONTRADO AUTOMÁTICAMENTE${NC}"
    echo ""
    echo "Manual de ubicación del backend:"
    echo "1. Buscar directorio con nest-cli.json:"
    find . -name "nest-cli.json" -not -path "*/node_modules/*" 2>/dev/null
    echo ""
    echo "2. Buscar directorios con main.ts:"
    find . -name "main.ts" -path "*/src/*" -not -path "*/node_modules/*" 2>/dev/null
    echo ""
    echo "3. Buscar package.json con @nestjs/core:"
    find . -name "package.json" -not -path "*/node_modules/*" -exec grep -l "@nestjs/core" {} \; 2>/dev/null
    echo ""
    echo -e "${BLUE}💡 INSTRUCCIONES MANUALES:${NC}"
    echo "1. cd [directorio-del-backend]"
    echo "2. npm install (si es necesario)"
    echo "3. npm run start:dev (o npm run dev)"
    echo ""
    echo -e "${BLUE}💡 PUERTOS COMUNES PARA VERIFICAR:${NC}"
    echo "- Backend NestJS: http://localhost:3002"
    echo "- Backend alternativo: http://localhost:3000"
    echo "- Backend alternativo: http://localhost:8000"
fi

echo -e "\n${BLUE}📋 4. VERIFICACIÓN POST-INICIO${NC}"
echo "-------------------------------"

echo "⏳ Esperando 5 segundos para que el backend se inicie..."
sleep 5

echo "🔍 Verificando puertos comunes..."

for port in 3002 3000 8000; do
    echo "  Probando puerto $port..."
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:$port/health 2>/dev/null | grep -q "200"; then
        echo -e "  ${GREEN}✅ Backend respondiendo en puerto $port${NC}"
        echo "  🔗 URL: http://localhost:$port"
        
        # Probar autenticación
        echo "  🔐 Probando autenticación..."
        AUTH_RESPONSE=$(curl -s -X POST "http://localhost:$port/auth/login" \
            -H "Content-Type: application/json" \
            -d '{"email":"admin@gamifier.com","password":"admin123"}' 2>/dev/null)
        
        if echo "$AUTH_RESPONSE" | grep -q "access_token"; then
            echo -e "  ${GREEN}✅ Autenticación funcionando${NC}"
        else
            echo -e "  ${YELLOW}⚠️ Autenticación no verificada${NC}"
        fi
        
        BACKEND_FOUND=true
        break
    else
        echo -e "  ${RED}❌ No responde en puerto $port${NC}"
    fi
done

if [ "$BACKEND_FOUND" != true ]; then
    echo -e "\n${YELLOW}⚠️ BACKEND NO DETECTADO${NC}"
    echo "Posibles causas:"
    echo "1. Backend aún iniciándose (esperar más tiempo)"
    echo "2. Error en configuración de base de datos"
    echo "3. Puerto diferente al esperado"
    echo "4. Backend no instalado en este workspace"
    echo ""
    echo "💡 Revisar logs de ejecución para más detalles"
fi

echo -e "\n======================================================"
echo "🔍 Búsqueda completada - $(date)"
echo "======================================================"