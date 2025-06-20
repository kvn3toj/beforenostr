#!/bin/bash

# 🚀 Script de Deploy PWA - CoomÜnity SuperApp
# Para prelanzamiento de 100 usuarios

echo "🚀 Iniciando deploy de CoomÜnity SuperApp PWA..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecuta este script desde Demo/apps/superapp-unified/"
    exit 1
fi

# Limpiar build anterior
echo "🧹 Limpiando build anterior..."
rm -rf dist/

# Instalar dependencias si es necesario
echo "📦 Verificando dependencias..."
npm install --legacy-peer-deps

# Build de producción
echo "🔨 Construyendo PWA para producción..."
npm run build

# Verificar que el build fue exitoso
if [ ! -d "dist" ]; then
    echo "❌ Error: Build falló"
    exit 1
fi

echo "✅ Build completado exitosamente!"
echo ""
echo "📱 Tu PWA está lista para deploy en:"
echo "   📁 Directorio: ./dist/"
echo "   📊 Tamaño total: $(du -sh dist/ | cut -f1)"
echo ""
echo "🌐 Opciones de deploy:"
echo ""
echo "1️⃣  VERCEL (Recomendado - GRATIS):"
echo "   npm install -g vercel"
echo "   vercel --prod"
echo ""
echo "2️⃣  NETLIFY:"
echo "   npm install -g netlify-cli"
echo "   netlify deploy --prod --dir=dist"
echo ""
echo "3️⃣  RAILWAY (Con backend):"
echo "   Conecta tu repo GitHub a Railway"
echo ""
echo "🎯 Para 100 usuarios, Vercel es perfecto y GRATIS"
echo "✨ Tu PWA incluye:"
echo "   ✅ Service Worker optimizado"
echo "   ✅ Manifest.json configurado"
echo "   ✅ Funcionalidades nativas"
echo "   ✅ Modo offline básico"
echo "   ✅ Instalación desde navegador"
echo ""
echo "🚀 ¡Listo para el prelanzamiento!" 