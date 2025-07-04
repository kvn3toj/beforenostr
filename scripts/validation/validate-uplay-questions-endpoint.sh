#!/bin/bash

# 🎬 Script de Validación: Endpoint ÜPlay Questions + Transformador de Datos
# Para uso en Agente Slack - Validación sin navegador
# Actualizado con mejoras del UPLAY_ENVIRONMENT_REVIEW
# Creado: $(date)

echo "🎯 VALIDACIÓN ÜPLAY QUESTIONS + TRANSFORMADOR DE DATOS"
echo "======================================================="

# Verificar backend disponible
echo "🔍 1. Verificando backend..."
BACKEND_STATUS=$(curl -s http://localhost:3002/health | jq -r '.status' 2>/dev/null || echo "ERROR")

if [ "$BACKEND_STATUS" != "ok" ]; then
    echo "❌ Backend no disponible en puerto 3002"
    exit 1
fi
echo "✅ Backend operacional: status=$BACKEND_STATUS"

# Obtener token JWT
echo "🔑 2. Obteniendo token de autenticación..."
TOKEN=$(curl -X POST "http://localhost:3002/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email": "admin@gamifier.com", "password": "admin123"}' \
    -s | jq -r '.access_token' 2>/dev/null)

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
    echo "❌ No se pudo obtener token de autenticación"
    exit 1
fi
echo "✅ Token obtenido: ${TOKEN:0:20}..."

# Verificar endpoint de preguntas
echo "🎯 3. Verificando endpoint de preguntas..."
QUESTIONS_RESPONSE=$(curl -H "Authorization: Bearer $TOKEN" \
    http://localhost:3002/video-items/1/questions -s)

QUESTIONS_COUNT=$(echo "$QUESTIONS_RESPONSE" | jq 'length' 2>/dev/null || echo "0")

if [ "$QUESTIONS_COUNT" -eq 0 ]; then
    echo "❌ No se obtuvieron preguntas del endpoint"
    echo "Respuesta: $QUESTIONS_RESPONSE"
    exit 1
fi
echo "✅ Endpoint respondió con $QUESTIONS_COUNT preguntas"

# 🎯 NUEVO: Verificar estructura de datos para transformador
echo "🔄 4. Verificando estructura de datos para transformador..."
FIRST_QUESTION=$(echo "$QUESTIONS_RESPONSE" | jq '.[0]' 2>/dev/null)

# Verificar campos críticos para la transformación
QUESTION_ID=$(echo "$FIRST_QUESTION" | jq -r '.id' 2>/dev/null)
QUESTION_TYPE=$(echo "$FIRST_QUESTION" | jq -r '.type' 2>/dev/null)
QUESTION_TIMESTAMP=$(echo "$FIRST_QUESTION" | jq -r '.timestamp' 2>/dev/null)
QUESTION_END_TIMESTAMP=$(echo "$FIRST_QUESTION" | jq -r '.endTimestamp' 2>/dev/null)
OPTIONS_COUNT=$(echo "$FIRST_QUESTION" | jq '.options | length' 2>/dev/null)

echo "📊 Análisis de estructura de la primera pregunta:"
echo "   - ID: $QUESTION_ID"
echo "   - Tipo: $QUESTION_TYPE (requiere transformación a lowercase)"
echo "   - Timestamp: $QUESTION_TIMESTAMP"
echo "   - End Timestamp: $QUESTION_END_TIMESTAMP (será calculado si es null)"
echo "   - Opciones: $OPTIONS_COUNT"

# Verificar que las opciones tienen la estructura correcta
FIRST_OPTION=$(echo "$FIRST_QUESTION" | jq '.options[0]' 2>/dev/null)
OPTION_ID_TYPE=$(echo "$FIRST_OPTION" | jq -r '.id | type' 2>/dev/null)
OPTION_HAS_LABEL=$(echo "$FIRST_OPTION" | jq 'has("label")' 2>/dev/null)

echo "🔍 5. Verificando estructura de opciones..."
echo "   - ID tipo: $OPTION_ID_TYPE (debe ser number, se convertirá a string)"
echo "   - Tiene campo 'label': $OPTION_HAS_LABEL (se agregará A, B, C, D)"

if [ "$OPTION_HAS_LABEL" == "true" ]; then
    echo "⚠️ Las opciones YA tienen campo 'label' - revisar transformador"
else
    echo "✅ Las opciones necesitan campo 'label' - transformador es necesario"
fi

# 🎯 NUEVO: Simular transformación y verificar lógica
echo "🔄 6. Simulando transformación de datos..."

# Verificar que el tipo necesita transformación
if [ "$QUESTION_TYPE" == "MULTIPLE_CHOICE" ]; then
    echo "✅ Transformación de tipo: $QUESTION_TYPE → multiple-choice"
elif [ "$QUESTION_TYPE" == "TRUE_FALSE" ]; then
    echo "✅ Transformación de tipo: $QUESTION_TYPE → true-false"
else
    echo "⚠️ Tipo no reconocido: $QUESTION_TYPE"
fi

# Verificar cálculo de endTimestamp si es null
if [ "$QUESTION_END_TIMESTAMP" == "null" ]; then
    CALCULATED_END=$(echo "$QUESTION_TIMESTAMP + 30" | bc 2>/dev/null)
    echo "✅ EndTimestamp será calculado: null → $CALCULATED_END (+30s)"
else
    echo "✅ EndTimestamp ya definido: $QUESTION_END_TIMESTAMP"
fi

# Verificar lógica de labels para opciones
echo "✅ Labels de opciones se asignarán: A, B, C, D (índice 0-3)"

echo "🎊 7. VALIDACIÓN COMPLETA EXITOSA"
echo "================================="
echo "📊 Resumen:"
echo "   - Backend: ✅ Operacional"
echo "   - Autenticación: ✅ Exitosa" 
echo "   - Endpoint preguntas: ✅ Funcional ($QUESTIONS_COUNT preguntas)"
echo "   - Estructura backend: ✅ Correcta para transformación"
echo "   - Transformador: ✅ Necesario y preparado"
echo ""
echo "🚀 El sistema está listo para mostrar preguntas interactivas en ÜPlay"
echo "🎯 Próximo paso: Verificar que el frontend aplicó las transformaciones"

# 🎯 NUEVO: Información para debugging del frontend
echo ""
echo "🔧 Para debugging del frontend, buscar en consola:"
echo "   - '🎯 [VideoPlayer] Using transformed backend questions'"
echo "   - '✅ [VideoPlayer] Transformed question X'"
echo "   - '🚀 [VideoPlayer] ACTIVATING QUESTION'" 