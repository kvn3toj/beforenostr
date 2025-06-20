# 🚀 Cursor v1.0 MCP Setup para CoomÜnity

## Configuración de Model Context Protocol (MCP) Servers

### 📋 Servidores MCP Configurados

#### **Configuración Local (SuperApp)**
Ubicación: `Demo/apps/superapp-unified/.cursor/mcp.json`

- **GitHub Integration**: Revisión de PRs, issues, commits
- **Playwright Testing**: Automatización de tests E2E
- **PostgreSQL**: Acceso directo a la base de datos del backend
- **Filesystem**: Navegación y edición de archivos del proyecto

#### **Configuración Global**
Ubicación: `~/.cursor/mcp.json`

- **Notion**: Gestión de documentación y proyecto
- **Sentry**: Monitoreo de errores y performance
- **Linear**: Gestión de issues y planning
- **Web Search**: Búsqueda en tiempo real (DuckDuckGo)

### 🔧 Configuración de Tokens/APIs

Para activar completamente los MCP servers, necesitas configurar las siguientes variables:

#### **1. GitHub Token**
```bash
# En Demo/apps/superapp-unified/.cursor/mcp.json
# Reemplazar "github_pat_placeholder" con tu token real:
# https://github.com/settings/tokens
```

#### **2. PostgreSQL Connection**
```bash
# Verificar que el backend NestJS esté corriendo en puerto 3002
# La cadena de conexión debe apuntar a la misma BD que usa el backend
```

#### **3. Notion API** (Opcional)
```bash
# En ~/.cursor/mcp.json
# Crear integración en: https://www.notion.so/my-integrations
# Obtener API key y database ID
```

#### **4. Sentry Token** (Para Producción)
```bash
# Configurar cuando tengamos Sentry configurado en producción
```

### 🎯 Uso de MCP Servers

#### **Con Background Agent (Cmd/Ctrl+E)**
- "Usa GitHub MCP para revisar las últimas PRs del proyecto"
- "Ejecuta tests E2E con Playwright MCP para validar el flujo de login"
- "Consulta la base de datos PostgreSQL para obtener estadísticas de usuarios"

#### **En Chat Normal**
Los servidores MCP aparecerán automáticamente como "Available Tools" cuando sean relevantes para la conversación.

### 🔍 Verificación de MCP

#### **Verificar Configuración Local**
```bash
cd Demo/apps/superapp-unified
cat .cursor/mcp.json
```

#### **Verificar Configuración Global**
```bash
cat ~/.cursor/mcp.json
```

#### **Test de Conectividad**
En Cursor Chat, pregunta:
- "¿Qué herramientas MCP están disponibles?"
- "Lista los archivos del proyecto usando el MCP filesystem"

### 📊 Beneficios Esperados

#### **Productividad**
- ✅ Acceso directo a GitHub sin cambiar contexto
- ✅ Tests automatizados desde el chat
- ✅ Consultas DB sin salir del editor
- ✅ Búsqueda web integrada

#### **Calidad**
- ✅ Revisión automática de código con GitHub MCP
- ✅ Testing continuo con Playwright MCP
- ✅ Monitoreo de errores con Sentry MCP

#### **Colaboración**
- ✅ Documentación sincronizada con Notion MCP
- ✅ Issues y planning con Linear MCP
- ✅ Conocimiento actualizado con Web Search MCP

### 🚨 Notas Importantes

1. **Seguridad**: Los tokens deben mantenerse seguros y no commitearse
2. **Performance**: Los MCP servers se ejecutan localmente y pueden consumir recursos
3. **Updates**: Los servers se actualizan automáticamente con `npx -y`
4. **Troubleshooting**: Verificar logs en la consola de Cursor si hay problemas

### 📈 Roadmap MCP

#### **Próximas Integraciones**
- **Figma MCP**: Para design-to-code workflows
- **PostHog MCP**: Para analytics avanzados
- **Stripe MCP**: Para gestión de pagos (futuro)

#### **Custom MCP Servers**
- **CoomÜnity Backend MCP**: Integración directa con nuestro NestJS API
- **Gamification MCP**: Acceso directo a métricas de Ayni, Méritos, etc.

---

**Configurado por**: Agente IA CoomÜnity  
**Fecha**: 2025-06-07  
**Versión Cursor**: v1.0+  
**Estado**: ✅ Configuración Base Completa 