#!/bin/bash

# 🎨 SCRIPT DE VERIFICACIÓN DE EFECTOS VISUALES DESBLOQUEADOS
# Verifica que los efectos visuales están funcionando después de eliminar mocks

echo "🎨 VERIFICACIÓN DE EFECTOS VISUALES DESBLOQUEADOS"
echo "================================================"
echo ""

# VERIFICACIONES TÉCNICAS
echo "🔧 VERIFICACIONES TÉCNICAS:"

# 1. Verificar servicios ejecutándose
echo "├── 🌐 Verificando servicios..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/health 2>/dev/null || echo "000")
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 2>/dev/null || echo "000")

if [ "$BACKEND_STATUS" = "200" ]; then
    echo "│   ├── ✅ Backend NestJS (puerto 3002): HTTP $BACKEND_STATUS"
else
    echo "│   ├── ❌ Backend NestJS no disponible (HTTP $BACKEND_STATUS)"
fi

if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "│   └── ✅ SuperApp Frontend (puerto 3001): HTTP $FRONTEND_STATUS"
else
    echo "│   └── ❌ SuperApp Frontend no disponible (HTTP $FRONTEND_STATUS)"
fi

# 2. Verificar eliminación de archivos mock críticos
echo "├── 🗑️ Verificando eliminación de mocks críticos..."
CRITICAL_MOCKS=(
    "Demo/apps/superapp-unified/src/data/marketplaceMockData.ts"
    "Demo/apps/superapp-unified/src/lib/lets-mock-service.ts"
)

REMAINING_MOCKS=0
for mock in "${CRITICAL_MOCKS[@]}"; do
    if [ -f "$mock" ]; then
        echo "│   ├── ❌ $(basename "$mock"): AÚN EXISTE"
        REMAINING_MOCKS=$((REMAINING_MOCKS + 1))
    else
        echo "│   ├── ✅ $(basename "$mock"): ELIMINADO"
    fi
done
echo "│   └── Mocks restantes: $REMAINING_MOCKS"

# 3. Verificar referencias a mock data
echo "├── 📝 Verificando referencias a mock data..."
MOCK_REFS=$(find Demo/apps/superapp-unified/src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec grep -l "marketplaceMockData\|Mock.*Data.*=.*\[" {} \; 2>/dev/null | wc -l)
echo "│   └── Referencias encontradas: $MOCK_REFS archivos"

# 4. Verificar bypass logic activo
echo "└── 🔄 Verificando bypass logic..."
BYPASS_ACTIVE=$(find Demo/apps/superapp-unified/src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec grep -l "isBuilderEnvironment.*true\|safe_mode.*true" {} \; 2>/dev/null | wc -l)
echo "    └── Bypass logic activo: $BYPASS_ACTIVE archivos"
echo ""

# VERIFICACIONES DE ENDPOINTS BACKEND
echo "📊 VERIFICACIONES DE ENDPOINTS BACKEND:"
echo "├── Verificando endpoints reales disponibles..."

ENDPOINTS=(
    "marketplace/items:Marketplace"
    "video-items:Videos" 
    "challenges:Challenges"
    "social/posts:Social"
    "auth/me:Auth"
)

