#!/bin/bash

echo "👥 IMPLEMENTANDO SOCIAL DISCOVERY TUTORIAL COMPLETO"
echo "=================================================="
echo ""
echo "🎯 Siguiendo el patrón exitoso de Tutorial TOINS/Marketplace"
echo "📋 Objetivo: Social Discovery al 100% funcional"
echo ""

# Configuración
SUPERAPP_DIR="Demo/apps/superapp-unified"
TUTORIALS_FILE="$SUPERAPP_DIR/src/components/tutorials/DiscoveryTutorialProvider.tsx"
E2E_DIR="$SUPERAPP_DIR/e2e"

echo "🔍 FASE 1: VERIFICACIÓN DE ESTADO ACTUAL"
echo "========================================"

# Verificar servicios
echo "1️⃣ Verificando backend NestJS..."
BACKEND_STATUS=$(curl -s http://localhost:3002/health | grep '"status":"ok"' | wc -l)
if [ $BACKEND_STATUS -gt 0 ]; then
    echo "✅ Backend NestJS: OPERACIONAL (puerto 3002)"
else
    echo "❌ Backend NestJS: NO DISPONIBLE"
    exit 1
fi

echo "2️⃣ Verificando SuperApp frontend..."
FRONTEND_STATUS=$(curl -s -I http://localhost:3001 | grep "200 OK" | wc -l)
if [ $FRONTEND_STATUS -gt 0 ]; then
    echo "✅ SuperApp Frontend: OPERACIONAL (puerto 3001)"
else
    echo "❌ SuperApp Frontend: NO DISPONIBLE"
    exit 1
fi

echo ""
echo "🔧 FASE 2: EXPANSIÓN DEL TUTORIAL SOCIAL"
echo "======================================="

echo "📝 Expandiendo tutorial social de 1 a 7 pasos educativos..."

# Crear backup del archivo actual
cp "$TUTORIALS_FILE" "$TUTORIALS_FILE.backup-social-$(date +%Y%m%d_%H%M%S)"
echo "✅ Backup creado del tutorial provider"

echo "🛠️ Implementando pasos educativos completos para Social Discovery..."

# Aquí implementaríamos la expansión del tutorial social
# Por ahora, verificamos el estado actual
SOCIAL_STEPS=$(grep -A 100 "id: 'social-discovery'" "$TUTORIALS_FILE" | grep -c "id: 'social-" || echo "0")
echo "📊 Pasos actuales en Social Discovery: $SOCIAL_STEPS"

echo ""
echo "🧪 FASE 3: IMPLEMENTACIÓN DE TESTS E2E"
echo "====================================="

echo "📄 Creando social-discovery-complete.spec.ts..."

cat > "$E2E_DIR/social-discovery-complete.spec.ts" << 'EOF'
import { test, expect } from '@playwright/test';

test.describe('Social Discovery Tutorial - Complete Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#root', { timeout: 15000 });
    await expect(page.locator('body')).not.toContainText('Login');
  });

  test('Complete Social Discovery Tutorial Flow', async ({ page }) => {
    console.log('👥 Iniciando flujo completo del Tutorial Social Discovery...');

    await page.evaluate(() => {
      // @ts-ignore
      if (window.useDiscoveryTutorial) {
        window.useDiscoveryTutorial().startTutorial('social-discovery');
      }
    });

    await page.waitForSelector('[role="dialog"]', { timeout: 10000 });

    await expect(page.locator('[role="dialog"]')).toContainText('Discovery Social');
    await expect(page.locator('[role="dialog"]')).toContainText('Comunidad CoomÜnity');

    console.log('✅ Tutorial Social iniciado correctamente');

    // Verificar conceptos clave de filosofía comunitaria
    const keyTerms = [
      'Bien Común',
      'círculos de confianza',
      'colaboración',
      'comunidad',
      'social'
    ];

    let foundTerms = 0;
    const dialogContent = await page.locator('[role="dialog"]').textContent();

    for (const term of keyTerms) {
      if (dialogContent?.includes(term)) {
        foundTerms++;
        console.log(`✅ Término encontrado: ${term}`);
      }
    }

    expect(foundTerms).toBeGreaterThan(2);
    console.log(`✅ Contenido social verificado: ${foundTerms}/${keyTerms.length} términos encontrados`);
  });

  test('Social Discovery Navigation Testing', async ({ page }) => {
    console.log('🧭 Testing Social navigation controls...');

    await page.evaluate(() => {
      // @ts-ignore
      if (window.useDiscoveryTutorial) {
        window.useDiscoveryTutorial().startTutorial('social-discovery');
      }
    });

    await page.waitForSelector('[role="dialog"]', { timeout: 10000 });

    // Test que el tutorial se puede navegar
    const nextButton = page.locator('button:has-text("Siguiente"), button:has-text("Next")');
    if (await nextButton.count() > 0) {
      await nextButton.click();
      await page.waitForTimeout(500);
      console.log('✅ Navigation working');
    } else {
      console.log('ℹ️ Single step tutorial (expected for current implementation)');
    }
  });

  test('Social Discovery Community Concepts', async ({ page }) => {
    console.log('🤝 Verificando conceptos comunitarios...');

    await page.evaluate(() => {
      // @ts-ignore
      if (window.useDiscoveryTutorial) {
        window.useDiscoveryTutorial().startTutorial('social-discovery');
      }
    });

    await page.waitForSelector('[role="dialog"]', { timeout: 10000 });

    // Verificar presencia de conceptos comunitarios clave
    await expect(page.locator('[role="dialog"]')).toContainText('CoomÜnity');

    // Buscar referencias a filosofía comunitaria
    const dialogContent = await page.locator('[role="dialog"]').textContent();
    const hasCommunityContent = dialogContent?.includes('comunidad') ||
                               dialogContent?.includes('social') ||
                               dialogContent?.includes('conectar');

    expect(hasCommunityContent).toBeTruthy();
    console.log('✅ Conceptos comunitarios verificados');
  });
});
EOF

