#!/bin/bash

# Script para configurar un cron job que sincronice el Cosmic Kanban periódicamente
# Este script debe ejecutarse con permisos de administrador

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Configurando Cron Job para Cosmic Kanban...${NC}"

# Obtener el directorio actual del proyecto
PROJECT_DIR=$(pwd)
WEBHOOK_TOKEN=${COSMIC_KANBAN_WEBHOOK_TOKEN:-"cosmic-kanban-secret-token"}
BACKEND_URL=${BACKEND_URL:-"http://localhost:3002"}

# Crear archivo temporal para el cron job
TEMP_CRON_FILE=$(mktemp)

# Verificar si ya existe un cron job para Cosmic Kanban
crontab -l | grep -v "cosmic-kanban" > "$TEMP_CRON_FILE" || true

# Agregar el nuevo cron job (cada hora)
echo "# Cosmic Kanban - Sincronización automática cada hora" >> "$TEMP_CRON_FILE"
echo "0 * * * * curl -X POST \"$BACKEND_URL/cosmic-kanban/webhook/sync\" -H \"Content-Type: application/json\" -H \"x-webhook-token: $WEBHOOK_TOKEN\" -d '{\"event\":\"cron\",\"source\":\"system_cron\"}' > /dev/null 2>&1" >> "$TEMP_CRON_FILE"

# Instalar el nuevo cron job
crontab "$TEMP_CRON_FILE"
rm "$TEMP_CRON_FILE"

echo -e "${GREEN}✅ Cron job configurado exitosamente${NC}"
echo -e "El Cosmic Kanban se sincronizará automáticamente cada hora"
echo -e "Además, la sincronización interna está programada cada 30 minutos"
echo -e "URL del webhook: ${YELLOW}$BACKEND_URL/cosmic-kanban/webhook/sync${NC}"
echo -e "Token del webhook: ${YELLOW}$WEBHOOK_TOKEN${NC}"
echo -e "${YELLOW}Nota:${NC} Puedes cambiar el token del webhook configurando la variable de entorno COSMIC_KANBAN_WEBHOOK_TOKEN"

# Instrucciones para configurar webhooks en GitHub
echo -e "\n${YELLOW}Instrucciones para configurar el webhook en GitHub:${NC}"
echo -e "1. Ve a tu repositorio en GitHub"
echo -e "2. Ve a Settings > Webhooks > Add webhook"
echo -e "3. Payload URL: $BACKEND_URL/cosmic-kanban/webhook/sync"
echo -e "4. Content type: application/json"
echo -e "5. Secret: $WEBHOOK_TOKEN"
echo -e "6. Selecciona los eventos: Push, Pull requests"
echo -e "7. Guarda el webhook"

echo -e "\n${GREEN}¡Listo! El Cosmic Kanban ahora se actualizará automáticamente.${NC}"
