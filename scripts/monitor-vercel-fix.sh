#!/bin/bash

# 🔍 MONITOR INTENSIVO VERCEL FRAMEWORK FIX - COOMUNITY
# =======================================================
# 🌐 URL: https://superapp-peach.vercel.app
# 🎯 Fix Aplicado: Eliminated Conflicting Redirects + Framework Auto-Detection
# 📅 Commit: e66146e
# ⏱️ Intervalo: 15 segundos
# 🎮 Referencia: https://vercel.com/guides/why-is-my-deployed-project-giving-404
# 🛑 Presiona Ctrl+C para detener

URL="https://superapp-peach.vercel.app"
COUNTER=0
START_TIME=$(date +%s)

echo "🔍 MONITOR INTENSIVO VERCEL FRAMEWORK FIX - COOMUNITY"
echo "======================================================="
echo "🌐 URL: $URL"
echo "🎯 Fix Aplicado: Eliminated Conflicting Redirects + Framework Auto-Detection"
echo "📅 Commit: e66146e"
echo "⏱️ Intervalo: 15 segundos"
echo "🎮 Referencia: https://vercel.com/guides/why-is-my-deployed-project-giving-404"
echo "🛑 Presiona Ctrl+C para detener"

while true; do
    COUNTER=$((COUNTER + 1))
    CURRENT_TIME=$(date +"%H:%M:%S")

    echo "🔍 VERIFICACIÓN #$COUNTER a las $CURRENT_TIME"
    echo "----------------------------------------------"

    START_REQUEST=$(date +%s.%N)
    HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' "$URL")
    END_REQUEST=$(date +%s.%N)

    RESPONSE_TIME=$(echo "$END_REQUEST - $START_REQUEST" | bc)

    case $HTTP_CODE in
        200)
            echo "🎉 SUCCESS: SuperApp Vercel: HTTP 200 (¡FUNCIONAL!) - ${RESPONSE_TIME}s"
            echo "✅ FIX OFICIAL DE VERCEL EXITOSO!"
            echo "🌐 URL funcionando: $URL"
            CURRENT_TIME_ELAPSED=$(date +%s)
            TOTAL_ELAPSED=$((CURRENT_TIME_ELAPSED - START_TIME))
            MINUTES=$((TOTAL_ELAPSED / 60))
            SECONDS=$((TOTAL_ELAPSED % 60))
            echo "⏱️ Tiempo total hasta resolución: ${MINUTES}m${SECONDS}s"
            echo "🎯 Verificaciones realizadas: $COUNTER"
            echo ""
            echo "🚀 ¡LA SUPERAPP COOMUNITY ESTÁ AHORA OPERACIONAL EN VERCEL!"
            exit 0
            ;;
        404)
            echo "⚠️  WARNING: SuperApp Vercel: HTTP 404 (En construcción/No encontrado) - ${RESPONSE_TIME}s"
            ;;
        503)
            echo "🔄 INFO: SuperApp Vercel: HTTP 503 (Deployment en progreso) - ${RESPONSE_TIME}s"
            ;;
        502)
            echo "🔧 INFO: SuperApp Vercel: HTTP 502 (Build en progreso) - ${RESPONSE_TIME}s"
            ;;
        *)
            echo "❓ INFO: SuperApp Vercel: HTTP $HTTP_CODE (Estado inesperado) - ${RESPONSE_TIME}s"
            ;;
    esac

    # Mostrar estadísticas cada 5 verificaciones
    if [ $((COUNTER % 5)) -eq 0 ]; then
        CURRENT_TIME_ELAPSED=$(date +%s)
        TOTAL_ELAPSED=$((CURRENT_TIME_ELAPSED - START_TIME))
        MINUTES=$((TOTAL_ELAPSED / 60))
        SECONDS=$((TOTAL_ELAPSED % 60))
        echo "🔍 INFO: 📊 Estadísticas: $COUNTER verificaciones en ${MINUTES}m${SECONDS}s"
    fi

    sleep 15
done
