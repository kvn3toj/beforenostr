#!/bin/bash

echo "🔍 INICIANDO PRUEBA DE BACKEND..."
echo "📝 Limpiando procesos previos..."
pkill -f tsx 2>/dev/null || true
sleep 2

echo "🚀 Iniciando backend y capturando logs..."
timeout 30 npm run dev:backend 2>&1 | tee backend-logs.txt || echo "⏰ Timeout después de 30 segundos"

echo "📊 Verificando si el servidor está respondiendo..."
if curl -s http://localhost:1111/health >/dev/null 2>&1; then
    echo "✅ Backend está funcionando!"
    curl http://localhost:1111/health
else
    echo "❌ Backend no está respondiendo"
    echo "📋 Últimas líneas de los logs:"
    tail -20 backend-logs.txt
fi 