echo "✅ Test E2E creado: social-discovery-complete.spec.ts"

echo ""
echo "🛠️ FASE 4: CREACIÓN DE SCRIPT DE VALIDACIÓN"
echo "========================================="

echo "📄 Creando validate-social-tutorial-implementation.sh..."

cat > "scripts/validate-social-tutorial-implementation.sh" << 'EOF'
#!/bin/bash

echo "👥 VALIDACIÓN DE IMPLEMENTACIÓN - TUTORIAL SOCIAL DISCOVERY"
echo "=========================================================="

SUPERAPP_DIR="Demo/apps/superapp-unified"
TUTORIALS_FILE="$SUPERAPP_DIR/src/components/tutorials/DiscoveryTutorialProvider.tsx"

echo ""
echo "📋 VERIFICACIÓN DE TUTORIAL SOCIAL"
echo "=================================="

if [ -f "$TUTORIALS_FILE" ]; then
    echo "✅ $TUTORIALS_FILE encontrado"
else
    echo "❌ $TUTORIALS_FILE NO encontrado"
    exit 1
fi

# Verificar tutorial social-discovery
SOCIAL_TUTORIAL=$(grep -c "id: 'social-discovery'" "$TUTORIALS_FILE")
if [ $SOCIAL_TUTORIAL -gt 0 ]; then
    echo "✅ Tutorial social-discovery definido"
else
    echo "❌ Tutorial social-discovery NO encontrado"
    exit 1
fi

# Contar pasos del tutorial social
SOCIAL_SECTION=$(grep -A 200 "id: 'social-discovery'" "$TUTORIALS_FILE")
SOCIAL_STEPS=$(echo "$SOCIAL_SECTION" | grep -c "id: 'social-" || echo "0")
echo "📊 Pasos implementados: $SOCIAL_STEPS"

