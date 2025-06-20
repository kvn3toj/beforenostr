# Extracción de Contenido Incrustado - Documentación

## Resumen

Estos scripts complementan el proceso de extracción web existente, añadiendo la capacidad de extraer y organizar contenido CSS y JavaScript incrustado directamente en páginas HTML (bloques `<style>` y `<script>` sin atributo `src`).

## Archivos Creados

### 1. `extract-inline-content.ts`
Script independiente que procesa archivos HTML existentes para extraer contenido incrustado.

### 2. `integrated-scraper-with-inline-extraction.ts`
Script combinado que realiza scraping con Playwright y extrae contenido incrustado en una sola operación.

## Uso

### Script de Extracción Independiente

```bash
# Procesar todos los proyectos en recovered_code/
npx tsx extract-inline-content.ts

# Procesar un proyecto específico
npx tsx extract-inline-content.ts pilgrim_demo

# Procesar un archivo HTML específico
npx tsx extract-inline-content.ts path/to/file.html
```

### Script Integrado de Scraping

```bash
# Usar preset de pilgrim
npx tsx integrated-scraper-with-inline-extraction.ts pilgrim

# Usar preset de merchant
npx tsx integrated-scraper-with-inline-extraction.ts merchant

# Configuración personalizada
npx tsx integrated-scraper-with-inline-extraction.ts custom "https://example.com" "project_name"
```

## Estructura de Salida

Para cada proyecto procesado, se crean las siguientes carpetas:

```
recovered_code/
├── project_name/
│   ├── inline_css/           # Archivos CSS extraídos de bloques <style>
│   │   ├── file_style_block_1.css
│   │   ├── file_style_block_2.css
│   │   └── ...
│   ├── inline_js/            # Archivos JS extraídos de bloques <script>
│   │   ├── file_script_block_1.js
│   │   ├── file_script_block_2.js
│   │   └── ...
│   └── inline_content_extraction_report.json  # Reporte detallado
```

## Formato de Archivos Extraídos

Cada archivo extraído incluye metadatos en forma de comentarios:

### CSS
```css
/* Extracted from: original_file.html */
/* Block index: 1 */
/* Extracted at: 2025-06-03T02:16:25.342Z */

/* Contenido CSS original aquí */
```

### JavaScript
```javascript
/* Extracted from: original_file.html */
/* Block index: 3 */
/* Extracted at: 2025-06-03T02:16:25.342Z */

// Contenido JavaScript original aquí
```

## Reportes Generados

### Reporte Individual (`ExtractionReport`)
```json
{
  "htmlFile": "filename.html",
  "timestamp": "2025-06-03T02:16:25.342Z",
  "extractedFiles": {
    "css": ["file1.css", "file2.css"],
    "js": ["file1.js", "file2.js"]
  },
  "summary": {
    "totalCssBlocks": 6,
    "totalJsBlocks": 6,
    "cssFilesSize": 14947,
    "jsFilesSize": 7667
  }
}
```

### Reporte Consolidado
```json
{
  "project": "project_name",
  "timestamp": "2025-06-03T02:16:25.484Z",
  "processedFiles": 9,
  "totalExtractedFiles": {
    "css": 55,
    "js": 50
  },
  "reports": [/* array de reportes individuales */]
}
```

## Resultados de la Ejecución

### Merchant Demo
- **9 archivos HTML procesados**
- **55 archivos CSS extraídos**
- **50 archivos JavaScript extraídos**
- Total de ~140KB de contenido incrustado recuperado

### Pilgrim Demo
- **1 archivo HTML procesado**
- **3 archivos CSS extraídos**
- **3 archivos JavaScript extraídos**

## Características Técnicas

### Extracción Inteligente
- Ignora scripts externos (con atributo `src`)
- Filtra contenido vacío o solo espacios
- Mantiene la numeración original de bloques
- Preserva metadatos de origen

### Organización de Archivos
- Nombres descriptivos con timestamp
- Directorios separados por tipo de contenido
- Prevención de colisiones de nombres
- Reportes JSON estructurados

### Manejo de Errores
- Logs detallados del progreso
- Continuación ante errores individuales
- Reportes de estado para cada operación

## Integración con Flujos Existentes

Este sistema se integra perfectamente con los scripts de scraping existentes:

1. **Fase 1-3**: Scraping básico y descarga de assets externos
2. **Fase 4**: Extracción de contenido incrustado (este script)
3. **Resultado**: Recuperación completa del sitio web

## Dependencias

Asegúrate de tener instaladas las dependencias necesarias:

```bash
npm install cheerio @types/cheerio playwright tsx typescript
```

## Notas de Desarrollo

- El script utiliza `cheerio` para parsing HTML eficiente
- Manejo asíncrono con límites de concurrencia
- Compatible con el sistema de tipos TypeScript
- Logging con emojis para mejor experiencia de usuario 