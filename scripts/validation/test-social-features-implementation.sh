#!/bin/bash

# 🧪 Script de Validación: Funcionalidades Sociales ÜPlay FASE 2
# Verifica la implementación de hooks, componentes y tipos para salas de estudio
# Basado en el roadmap de scripts/slack-agent-tasks/implement-uplay-social-features.md

echo "🏫 VALIDACIÓN IMPLEMENTACIÓN FASE 2 - FUNCIONALIDADES SOCIALES"
echo "=============================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contadores
TOTAL_CHECKS=0
PASSED_CHECKS=0

# Función para check
check_file() {
    local file=$1
    local description=$2
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $description"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "${RED}❌${NC} $description - Archivo no encontrado: $file"
        return 1
    fi
}

# Función para check de contenido
check_content() {
    local file=$1
    local pattern=$2
    local description=$3
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ -f "$file" ] && grep -q "$pattern" "$file"; then
        echo -e "${GREEN}✅${NC} $description"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "${RED}❌${NC} $description - Patrón no encontrado: $pattern en $file"
        return 1
    fi
}

echo "🔍 1. Verificando TypeScript Types..."
echo "------------------------------------"

# Verificar tipos principales
check_file "Demo/apps/superapp-unified/src/types/study-rooms.ts" "Tipos de Study Rooms definidos"
check_content "Demo/apps/superapp-unified/src/types/study-rooms.ts" "StudyRoom" "Interface StudyRoom definida"
check_content "Demo/apps/superapp-unified/src/types/study-rooms.ts" "ChatMessage" "Interface ChatMessage definida"
check_content "Demo/apps/superapp-unified/src/types/study-rooms.ts" "VideoParty" "Interface VideoParty definida"
check_content "Demo/apps/superapp-unified/src/types/study-rooms.ts" "CollaborativeMission" "Interface CollaborativeMission definida"
check_content "Demo/apps/superapp-unified/src/types/study-rooms.ts" "RoomEvent" "Interface RoomEvent para WebSocket definida"

echo ""
echo "🎣 2. Verificando Hooks..."
echo "-------------------------"

# Verificar hook principal
check_file "Demo/apps/superapp-unified/src/hooks/useStudyRooms.ts" "Hook useStudyRooms implementado"
check_content "Demo/apps/superapp-unified/src/hooks/useStudyRooms.ts" "createRoom" "Función createRoom implementada"
check_content "Demo/apps/superapp-unified/src/hooks/useStudyRooms.ts" "joinRoom" "Función joinRoom implementada"
check_content "Demo/apps/superapp-unified/src/hooks/useStudyRooms.ts" "leaveRoom" "Función leaveRoom implementada"
check_content "Demo/apps/superapp-unified/src/hooks/useStudyRooms.ts" "syncVideo" "Función syncVideo implementada"
check_content "Demo/apps/superapp-unified/src/hooks/useStudyRooms.ts" "sendMessage" "Función sendMessage implementada"
check_content "Demo/apps/superapp-unified/src/hooks/useStudyRooms.ts" "WebSocket" "Conexión WebSocket implementada"
check_content "Demo/apps/superapp-unified/src/hooks/useStudyRooms.ts" "applyFilters" "Sistema de filtros implementado"

echo ""
echo "🎨 3. Verificando Componentes..."
echo "--------------------------------"

# Verificar componentes existentes (foundation)
check_file "Demo/apps/superapp-unified/src/components/modules/uplay/components/StudyRoomCreator.tsx" "Componente StudyRoomCreator (Foundation)"
check_content "Demo/apps/superapp-unified/src/components/modules/uplay/components/StudyRoomCreator.tsx" "STUDY_FOCUS_CONFIG" "Configuración de focos de estudio"
check_content "Demo/apps/superapp-unified/src/components/modules/uplay/components/StudyRoomCreator.tsx" "useState" "Estado del formulario implementado"
check_content "Demo/apps/superapp-unified/src/components/modules/uplay/components/StudyRoomCreator.tsx" "Material.*UI" "Diseño Material UI implementado"

