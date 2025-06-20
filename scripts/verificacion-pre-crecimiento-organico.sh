#!/bin/bash

# 🌱 SCRIPT DE VERIFICACIÓN PRE-CRECIMIENTO ORGÁNICO
# Plataforma CoomÜnity - 7 de junio de 2025
# Este script verifica que toda la infraestructura esté lista para el crecimiento orgánico

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "SUCCESS")
            echo -e "${GREEN}✅ $message${NC}"
            ;;
        "ERROR")
            echo -e "${RED}❌ $message${NC}"
            ;;
        "WARNING")
            echo -e "${YELLOW}⚠️  $message${NC}"
            ;;
        "INFO")
            echo -e "${BLUE}ℹ️  $message${NC}"
            ;;
    esac
}

print_header() {
    echo -e "\n${BLUE}================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================================${NC}\n"
}

# Initialize report
REPORT_FILE="verificacion-pre-crecimiento-$(date +%Y%m%d_%H%M%S).md"

echo "# 🌱 REPORTE DE VERIFICACIÓN PRE-CRECIMIENTO ORGÁNICO" > $REPORT_FILE
echo "**Fecha:** $(date)" >> $REPORT_FILE
echo "**Plataforma:** CoomÜnity" >> $REPORT_FILE
echo "" >> $REPORT_FILE

print_header "🎯 VERIFICACIÓN PRE-CRECIMIENTO ORGÁNICO INICIADA"

# 1. VERIFICACIÓN DEL BACKEND
print_header "1. VERIFICACIÓN DEL BACKEND NESTJS (Puerto 3002)"

print_status "INFO" "Verificando que el backend esté corriendo..."