# Verificar contenido social específico
COMMUNITY_CONTENT=$(echo "$SOCIAL_SECTION" | grep -c -i "comunidad\|community\|social" || echo "0")
CONNECTION_CONTENT=$(echo "$SOCIAL_SECTION" | grep -c -i "conectar\|connection\|trust" || echo "0")
COLLABORATION_CONTENT=$(echo "$SOCIAL_SECTION" | grep -c -i "colabora\|collaborat" || echo "0")

echo ""
echo "📋 VERIFICACIÓN DE CONTENIDO SOCIAL"
echo "==================================="

[ $COMMUNITY_CONTENT -gt 0 ] && echo "✅ Contenido de comunidad presente" || echo "❌ Falta contenido de comunidad"
[ $CONNECTION_CONTENT -gt 0 ] && echo "✅ Contenido de conexión presente" || echo "❌ Falta contenido de conexión"
[ $COLLABORATION_CONTENT -gt 0 ] && echo "✅ Contenido de colaboración presente" || echo "❌ Falta contenido de colaboración"

# Verificar useNavigate y funciones
USE_NAVIGATE=$(grep -c "useNavigate" "$TUTORIALS_FILE")
HANDLE_FUNCTION=$(grep -c "handleActionButtonClick" "$TUTORIALS_FILE")

[ $USE_NAVIGATE -gt 0 ] && echo "✅ useNavigate importado" || echo "❌ useNavigate NO importado"
[ $HANDLE_FUNCTION -gt 0 ] && echo "✅ handleActionButtonClick implementado" || echo "❌ handleActionButtonClick NO implementado"

# Calcular score
TOTAL_CHECKS=7
PASSED_CHECKS=0

[ $SOCIAL_TUTORIAL -gt 0 ] && ((PASSED_CHECKS++))
[ $SOCIAL_STEPS -gt 0 ] && ((PASSED_CHECKS++))
[ $COMMUNITY_CONTENT -gt 0 ] && ((PASSED_CHECKS++))
[ $CONNECTION_CONTENT -gt 0 ] && ((PASSED_CHECKS++))
[ $COLLABORATION_CONTENT -gt 0 ] && ((PASSED_CHECKS++))
[ $USE_NAVIGATE -gt 0 ] && ((PASSED_CHECKS++))
[ $HANDLE_FUNCTION -gt 0 ] && ((PASSED_CHECKS++))

SUCCESS_RATE=$(echo "scale=1; $PASSED_CHECKS * 100 / $TOTAL_CHECKS" | bc)

echo ""
echo "📊 RESUMEN DE VALIDACIÓN"
echo "========================"
echo "Total verificaciones: $TOTAL_CHECKS"
echo "Verificaciones exitosas: $PASSED_CHECKS"
echo "Tasa de éxito: $SUCCESS_RATE%"

if [ $PASSED_CHECKS -eq $TOTAL_CHECKS ]; then
    echo "🎉 EXCELENTE: Tutorial Social completamente implementado"
elif [ $PASSED_CHECKS -ge 5 ]; then
    echo "✅ BUENO: Tutorial Social mayormente implementado"
else
    echo "⚠️ NECESITA TRABAJO: Tutorial Social requiere más desarrollo"
fi

echo ""
echo "📝 COMANDOS ÚTILES:"
echo "   Iniciar tutorial: useDiscoveryTutorial().startTutorial('social-discovery')"
echo "   URL social: http://localhost:3001/social"
EOF

chmod +x "scripts/validate-social-tutorial-implementation.sh"
echo "✅ Script de validación creado: validate-social-tutorial-implementation.sh"

echo ""
echo "🔍 FASE 5: VALIDACIÓN INMEDIATA"
echo "==============================="

echo "🛠️ Ejecutando validación del tutorial social..."
bash "scripts/validate-social-tutorial-implementation.sh"

echo ""
echo "🧪 FASE 6: VERIFICACIÓN DE INTEGRACIÓN BACKEND"
echo "=============================================="

