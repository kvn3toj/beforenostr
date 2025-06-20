#!/bin/bash

# 🚀 Script de Deployment para Render - CoomÜnity SuperApp
set -e

echo "🎯 Iniciando deployment a Render..."

# 📊 Verificar configuración
echo "📋 Verificando configuración previa..."

if [ ! -f "render.yaml" ]; then
    echo "❌ Error: render.yaml no encontrado"
    exit 1
fi

echo "✅ Configuración encontrada"

# 🏗️ Build local para verificar
echo "🔧 Ejecutando build local para verificación..."
npm install --legacy-peer-deps
npm run build

echo "✅ Build local exitoso"

# 📋 Variables de entorno requeridas
echo "🔑 Verificando variables de entorno..."

REQUIRED_VARS=(
    "VITE_API_BASE_URL"
    "VITE_ENABLE_MOCK_AUTH"
    "VITE_BASE_URL"
)

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "⚠️ Advertencia: Variable $var no configurada"
    else
        echo "✅ $var configurada"
    fi
done

# 🌟 Instrucciones para deployment
echo ""
echo "📋 INSTRUCCIONES DE DEPLOYMENT EN RENDER:"
echo "==============================================="
echo ""
echo "1. 🌐 Ve a https://render.com"
echo "2. 🔗 Conecta tu repositorio de GitHub"
echo "3. 📂 Selecciona este directorio: Demo/apps/superapp-unified/"
echo "4. ⚙️ Configuración sugerida:"
echo "   - Runtime: Node"
echo "   - Build Command: npm install --legacy-peer-deps && npm run build"
echo "   - Start Command: npm run preview"
echo "   - Root Directory: Demo/apps/superapp-unified"
echo ""
echo "5. 🔑 Variables de entorno a configurar:"
echo "   - NODE_ENV=production"
echo "   - VITE_API_BASE_URL=https://backend-production-80bb.up.railway.app"
echo "   - VITE_ENABLE_MOCK_AUTH=false"
echo "   - VITE_BASE_URL=https://[tu-app].onrender.com"
echo "   - VITE_SUPABASE_URL=[tu-url-supabase]"
echo "   - VITE_SUPABASE_ANON_KEY=[tu-key-supabase]"
echo ""
echo "6. 🚀 Deploy!"
echo ""

# 🎯 Configuración adicional
echo "🔧 CONFIGURACIONES ADICIONALES:"
echo "================================"
echo ""
echo "📁 Archivos incluidos para Render:"
echo "  ✅ render.yaml - Configuración de servicios"
echo "  ✅ Dockerfile.render - Container configuration"
echo "  ✅ package.json - Dependencias y scripts"
echo "  ✅ vite.config.ts - Build configuration"
echo ""
echo "🌟 Features habilitadas:"
echo "  ✅ Static Site Generation"
echo "  ✅ SPA Routing"
echo "  ✅ Environment Variables"
echo "  ✅ Health Checks"
echo "  ✅ Auto-deploy en push"
echo ""

# 🎨 Banner final
echo "🎉 ¡Listo para deployment en Render!"
echo "🔗 URL esperada: https://coomunity-superapp.onrender.com"
echo ""
echo "📚 Documentación: https://render.com/docs/web-services"
echo "🐛 Troubleshooting: https://render.com/docs/troubleshooting"
