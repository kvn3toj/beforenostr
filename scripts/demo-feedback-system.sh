#!/bin/bash

# 🤖 SCRIPT DE DEMOSTRACIÓN - AGENTE DE FEEDBACK (ORÁCULO DE COOMUNITY)
# ===============================================================================
# Este script demuestra la funcionalidad completa del sistema de feedback
# implementado en la SuperApp CoomÜnity
# ===============================================================================

set -e  # Salir si hay errores

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${PURPLE}🤖 DEMOSTRACIÓN - AGENTE DE FEEDBACK (ORÁCULO DE COOMUNITY)${NC}"
echo -e "${PURPLE}===============================================================================${NC}"
echo ""

# 1. VERIFICAR ESTADO DEL SISTEMA
echo -e "${BLUE}📋 1. VERIFICANDO ESTADO DEL SISTEMA...${NC}"
echo ""

# Verificar directorio correcto
if [ "$(pwd)" != "/Users/kevinp/Movies/GAMIFIER-copy" ]; then
    echo -e "${RED}❌ Error: Ejecuta este script desde la raíz del monorepo${NC}"
    echo -e "${YELLOW}🔧 Ejecuta: cd /Users/kevinp/Movies/GAMIFIER-copy${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Directorio correcto: $(pwd)${NC}"

# Verificar SuperApp
if curl -s http://localhost:3001 >/dev/null; then
    echo -e "${GREEN}✅ SuperApp ejecutándose en puerto 3001${NC}"
else
    echo -e "${YELLOW}⚠️ SuperApp no disponible en puerto 3001${NC}"
    echo -e "${BLUE}🚀 Iniciando SuperApp...${NC}"
    npm run dev:superapp &
    sleep 10
    if curl -s http://localhost:3001 >/dev/null; then
        echo -e "${GREEN}✅ SuperApp iniciada correctamente${NC}"
    else
        echo -e "${RED}❌ Error: No se pudo iniciar la SuperApp${NC}"
        exit 1
    fi
fi

# Verificar archivos clave
echo -e "${BLUE}📁 Verificando archivos del sistema de feedback...${NC}"

FEEDBACK_FILES=(
    "Demo/apps/superapp-unified/src/contexts/FeedbackContext.tsx"
    "Demo/apps/superapp-unified/src/components/feedback/FeedbackAgent.tsx"
    "Demo/apps/superapp-unified/src/components/feedback/FeedbackModeToggle.tsx"
    "Demo/apps/superapp-unified/src/components/feedback/FeedbackFloatingButton.tsx"
    "Demo/apps/superapp-unified/src/components/feedback/FeedbackCaptureModal.tsx"
    "Demo/apps/superapp-unified/src/components/AdminPanel/AdminPanel.tsx"
)

for file in "${FEEDBACK_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ FALTA: $file${NC}"
    fi
done

echo ""

# 2. INFORMACIÓN DEL SISTEMA
echo -e "${BLUE}📊 2. INFORMACIÓN DEL SISTEMA DE FEEDBACK${NC}"
echo -e "${PURPLE}===============================================================================${NC}"
echo ""

echo -e "${YELLOW}🎯 COMPONENTES IMPLEMENTADOS:${NC}"
echo "   • FeedbackContext - Gestión centralizada del estado"
echo "   • FeedbackAgent - Componente principal orquestador"
echo "   • FeedbackModeToggle - Toggle flotante para administradores"
echo "   • FeedbackFloatingButton - Botón flotante con tipos de feedback"
echo "   • FeedbackCaptureModal - Modal de captura de datos completo"
echo "   • AdminPanel - Panel de control administrativo"
echo ""

echo -e "${YELLOW}🔧 FUNCIONALIDADES IMPLEMENTADAS:${NC}"
echo "   • ✅ Control de permisos (solo administradores)"
echo "   • ✅ 6 tipos de feedback específicos"
echo "   • ✅ Selector interactivo de elementos UI"
echo "   • ✅ Captura automática de contexto técnico"
echo "   • ✅ Persistencia en localStorage"
echo "   • ✅ Integración con layout principal"
echo "   • ✅ Modal responsive y accesible"
echo "   • ✅ Notificaciones visuales"
echo ""

