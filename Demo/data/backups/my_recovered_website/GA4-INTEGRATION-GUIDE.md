# 📊 Google Analytics 4 (GA4) Integration Guide - CoomÜnity Platform

## 🎯 Resumen de la Integración

Este documento describe la integración completa de Google Analytics 4 en la plataforma CoomÜnity, incluyendo el tracking de eventos específicos para las heurísticas UX implementadas.

## 📁 Archivos Generados

- `shared/js/ga4-events.js` - Módulo principal de tracking
- `shared/js/ga4-examples-red-pill.js` - Ejemplos para sección Red Pill
- `shared/js/ga4-examples-merchant.js` - Ejemplos para sección Merchant
- `shared/js/ga4-examples-pilgrim.js` - Ejemplos para sección Pilgrim

## 🔧 Configuración Inicial

### 1. Reemplazar Measurement ID

⚠️ **IMPORTANTE**: Reemplaza `G-COOMUNITY123` en todos los archivos HTML con tu Measurement ID real de GA4.

Para obtener tu Measurement ID:
1. Ve a [Google Analytics](https://analytics.google.com/)
2. Crea una nueva propiedad GA4
3. Copia el Measurement ID (formato: G-COOMUNITY123)

### 2. Incluir el Módulo de Eventos

Añade al final de tu JavaScript Manager principal:

```javascript
// Cargar módulo de GA4 Events
const script = document.createElement('script');
script.src = 'shared/js/ga4-events.js';
document.head.appendChild(script);
```

## 🎯 Eventos Definidos


### page_view_enhanced
**Descripción**: Vista de página mejorada con contexto UX
**Ubicación**: JavaScript Manager - onPageLoad()

**Parámetros**:
- `page_title`: string
- `page_location`: string
- `content_group1`: string
- `ux_heuristic_score`: number

**Ejemplo de uso**:
```javascript
gtag('event', 'page_view_enhanced', {
  page_title: document.title,
  page_location: window.location.href,
  content_group1: getCurrentSection(),
  ux_heuristic_score: getUXScore()
});
```


### navigation_interaction
**Descripción**: Interacciones con elementos de navegación
**Ubicación**: Navigation handlers en JavaScript Manager

**Parámetros**:
- `navigation_type`: string
- `link_text`: string
- `destination`: string
- `interaction_method`: string

**Ejemplo de uso**:
```javascript
gtag('event', 'navigation_interaction', {
  navigation_type: 'main_nav',
  link_text: linkElement.textContent,
  destination: linkElement.href,
  interaction_method: 'click'
});
```


### loading_state_change
**Descripción**: Cambios en indicadores de carga (Heurística: Visibilidad del Estado)
**Ubicación**: Loading Manager - showLoading()/hideLoading()

**Parámetros**:
- `loading_state`: string
- `loading_type`: string
- `loading_duration`: number
- `component_name`: string

**Ejemplo de uso**:
```javascript
gtag('event', 'loading_state_change', {
  loading_state: 'start',
  loading_type: 'component',
  component_name: 'red-pill-quiz',
  loading_duration: Date.now() - loadingStartTime
});
```


### personalization_change
**Descripción**: Interacciones con controles de personalización
**Ubicación**: Personalization Manager - updateSetting()

**Parámetros**:
- `setting_type`: string
- `old_value`: string
- `new_value`: string
- `personalization_level`: string

**Ejemplo de uso**:
```javascript
gtag('event', 'personalization_change', {
  setting_type: 'theme',
  old_value: oldTheme,
  new_value: newTheme,
  personalization_level: getCurrentPersonalizationLevel()
});
```


### red_pill_journey_step
**Descripción**: Progreso en el Red Pill Journey
**Ubicación**: Red Pill Manager - handleChoice()

**Parámetros**:
- `step_number`: number
- `step_name`: string
- `choice_made`: string
- `journey_progress`: number
- `time_spent`: number

**Ejemplo de uso**:
```javascript
gtag('event', 'red_pill_journey_step', {
  step_number: currentStep,
  step_name: steps[currentStep].name,
  choice_made: choice,
  journey_progress: (currentStep / totalSteps) * 100,
  time_spent: Date.now() - stepStartTime
});
```


### video_interaction
**Descripción**: Interacciones con video principal
**Ubicación**: Video Manager - onVideoEvent()

**Parámetros**:
- `video_action`: string
- `video_position`: number
- `video_duration`: number
- `interaction_type`: string

**Ejemplo de uso**:
```javascript
gtag('event', 'video_interaction', {
  video_action: 'play',
  video_position: video.currentTime,
  video_duration: video.duration,
  interaction_type: 'button'
});
```


### accessibility_feature_used
**Descripción**: Uso de características de accesibilidad
**Ubicación**: Accessibility Manager - onFeatureToggle()

**Parámetros**:
- `feature_type`: string
- `feature_action`: string
- `user_preference`: string

**Ejemplo de uso**:
```javascript
gtag('event', 'accessibility_feature_used', {
  feature_type: 'keyboard_nav',
  feature_action: 'enabled',
  user_preference: 'auto'
});
```


### ux_heuristic_interaction
**Descripción**: Interacciones específicas con elementos UX
**Ubicación**: UX Managers específicos

**Parámetros**:
- `heuristic_name`: string
- `element_type`: string
- `interaction_success`: boolean
- `user_satisfaction`: number

**Ejemplo de uso**:
```javascript
gtag('event', 'ux_heuristic_interaction', {
  heuristic_name: 'visibility',
  element_type: 'loading_indicator',
  interaction_success: true,
  user_satisfaction: 4
});
```


## 🔌 Integración en JavaScript Manager

### Loading Manager
```javascript
class LoadingManager {
  showLoading(componentName) {
    this.loadingStartTime = Date.now();
    window.GA4Tracker?.trackLoadingState('start', 'component', componentName);
    // ... resto del código
  }
  
  hideLoading(componentName) {
    const duration = Date.now() - this.loadingStartTime;
    window.GA4Tracker?.trackLoadingState('end', 'component', componentName, duration);
    // ... resto del código
  }
}
```

### Red Pill Manager
```javascript
class RedPillManager {
  handleChoice(choice) {
    window.GA4Tracker?.trackRedPillStep(
      this.currentStep,
      this.steps[this.currentStep].name,
      choice,
      (this.currentStep / this.totalSteps) * 100
    );
    // ... resto del código
  }
}
```

### Video Manager
```javascript
class VideoManager {
  onVideoPlay() {
    window.GA4Tracker?.trackVideoInteraction(
      'play',
      this.video.currentTime,
      this.video.duration,
      'button'
    );
  }
}
```

## 📈 Custom Dimensions Recomendadas

Configura estas dimensiones personalizadas en GA4:

1. **section_name** - Sección actual del sitio
2. **ux_heuristic** - Heurística UX específica
3. **user_journey_step** - Paso en el journey del usuario
4. **device_type** - Tipo de dispositivo (mobile/tablet/desktop)
5. **personalization_level** - Nivel de personalización del usuario

## 🔍 Reports Personalizados

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
1. Verifica que el Measurement ID sea correcto
2. Revisa la consola del navegador por errores
3. Confirma que no hay adblockers interfiriendo

### Eventos no se envían
1. Verifica que `window.GA4Tracker` esté disponible
2. Revisa la cola de eventos: `window.GA4Tracker.eventQueue`
3. Llama manualmente: `window.GA4Tracker.processEventQueue()`

### Datos inconsistentes
1. Verifica que los parámetros de eventos sean consistentes
2. Revisa la configuración de custom dimensions
3. Confirma que el timezone esté configurado correctamente

## 📝 Próximos Pasos

1. **Testing**: Probar en modo debug de GA4
2. **Validación**: Usar GA4 DebugView para verificar eventos
3. **Optimización**: Ajustar parámetros basado en datos reales
4. **Expansión**: Añadir más eventos específicos según necesidades

## 📞 Soporte

Para preguntas sobre esta integración:
- Revisa la documentación oficial de GA4
- Consulta los ejemplos en los archivos `ga4-examples-*.js`
- Revisa la consola del navegador para logs de debug

---

**Última actualización**: 2025-06-03T20:47:05.065Z
**Versión**: 1.0.0
