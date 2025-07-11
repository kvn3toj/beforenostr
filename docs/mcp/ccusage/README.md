# 🔧 CC Usage MCP - CoomÜnity Integration

## **🎯 INTENT**

- **Propósito:** Establecer métricas de sostenibilidad mediante monitoreo en tiempo real del consumo de recursos de agentes IA
- **Impacto:** Optimizar costos operativos y asegurar un uso eficiente y consciente de recursos computacionales
- **Problema que resuelve:** Visibilidad completa del consumo de tokens, API calls y recursos para tomar decisiones informadas

## **🌟 VALUES**

- **Bien Común:** Uso responsable de recursos tecnológicos compartidos
- **Ayni:** Balance entre consumo y contribución de valor al ecosistema
- **Conciencia:** Transparencia total sobre el impacto ambiental y económico
- **Transparencia:** Métricas visibles y accesibles para todo el equipo

## **⚡ CONSTRAINTS**

- **Técnicos:** Recolección en tiempo real, almacenamiento eficiente, dashboards responsivos
- **Filosóficos:** Privacidad de datos, uso ético de recursos, sostenibilidad ambiental
- **Operacionales:** Overhead mínimo, alertas inteligentes, reportes automatizados
- **Presupuesto:** Optimización de costos, proyecciones precisas, alertas de límites

---

## **📋 Información Técnica**

### **Instalación**

```bash
# Instalar CC Usage MCP
npm install -g @claude-usage/mcp-server

# Verificar instalación
ccusage-mcp --version
```

### **Configuración**

```json
{
  "mcp": {
    "name": "ccusage-mcp",
    "version": "1.0.0",
    "server": "@claude-usage/mcp-server",
    "config": {
      "trackingEnabled": true,
      "granularity": "per-session",
      "alerts": {
        "dailyLimit": 1000,
        "monthlyLimit": 25000,
        "costThreshold": 50
      },
      "storage": {
        "provider": "postgresql",
        "retention": "90d"
      }
    }
  }
}
```

### **Variables de Entorno**

```bash
# Archivo .env
CLAUDE_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxx
CCUSAGE_DB_URL=postgresql://user:pass@localhost:5432/ccusage
CCUSAGE_ALERT_WEBHOOK=https://coomunity.app/webhooks/usage-alerts
```

---

## **🚀 Casos de Uso CoomÜnity**

### **Caso de Uso 1: Monitoreo de Consumo por Proyecto**

**🎯 INTENT:** Rastrear el uso de recursos IA por proyecto para optimizar asignación de presupuesto
**🌟 VALUES:** Transparencia - visibilidad completa, Bien Común - recursos compartidos eficientemente
**⚡ CONSTRAINTS:** Granularidad por proyecto, alertas automáticas, reportes mensuales

**Comandos:**

```bash
# Obtener métricas de consumo por proyecto
ccusage-mcp stats --project "coomunity-superapp" --period "this-month"

# Generar reporte de eficiencia
ccusage-mcp report --type "efficiency" --projects "all" --format "dashboard"
```

### **Caso de Uso 2: Alertas de Sostenibilidad**

**🎯 INTENT:** Prevenir sobreconsumo mediante alertas tempranas basadas en patrones de uso
**🌟 VALUES:** Conciencia - uso responsable, Ayni - balance entre consumo y valor
**⚡ CONSTRAINTS:** Alertas en tiempo real, umbrales configurables, escalación automática

**Comandos:**

```bash
# Configurar alerta de límite diario
ccusage-mcp alert --set-daily-limit 500 --project "coomunity-admin"

# Verificar estado de alertas
ccusage-mcp alerts --status --active-only
```

### **Caso de Uso 3: Análisis de Eficiencia por Guardián**

**🎯 INTENT:** Medir y optimizar la eficiencia de cada Guardián en uso de recursos IA
**🌟 VALUES:** Mejora continua - optimización basada en datos, Reciprocidad - reconocimiento eficiente
**⚡ CONSTRAINTS:** Datos anonimizados, métricas comparativas, feedback constructivo