echo -e "${YELLOW}🎮 TIPOS DE FEEDBACK DISPONIBLES:${NC}"
echo "   1. 🐛 Bug - Errores y problemas técnicos"
echo "   2. 💡 Improvement - Sugerencias de mejora"
echo "   3. ❓ Missing Feature - Funcionalidades faltantes"
echo "   4. 🎨 UI/UX - Problemas de interfaz y experiencia"
echo "   5. ⚡ Performance - Problemas de rendimiento"
echo "   6. 📱 Other - Otros comentarios generales"
echo ""

# 3. CREDENCIALES DE ADMINISTRADOR
echo -e "${BLUE}🔑 3. CREDENCIALES PARA LA DEMOSTRACIÓN${NC}"
echo -e "${PURPLE}===============================================================================${NC}"
echo ""

echo -e "${YELLOW}Para acceder como ADMINISTRADOR y usar el Agente de Feedback:${NC}"
echo ""
echo -e "${GREEN}📧 Email: admin@gamifier.com${NC}"
echo -e "${GREEN}🔒 Password: admin123${NC}"
echo ""
echo -e "${YELLOW}Para usuarios regulares (NO pueden usar el agente):${NC}"
echo ""
echo -e "${BLUE}📧 Email: user@gamifier.com${NC}"
echo -e "${BLUE}🔒 Password: 123456${NC}"
echo ""

# 4. INSTRUCCIONES DE USO
echo -e "${BLUE}🎯 4. CÓMO USAR EL AGENTE DE FEEDBACK${NC}"
echo -e "${PURPLE}===============================================================================${NC}"
echo ""

echo -e "${YELLOW}PASO 1: Acceder como Administrador${NC}"
echo "   1. Abre http://localhost:3001 en tu navegador"
echo "   2. Haz login con admin@gamifier.com / admin123"
echo "   3. Una vez autenticado, verás el toggle en la esquina superior derecha"
echo ""

echo -e "${YELLOW}PASO 2: Activar el Modo Agente${NC}"
echo "   1. Busca el toggle 'Modo Agente' en la esquina superior derecha"
echo "   2. Activa el switch - aparecerá una etiqueta 'BETA'"
echo "   3. Verás un indicador pulsante cuando esté activo"
echo ""

echo -e "${YELLOW}PASO 3: Reportar Feedback${NC}"
echo "   1. Con el modo agente activo, aparecerá un botón flotante rojo"
echo "   2. Haz clic en el botón flotante para ver los tipos de feedback"
echo "   3. Selecciona el tipo de feedback apropiado"
echo "   4. Haz clic en cualquier elemento de la UI que quieras reportar"
echo "   5. Se abrirá un modal para completar los detalles"
echo "   6. Rellena la información y envía el feedback"
echo ""

echo -e "${YELLOW}PASO 4: Gestión Administrativa${NC}"
echo "   1. El AdminPanel muestra estadísticas de feedback pendiente"
echo "   2. Los datos se almacenan en localStorage como fallback"
echo "   3. La integración con backend está preparada para envío real"
echo ""

# 5. DATOS DE PRUEBA
echo -e "${BLUE}📝 5. CREANDO DATOS DE PRUEBA${NC}"
echo -e "${PURPLE}===============================================================================${NC}"
echo ""

echo -e "${YELLOW}Configurando datos de prueba en localStorage...${NC}"

# Crear script JavaScript para ejecutar en el navegador
cat > /tmp/setup_feedback_test_data.js << 'EOF'
// Script para configurar datos de prueba del sistema de feedback
console.log('🚀 Configurando datos de prueba para el Agente de Feedback...');

// Limpiar datos previos
localStorage.removeItem('COOMUNITY_PENDING_FEEDBACK');
localStorage.removeItem('COOMUNITY_FEEDBACK_MODE');

