#!/bin/bash

# CoomÜnity Backend - Script de Instalación
# Este script instala todas las dependencias y configura el backend

set -e

echo "🚀 Instalando CoomÜnity Backend API Server..."
echo "=============================================="

# Verificar que estemos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Este script debe ejecutarse desde el directorio backend/"
    echo "   cd backend/ && ./install.sh"
    exit 1
fi

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado"
    echo "   Instala Node.js desde https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js detectado: $NODE_VERSION"

# Verificar que npm esté instalado
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm no está instalado"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo "✅ npm detectado: $NPM_VERSION"

# Instalar dependencias
echo ""
echo "📦 Instalando dependencias..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencias instaladas correctamente"
else
    echo "❌ Error instalando dependencias"
    exit 1
fi

# Crear archivo .env si no existe
if [ ! -f ".env" ]; then
    echo ""
    echo "⚙️  Creando archivo de configuración..."
    cp env.example .env
    echo "✅ Archivo .env creado desde env.example"
    echo "   Puedes editarlo si necesitas cambiar configuraciones"
else
    echo "⚙️  Archivo .env ya existe, no se sobreescribirá"
fi

# Verificar estructura de datos
DATA_PATH="../data/backups/my_recovered_website/shared/data"
if [ -d "$DATA_PATH" ]; then
    echo "✅ Directorio de datos encontrado: $DATA_PATH"
    
    # Verificar archivos específicos
    if [ -f "$DATA_PATH/mock-recommendations.json" ]; then
        echo "✅ Archivo de recomendaciones encontrado"
    else
        echo "⚠️  Archivo mock-recommendations.json no encontrado en $DATA_PATH"
    fi
else
    echo "⚠️  Directorio de datos no encontrado: $DATA_PATH"
    echo "   El servidor funcionará, pero algunos endpoints podrían fallar"
fi

echo ""
echo "🎉 Instalación completada!"
echo "========================="
echo ""
echo "Comandos para iniciar el servidor:"
echo "  npm start       - Modo producción"
echo "  npm run dev     - Modo desarrollo (reinicio automático)"
echo ""
echo "URLs importantes:"
echo "  Backend API:    http://localhost:3000"
echo "  Health Check:   http://localhost:3000/health"
echo "  Documentación:  http://localhost:3000/api"
echo ""
echo "Para testing rápido:"
echo "  ./test.sh       - Ejecutar tests básicos"
echo "" 