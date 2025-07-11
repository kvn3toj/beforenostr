# 🔧 GitHub MCP Server - CoomÜnity Integration

## **🎯 INTENT**

- **Propósito:** Proporcionar omnisciencia del repositorio mediante integración programática con GitHub API
- **Impacto:** Acelerar la gestión de código, automatizar workflows y mejorar la visibilidad del desarrollo colaborativo
- **Problema que resuelve:** Eliminar fricción en operaciones Git repetitivas y habilitar automatización inteligente

## **🌟 VALUES**

- **Bien Común:** Herramientas compartidas que benefician a todo el equipo de desarrollo
- **Ayni:** Reciprocidad en contribuciones - facilitar el reconocimiento y balance de aportes
- **Conciencia:** Automatización que preserva el contexto y propósito de cada cambio
- **Transparencia:** Visibilidad completa del estado del repositorio y contribuciones

## **⚡ CONSTRAINTS**

- **Técnicos:** Rate limits de GitHub API, autenticación segura, compatibilidad con Claude Code
- **Filosóficos:** Respetar privacidad del desarrollador, no crear dependencias críticas
- **Operacionales:** Configuración simple, mantenimiento mínimo, recuperación graceful ante fallos
- **Presupuesto:** Utilizar tier gratuito de GitHub API cuando sea posible

---

## **📋 Información Técnica**

### **Instalación**

```bash
# Instalar GitHub MCP Server
npm install -g @modelcontextprotocol/server-github

# Verificar instalación
github-mcp --version
```

### **Configuración**

```json
{
  "mcp": {
    "name": "github-mcp",
    "version": "1.0.0",
    "server": "@modelcontextprotocol/server-github",
    "config": {
      "githubToken": "${GITHUB_TOKEN}",
      "owner": "tu-organizacion",
      "repo": "coomunity-monorepo",
      "features": ["issues", "pulls", "commits", "actions"]
    }
  }
}
```

### **Variables de Entorno**

```bash
# Archivo .env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=tu-organizacion
GITHUB_REPO=coomunity-monorepo
```

---

## **🚀 Casos de Uso CoomÜnity**

### **Caso de Uso 1: Gestión de Issues con Filosofía CoomÜnity**

**🎯 INTENT:** Automatizar la creación y etiquetado de issues basado en principios CoomÜnity
**🌟 VALUES:** Transparencia - issues claros, Bien Común - priorización comunitaria
**⚡ CONSTRAINTS:** Labels automáticos, templates obligatorios, asignación balanceada

**Comandos:**

```bash
# Crear issue con contexto CoomÜnity
github-mcp create-issue --title "Implementar wallet Ünits" --labels "bien-comun,transparencia" --template "feature-coomunity"

# Listar issues por valor CoomÜnity
github-mcp list-issues --filter "label:reciprocidad"
```

### **Caso de Uso 2: Pull Requests con Patrón Intent+Values+Constraints**

**🎯 INTENT:** Asegurar que cada PR incluya contexto filosófico y técnico
**🌟 VALUES:** Ayni - contribuciones balanceadas, Conciencia - propósito claro
**⚡ CONSTRAINTS:** Template obligatorio, review automático, métricas de impacto

**Comandos:**

```bash
# Crear PR con template CoomÜnity
github-mcp create-pr --title "Refactor auth flow" --template "intent-values-constraints" --reviewers "guardians"

# Validar PR compliance
github-mcp validate-pr --pr-number 42 --check-template
```

### **Caso de Uso 3: Análisis de Contribuciones (Ayni)**

**🎯 INTENT:** Medir y reconocer contribuciones balanceadas según principio de Ayni
**🌟 VALUES:** Reciprocidad - reconocimiento justo, Bien Común - evitar desbalances
**⚡ CONSTRAINTS:** Métricas cualitativas y cuantitativas, reporte automático

**Comandos:**

```bash
# Generar reporte de contribuciones
github-mcp analyze-contributions --period "last-month" --type "ayni-balance"

# Identificar oportunidades de colaboración
github-mcp suggest-collaboration --based-on "expertise-gaps"
```

---

## **📊 Métricas y Monitoreo**

### **KPIs Principales**

- **Tiempo de respuesta:** < 2s para operaciones básicas
- **Tasa de éxito:** > 95% para comandos críticos
- **Uso de recursos:** < 100MB RAM, < 50MB storage
- **Impacto en velocidad:** 40% reducción en tiempo de gestión de repo

### **Alertas Configuradas**

- ⚠️ **Tiempo de respuesta > 5s**
- 🚨 **Tasa de error > 5%**
- 📊 **Rate limit GitHub API > 80%**

---

## **🔄 Workflows de Integración**

### **Workflow 1: Auto-triage de Issues**

```yaml
name: auto-triage-issues
trigger: issue.opened
actions:
  - classify-by-content
  - assign-coomunity-labels
  - suggest-assignees
  - add-to-project-board
```

### **Workflow 2: PR Validation**

```yaml
name: pr-validation
trigger: pull_request.opened
actions:
  - check-template-compliance
  - validate-intent-values-constraints
  - assign-reviewers-by-expertise
  - update-project-metrics
```

---

## **🐛 Troubleshooting**

### **Error Común 1: GitHub API Rate Limit**

**Síntoma:** Error 403 "API rate limit exceeded"
**Causa:** Demasiadas requests en periodo corto
**Solución:**

1. Implementar caching inteligente
2. Usar GraphQL cuando sea posible
3. Configurar GitHub App para rate limits más altos

### **Error Común 2: Token Authentication Failed**

**Síntoma:** Error 401 "Bad credentials"
**Causa:** Token expirado o permisos insuficientes
**Solución:**

1. Verificar token en GitHub Settings
2. Asegurar permisos: repo, issues, pull_requests
3. Regenerar token si es necesario

### **Error Común 3: Webhook Delivery Failed**

**Síntoma:** Webhooks no llegan a endpoint
**Causa:** Configuración incorrecta o endpoint no disponible
**Solución:**

1. Verificar URL del webhook
2. Comprobar SSL certificate
3. Testear conectividad con ngrok si es desarrollo

---

## **📝 Changelog**

### **v1.0.0** - 2024-01-XX

- ✅ **Implementación inicial**
- ✅ **Configuración básica con GitHub API**
- ✅ **Casos de uso fundamentales para CoomÜnity**

### **v1.1.0** - 2024-01-XX

- ✅ **Workflows de auto-triage**
- ✅ **Integración con labels CoomÜnity**
- ✅ **Métricas de Ayni para contribuciones**

---

## **🔗 Enlaces Útiles**

- [Documentación oficial de GitHub MCP](https://github.com/modelcontextprotocol/servers/tree/main/src/github)
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [MCP Protocol Specification](https://spec.modelcontextprotocol.io/)
- [CoomÜnity Development Guidelines](../../CLAUDE.md)

---

## **👥 Responsables**

- **Guardián Principal:** ATLAS
- **Guardián Secundario:** COSMOS
- **Mantenedor Técnico:** [Asignar desarrollador]
- **Fecha de última actualización:** 2024-01-XX

---

_Este documento sigue el patrón Intent + Values + Constraints del ecosistema CoomÜnity y debe actualizarse con cada evolución significativa del GitHub MCP._