**Comandos:**

```bash
# Analizar eficiencia por guardián
ccusage-mcp analyze --by-guardian --metric "tokens-per-task" --period "last-week"

# Generar reporte de mejores prácticas
ccusage-mcp best-practices --based-on "efficiency-leaders" --suggestions
```

---

## **📊 Métricas y Monitoreo**

### **KPIs Principales**

- **Costo por tarea:** < $0.10 promedio
- **Eficiencia de tokens:** > 85% tokens útiles vs total
- **Tiempo de respuesta:** < 1s para consultas de métricas
- **Precisión de alertas:** > 95% alertas relevantes

### **Alertas Configuradas**

- ⚠️ **Consumo diario > 80% del límite**
- 🚨 **Costo mensual > presupuesto asignado**
- 📊 **Eficiencia < 70% por 3 días consecutivos**

---

## **🔄 Workflows de Integración**

### **Workflow 1: Monitoreo Continuo**

```yaml
name: continuous-monitoring
trigger: api.call.completed
actions:
  - log-usage-metrics
  - check-threshold-alerts
  - update-real-time-dashboard
  - analyze-efficiency-patterns
```

### **Workflow 2: Reportes Automáticos**

```yaml
name: automated-reporting
trigger: schedule.weekly
actions:
  - generate-usage-report
  - analyze-trends
  - send-recommendations
  - update-budget-projections
```

---

## **🐛 Troubleshooting**

### **Error Común 1: Métricas No Actualizadas**

**Síntoma:** Dashboard muestra datos desactualizados
**Causa:** Fallo en pipeline de recolección de datos
**Solución:**

1. Verificar conexión a DB: `ccusage-mcp db --check`
2. Reiniciar colector: `ccusage-mcp collector --restart`
3. Validar integridad: `ccusage-mcp metrics --validate`

### **Error Común 2: Alertas No Disparadas**

**Síntoma:** No se reciben alertas a pesar de superar límites
**Causa:** Configuración incorrecta de webhooks o umbrales
**Solución:**

1. Probar webhook: `ccusage-mcp alert --test-webhook`
2. Verificar umbrales: `ccusage-mcp config --show-thresholds`
3. Revisar logs: `ccusage-mcp logs --filter "alerts" --last-24h`

### **Error Común 3: Datos de Uso Incorrectos**

**Síntoma:** Métricas no coinciden con facturación real
**Causa:** Desincronización con API de Claude
**Solución:**

1. Sincronizar datos: `ccusage-mcp sync --force --with-claude-api`
2. Reconciliar diferencias: `ccusage-mcp reconcile --period "last-month"`
3. Actualizar configuración: `ccusage-mcp config --update-api-endpoints`

---

## **📝 Changelog**

### **v1.0.0** - 2024-01-XX

- ✅ **Implementación inicial**
- ✅ **Integración con Claude API**
- ✅ **Dashboard básico con métricas esenciales**

### **v1.1.0** - 2024-01-XX

- ✅ **Alertas inteligentes por umbral**
- ✅ **Reportes automáticos semanales**
- ✅ **Análisis de eficiencia por guardián**

---

## **🔗 Enlaces Útiles**

- [Documentación oficial de Claude Usage API](https://docs.anthropic.com/claude/reference/usage)
- [Dashboard de Métricas CoomÜnity](https://metrics.coomunity.app)
- [Guía de Optimización de Costos](./optimization-guide.md)
- [CoomÜnity Development Guidelines](../../CLAUDE.md)

---

## **👥 Responsables**

- **Guardián Principal:** HELIOS
- **Guardián Secundario:** GAIA
- **Mantenedor Técnico:** [Asignar desarrollador]
- **Fecha de última actualización:** 2024-01-XX

---

_Este documento sigue el patrón Intent + Values + Constraints del ecosistema CoomÜnity y debe actualizarse con cada evolución significativa del CC Usage MCP._
