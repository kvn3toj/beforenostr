# Red Pill Comprehensive Scraper

Script de Playwright en TypeScript para extraer y recuperar todo el código de la URL `https://demo.coomunity.co/red-pill/c8862dd1`.

## 🎯 Características

- **Intercepción exhaustiva de red**: Captura todas las respuestas HTTP 200
- **Simulación de interacciones**: Scroll automático y clics en elementos interactivos
- **Extracción de contenido en línea**: CSS y JavaScript embebido
- **Organización automática**: Estructura de carpetas por tipo de archivo
- **Prevención de duplicados**: Sistema de URLs ya descargadas
- **Robustez**: Manejo de errores y timeouts

## 📋 Requisitos

```bash
npm install playwright typescript @types/node
npx playwright install chromium
```

## 🚀 Uso

### Ejecución directa:
```bash
npx tsx red-pill-comprehensive-scraper.ts
```

### Como módulo:
```typescript
import { main } from './red-pill-comprehensive-scraper';
await main();
```

## 📁 Estructura de archivos generados

```
recovered_code/red_pill_demo/
├── red_pill_initial.html                    # HTML inicial
├── red_pill_after_scroll_1.html            # Después del primer scroll
├── red_pill_after_scroll_2.html            # Después del segundo scroll
├── red_pill_after_click_[selector]_1.html  # Después de clics
├── red_pill_final.html                     # Estado final
├── assets/
│   ├── css/                                 # Archivos CSS externos
│   ├── js/                                  # Archivos JavaScript externos
│   ├── images/                              # Imágenes (JPG, PNG, SVG, etc.)
│   ├── fonts/                               # Fuentes (WOFF, WOFF2, TTF, OTF)
│   ├── data/                                # Respuestas JSON de API
│   └── other/                               # Otros recursos
├── inline_css/
│   ├── inline_style_block_1.css            # CSS extraído de tags <style>
│   ├── inline_style_block_2.css
│   └── ...
└── inline_js/
    ├── inline_script_block_1.js             # JS extraído de tags <script>
    ├── inline_script_block_2.js
    └── ...
```

## ⚙️ Configuración

### Modificar URL objetivo:
```typescript
const TARGET_URL = 'https://demo.coomunity.co/red-pill/c8862dd1';
```

### Personalizar directorio base:
```typescript
const BASE_DIR = 'recovered_code/red_pill_demo';
```

### Selectores interactivos personalizados:
Si conoces selectores específicos de la página que cargan contenido adicional, modifica:

```typescript
const interactiveSelectors = [
  'button[class*="load"], button[class*="more"]',
  '.your-custom-selector',        // Añadir aquí
  '#specific-button-id',          // O aquí
  // ... otros selectores
];
```

### Modo headless:
```typescript
browser = await chromium.launch({ 
  headless: true,  // Cambiar a true para modo silencioso
  slowMo: 0        // Eliminar ralentización
});
```

## 🔧 Funcionalidades detalladas

### 1. Intercepción de red
- Intercepta todas las respuestas HTTP con código 200
- Clasifica automáticamente por tipo de contenido
- Evita descargas duplicadas usando un Set de URLs

### 2. Simulación de scroll
- Detecta cambios en la altura del documento
- Scroll gradual hasta el final de la página
- Espera a que la red esté inactiva entre scrolls
- Máximo 10 intentos para evitar loops infinitos

### 3. Simulación de clics
- Busca elementos interactivos comunes:
  - Botones de "cargar más" o "mostrar más"
  - Pestañas inactivas
  - Elementos con `data-toggle` o `data-target`
  - Links de paginación
- Limita a 3 clics por tipo de selector
- Guarda HTML después de cada interacción

### 4. Extracción de contenido en línea
- **CSS**: Extrae todo el contenido de tags `<style>`
- **JavaScript**: Extrae contenido de tags `<script>` sin atributo `src`
- Numeración automática para evitar conflictos de nombres

## 📊 Estadísticas de salida

Al finalizar, el script muestra:
- Número de URLs únicas descargadas
- Cantidad de archivos HTML capturados
- Bloques de CSS en línea extraídos
- Bloques de JavaScript en línea extraídos

## 🐛 Solución de problemas

### Error de timeout:
- Aumentar el timeout en `page.goto()`:
```typescript
await page.goto(TARGET_URL, { 
  waitUntil: 'networkidle',
  timeout: 60000  // 60 segundos
});
```

### Problemas de permisos:
- Verificar permisos de escritura en el directorio
- Ejecutar con permisos adecuados si es necesario

### Elementos interactivos no encontrados:
- Revisar los selectores en `interactiveSelectors`
- Añadir selectores específicos de la página objetivo
- Verificar en las herramientas de desarrollador del navegador

### Modo de depuración:
- Cambiar `headless: false` para ver el navegador en acción
- Añadir `slowMo: 1000` para ralentizar las acciones
- Revisar los logs en consola para identificar problemas

## 📝 Notas importantes

1. **Respeto por el servidor**: El script incluye delays para no sobrecargar el servidor objetivo
2. **Detección de elementos**: Los selectores genéricos pueden no funcionar en todas las páginas
3. **Contenido dinámico**: Algunos elementos pueden requerir selectores específicos
4. **Límites de scroll**: Se limita a 10 intentos de scroll para evitar loops infinitos
5. **Timeouts**: Se incluyen timeouts para evitar que el script se cuelgue indefinidamente

## 🔄 Personalización avanzada

Para páginas específicas, considera:
1. Analizar la página manualmente primero
2. Identificar selectores únicos para elementos interactivos
3. Ajustar los tiempos de espera según la velocidad de carga
4. Modificar la lógica de scroll si la página usa scroll infinito
5. Añadir selectores específicos para modales o overlays 