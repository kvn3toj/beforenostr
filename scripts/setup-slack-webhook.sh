#!/bin/bash

# 🚀 Script de Configuración Automática del Webhook de Slack para CoomÜnity
# Este script automatiza la configuración del agente Slack

echo "🤖 Configurador Automático del Agente Slack CoomÜnity"
echo "=================================================="
echo ""

# Colores para mejor visualización
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar que estamos en el directorio correcto
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Error: No se encontró archivo .env${NC}"
    echo "Asegúrate de ejecutar este script desde la raíz del proyecto"
    exit 1
fi

echo -e "${BLUE}📋 Paso 1: Información del Workspace${NC}"
echo "Tu workspace ID detectado en el código: T07Q79L0M9V"
echo "Canal recomendado: #all-superapp"
echo ""

echo -e "${YELLOW}🔗 Paso 2: Crear el Webhook de Slack${NC}"
echo "Voy a abrir automáticamente la página para crear tu webhook..."
echo ""

# Abrir automáticamente la página de Slack Apps
echo -e "${GREEN}Abriendo https://api.slack.com/apps en tu navegador...${NC}"
open "https://api.slack.com/apps" 2>/dev/null || {
    echo "No se pudo abrir automáticamente. Ve manualmente a: https://api.slack.com/apps"
}

echo ""
echo -e "${BLUE}📝 Sigue estos pasos en el navegador:${NC}"
echo "1. Click 'Create New App'"
echo "2. Selecciona 'From scratch'"
echo "3. Nombre: 'CoomÜnity Agent'"
echo "4. Workspace: Selecciona tu workspace 'SuperApp'"
echo "5. Click 'Create App'"
echo ""
echo "6. En el menú lateral, click 'Incoming Webhooks'"
echo "7. Activa el toggle 'Activate Incoming Webhooks'"
echo "8. Scroll down y click 'Add New Webhook to Workspace'"
echo "9. Selecciona el canal #all-superapp"
echo "10. Click 'Allow'"
echo ""

# Función para validar URL del webhook
validate_webhook_url() {
    if [[ $1 =~ ^https://hooks\.slack\.com/services/[A-Z0-9]+/[A-Z0-9]+/[A-Za-z0-9]+ ]]; then
        return 0
    else
        return 1
    fi
}

# Solicitar la URL del webhook
echo -e "${YELLOW}🔗 Paso 3: Configurar el Webhook${NC}"
while true; do
    echo ""
    echo -e "${GREEN}Copia la URL del webhook que Slack te proporcionó:${NC}"
    echo "(Debe empezar con: https://hooks.slack.com/services/...)"
    read -p "Webhook URL: " webhook_url
    
    if [ -z "$webhook_url" ]; then
        echo -e "${RED}❌ Por favor ingresa la URL del webhook${NC}"
        continue
    fi
    
    if validate_webhook_url "$webhook_url"; then
        echo -e "${GREEN}✅ URL válida detectada${NC}"
        break
    else
        echo -e "${RED}❌ URL inválida. Debe empezar con https://hooks.slack.com/services/${NC}"
        echo "Ejemplo: https://hooks.slack.com/services/T07Q79L0M9V/B1234567890/XXXXXXXXXXXXXXXXXX"
    fi
done

# Hacer backup del .env
echo ""
echo -e "${BLUE}💾 Creando backup de .env...${NC}"
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Backup creado"

# Configurar las variables en .env
echo ""
echo -e "${BLUE}⚙️ Configurando variables de entorno...${NC}"

# Actualizar SLACK_WEBHOOK_URL
if grep -q "^SLACK_WEBHOOK_URL=" .env; then
    sed -i '' "s|^SLACK_WEBHOOK_URL=.*|SLACK_WEBHOOK_URL=${webhook_url}|" .env
else
    echo "SLACK_WEBHOOK_URL=${webhook_url}" >> .env
fi

# Actualizar ALERT_SLACK_ENABLED
if grep -q "^ALERT_SLACK_ENABLED=" .env; then
    sed -i '' "s|^ALERT_SLACK_ENABLED=.*|ALERT_SLACK_ENABLED=true|" .env
else
    echo "ALERT_SLACK_ENABLED=true" >> .env
fi

echo "✅ Variables configuradas"

# Mostrar configuración actual
echo ""
echo -e "${GREEN}📋 Configuración aplicada:${NC}"
echo "ALERT_SLACK_ENABLED=true"
echo "SLACK_WEBHOOK_URL=${webhook_url}"

# Probar el webhook
echo ""
echo -e "${YELLOW}🧪 Paso 4: Probar el Webhook${NC}"
echo "Enviando mensaje de prueba a Slack..."

test_response=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    -H 'Content-type: application/json' \
    --data '{"text":"🚀 ¡Agente CoomÜnity conectado exitosamente!\n\n✅ Webhook configurado correctamente\n📊 El agente está listo para enviar reportes\n🎯 Canal: #all-superapp"}' \
    "$webhook_url")

if [ "$test_response" = "200" ]; then
    echo -e "${GREEN}✅ ¡Mensaje de prueba enviado exitosamente!${NC}"
    echo "Revisa tu canal #all-superapp en Slack"
else
    echo -e "${RED}❌ Error enviando mensaje de prueba (HTTP: $test_response)${NC}"
    echo "Verifica que la URL del webhook sea correcta"
fi

# Ejecutar el agente completo
echo ""
echo -e "${YELLOW}🤖 Paso 5: Ejecutar el Agente Completo${NC}"
echo "¿Quieres ejecutar el agente de integración completo ahora? (y/N)"
read -p "Respuesta: " run_agent

if [[ $run_agent =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${BLUE}🚀 Ejecutando agente de integración CoomÜnity...${NC}"
    echo "=================================================="
    node scripts/slack-integration-agent.js
else
    echo ""
    echo -e "${GREEN}✅ Configuración completada${NC}"
    echo ""
    echo -e "${BLUE}Para ejecutar el agente manualmente:${NC}"
    echo "node scripts/slack-integration-agent.js"
fi

echo ""
echo -e "${GREEN}🎉 ¡Configuración del Agente Slack Completada!${NC}"
echo ""
echo -e "${BLUE}📋 Resumen:${NC}"
echo "• Webhook configurado y probado"
echo "• Alertas Slack habilitadas"  
echo "• Agente listo para reportes automáticos"
echo "• Canal objetivo: #all-superapp"
echo ""
echo -e "${YELLOW}💡 Tip:${NC} Puedes ejecutar el agente en cualquier momento con:"
echo "node scripts/slack-integration-agent.js" 