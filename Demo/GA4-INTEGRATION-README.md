# 📊 Google Analytics 4 (GA4) Integration - CoomÜnity Platform

## 🎯 Descripción

Este proyecto proporciona una integración completa y automatizada de Google Analytics 4 (GA4) para la plataforma CoomÜnity, con tracking específico de eventos UX y heurísticas de usabilidad.

## 🚀 Características Principales

- ✅ **Integración Automática**: Script TypeScript que añade GA4 a todos los archivos HTML
- ✅ **Tracking UX Específico**: 8 eventos personalizados para heurísticas UX
- ✅ **Ejemplos por Sección**: Código específico para Red Pill, Merchant y Pilgrim
- ✅ **Documentación Completa**: Guía detallada de implementación y configuración
- ✅ **Scripts de Setup**: Automatización con opciones configurables

## 📁 Estructura de Archivos

```
📦 GA4 Integration
├── 📄 ga4-integration-script.ts     # Script principal de integración
├── 📄 ga4-package.json              # Dependencias del proyecto
├── 📄 setup-ga4-integration.sh      # Script de setup automatizado
├── 📄 GA4-INTEGRATION-README.md     # Este archivo
└── 📁 data/backups/my_recovered_website/
    ├── 📄 GA4-INTEGRATION-GUIDE.md  # Documentación completa
    └── 📁 shared/js/
        ├── 📄 ga4-events.js         # Módulo principal de tracking
        ├── 📄 ga4-examples-red-pill.js    # Ejemplos Red Pill
        ├── 📄 ga4-examples-merchant.js    # Ejemplos Merchant
        └── 📄 ga4-examples-pilgrim.js     # Ejemplos Pilgrim
```

## 🔧 Instalación y Uso

### Opción 1: Setup Automático (Recomendado)

```bash
# Dar permisos al script
chmod +x setup-ga4-integration.sh

# Ejecutar con tu Measurement ID
./setup-ga4-integration.sh --measurement-id G-TU_ID_REAL

# Opciones adicionales disponibles
./setup-ga4-integration.sh --help
```

### Opción 2: Ejecución Manual

```bash
# Instalar dependencias
npm install

# Ejecutar script TypeScript directamente
npx ts-node ga4-integration-script.ts
```

### Opción 3: Modo Simulación

```bash
# Ver qué se haría sin hacer cambios
./setup-ga4-integration.sh --dry-run
```

## 🎯 Eventos de Tracking Implementados

| Evento | Descripción | Heurística UX |
|--------|-------------|---------------|
| `page_view_enhanced` | Vista de página con contexto UX | General |
| `navigation_interaction` | Interacciones de navegación | Consistencia |
| `loading_state_change` | Estados de carga/loading | Visibilidad del Estado |
| `personalization_change` | Cambios de personalización | Experiencia Adaptativa |
| `red_pill_journey_step` | Progreso en Red Pill Journey | Específico Red Pill |
| `video_interaction` | Interacciones de video | Multimedia |
| `accessibility_feature_used` | Uso de funciones accesibilidad | Control del Usuario |
| `ux_heuristic_interaction` | Interacciones UX generales | Todas las Heurísticas |

## 📋 Configuración Post-Instalación

### 1. Configurar Google Analytics