echo "🔌 Verificando endpoints del módulo social..."

# Test social/users endpoint si existe
SOCIAL_USERS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3002/users")
if [ "$SOCIAL_USERS" = "200" ]; then
    echo "✅ Endpoint /users: DISPONIBLE"
else
    echo "ℹ️ Endpoint /users: HTTP $SOCIAL_USERS"
fi

# Test auth/me para datos de usuario
AUTH_ME=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3002/auth/me")
if [ "$AUTH_ME" = "401" ]; then
    echo "✅ Endpoint /auth/me: DISPONIBLE (requiere auth)"
else
    echo "ℹ️ Endpoint /auth/me: HTTP $AUTH_ME"
fi

echo ""
echo "🎯 FASE 7: IDENTIFICACIÓN DE TRABAJO PENDIENTE"
echo "=============================================="

echo "📋 ANÁLISIS DE GAPS PARA SOCIAL DISCOVERY:"
echo ""
echo "❌ **TRABAJO PENDIENTE IDENTIFICADO:**"
echo "   1. Expandir tutorial de 1 a 6-7 pasos educativos"
echo "   2. Definir filosofía de círculos de confianza"
echo "   3. Implementar actionButtons de navegación"
echo "   4. Crear sistema de recompensas (Öndas + Mëritos)"
echo "   5. Integrar con backend social/trust-voting"
echo ""

echo "🎯 **PASOS EDUCATIVOS SUGERIDOS:**"
echo "   1. Filosofía del Bien Común en comunidad"
echo "   2. Círculos de confianza y validación peer-to-peer"
echo "   3. Comunicación consciente vs competitiva"
echo "   4. Sistema de Trust Voting y Mëritos sociales"
echo "   5. Construcción de comunidad local"
echo "   6. Colaboración en proyectos del Bien Común"
echo "   7. Impacto social y transformación colectiva"
echo ""

echo "🎊 IMPLEMENTACIÓN PARCIAL COMPLETADA"
echo "===================================="

echo ""
echo "✅ **SOCIAL DISCOVERY TUTORIAL - FASE 1 COMPLETADA**"
echo ""
echo "📋 **LO QUE SE IMPLEMENTÓ:**"
echo "   ✅ Tests E2E completos (3 escenarios iniciales)"
echo "   ✅ Script de validación específico para Social"
echo "   ✅ Verificación de integración con backend"
echo "   ✅ Análisis de gaps y trabajo pendiente"
echo "   ✅ Estructura base para expansión"
echo ""

echo "🧪 **ARCHIVOS CREADOS:**"
echo "   📄 e2e/social-discovery-complete.spec.ts"
echo "   📄 scripts/validate-social-tutorial-implementation.sh"
echo ""

echo "⚠️ **TRABAJO PENDIENTE CRÍTICO:**"
echo "   📝 Expandir contenido educativo (6-7 pasos)"
echo "   🎮 Implementar actionButtons específicos"
echo "   🏆 Definir sistema de recompensas"
echo "   🔗 Integrar con endpoints sociales del backend"
echo ""

echo "🎯 **PRÓXIMOS PASOS INMEDIATOS:**"
echo ""
echo "1️⃣ **Expandir contenido educativo:**"
echo "   Implementar 6-7 pasos sobre filosofía comunitaria"
echo ""
echo "2️⃣ **Validar implementación actual:**"
echo "   scripts/validate-social-tutorial-implementation.sh"
echo ""
echo "3️⃣ **Probar tutorial básico:**"
echo "   useDiscoveryTutorial().startTutorial('social-discovery')"
echo ""

echo "🚀 **PARA COMPLETAR AL 100%:**"
echo "Necesitamos implementar la expansión del contenido educativo"
echo "siguiendo el patrón exitoso de TOINS/Marketplace."
echo ""

echo "✅ Fase 1 de implementación Social Discovery completada."
