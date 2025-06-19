#!/bin/bash

echo "🔧 EJECUTAR BACKEND NESTJS - GUÍA PASO A PASO"
echo "============================================="
echo ""

# Colores para mejor visualización
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 PASO 1: LOCALIZAR EL BACKEND${NC}"
echo "=================================="
echo ""

echo "🔍 Buscando ubicaciones comunes del backend..."
echo ""

# Opciones de ubicación
LOCATIONS=(
    "/Users/kevinp/Movies/GAMIFIER copy"
    "/Users/kevinp/Movies/GAMIFIER-copy"
    "/Users/kevinp/Movies/GAMIFIER copy/backend"
    "/Users/kevinp/Movies/GAMIFIER-copy/backend"
)

for location in "${LOCATIONS[@]}"; do
    if [ -d "$location" ]; then
        echo -e "✅ ${GREEN}ENCONTRADO:${NC} $location"
        if [ -f "$location/nest-cli.json" ]; then
            echo -e "   📁 ${GREEN}nest-cli.json encontrado${NC}"
            BACKEND_DIR="$location"
        fi
        if [ -f "$location/package.json" ]; then
            if grep -q "@nestjs/core" "$location/package.json" 2>/dev/null; then
                echo -e "   📦 ${GREEN}NestJS detectado en package.json${NC}"
                BACKEND_DIR="$location"
            fi
        fi
    else
        echo -e "❌ ${RED}NO EXISTE:${NC} $location"
    fi
done

echo ""

