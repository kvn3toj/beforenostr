# 🧪 Tests UX Heuristics - CoomÜnity Platform

Este conjunto de pruebas automatizadas valida la implementación de las heurísticas UX/UI en la plataforma CoomÜnity utilizando Playwright y TypeScript.

## 📋 Índice

- [Instalación y Configuración](#instalación-y-configuración)
- [Estructura de Pruebas](#estructura-de-pruebas)
- [Heurísticas Implementadas](#heurísticas-implementadas)
- [Ejecución de Pruebas](#ejecución-de-pruebas)
- [Interpretación de Resultados](#interpretación-de-resultados)
- [Troubleshooting](#troubleshooting)

## 🛠️ Instalación y Configuración

### Prerequisitos

1. **Node.js** (versión 16 o superior)
2. **npm** o **yarn**
3. **Python 3** (para el servidor local)
4. Acceso al directorio `data/backups/my_recovered_website/`

### Instalación

```bash
# Instalar dependencias de Playwright
npm install @playwright/test

# Instalar navegadores
npx playwright install
```

### Configuración del Servidor

Las pruebas esperan que el sitio web esté disponible en `http://localhost:8080`. Para iniciar el servidor:

```bash
# Navegar al directorio del proyecto
cd data/backups/my_recovered_website/

# Iniciar servidor Python
python3 -m http.server 8080
```

## 📁 Estructura de Pruebas

```
tests/e2e/ux-heuristics/
├── 00-master-ux-validation.spec.ts    # Suite maestra de validación
├── 01-visibility-system-status.spec.ts # Visibilidad del estado del sistema
├── 02-consistency-standards.spec.ts    # Consistencia y estándares
├── 03-adaptive-contextual.spec.ts      # Experiencia adaptativa
├── 04-performance-loading.spec.ts      # Performance y carga
└── README.md                           # Documentación
```

## 🎯 Heurísticas Implementadas

### 1. Visibilidad del Estado del Sistema
- **Peso**: 20%
- **Evalúa**: Indicadores de carga, feedback de interacciones, mensajes de estado
- **Tests**: Indicadores de carga, feedback visual, validación de formularios

### 2. Consistencia y Estándares
- **Peso**: 25%
- **Evalúa**: Patrones de diseño, elementos de navegación, estilos globales
- **Tests**: Estructura HTML, tipografía, colores del tema, patrones de botones

### 3. Experiencia Adaptativa y Contextual
- **Peso**: 20%
- **Evalúa**: Responsividad, adaptación de contenido, navegación móvil
- **Tests**: Layout responsivo, elementos contextuales, usabilidad multi-dispositivo

### 4. Performance & Loading Experience
- **Peso**: 15%
- **Evalúa**: Tiempos de carga, optimización de recursos, carga progresiva
- **Tests**: Tiempos de respuesta, tamaño de recursos, indicadores de progreso

### 5. Control y Libertad del Usuario
- **Peso**: 10%
- **Evalúa**: Elementos interactivos, accesibilidad básica
- **Tests**: Navegación por teclado, elementos clickeables, feedback de acciones

### 6. Navegación Intuitiva y Jerarquía
- **Peso**: 10%
- **Evalúa**: Estructura de navegación, jerarquía visual
- **Tests**: Estructura de headings, elementos de navegación, breadcrumbs

## 🚀 Ejecución de Pruebas

### Comando Básico

```bash
# Ejecutar todas las pruebas UX
npx playwright test tests/e2e/ux-heuristics/

# Ejecutar solo la suite maestra
npx playwright test tests/e2e/ux-heuristics/00-master-ux-validation.spec.ts

# Ejecutar una heurística específica
npx playwright test tests/e2e/ux-heuristics/01-visibility-system-status.spec.ts
```

### Opciones Avanzadas

```bash
# Ejecutar en modo headed (ver navegador)
npx playwright test --headed tests/e2e/ux-heuristics/

# Ejecutar solo en un navegador específico
npx playwright test --project="Desktop Chrome" tests/e2e/ux-heuristics/

# Ejecutar con debugging
npx playwright test --debug tests/e2e/ux-heuristics/

# Generar reporte HTML
npx playwright test tests/e2e/ux-heuristics/ && npx playwright show-report
```

### Proyectos de Testing Configurados

- **Desktop Chrome**: Navegador principal (1280x720)
- **Desktop Firefox**: Compatibilidad multiplataforma
- **Desktop Safari**: Compatibilidad Apple
- **Mobile Chrome**: Testing móvil Android
- **Mobile Safari**: Testing móvil iOS
- **Tablet**: Testing tablet (1024x768)
- **UX-Desktop-Critical**: Tests UX específicos desktop (1920x1080)
- **UX-Mobile-Critical**: Tests UX específicos móvil

## 📊 Interpretación de Resultados

### Score General
- **🟢 80-100%**: Excelente implementación UX
- **🟡 60-79%**: Buena implementación, mejoras menores
- **🔴 0-59%**: Requiere mejoras significativas

### Reporte de la Suite Maestra

La suite maestra (`00-master-ux-validation.spec.ts`) genera un reporte completo que incluye:

```
🏆 REPORTE FINAL - VALIDACIÓN UX HEURISTICS COOMUNITY
================================================================================
⏰ Timestamp: 2024-XX-XX...
📊 Score General: XX.X%
✅ Tests Pasados: XX/XX
❌ Tests Fallidos: XX
🚨 Issues Críticos: X

📈 SCORES POR HEURÍSTICA:
🟢 visibility: XX.X%
🟡 consistency: XX.X%
🔴 adaptive: XX.X%
...

📋 SCORES POR SECCIÓN:
🟢 Principal (critical): XX.X%
🟡 Red Pill (high): XX.X%
...

🚨 ISSUES CRÍTICOS:
1. Principal: Indicadores de carga - Encontrados 0 indicadores
...

💡 RECOMENDACIONES:
1. Mejorar Performance & Loading Experience en sección Red Pill (Score: 45%)
...
```

### Archivos de Resultado

- **HTML Report**: `test-results/html-report/index.html`
- **JSON Results**: `test-results/results.json`
- **JUnit XML**: `test-results/junit.xml`
- **Screenshots**: `test-results/` (en caso de fallos)
- **Videos**: `test-results/` (en caso de fallos)

## 🔧 Configuración Personalizada

### Variables de Entorno

```bash
# Cambiar URL base
export BASE_URL=http://localhost:3000

# Modo CI (más reintentos, sin paralelización)
export CI=true

# Timeout personalizado
export PLAYWRIGHT_TIMEOUT=60000
```

### Configuración del playwright.config.ts

El archivo de configuración incluye:

- **Base URL**: `http://localhost:8080`
- **Timeouts**: 15s acciones, 30s navegación
- **Retries**: 1 local, 2 en CI
- **Reporters**: HTML, JSON, JUnit
- **Screenshots**: Solo en fallos
- **Videos**: Solo en fallos

## 🐛 Troubleshooting

### Problemas Comunes

#### 1. Error "Connection refused" o "ECONNREFUSED"

```bash
# Verificar que el servidor esté corriendo
curl http://localhost:8080

# Iniciar servidor si no está activo
cd data/backups/my_recovered_website/
python3 -m http.server 8080
```

#### 2. Tests fallan por timeout

```bash
# Aumentar timeout en playwright.config.ts
# O usar variable de entorno
export PLAYWRIGHT_TIMEOUT=60000
```

#### 3. Navegadores no instalados

```bash
# Reinstalar navegadores
npx playwright install --force
```

#### 4. Permisos de archivos (macOS/Linux)

```bash
# Verificar permisos del directorio
chmod -R 755 data/backups/my_recovered_website/
```

### Debugging

#### Modo Debug Interactivo

```bash
# Debug paso a paso
npx playwright test --debug tests/e2e/ux-heuristics/01-visibility-system-status.spec.ts
```

#### Codegen para nuevos tests

```bash
# Generar código de test automáticamente
npx playwright codegen http://localhost:8080
```

#### Inspector de Playwright

```bash
# Abrir inspector
npx playwright test --debug --timeout=0
```

### Logs Detallados

```bash
# Logs verbosos
DEBUG=pw:api npx playwright test tests/e2e/ux-heuristics/

# Solo logs de network
DEBUG=pw:protocol npx playwright test tests/e2e/ux-heuristics/
```

## 📝 Mejores Prácticas

### Para Desarrolladores

1. **Ejecutar suite maestra regularmente**: Para overview rápido del estado UX
2. **Tests específicos durante desarrollo**: Usar tests individuales para features específicas
3. **Verificar en múltiples navegadores**: Especialmente para cambios de CSS/JS
4. **Revisar screenshots de fallos**: Para entender problemas visuales

### Para QA

1. **Ejecutar en proyectos críticos**: UX-Desktop-Critical y UX-Mobile-Critical
2. **Documentar regresiones**: Comparar scores entre versiones
3. **Validar en diferentes viewports**: Desktop, tablet, móvil
4. **Verificar accesibilidad**: Prestar atención a scores de Control del Usuario

### Integración CI/CD

```yaml
# Ejemplo GitHub Actions
- name: Run UX Heuristics Tests
  run: |
    cd data/backups/my_recovered_website/
    python3 -m http.server 8080 &
    sleep 5
    npx playwright test tests/e2e/ux-heuristics/
  env:
    CI: true
```

## 🤝 Contribución

Para añadir nuevas heurísticas o mejorar las existentes:

1. Seguir el patrón de naming: `XX-nombre-heuristica.spec.ts`
2. Incluir documentación en cada test
3. Actualizar la suite maestra si es necesario
4. Mantener selectores robustos y no dependientes de implementación específica
5. Incluir esperas apropiadas para evitar flakiness

## 📚 Referencias

- [Playwright Documentation](https://playwright.dev/)
- [Jakob Nielsen's 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)
- [CoomÜnity UX Implementation Guide](../../../data/backups/my_recovered_website/UX-IMPLEMENTATION-GUIDE.md) 