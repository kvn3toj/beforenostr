# 🎬 Red Pill Interactive Scraper

Script especializado de Playwright en TypeScript para capturar las **interacciones completas del reproductor de video** y los **diferentes recorridos/paths** de Red Pill.

## 🎯 Objetivo Específico

Este script está diseñado para capturar lo que el script básico **NO pudo obtener**:
- ✅ **Botones interactivos que aparecen durante/después del video**
- ✅ **Los diferentes recorridos (Red Pill vs Blue Pill paths)**
- ✅ **Interacciones con preguntas y sliders**
- ✅ **Videos de loop y transiciones**
- ✅ **Estados HTML en cada punto de decisión**

## 🔍 ¿Qué captura específicamente?

### **Interacciones del Video**
- **Final del video principal**: Detecta cuando termina el video de Vimeo
- **Botones de opción**: `#left-option` (Red Pill) y `#right-option` (Blue Pill)
- **Video de loop**: `LoopMorpheo.mp4` y `LoopMorpheo.webm`
- **Transiciones**: Animaciones entre estados

### **Paths de Decisión**
- **Red Pill Path** (opción izquierda):
  - Lleva a sección de preguntas (`#questions`)
  - Activa tutorial-1 (`showTourBySlug("tutorial-1")`)
  - Sistema de sliders interactivos
- **Blue Pill Path** (opción derecha):
  - Ejecuta `rightOptionClick()`
  - Diferente flujo de interacciones

### **Sistema de Preguntas**
- **Sliders NoUI**: Controles deslizantes con rango -5 a +5
- **Botones de respuesta**: Elementos con clases `btn-id-1`, `btn-id-2`, etc.
- **Animaciones de feedback**: Función `setResponseRate()`

## 🚀 Uso

```bash
# Ejecutar script interactivo
npx tsx red-pill-interactive-scraper.ts
```

## 📁 Estructura de Captura

```
recovered_code/red_pill_interactive/
├── red_pill_initial_1.html              # Estado inicial
├── red_pill_video_ended_2.html          # Después de que termina el video
├── red_pill_left_path_3.html            # Después de clic en Red Pill
├── red_pill_slider_1_4.html             # Interacción con slider 1
├── red_pill_slider_2_5.html             # Interacción con slider 2
├── red_pill_response_1_6.html           # Respuesta a pregunta 1
├── red_pill_right_path_7.html           # Después de clic en Blue Pill
├── red_pill_final_8.html                # Estado final
├── assets/
│   ├── videos/                           # 🎥 Videos específicos
│   │   ├── LoopMorpheo.mp4              # Video de loop principal
│   │   └── LoopMorpheo.webm             # Video de loop (WebM)
│   ├── css/                             # CSS adicional capturado
│   ├── js/                              # JavaScript de interacciones
│   └── [otros recursos...]
└── interaction_paths/                    # Rutas de interacción documentadas
```

## 🎬 Flujo de Captura

### **FASE 1: Espera del Video Principal**
```typescript
// Detecta cuando el reproductor de Vimeo termina
await page.waitForFunction(() => {
  const optionsElement = document.getElementById('options');
  return optionsElement && optionsElement.style.display === 'block';
}, { timeout: 120000 });
```

### **FASE 2: Exploración del Red Pill Path**
```typescript
// Clic en opción izquierda
await page.$('#left-option').click();

// Esperar aparición de preguntas
await page.waitForSelector('#questions', { timeout: 10000 });

// Interactuar con sliders
const sliders = await page.$$('.slider');
for (const slider of sliders) {
  await slider.click();
  // Capturar estado después de cada interacción
}
```

### **FASE 3: Exploración del Blue Pill Path**
```typescript
// Recargar página para estado limpio
await page.reload();

// Esperar fin de video nuevamente
await waitForMainVideoEnd(page);

// Clic en opción derecha
await page.$('#right-option').click();
```

### **FASE 4: Descarga de Videos Específicos**
```typescript
const videoUrls = [
  '/assets/videos/loop/LoopMorpheo.mp4',
  '/assets/videos/loop/LoopMorpheo.webm'
];

// Navegación directa para forzar descarga
for (const videoPath of videoUrls) {
  const fullUrl = new URL(videoPath, TARGET_URL).href;
  await page.goto(fullUrl, { timeout: 30000 });
}
```

## 🎯 Elementos Objetivo Detectados

### **Del Análisis del Código JavaScript:**
- `player.on('ended')` - Evento de fin de video
- `$('#left-option').click()` - Clic en Red Pill
- `rightOptionClick()` - Función del Blue Pill
- `showTourBySlug("tutorial-1")` - Sistema de tours
- `.slider` - Controles deslizantes NoUI
- `loadAnimationVideo()` - Animaciones de video

### **Del Análisis del HTML:**
- `<div id="options">` - Contenedor de opciones
- `<div id="left-option">` - Botón Red Pill
- `<div id="right-option">` - Botón Blue Pill
- `<video id="loop">` - Video de loop
- `<div id="questions">` - Sección de preguntas

## ⚙️ Configuración Avanzada

### **Timeouts Específicos**
```typescript
// Video principal (hasta 2 minutos)
{ timeout: 120000 }

// Aparición de preguntas
{ timeout: 10000 }

// Interacciones individuales
await page.waitForTimeout(3000);
```

### **Modo de Depuración**
```typescript
browser = await chromium.launch({ 
  headless: false, // Ver interacciones en tiempo real
  slowMo: 500      // Ralentizar para observar
});
```

## 📊 Estadísticas Esperadas

Después de la ejecución completa:
- **~8-12 estados HTML** capturados
- **2 videos de loop** descargados  
- **Múltiples paths** de interacción documentados
- **Respuestas del sistema** de preguntas capturadas

## 🔧 Solución de Problemas

### **Video no termina**
- El script espera hasta 2 minutos
- Fallback: fuerza la aparición de opciones después de 10 segundos

### **Botones no visibles**
- Verifica que el evento `ended` del video se disparó
- Comprueba que `#options` tiene `display: block`

### **Preguntas no aparecen**
- Confirma que el clic en `#left-option` fue exitoso
- Verifica que el scroll a `#questions` funcionó

### **Videos no se descargan**
- Comprueba que las rutas `/assets/videos/loop/` existen
- Verifica permisos y conectividad

## 🎭 Diferencias con el Script Básico

| Aspecto | Script Básico | Script Interactivo |
|---------|---------------|-------------------|
| **Objetivo** | Recursos estáticos | Interacciones dinámicas |
| **Video** | Solo reproductor | Espera fin + opciones |
| **Botones** | No detecta | Simula clics en paths |
| **Estados** | 3 capturas | 8+ capturas específicas |
| **Videos** | Solo embebidos | Descarga videos de loop |
| **Paths** | Uno solo | Múltiples recorridos |

---

**🎯 Este script complementa perfectamente el script básico para obtener una captura 100% completa de la experiencia interactiva de Red Pill.** 