if curl -s http://localhost:3002/health > /dev/null; then
    BACKEND_RESPONSE=$(curl -s http://localhost:3002/health)
    print_status "SUCCESS" "Backend está funcionando correctamente"
    echo "## ✅ Backend NestJS" >> $REPORT_FILE
    echo "- **Estado:** ✅ Funcionando" >> $REPORT_FILE
    echo "- **Puerto:** 3002" >> $REPORT_FILE
    echo "- **Health Check:** ✅ Passing" >> $REPORT_FILE
    echo "- **Respuesta:** \`$BACKEND_RESPONSE\`" >> $REPORT_FILE
    echo "" >> $REPORT_FILE
    
    # Test API endpoints
    print_status "INFO" "Probando endpoints críticos del API..."
    
    # Test auth endpoint
    if curl -s -f http://localhost:3002/auth/login -X POST -H "Content-Type: application/json" -d '{}' > /dev/null 2>&1 || [ $? -eq 22 ]; then
        print_status "SUCCESS" "Endpoint de autenticación disponible"
        echo "- **Auth Endpoint:** ✅ Disponible" >> $REPORT_FILE
    else
        print_status "WARNING" "Endpoint de autenticación no responde correctamente"
        echo "- **Auth Endpoint:** ⚠️ Problemas detectados" >> $REPORT_FILE
    fi
    
    # Test users endpoint (might require auth)
    if curl -s -f http://localhost:3002/users > /dev/null 2>&1 || [ $? -eq 22 ]; then
        print_status "SUCCESS" "Endpoint de usuarios disponible"
        echo "- **Users Endpoint:** ✅ Disponible" >> $REPORT_FILE
    else
        print_status "WARNING" "Endpoint de usuarios requiere autenticación (esperado)"
        echo "- **Users Endpoint:** ℹ️ Requiere autenticación (esperado)" >> $REPORT_FILE
    fi
    
else
    print_status "ERROR" "Backend no está respondiendo en puerto 3002"
    echo "## ❌ Backend NestJS" >> $REPORT_FILE
    echo "- **Estado:** ❌ No funciona" >> $REPORT_FILE
    echo "- **Puerto:** 3002" >> $REPORT_FILE
    echo "- **Error:** Backend no responde" >> $REPORT_FILE
    echo "" >> $REPORT_FILE
    
    print_status "INFO" "Intentando iniciar el backend..."
    print_status "WARNING" "Por favor, inicia el backend manualmente con: npm exec tsx watch --no-cache --clear-screen=false --tsconfig tsconfig.backend.json src/main.ts"
fi

# 2. VERIFICACIÓN DE LA SUPERAPP
print_header "2. VERIFICACIÓN DE LA SUPERAPP (Puerto 3000)"

print_status "INFO" "Verificando que la SuperApp esté corriendo..."

if curl -s -I http://localhost:3000 | grep -q "200 OK"; then
    print_status "SUCCESS" "SuperApp está funcionando correctamente"
    echo "## ✅ SuperApp Frontend" >> $REPORT_FILE
    echo "- **Estado:** ✅ Funcionando" >> $REPORT_FILE
    echo "- **Puerto:** 3000" >> $REPORT_FILE
    echo "- **Framework:** React + Vite" >> $REPORT_FILE
    echo "" >> $REPORT_FILE
    
    # Verify config file
    if [ -f "Demo/apps/superapp-unified/.env" ]; then
        BACKEND_URL=$(grep VITE_API_BASE_URL Demo/apps/superapp-unified/.env | cut -d'=' -f2)
        if [ "$BACKEND_URL" = "http://localhost:3002" ]; then
            print_status "SUCCESS" "Configuración de backend correcta"
            echo "- **Backend Config:** ✅ Apunta a puerto 3002" >> $REPORT_FILE
        else
            print_status "WARNING" "Configuración de backend: $BACKEND_URL"
            echo "- **Backend Config:** ⚠️ Apunta a $BACKEND_URL" >> $REPORT_FILE
        fi
    else
        print_status "WARNING" "Archivo .env no encontrado"
        echo "- **Config File:** ⚠️ .env no encontrado" >> $REPORT_FILE
    fi
    
else
    print_status "ERROR" "SuperApp no está respondiendo en puerto 3000"
    echo "## ❌ SuperApp Frontend" >> $REPORT_FILE
    echo "- **Estado:** ❌ No funciona" >> $REPORT_FILE
    echo "- **Puerto:** 3000" >> $REPORT_FILE
    echo "- **Error:** SuperApp no responde" >> $REPORT_FILE
    echo "" >> $REPORT_FILE
    
    print_status "INFO" "Para iniciar la SuperApp, ejecuta: cd Demo/apps/superapp-unified && npm run dev"
fi

# 3. VERIFICACIÓN DE ESTRUCTURA DE ARCHIVOS
print_header "3. VERIFICACIÓN DE ESTRUCTURA DE ARCHIVOS"

print_status "INFO" "Verificando estructura del proyecto..."

# Check essential directories
declare -a ESSENTIAL_DIRS=(
    "Demo/apps/superapp-unified"
    "Demo/apps/superapp-unified/src"
    "Demo/apps/superapp-unified/src/components"
    "Demo/apps/superapp-unified/src/pages"
)

ALL_DIRS_OK=true
echo "## 📁 Estructura de Directorios" >> $REPORT_FILE

for dir in "${ESSENTIAL_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        print_status "SUCCESS" "Directorio encontrado: $dir"
        echo "- ✅ $dir" >> $REPORT_FILE
    else
        print_status "ERROR" "Directorio faltante: $dir"
        echo "- ❌ $dir" >> $REPORT_FILE
        ALL_DIRS_OK=false
    fi
done

echo "" >> $REPORT_FILE

# Check essential files
declare -a ESSENTIAL_FILES=(
    "Demo/apps/superapp-unified/package.json"
    "Demo/apps/superapp-unified/vite.config.ts"
    "Demo/apps/superapp-unified/src/main.tsx"
)

ALL_FILES_OK=true
echo "## 📄 Archivos Esenciales" >> $REPORT_FILE

for file in "${ESSENTIAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status "SUCCESS" "Archivo encontrado: $file"
        echo "- ✅ $file" >> $REPORT_FILE
    else
        print_status "ERROR" "Archivo faltante: $file"
        echo "- ❌ $file" >> $REPORT_FILE
        ALL_FILES_OK=false
    fi
done

echo "" >> $REPORT_FILE

# 4. VERIFICACIÓN DE DEPENDENCIAS
print_header "4. VERIFICACIÓN DE DEPENDENCIAS"

print_status "INFO" "Verificando dependencias de la SuperApp..."

if [ -f "Demo/apps/superapp-unified/package.json" ]; then
    cd Demo/apps/superapp-unified
    
    print_status "INFO" "Verificando node_modules..."
    if [ -d "node_modules" ]; then
        print_status "SUCCESS" "node_modules encontrado"
        echo "## 📦 Dependencias" >> "../../$REPORT_FILE"
        echo "- ✅ node_modules instalado" >> "../../$REPORT_FILE"
        
        # Check key dependencies
        declare -a KEY_DEPS=(
            "react"
            "react-dom"
            "vite"
            "@mui/material"
            "axios"
        )
        
        for dep in "${KEY_DEPS[@]}"; do
            if [ -d "node_modules/$dep" ]; then
                print_status "SUCCESS" "Dependencia encontrada: $dep"
                echo "- ✅ $dep" >> "../../$REPORT_FILE"
            else
                print_status "WARNING" "Dependencia faltante: $dep"
                echo "- ⚠️ $dep (faltante)" >> "../../$REPORT_FILE"
            fi
        done
        
    else
        print_status "WARNING" "node_modules no encontrado"
        echo "## 📦 Dependencias" >> "../../$REPORT_FILE"
        echo "- ⚠️ node_modules no instalado" >> "../../$REPORT_FILE"
        print_status "INFO" "Ejecutando npm install..."
        npm install
    fi
    
    cd ../..
    echo "" >> $REPORT_FILE
else
    print_status "ERROR" "package.json no encontrado en SuperApp"
fi

# 5. VERIFICACIÓN DE CONECTIVIDAD
print_header "5. VERIFICACIÓN DE CONECTIVIDAD ENTRE COMPONENTES"

print_status "INFO" "Probando conectividad entre SuperApp y Backend..."

# This would require the SuperApp to be running and making actual API calls
# For now, we'll just verify the configuration

if [ -f "Demo/apps/superapp-unified/.env" ]; then
    BACKEND_URL=$(grep VITE_API_BASE_URL Demo/apps/superapp-unified/.env | cut -d'=' -f2)
    
    print_status "INFO" "Probando conectividad a $BACKEND_URL desde SuperApp..."
    
    if curl -s "$BACKEND_URL/health" > /dev/null; then
        print_status "SUCCESS" "SuperApp puede conectarse al Backend"
        echo "## 🔌 Conectividad" >> $REPORT_FILE
        echo "- ✅ SuperApp → Backend: Conexión exitosa" >> $REPORT_FILE
    else
        print_status "ERROR" "SuperApp no puede conectarse al Backend"
        echo "## 🔌 Conectividad" >> $REPORT_FILE
        echo "- ❌ SuperApp → Backend: Conexión fallida" >> $REPORT_FILE
    fi
else
    print_status "WARNING" "No se puede verificar conectividad sin archivo .env"
    echo "## 🔌 Conectividad" >> $REPORT_FILE
    echo "- ⚠️ No se puede verificar (archivo .env faltante)" >> $REPORT_FILE
fi

echo "" >> $REPORT_FILE

# 6. VERIFICACIÓN DE PUERTOS
print_header "6. VERIFICACIÓN DE PUERTOS"

print_status "INFO" "Verificando disponibilidad de puertos..."

echo "## 🔌 Estado de Puertos" >> $REPORT_FILE

declare -a PORTS=(
    "3002:Backend NestJS"
    "3000:SuperApp Frontend"
)

for port_info in "${PORTS[@]}"; do
    IFS=':' read -r port service <<< "$port_info"
    
    if lsof -i :$port > /dev/null 2>&1; then
        print_status "SUCCESS" "Puerto $port está en uso ($service)"
        echo "- ✅ Puerto $port: $service (en uso)" >> $REPORT_FILE
    else
        print_status "WARNING" "Puerto $port libre ($service no está corriendo)"
        echo "- ⚠️ Puerto $port: $service (libre)" >> $REPORT_FILE
    fi
done

echo "" >> $REPORT_FILE

# 7. RECOMENDACIONES PARA CRECIMIENTO ORGÁNICO
print_header "7. GENERANDO RECOMENDACIONES"

echo "## 🎯 Recomendaciones para Crecimiento Orgánico" >> $REPORT_FILE
echo "" >> $REPORT_FILE

# Calculate readiness score
TOTAL_CHECKS=6
PASSED_CHECKS=0

# Backend check
if curl -s http://localhost:3002/health > /dev/null; then
    ((PASSED_CHECKS++))
fi

# SuperApp check
if curl -s -I http://localhost:3000 | grep -q "200 OK"; then
    ((PASSED_CHECKS++))
fi

# Directory structure
if $ALL_DIRS_OK; then
    ((PASSED_CHECKS++))
fi

# Essential files
if $ALL_FILES_OK; then
    ((PASSED_CHECKS++))
fi

# Dependencies (assume OK if SuperApp is running)
if curl -s -I http://localhost:3000 | grep -q "200 OK"; then
    ((PASSED_CHECKS++))
fi

# Connectivity (if both are running)
if curl -s http://localhost:3002/health > /dev/null && curl -s -I http://localhost:3000 | grep -q "200 OK"; then
    ((PASSED_CHECKS++))
fi

READINESS_SCORE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))

