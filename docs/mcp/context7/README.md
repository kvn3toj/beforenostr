# 🔧 Context7 MCP - CoomÜnity Integration

## **🎯 INTENT**

- **Propósito:** Expandir el archivo cósmico de conocimiento mediante acceso en tiempo real a documentación de librerías externas
- **Impacto:** Acelerar la investigación y desarrollo al eliminar la necesidad de buscar documentación manualmente
- **Problema que resuelve:** Reducir contexto switching y aumentar la precisión técnica en implementaciones

## **🌟 VALUES**

- **Bien Común:** Conocimiento compartido y accesible para todo el equipo
- **Ayni:** Contribuir de vuelta al ecosistema de conocimiento open source
- **Conciencia:** Decisiones técnicas informadas por documentación actualizada
- **Transparencia:** Fuentes de información siempre visibles y auditables

## **⚡ CONSTRAINTS**

- **Técnicos:** Rate limits de APIs de documentación, caching inteligente, compatibilidad Claude Code
- **Filosóficos:** Usar fuentes open source prioritariamente, respetar licencias
- **Operacionales:** Tiempo de respuesta < 2s, disponibilidad 99.5%
- **Presupuesto:** Priorizar fuentes gratuitas, optimizar uso de APIs de pago

---

## **📋 Información Técnica**

### **Instalación**

```bash
# Instalar Context7 MCP
npm install -g @context7/mcp-server

# Verificar instalación
context7-mcp --version
```

### **Configuración**

```json
{
  "mcp": {
    "name": "context7-mcp",
    "version": "1.0.0",
    "server": "@context7/mcp-server",
    "config": {
      "sources": ["npm", "github", "mdn", "typescript", "react", "nestjs"],
      "cacheSize": "500MB",
      "refreshInterval": "24h",
      "preferredLanguage": "en"
    }
  }
}
```

### **Variables de Entorno**

```bash
# Archivo .env
CONTEXT7_API_KEY=ctx7_xxxxxxxxxxxxxxxxxxxx
CONTEXT7_CACHE_DIR=./cache/context7
CONTEXT7_MAX_CACHE_SIZE=500MB
```

---

## **🚀 Casos de Uso CoomÜnity**

### **Caso de Uso 1: Investigación de Librerías para Features**

**🎯 INTENT:** Acceder rápidamente a documentación de librerías para implementar features CoomÜnity
**🌟 VALUES:** Eficiencia - desarrollo acelerado, Bien Común - decisiones técnicas informadas
**⚡ CONSTRAINTS:** Fuentes actualizadas, ejemplos de código, compatibilidad con stack

**Comandos:**

```bash
# Buscar documentación de React Query para implementar cache
context7-mcp search --library "@tanstack/react-query" --topic "cache invalidation"

# Obtener ejemplos de uso de Zustand con TypeScript
context7-mcp examples --library "zustand" --language "typescript" --pattern "store-setup"
```

### **Caso de Uso 2: Resolución de Errores Técnicos**

**🎯 INTENT:** Encontrar soluciones rápidas a errores específicos durante desarrollo
**🌟 VALUES:** Transparencia - entender causa raíz, Conciencia - aprende de errores
**⚡ CONSTRAINTS:** Soluciones verificadas, contexto del stack CoomÜnity

**Comandos:**

```bash
# Buscar solución para error específico de NestJS
context7-mcp debug --error "Cannot resolve dependency" --context "nestjs,typescript"

# Obtener mejores prácticas para error handling
context7-mcp best-practices --topic "error-handling" --framework "nestjs"
```

### **Caso de Uso 3: Actualizaciones de Dependencias**

**🎯 INTENT:** Evaluar impacto de actualizaciones de dependencias antes de implementar
**🌟 VALUES:** Ayni - contribuir con feedback, Bien Común - estabilidad del proyecto
**⚡ CONSTRAINTS:** Cambios breaking, compatibilidad, esfuerzo de migración

**Comandos:**

```bash
# Verificar cambios breaking en nueva versión
context7-mcp migration --from "react@17" --to "react@18" --breaking-changes

# Obtener guía de migración
context7-mcp migration-guide --library "material-ui" --version "v5"
```

---

## **📊 Métricas y Monitoreo**

### **KPIs Principales**

- **Tiempo de respuesta:** < 2s para búsquedas básicas
- **Tasa de éxito:** > 98% para librerías principales
- **Uso de recursos:** < 200MB RAM, < 500MB cache
- **Impacto en velocidad:** 60% reducción en tiempo de investigación

### **Alertas Configuradas**

- ⚠️ **Tiempo de respuesta > 5s**
- 🚨 **Tasa de error > 2%**
- 📊 **Cache hit rate < 80%**

---

## **🔄 Workflows de Integración**

### **Workflow 1: Auto-completion de Documentación**

```yaml
name: auto-complete-docs
trigger: code.completion
actions:
  - analyze-import-statements
  - fetch-relevant-documentation
  - provide-inline-suggestions
  - cache-frequently-used-docs
```

### **Workflow 2: Dependency Analysis**

```yaml
name: dependency-analysis
trigger: package.json.changed
actions:
  - check-breaking-changes
  - analyze-security-vulnerabilities
  - suggest-migration-paths
  - update-documentation-cache
```

---

## **🐛 Troubleshooting**

### **Error Común 1: API Rate Limit Exceded**

**Síntoma:** Error 429 "Too Many Requests"
**Causa:** Demasiadas consultas en período corto
**Solución:**

1. Implementar backoff exponencial
2. Aumentar cache TTL
3. Usar múltiples fuentes de documentación

### **Error Común 2: Cache Corruption**

**Síntoma:** Documentación desactualizada o corrupta
**Causa:** Interrupción durante escritura de cache
**Solución:**

1. Limpiar cache: `context7-mcp cache --clear`
2. Verificar integridad: `context7-mcp cache --verify`
3. Regenerar cache: `context7-mcp cache --rebuild`

### **Error Común 3: Source Unavailable**

**Síntoma:** Error 503 "Service Temporarily Unavailable"
**Causa:** Fuente de documentación caída
**Solución:**

1. Usar fuentes alternativas
2. Consultar cache local
3. Implementar fallback a mirror sites

---

## **📝 Changelog**

### **v1.0.0** - 2024-01-XX

- ✅ **Implementación inicial**
- ✅ **Configuración básica con fuentes principales**
- ✅ **Sistema de cache inteligente**

### **v1.1.0** - 2024-01-XX

- ✅ **Integración con VS Code**
- ✅ **Soporte para librerías CoomÜnity específicas**
- ✅ **Métricas de uso y eficiencia**

---

## **🔗 Enlaces Útiles**

- [Documentación oficial de Context7](https://context7.ai/docs)
- [MCP Protocol Specification](https://spec.modelcontextprotocol.io/)
- [CoomÜnity Development Guidelines](../../CLAUDE.md)
- [Lista de fuentes soportadas](./sources.md)

---

## **👥 Responsables**

- **Guardián Principal:** ANA
- **Guardián Secundario:** MIRA
- **Mantenedor Técnico:** [Asignar desarrollador]
- **Fecha de última actualización:** 2024-01-XX

---

_Este documento sigue el patrón Intent + Values + Constraints del ecosistema CoomÜnity y debe actualizarse con cada evolución significativa del Context7 MCP._