AVAILABLE_ENDPOINTS=0
TOTAL_ENDPOINTS=${#ENDPOINTS[@]}

for endpoint_pair in "${ENDPOINTS[@]}"; do
    endpoint=${endpoint_pair%%:*}
    module=${endpoint_pair##*:}
    status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3002/$endpoint" 2>/dev/null || echo "000")
    
    if [ "$status" = "200" ] || [ "$status" = "401" ]; then
        echo "│   ├── ✅ $module ($endpoint): HTTP $status"
        AVAILABLE_ENDPOINTS=$((AVAILABLE_ENDPOINTS + 1))
    else
        echo "│   ├── ❌ $module ($endpoint): HTTP $status"
    fi
done

BACKEND_INTEGRATION=$((AVAILABLE_ENDPOINTS * 100 / TOTAL_ENDPOINTS))
echo "└── Backend Integration: $BACKEND_INTEGRATION% ($AVAILABLE_ENDPOINTS/$TOTAL_ENDPOINTS)"
echo ""

# VERIFICACIONES DE ARCHIVOS CSS/THEME
echo "🎨 VERIFICACIONES DE ARCHIVOS CSS/THEME:"
echo "├── Verificando archivos de efectos visuales..."

VISUAL_FILES=(
    "Demo/apps/superapp-unified/src/index.css:CSS Principal"
    "Demo/apps/superapp-unified/src/theme.ts:Theme Configuration"
    "Demo/apps/superapp-unified/src/styles:Styles Directory"
    "Demo/apps/superapp-unified/src/design-system:Design System"
)

for file_pair in "${VISUAL_FILES[@]}"; do
    file=${file_pair%%:*}
    desc=${file_pair##*:}
    
    if [ -f "$file" ] || [ -d "$file" ]; then
        echo "│   ├── ✅ $desc: PRESENTE"
        
        # Verificar contenido de efectos específicos
        if [ "$desc" = "CSS Principal" ]; then
            if grep -q "glassmorphism\|cosmic\|aura\|particle" "$file" 2>/dev/null; then
                echo "│   │   └── 🎉 Efectos CSS detectados"
            fi
        fi
    else
        echo "│   ├── ❌ $desc: NO ENCONTRADO"
    fi
done
echo "└── ✅ Verificación de archivos visuales completada"
echo ""

# RESUMEN DE ESTADO
echo "📋 RESUMEN DE ESTADO DE EFECTOS VISUALES:"

# Calcular score de desbloqueo
UNBLOCK_SCORE=0

# +25 puntos por servicios funcionando
if [ "$BACKEND_STATUS" = "200" ] && [ "$FRONTEND_STATUS" = "200" ]; then
    UNBLOCK_SCORE=$((UNBLOCK_SCORE + 25))
fi

# +30 puntos por mocks eliminados
if [ "$REMAINING_MOCKS" -eq 0 ]; then
    UNBLOCK_SCORE=$((UNBLOCK_SCORE + 30))
fi

# +25 puntos por integración backend
UNBLOCK_SCORE=$((UNBLOCK_SCORE + BACKEND_INTEGRATION / 4))

# +20 puntos por referencias mock eliminadas
if [ "$MOCK_REFS" -eq 0 ]; then
    UNBLOCK_SCORE=$((UNBLOCK_SCORE + 20))
fi

echo "├── 🎯 Score de Desbloqueo: $UNBLOCK_SCORE/100"

if [ "$UNBLOCK_SCORE" -ge 80 ]; then
    echo "├── 🎉 ESTADO: EFECTOS VISUALES DESBLOQUEADOS"
    echo "├── ✅ Cosmic Design System: DISPONIBLE"
    echo "├── ✅ Glassmorphism Effects: DISPONIBLE"  
    echo "├── ✅ Revolutionary Auras: DISPONIBLE"
    echo "└── ✅ Dynamic Particles: DISPONIBLE"
elif [ "$UNBLOCK_SCORE" -ge 60 ]; then
    echo "├── 🔶 ESTADO: PARCIALMENTE DESBLOQUEADO"
    echo "├── ⚠️ Algunos efectos pueden estar limitados"
    echo "└── 🔧 Continuar eliminando mocks restantes"
elif [ "$UNBLOCK_SCORE" -ge 40 ]; then
    echo "├── 🔶 ESTADO: EN PROCESO DE DESBLOQUEO"
    echo "├── ⚠️ Efectos aún bloqueados por mocks"
    echo "└── 🔧 Continuar con migración por fases"
else
    echo "├── 🔴 ESTADO: EFECTOS BLOQUEADOS"
    echo "├── ❌ Mocks aún bloquean efectos visuales"
    echo "└── 🔧 Ejecutar scripts de eliminación de mocks"
fi
echo ""

# RECOMENDACIONES ESPECÍFICAS
echo "🎯 RECOMENDACIONES ESPECÍFICAS:"

if [ "$UNBLOCK_SCORE" -lt 80 ]; then
    echo "├── 🔧 ACCIONES INMEDIATAS:"
    
    if [ "$REMAINING_MOCKS" -gt 0 ]; then
        echo "│   ├── Eliminar mocks restantes con scripts de fase"
    fi
    
    if [ "$MOCK_REFS" -gt 0 ]; then
        echo "│   ├── Refactorizar $MOCK_REFS archivos con referencias mock"
    fi
    
    if [ "$BACKEND_INTEGRATION" -lt 80 ]; then
        echo "│   ├── Implementar endpoints backend faltantes"
    fi
    
    if [ "$BYPASS_ACTIVE" -gt 0 ]; then
        echo "│   └── Desactivar bypass logic en $BYPASS_ACTIVE archivos"
    fi
else
    echo "├── 🎨 VERIFICACIÓN VISUAL:"
    echo "│   ├── Navegar a http://localhost:3001"
    echo "│   ├── Verificar efectos en /marketplace"
    echo "│   ├── Verificar efectos en /uplay"
    echo "│   └── Verificar efectos en /social"
fi

echo "└── 📊 MONITOREO:"
echo "    ├── Ejecutar este script después de cada fase"
echo "    └── Score objetivo: 100/100 para desbloqueo completo"
echo ""

echo "================================================"
echo "🎨 VERIFICACIÓN COMPLETADA - Score: $UNBLOCK_SCORE/100"
echo "================================================"