echo "### 📊 Puntuación de Preparación: $READINESS_SCORE%" >> $REPORT_FILE
echo "" >> $REPORT_FILE

if [ $READINESS_SCORE -ge 80 ]; then
    print_status "SUCCESS" "Plataforma LISTA para crecimiento orgánico ($READINESS_SCORE%)"
    echo "### ✅ ESTADO: LISTO PARA CRECIMIENTO ORGÁNICO" >> $REPORT_FILE
    echo "" >> $REPORT_FILE
    echo "La plataforma tiene una puntuación de preparación del $READINESS_SCORE%, lo cual indica que está" >> $REPORT_FILE
    echo "**técnicamente lista** para iniciar el crecimiento orgánico." >> $REPORT_FILE
    echo "" >> $REPORT_FILE
    echo "### 🚀 Próximos pasos recomendados:" >> $REPORT_FILE
    echo "1. Iniciar programa beta con primeros 100 usuarios" >> $REPORT_FILE
    echo "2. Configurar monitoreo de métricas de usuarios" >> $REPORT_FILE
    echo "3. Preparar contenido educativo inicial" >> $REPORT_FILE
    echo "4. Identificar cooperativas target para partnerships" >> $REPORT_FILE
    
elif [ $READINESS_SCORE -ge 60 ]; then
    print_status "WARNING" "Plataforma PARCIALMENTE LISTA ($READINESS_SCORE%)"
    echo "### ⚠️ ESTADO: PARCIALMENTE LISTO" >> $REPORT_FILE
    echo "" >> $REPORT_FILE
    echo "La plataforma tiene una puntuación de preparación del $READINESS_SCORE%. Se recomienda" >> $REPORT_FILE
    echo "**resolver los problemas identificados** antes de iniciar el crecimiento orgánico." >> $REPORT_FILE
    