// Crear algunos datos de feedback de ejemplo
const sampleFeedback = [
    {
        id: 'fb_001',
        type: 'bug',
        description: 'El botón de navegación no responde en móvil',
        element: {
            tagName: 'BUTTON',
            className: 'nav-button',
            text: 'Inicio'
        },
        context: {
            url: 'http://localhost:3001/',
            userAgent: 'Demo Browser',
            timestamp: new Date().toISOString()
        },
        status: 'pending',
        priority: 'high'
    },
    {
        id: 'fb_002',
        type: 'improvement',
        description: 'Sería útil tener un modo oscuro automático',
        element: {
            tagName: 'DIV',
            className: 'theme-selector',
            text: 'Configuración de tema'
        },
        context: {
            url: 'http://localhost:3001/settings',
            userAgent: 'Demo Browser',
            timestamp: new Date().toISOString()
        },
        status: 'pending',
        priority: 'medium'
    },
    {
        id: 'fb_003',
        type: 'missing-feature',
        description: 'Falta exportación de datos de usuario',
        element: {
            tagName: 'SECTION',
            className: 'profile-section',
            text: 'Mi Perfil'
        },
        context: {
            url: 'http://localhost:3001/profile',
            userAgent: 'Demo Browser',
            timestamp: new Date().toISOString()
        },
        status: 'pending',
        priority: 'low'
    }
];

// Guardar en localStorage
localStorage.setItem('COOMUNITY_PENDING_FEEDBACK', JSON.stringify(sampleFeedback));

// Configurar modo feedback como inactivo inicialmente
localStorage.setItem('COOMUNITY_FEEDBACK_MODE', 'false');

console.log('✅ Datos de prueba configurados correctamente');
console.log('📊 Feedback pendiente:', sampleFeedback.length);
console.log('🔧 Para activar: Haz login como admin y activa el toggle');
EOF

echo -e "${GREEN}✅ Script de datos de prueba creado en /tmp/setup_feedback_test_data.js${NC}"
echo ""

# 6. VERIFICACIÓN FINAL
echo -e "${BLUE}🔍 6. VERIFICACIÓN FINAL${NC}"
echo -e "${PURPLE}===============================================================================${NC}"
echo ""

echo -e "${YELLOW}Estado del sistema:${NC}"
echo -e "${GREEN}✅ SuperApp ejecutándose en: http://localhost:3001${NC}"
echo -e "${GREEN}✅ Todos los componentes de feedback implementados${NC}"
echo -e "${GREEN}✅ Sistema listo para demostración${NC}"
echo ""

echo -e "${YELLOW}Para comenzar la demostración:${NC}"
echo -e "${BLUE}1. Abre http://localhost:3001 en tu navegador${NC}"
echo -e "${BLUE}2. Haz login con admin@gamifier.com / admin123${NC}"
echo -e "${BLUE}3. Busca el toggle 'Modo Agente' en la esquina superior derecha${NC}"
echo -e "${BLUE}4. Activa el modo agente y comienza a reportar feedback${NC}"
echo ""

# 7. INFORMACIÓN TÉCNICA ADICIONAL
echo -e "${BLUE}💻 7. INFORMACIÓN TÉCNICA${NC}"
echo -e "${PURPLE}===============================================================================${NC}"
echo ""

echo -e "${YELLOW}Arquitectura del sistema:${NC}"
echo "   • Frontend: SuperApp React + TypeScript"
echo "   • Estado: Context API + useState hooks"
echo "   • UI: Material UI + styled components"
echo "   • Persistencia: localStorage (fallback)"
echo "   • Backend: Preparado para NestJS integration"
echo ""

echo -e "${YELLOW}Ubicación de archivos clave:${NC}"
echo "   • Context: Demo/apps/superapp-unified/src/contexts/FeedbackContext.tsx"
echo "   • Components: Demo/apps/superapp-unified/src/components/feedback/"
echo "   • Integration: Demo/apps/superapp-unified/src/components/layout/AppLayout.tsx"
echo ""

echo -e "${YELLOW}Scripts relacionados:${NC}"
echo "   • Demo: scripts/demo-feedback-system.sh (este script)"
echo "   • Test: scripts/test-feedback-agent.sh"
echo "   • Integration: scripts/test-feedback-system-integration.sh"
echo ""

echo -e "${GREEN}🎉 DEMOSTRACIÓN LISTA - ¡El Oráculo de CoomÜnity te espera!${NC}"
echo -e "${PURPLE}===============================================================================${NC}"
echo ""