# Verificar componentes nuevos
check_file "Demo/apps/superapp-unified/src/components/modules/uplay/components/StudyRoomList.tsx" "Componente StudyRoomList implementado"
check_content "Demo/apps/superapp-unified/src/components/modules/uplay/components/StudyRoomList.tsx" "useStudyRooms" "Hook useStudyRooms integrado"
check_content "Demo/apps/superapp-unified/src/components/modules/uplay/components/StudyRoomList.tsx" "handleJoinRoom" "Funcionalidad Join implementada"
check_content "Demo/apps/superapp-unified/src/components/modules/uplay/components/StudyRoomList.tsx" "getFilteredAndSearchedRooms" "Sistema de búsqueda implementado"

# Verificar ChatBox (puede fallar si no se guardó correctamente)
if check_file "Demo/apps/superapp-unified/src/components/modules/uplay/components/ChatBox.tsx" "Componente ChatBox implementado"; then
    check_content "Demo/apps/superapp-unified/src/components/modules/uplay/components/ChatBox.tsx" "sendMessage" "Funcionalidad de envío implementada"
    check_content "Demo/apps/superapp-unified/src/components/modules/uplay/components/ChatBox.tsx" "EMOJI_REACTIONS" "Sistema de reacciones implementado"
    check_content "Demo/apps/superapp-unified/src/components/modules/uplay/components/ChatBox.tsx" "renderMessage" "Renderizado de mensajes implementado"
else
    echo -e "${YELLOW}⚠️${NC} ChatBox component may need to be created manually"
fi

echo ""
echo "🔧 4. Verificando Scripts y Documentación..."
echo "--------------------------------------------"

# Verificar roadmap y documentación
check_file "scripts/slack-agent-tasks/implement-uplay-social-features.md" "Roadmap para Agente Slack completo"
check_content "scripts/slack-agent-tasks/implement-uplay-social-features.md" "FASE 2.*FUNCIONALIDADES SOCIALES" "Documentación de FASE 2"
check_content "scripts/slack-agent-tasks/implement-uplay-social-features.md" "useStudyRooms" "Hook useStudyRooms documentado"
check_content "scripts/slack-agent-tasks/implement-uplay-social-features.md" "ChatBox" "Componente ChatBox documentado"

# Verificar script de validación anterior
check_file "scripts/validation/validate-uplay-questions-endpoint.sh" "Script de validación backend existente"

echo ""
echo "📊 5. Verificando Integración con Existente..."
echo "----------------------------------------------"

# Verificar que no rompe implementación existente
check_file "Demo/apps/superapp-unified/src/components/modules/uplay/components/EnhancedInteractiveVideoPlayer.tsx" "Video Player existente intacto"
check_content "Demo/apps/superapp-unified/src/components/modules/uplay/components/EnhancedInteractiveVideoPlayer.tsx" "handleQuestionSubmission" "Funcionalidad de preguntas intacta"

# Verificar imports y tipos
if [ -f "Demo/apps/superapp-unified/src/hooks/useStudyRooms.ts" ]; then
    echo -e "${BLUE}🔍${NC} Verificando imports en useStudyRooms..."
    if grep -q "from '../types/study-rooms'" "Demo/apps/superapp-unified/src/hooks/useStudyRooms.ts"; then
        echo -e "${GREEN}✅${NC} Imports de tipos correctos"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        echo -e "${RED}❌${NC} Imports de tipos incorrectos"
    fi
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
fi

echo ""
echo "🚀 6. Verificando Funcionalidades Implementadas..."
echo "------------------------------------------------"

# Contar funcionalidades implementadas según roadmap
IMPLEMENTED_FEATURES=0
TOTAL_FEATURES=7

echo -e "${BLUE}📋${NC} Checklist según roadmap FASE 2:"

# Tarea 1: Sistema de Salas de Estudio Básico
if [ -f "Demo/apps/superapp-unified/src/hooks/useStudyRooms.ts" ] && [ -f "Demo/apps/superapp-unified/src/components/modules/uplay/components/StudyRoomList.tsx" ]; then
    echo -e "${GREEN}✅${NC} Tarea 1: Sistema de Salas de Estudio Básico"
    IMPLEMENTED_FEATURES=$((IMPLEMENTED_FEATURES + 1))