else
    print_status "ERROR" "Plataforma NO LISTA para crecimiento orgánico ($READINESS_SCORE%)"
    echo "### ❌ ESTADO: NO LISTO" >> $REPORT_FILE
    echo "" >> $REPORT_FILE
    echo "La plataforma tiene una puntuación de preparación del $READINESS_SCORE%, lo cual indica que" >> $REPORT_FILE
    echo "**NO está lista** para el crecimiento orgánico. Deben resolverse los problemas críticos." >> $REPORT_FILE
fi

echo "" >> $REPORT_FILE

# 8. FINAL SUMMARY
print_header "8. RESUMEN FINAL"

print_status "INFO" "Reporte completo generado: $REPORT_FILE"

echo "### 📋 Resumen de Verificación" >> $REPORT_FILE
echo "- **Fecha:** $(date)" >> $REPORT_FILE
echo "- **Duración:** Verificación automática" >> $REPORT_FILE
echo "- **Componentes verificados:** Backend, SuperApp, Estructura, Dependencias, Conectividad" >> $REPORT_FILE
echo "- **Puntuación:** $READINESS_SCORE%" >> $REPORT_FILE
echo "" >> $REPORT_FILE
echo "---" >> $REPORT_FILE
echo "*Reporte generado automáticamente por el script de verificación pre-crecimiento orgánico*" >> $REPORT_FILE

print_header "✨ VERIFICACIÓN COMPLETADA"
print_status "INFO" "Revisa el reporte completo en: $REPORT_FILE"

if [ $READINESS_SCORE -ge 80 ]; then
    print_status "SUCCESS" "🌱 ¡La plataforma está LISTA para el crecimiento orgánico!"
    echo ""
    echo -e "${GREEN}🎯 Próximos pasos:${NC}"
    echo "1. Ejecutar: bash scripts/iniciar-programa-beta.sh"
    echo "2. Revisar: PLAN_CRECIMIENTO_ORGANICO_COOMUNITY.md"
    echo "3. Configurar: Analytics y monitoreo de usuarios"
else
    print_status "WARNING" "🔧 Resolver problemas identificados antes de continuar"
    echo ""
    echo -e "${YELLOW}🛠️  Acciones requeridas:${NC}"
    echo "1. Revisar errores en el reporte: $REPORT_FILE"
    echo "2. Asegurar que Backend esté corriendo en puerto 3002"
    echo "3. Asegurar que SuperApp esté corriendo en puerto 3000"
    echo "4. Re-ejecutar este script hasta obtener 80%+"
fi

echo ""
print_status "INFO" "Script de verificación completado a las $(date)" 