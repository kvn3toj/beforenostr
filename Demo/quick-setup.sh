#!/bin/bash

# CoomÜnity Backend Migration - Quick Setup
# Script para configurar rápidamente el backend y testing

set -e

echo "🚀 CoomÜnity Backend Migration - Quick Setup"
echo "============================================="
echo ""

# Verificar que estemos en el directorio correcto
if [ ! -d "backend" ]; then
    echo "❌ Error: Directorio 'backend' no encontrado"
    echo "   Este script debe ejecutarse desde el directorio raíz del proyecto"
    exit 1
fi

# Paso 1: Instalar backend
echo "📦 Paso 1: Instalando Backend..."
echo "================================="
cd backend/
./install.sh

if [ $? -ne 0 ]; then
    echo "❌ Error en la instalación del backend"
    exit 1
fi

# Volver al directorio raíz
cd ../

echo ""
echo "🎯 Paso 2: Verificación de estructura..."
echo "========================================"

# Verificar estructura del proyecto
echo "Verificando estructura del proyecto..."

required_dirs=(
    "backend"
    "data/backups/my_recovered_website"
    "scripts/setup"
    "docs"
)

for dir in "${required_dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ $dir"
    else
        echo "⚠️  $dir (no encontrado, puede afectar funcionalidad)"
    fi
done

echo ""
echo "📋 Paso 3: Resumen de instalación..."
echo "===================================="

cat << EOF

✅ Backend instalado correctamente

📁 Estructura creada:
   backend/
   ├── server.js              # Servidor principal Express
   ├── package.json           # Dependencias y scripts
   ├── .env                   # Configuración de entorno
   ├── README.md             # Documentación completa
   ├── install.sh            # Script de instalación
   └── test.sh               # Script de testing

📄 Documentación creada:
   docs/MIGRATION_PLAN.md     # Plan completo de migración

🚀 Para iniciar el backend:
   cd backend/
   npm start                  # Modo producción
   npm run dev               # Modo desarrollo

🧪 Para testing:
   cd backend/
   ./test.sh                 # Tests automáticos de todos los endpoints

📚 URLs importantes:
   Backend API:    http://localhost:3333
   Health Check:   http://localhost:3333/health
   Documentación:  http://localhost:3333/api

EOF

echo ""
echo "🔄 Próximos pasos de migración:"
echo "==============================="

cat << EOF

1. 📖 Leer plan de migración completo:
   cat docs/MIGRATION_PLAN.md

2. 🚀 Iniciar backend:
   cd backend/
   npm run dev

3. 🧪 Verificar que funciona:
   cd backend/
   ./test.sh

4. 🔍 Identificar llamadas de API en frontend:
   grep -r "fetch.*api" data/backups/my_recovered_website/

5. 🔄 Migrar llamadas de frontend una por una según el plan

6. 🧹 Limpiar servidor frontend original (remover APIs mockeadas)

EOF

echo ""
echo "🎉 Setup completado exitosamente!"
echo ""
echo "Para documentación detallada:"
echo "  backend/README.md       - Documentación del backend"
echo "  docs/MIGRATION_PLAN.md  - Plan completo de migración"
echo "" 