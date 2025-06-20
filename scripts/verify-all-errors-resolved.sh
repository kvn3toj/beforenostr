#!/bin/bash

# 🎯 VERIFICACIÓN COMPLETA: Resolución de Todos los Errores de Desarrollo
# ========================================================================
# Error ID: a6d311ded17a458592fe4cd47ebfbac7
# Fecha: 18 de junio 2025
# Errores resueltos: Element type invalid, imports faltantes, exports duplicados

echo "🔍 INICIANDO VERIFICACIÓN COMPLETA DE ERRORES RESUELTOS..."
echo "=========================================================="

# Función para logging con colores
log_success() { echo "✅ $1"; }
log_warning() { echo "⚠️  $1"; }
log_error() { echo "❌ $1"; }
log_info() { echo "ℹ️  $1"; }

SUPERAPP_DIR="Demo/apps/superapp-unified"
ERRORS_FOUND=0
CHECKS_PASSED=0
TOTAL_CHECKS=8

echo
log_info "VERIFICANDO RESOLUCIÓN DE ERRORES PRINCIPALES..."
echo "================================================="

# 1. VERIFICAR SUPERAPP HTTP 200 OK
echo
log_info "1/8 Verificando SuperApp HTTP 200 OK..."
SUPERAPP_RESPONSE=$(curl -s -I http://localhost:3001 2>/dev/null | head -n 1)
if echo "$SUPERAPP_RESPONSE" | grep -q "200 OK"; then
    log_success "SuperApp responde HTTP 200 OK en puerto 3001"
    ((CHECKS_PASSED++))
else
    log_error "SuperApp no responde o puerto no disponible"
    ((ERRORS_FOUND++))
fi

# 2. VERIFICAR ARCHIVO FeaturedProducts.tsx CREADO
echo
log_info "2/8 Verificando FeaturedProducts.tsx existe..."
if [ -f "$SUPERAPP_DIR/src/components/modules/marketplace/FeaturedProducts.tsx" ]; then
    FEATUREDPRODUCTS_SIZE=$(wc -l < "$SUPERAPP_DIR/src/components/modules/marketplace/FeaturedProducts.tsx")
    log_success "FeaturedProducts.tsx creado ($FEATUREDPRODUCTS_SIZE líneas)"
    ((CHECKS_PASSED++))
else
    log_error "FeaturedProducts.tsx no encontrado"
    ((ERRORS_FOUND++))
fi

# 3. VERIFICAR EXPORTS DEFAULT EN PÁGINAS CORREGIDAS
echo
log_info "3/8 Verificando exports default corregidos..."
MISSING_EXPORTS=0

for PAGE in "RegisterPage" "Analytics" "VideoPlayer"; do
    if ! grep -q "export default $PAGE" "$SUPERAPP_DIR/src/pages/${PAGE}.tsx" 2>/dev/null; then
        log_warning "export default faltante en ${PAGE}.tsx"
        ((MISSING_EXPORTS++))
    fi
done

if [ $MISSING_EXPORTS -eq 0 ]; then
    log_success "Todos los exports default están corregidos"
    ((CHECKS_PASSED++))
else
    log_error "$MISSING_EXPORTS páginas sin export default"
    ((ERRORS_FOUND++))
fi

# 4. VERIFICAR CORRECCIÓN DE IMPORT useLetsIntegration
echo
log_info "4/8 Verificando importación useLetsIntegration corregida..."
if grep -q "from '../../../hooks/useLetsIntegration'" "$SUPERAPP_DIR/src/components/modules/lets/LetsIntegrationManager.tsx"; then
    log_success "Importación useLetsIntegration corregida"
    ((CHECKS_PASSED++))
else
    log_error "Importación useLetsIntegration aún incorrecta"
    ((ERRORS_FOUND++))
fi

# 5. VERIFICAR RESOLUCIÓN DE EXPORTS DUPLICADOS EN useVideoData.ts
echo
log_info "5/8 Verificando exports duplicados resueltos..."
VIDEODATA_EXPORTS=$(grep -c "VideoDataCache" "$SUPERAPP_DIR/src/hooks/data/useVideoData.ts")
if [ "$VIDEODATA_EXPORTS" -eq 1 ]; then
    log_success "Export duplicado VideoDataCache resuelto"
    ((CHECKS_PASSED++))
else
    log_error "Aún hay exports duplicados de VideoDataCache ($VIDEODATA_EXPORTS encontrados)"
    ((ERRORS_FOUND++))
fi

# 6. VERIFICAR CORRECCIÓN DE CSS DUPLICADOS EN ServicesList.tsx
echo
log_info "6/8 Verificando CSS duplicados corregidos..."
if ! grep -q "backgroundImage.*backgroundSize.*backgroundPosition" "$SUPERAPP_DIR/src/components/modules/marketplace/ServicesList.tsx"; then
    log_success "Propiedades CSS duplicadas corregidas en ServicesList.tsx"
    ((CHECKS_PASSED++))
else
    log_error "Aún hay propiedades CSS duplicadas"
    ((ERRORS_FOUND++))
fi

# 7. VERIFICAR QUE NO HAY ARCHIVOS .backup CONFLICTIVOS
echo
log_info "7/8 Verificando archivos .backup conflictivos..."
BACKUP_FILES=$(find "$SUPERAPP_DIR/src" -name "*.backup" -o -name "*lazyComponents*.tsx" 2>/dev/null | wc -l)
if [ "$BACKUP_FILES" -eq 0 ]; then
    log_success "No hay archivos backup conflictivos"
    ((CHECKS_PASSED++))
else
    log_warning "$BACKUP_FILES archivos backup encontrados"
    find "$SUPERAPP_DIR/src" -name "*.backup" -o -name "*lazyComponents*.tsx" 2>/dev/null | head -3
    ((ERRORS_FOUND++))
fi

# 8. VERIFICAR PROCESO VITE CORRIENDO CORRECTAMENTE
echo
log_info "8/8 Verificando proceso Vite estable..."
VITE_PROCESSES=$(ps aux | grep -E "vite.*superapp" | grep -v grep | wc -l)
if [ "$VITE_PROCESSES" -eq 1 ]; then
    log_success "Un proceso Vite ejecutándose (estable)"
    ((CHECKS_PASSED++))
elif [ "$VITE_PROCESSES" -eq 0 ]; then
    log_warning "No hay procesos Vite ejecutándose"
    ((ERRORS_FOUND++))
else
    log_warning "Múltiples procesos Vite ($VITE_PROCESSES) - posible conflicto"
    ((ERRORS_FOUND++))
fi

# RESUMEN FINAL
echo
echo "================================================="
log_info "RESUMEN DE VERIFICACIÓN COMPLETA"
echo "================================================="
echo "✅ Verificaciones exitosas: $CHECKS_PASSED/$TOTAL_CHECKS"
echo "❌ Errores encontrados: $ERRORS_FOUND"

# Calcular porcentaje de éxito
SUCCESS_RATE=$(( (CHECKS_PASSED * 100) / TOTAL_CHECKS ))
echo "📊 Tasa de éxito: $SUCCESS_RATE%"

echo
if [ $ERRORS_FOUND -eq 0 ]; then
    log_success "🎉 TODOS LOS ERRORES RESUELTOS EXITOSAMENTE!"
    log_success "Error ID a6d311ded17a458592fe4cd47ebfbac7 - RESUELTO ✅"
    echo
    log_info "Errores corregidos:"
    echo "   • Element type is invalid (lazy loading)"
    echo "   • Failed to resolve import FeaturedProducts"
    echo "   • Failed to resolve import useLetsIntegration"
    echo "   • Multiple exports with same name VideoDataCache"
    echo "   • Duplicate CSS properties in ServicesList"
    echo "   • Missing export default en páginas"
elif [ $ERRORS_FOUND -le 2 ]; then
    log_warning "🔧 CASI COMPLETADO - Errores menores restantes: $ERRORS_FOUND"
    log_info "Continuar con la verificación manual si es necesario"
else
    log_error "🚨 ERRORES CRÍTICOS RESTANTES: $ERRORS_FOUND"
    log_info "Revisar logs arriba para identificar problemas pendientes"
fi

echo
log_info "SuperApp disponible en: http://localhost:3001"
log_info "Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
echo "================================================="

exit $ERRORS_FOUND 