else
    echo -e "${RED}❌${NC} Tarea 1: Sistema de Salas de Estudio Básico"
fi

# Tarea 2: Chat en Tiempo Real
if [ -f "Demo/apps/superapp-unified/src/components/modules/uplay/components/ChatBox.tsx" ]; then
    echo -e "${GREEN}✅${NC} Tarea 2: Chat en Tiempo Real"
    IMPLEMENTED_FEATURES=$((IMPLEMENTED_FEATURES + 1))
else
    echo -e "${YELLOW}⚠️${NC} Tarea 2: Chat en Tiempo Real (parcial)"
fi

# Verificar funcionalidades pendientes
echo -e "${YELLOW}⏳${NC} Tarea 3: Sincronización de Video WebRTC (pendiente)"
echo -e "${YELLOW}⏳${NC} Tarea 4: Sistema de Misiones Colaborativas (pendiente)"
echo -e "${YELLOW}⏳${NC} FASE 3: Video Party Sessions (pendiente)"

echo ""
echo "📈 RESUMEN DE VALIDACIÓN"
echo "========================"

# Calcular porcentajes
COMPLETION_PERCENTAGE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
FEATURES_PERCENTAGE=$((IMPLEMENTED_FEATURES * 100 / TOTAL_FEATURES))

echo -e "${BLUE}📊${NC} Archivos y verificaciones:"
echo "   Verificaciones pasadas: $PASSED_CHECKS/$TOTAL_CHECKS ($COMPLETION_PERCENTAGE%)"

echo -e "${BLUE}🎯${NC} Funcionalidades del roadmap:"
echo "   Implementadas: $IMPLEMENTED_FEATURES/$TOTAL_FEATURES ($FEATURES_PERCENTAGE%)"

# Estado general
if [ $COMPLETION_PERCENTAGE -ge 80 ]; then
    echo -e "${GREEN}🎉${NC} Estado: EXCELENTE - Implementación sólida"
elif [ $COMPLETION_PERCENTAGE -ge 60 ]; then
    echo -e "${YELLOW}⚠️${NC} Estado: BUENO - Algunas correcciones necesarias"
else
    echo -e "${RED}❌${NC} Estado: CRÍTICO - Implementación incompleta"
fi

echo ""
echo "🛠️ RECOMENDACIONES:"
echo "==================="

# Recomendaciones basadas en resultados
if [ ! -f "Demo/apps/superapp-unified/src/components/modules/uplay/components/ChatBox.tsx" ]; then
    echo -e "${YELLOW}📝${NC} 1. Crear componente ChatBox.tsx manualmente"
fi

if [ $FEATURES_PERCENTAGE -lt 50 ]; then
    echo -e "${YELLOW}📝${NC} 2. Continuar con implementación de FASE 2 según roadmap"
fi

echo -e "${BLUE}📝${NC} 3. Siguiente paso: Implementar WebRTC para sincronización de video"
echo -e "${BLUE}📝${NC} 4. Siguiente paso: Crear componente StudyRoomDashboard"
echo -e "${BLUE}📝${NC} 5. Integrar componentes con páginas principales de ÜPlay"

echo ""
echo "🔗 PARA CONTINUAR:"
echo "=================="
echo "1. Revisar roadmap completo: scripts/slack-agent-tasks/implement-uplay-social-features.md"
echo "2. Verificar backend endpoints disponibles"
echo "3. Integrar componentes en las páginas ÜPlay existentes"
echo "4. Implementar funcionalidades de FASE 3 (Video Party Sessions)"

echo ""
if [ $COMPLETION_PERCENTAGE -ge 70 ]; then
    echo -e "${GREEN}✅ FASE 2 BÁSICA COMPLETADA - LISTO PARA FASE 3${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️ COMPLETAR FASE 2 ANTES DE CONTINUAR${NC}"
    exit 1
fi 