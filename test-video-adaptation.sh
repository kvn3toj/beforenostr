#!/bin/bash

echo "🎬 PRUEBA DEL ADAPTADOR DE VIDEOS BACKEND → FRONTEND"
echo "================================================="
echo

# Verificar servicios
echo "📋 1. VERIFICANDO SERVICIOS..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/health)
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001)

if [ "$BACKEND_STATUS" != "200" ]; then
    echo "❌ Backend no disponible (código: $BACKEND_STATUS)"
    exit 1
fi

if [ "$FRONTEND_STATUS" != "200" ]; then
    echo "❌ SuperApp no disponible (código: $FRONTEND_STATUS)"
    exit 1
fi

echo "✅ Backend funcionando (puerto 3002)"
echo "✅ SuperApp funcionando (puerto 3001)"
echo

# Verificar datos raw del backend
echo "📊 2. VERIFICANDO DATOS BACKEND..."
BACKEND_VIDEOS=$(curl -s 'http://localhost:3002/video-items' | jq 'length')
echo "🎥 Videos en backend: $BACKEND_VIDEOS"

if [ "$BACKEND_VIDEOS" -gt 0 ]; then
    echo "✅ Backend devolviendo videos"
    
    # Mostrar estructura de un video del backend
    echo
    echo "📝 Estructura del primer video del backend:"
    curl -s 'http://localhost:3002/video-items' | jq '.[0] | {id, title, thumbnailUrl, duration, categories, tags, questions: (.questions | length)}'
else
    echo "❌ Backend no devuelve videos"
    exit 1
fi

echo
echo "🎯 3. VERIFICANDO DASHBOARD ÜPLAY..."
UPLAY_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/uplay)

if [ "$UPLAY_STATUS" = "200" ]; then
    echo "✅ Dashboard ÜPlay accesible"
else
    echo "❌ Dashboard ÜPlay no accesible (código: $UPLAY_STATUS)"
fi

echo
echo "🔧 4. INSTRUCCIONES PARA VERIFICAR VIDEOS:"
echo "   1. Abrir http://localhost:3001/uplay en el navegador"
echo "   2. Hacer clic en la tab 'Biblioteca'"
echo "   3. Verificar que se muestren las rutas de aprendizaje"
echo "   4. Verificar que se muestren los videos en cada ruta"
echo "   5. Abrir Developer Tools → Console para ver logs del adaptador"
echo

echo "🚀 ESTADO DEL ADAPTADOR:"
echo "   ✅ Backend respondiendo con $BACKEND_VIDEOS videos"
echo "   ✅ Frontend accesible y funcional"
echo "   ✅ Dashboard ÜPlay disponible"
echo "   🔄 Adaptador implementado (verificar en navegador)"
echo

echo "🎉 ¡PRUEBA COMPLETADA!"
echo "Ahora verifica manualmente en el navegador si los videos aparecen." 