1. Ve a [Google Analytics](https://analytics.google.com/)
2. Crea una nueva propiedad GA4
3. Obtén tu Measurement ID (formato: G-XXXXXXXXXX)
4. Reemplaza `G-COOMUNITY123` en los archivos HTML con tu ID real

### 2. Integrar en JavaScript Manager

Añade al final de tu JavaScript Manager principal:

```javascript
// Cargar módulo de GA4 Events
const script = document.createElement('script');
script.src = 'shared/js/ga4-events.js';
document.head.appendChild(script);
```

### 3. Implementar Tracking en Managers

```javascript
// En Loading Manager
showLoading(componentName) {
  window.GA4Tracker?.trackLoadingState('start', 'component', componentName);
  // ... resto del código
}

// En Red Pill Manager
handleChoice(choice) {
  window.GA4Tracker?.trackRedPillStep(
    this.currentStep,
    this.steps[this.currentStep].name,
    choice,
    (this.currentStep / this.totalSteps) * 100
  );
  // ... resto del código
}
```

## 🎮 Uso de Ejemplos por Sección

### Red Pill Section
```javascript
// Cargar ejemplos específicos
<script src="shared/js/ga4-examples-red-pill.js"></script>
```

### Merchant Section
```javascript
// Cargar ejemplos específicos
<script src="shared/js/ga4-examples-merchant.js"></script>
```

### Pilgrim Section
```javascript
// Cargar ejemplos específicos
<script src="shared/js/ga4-examples-pilgrim.js"></script>
```

## 📊 Custom Dimensions Recomendadas

Configura estas dimensiones en GA4:

1. **section_name** - Sección actual (red-pill, merchant, pilgrim)
2. **ux_heuristic** - Heurística específica
3. **user_journey_step** - Paso en el journey
4. **device_type** - Tipo de dispositivo
5. **personalization_level** - Nivel de personalización

## 🔍 Testing y Validación

### Verificar Integración

1. Abre las páginas web en tu navegador
2. Abre Developer Tools (F12) → Consola
3. Busca mensajes `📊 GA4 Event:`
4. Ve a GA4 DebugView para eventos en tiempo real

### Comandos de Debug

```javascript
// Verificar que GA4Tracker esté disponible
console.log(window.GA4Tracker);

// Ver cola de eventos
console.log(window.GA4Tracker.eventQueue);

// Procesar cola manualmente
window.GA4Tracker.processEventQueue();
```

## 📈 Reports Personalizados Sugeridos

### Report de UX Heuristics
- **Métrica**: Eventos por heurística
- **Dimensiones**: ux_heuristic, section_name
- **Filtros**: event_name contiene "heuristic"

### Report de Red Pill Journey
- **Métrica**: Progreso del journey
- **Dimensiones**: red_pill_journey_step, choice_made
- **Filtros**: event_name = "red_pill_journey_step"

### Report de Performance UX
- **Métrica**: Duración de loading
- **Dimensiones**: loading_type, component_name
- **Filtros**: event_name = "loading_state_change"

## 🚨 Troubleshooting

### GA4 no está cargando
1. ✅ Verifica que el Measurement ID sea correcto
2. ✅ Revisa la consola del navegador por errores
3. ✅ Confirma que no hay adblockers interfiriendo

### Eventos no se envían
1. ✅ Verifica que `window.GA4Tracker` esté disponible
2. ✅ Revisa la cola de eventos: `window.GA4Tracker.eventQueue`
3. ✅ Llama manualmente: `window.GA4Tracker.processEventQueue()`

### Datos inconsistentes
1. ✅ Verifica que los parámetros de eventos sean consistentes
2. ✅ Revisa la configuración de custom dimensions
3. ✅ Confirma que el timezone esté configurado correctamente

## 📝 Archivos de Resultados

Después de ejecutar la integración, se generan estos archivos:

- ✅ **21 archivos HTML** actualizados con snippet GA4
- ✅ **shared/js/ga4-events.js** - Módulo principal (241 líneas)
- ✅ **shared/js/ga4-examples-*.js** - Ejemplos por sección
- ✅ **GA4-INTEGRATION-GUIDE.md** - Documentación completa (317 líneas)

## 🔗 Referencias

- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [GA4 Event Tracking Guide](https://support.google.com/analytics/answer/9267735)
- [Custom Dimensions Setup](https://support.google.com/analytics/answer/10075209)

## 📞 Soporte

Para preguntas sobre esta integración:
- 📖 Revisa `GA4-INTEGRATION-GUIDE.md` para documentación completa
- 🔍 Consulta los ejemplos en `ga4-examples-*.js`
- 🛠️ Revisa la consola del navegador para logs de debug
- 📊 Usa GA4 DebugView para verificar eventos en tiempo real

---

**Autor**: AI Assistant  
**Versión**: 1.0.0  
**Fecha**: 2024  
**Proyecto**: CoomÜnity Platform UX Analytics Integration 