if [ -n "$BACKEND_DIR" ]; then
    echo -e "🎉 ${GREEN}BACKEND ENCONTRADO EN:${NC} $BACKEND_DIR"
    echo ""
    
    echo -e "${BLUE}📋 PASO 2: VERIFICAR DEPENDENCIAS${NC}"
    echo "=================================="
    echo ""
    
    # Verificar PostgreSQL
    echo "🔍 Verificando PostgreSQL..."
    if brew services list | grep -q "postgresql.*started"; then
        echo -e "✅ ${GREEN}PostgreSQL está ejecutándose${NC}"
        PG_STATUS="OK"
    else
        echo -e "❌ ${RED}PostgreSQL NO está ejecutándose${NC}"
        echo -e "💡 ${YELLOW}Ejecutar: brew services start postgresql@15${NC}"
        PG_STATUS="ERROR"
    fi
    
    # Verificar Redis
    echo "🔍 Verificando Redis..."
    if brew services list | grep -q "redis.*started"; then
        echo -e "✅ ${GREEN}Redis está ejecutándose${NC}"
        REDIS_STATUS="OK"
    else
        echo -e "❌ ${RED}Redis NO está ejecutándose${NC}"
        echo -e "💡 ${YELLOW}Ejecutar: brew services start redis${NC}"
        REDIS_STATUS="ERROR"
    fi
    
    echo ""
    
    # Verificar si el puerto está ocupado
    echo "🔍 Verificando puerto 3002..."
    if lsof -i :3002 >/dev/null 2>&1; then
        PROCESS_INFO=$(lsof -i :3002 | tail -n 1)
        echo -e "⚠️ ${YELLOW}Puerto 3002 está ocupado:${NC}"
        echo "   $PROCESS_INFO"
        echo -e "💡 ${YELLOW}Puede que el backend ya esté ejecutándose${NC}"
        PORT_STATUS="OCCUPIED"
    else
        echo -e "✅ ${GREEN}Puerto 3002 disponible${NC}"
        PORT_STATUS="FREE"
    fi
    
    echo ""
    
    # Verificar si backend ya responde
    echo "🔍 Verificando si backend ya está activo..."
    if curl -s "http://localhost:3002/health" >/dev/null 2>&1; then
        echo -e "🎉 ${GREEN}¡BACKEND YA ESTÁ FUNCIONANDO!${NC}"
        echo -e "✅ ${GREEN}Health check exitoso en http://localhost:3002/health${NC}"
        
        echo ""
        echo -e "${BLUE}📋 VERIFICACIÓN COMPLETA${NC}"
        echo "========================"
        echo ""
        
        # Hacer health check
        HEALTH_RESPONSE=$(curl -s "http://localhost:3002/health")
        echo "🩺 Health Check Response:"
        echo "$HEALTH_RESPONSE"
        
        echo ""
        echo -e "🎯 ${GREEN}EL BACKEND ESTÁ LISTO PARA USAR${NC}"
        echo ""
        echo "💡 Puedes continuar usando el frontend. Los videos reales deberían aparecer automáticamente."
        
        exit 0
    else
        echo -e "❌ ${RED}Backend no responde en puerto 3002${NC}"
        BACKEND_STATUS="NOT_RUNNING"
    fi
    
    echo ""
    
    if [ "$PG_STATUS" = "ERROR" ] || [ "$REDIS_STATUS" = "ERROR" ]; then
        echo -e "${RED}⚠️ DEPENDENCIAS FALTANTES${NC}"
        echo "=========================="
        echo ""
        
        if [ "$PG_STATUS" = "ERROR" ]; then
            echo -e "🔧 ${YELLOW}Para iniciar PostgreSQL:${NC}"
            echo "   brew services start postgresql@15"
            echo ""
        fi
        
        if [ "$REDIS_STATUS" = "ERROR" ]; then
            echo -e "🔧 ${YELLOW}Para iniciar Redis:${NC}"
            echo "   brew services start redis"
            echo ""
        fi
        
        echo -e "💡 ${BLUE}Ejecuta los comandos arriba y luego vuelve a ejecutar este script.${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}📋 PASO 3: EJECUTAR BACKEND${NC}"
    echo "==========================="
    echo ""
    
    if [ "$PORT_STATUS" = "OCCUPIED" ]; then
        echo -e "⚠️ ${YELLOW}El puerto 3002 está ocupado.${NC}"
        echo ""
        echo "Opciones:"
        echo "1. El backend ya puede estar ejecutándose (verifica con curl)"
        echo "2. Matar el proceso actual y reiniciar"
        echo ""
        echo -e "🔧 ${YELLOW}Para matar el proceso:${NC}"
        echo "   lsof -ti :3002 | xargs kill -9"
        echo ""
        echo -e "💡 ${BLUE}Luego vuelve a ejecutar este script.${NC}"
        exit 1
    fi
    
    echo -e "🚀 ${GREEN}LISTO PARA EJECUTAR BACKEND${NC}"
    echo ""
    echo -e "📁 ${BLUE}Directorio del backend:${NC} $BACKEND_DIR"
    echo ""
    
    echo -e "${YELLOW}COMANDOS PARA EJECUTAR MANUALMENTE:${NC}"
    echo "===================================="
    echo ""
    echo "1. Navegar al directorio del backend:"
    echo "   cd \"$BACKEND_DIR\""
    echo ""
    echo "2. Instalar dependencias (si es necesario):"
    echo "   npm install"
    echo ""
    echo "3. Ejecutar el backend:"
    echo "   npm run start:dev"
    echo ""
    echo "4. Verificar que funciona:"
    echo "   curl http://localhost:3002/health"
    echo ""
    
    echo -e "${GREEN}¿Quieres que ejecute el backend automáticamente? (y/n)${NC}"
    read -r RESPONSE
    
    if [[ "$RESPONSE" =~ ^[Yy]$ ]]; then
        echo ""
        echo -e "🚀 ${GREEN}EJECUTANDO BACKEND...${NC}"
        echo ""
        
        cd "$BACKEND_DIR"
        
        echo "📁 Directorio actual: $(pwd)"
        echo ""
        
        # Verificar si necesita npm install
        if [ ! -d "node_modules" ]; then
            echo "📦 Instalando dependencias..."
            npm install
            echo ""
        fi
        
        echo "🎬 Iniciando backend NestJS..."
        echo "⏱️  Esto puede tomar unos segundos..."
        echo ""
        echo -e "${YELLOW}Presiona Ctrl+C para detener el backend cuando ya no lo necesites.${NC}"
        echo ""
        
        # Ejecutar el backend
        npm run start:dev
        
    else
        echo ""
        echo -e "💡 ${BLUE}Muy bien. Ejecuta los comandos manualmente cuando estés listo.${NC}"
        echo ""
        echo -e "🎯 ${GREEN}Una vez que el backend esté ejecutándose, los videos reales aparecerán automáticamente en el frontend.${NC}"
    fi
    
else
    echo -e "❌ ${RED}NO SE PUDO LOCALIZAR EL BACKEND${NC}"
    echo ""
    echo -e "${YELLOW}BÚSQUEDA MANUAL REQUERIDA:${NC}"
    echo "=========================="
    echo ""
    echo "1. Buscar nest-cli.json en tu sistema:"
    echo "   find /Users/kevinp -name 'nest-cli.json' 2>/dev/null"
    echo ""
    echo "2. Buscar package.json con NestJS:"
    echo "   find /Users/kevinp -name 'package.json' -exec grep -l '@nestjs/core' {} \\; 2>/dev/null"
    echo ""
    echo "3. Una vez encontrado, navega a ese directorio y ejecuta:"
    echo "   cd [directorio-del-backend]"
    echo "   npm install"
    echo "   npm run start:dev"
    echo ""
fi

echo ""
echo "========================================"
echo -e "🔧 Script completado - $(date)"
echo "========================================"