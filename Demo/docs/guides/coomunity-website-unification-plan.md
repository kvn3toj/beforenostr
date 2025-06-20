# Plan de Unificación del Sitio Web CoomÜnity Recuperado

## Parte 1: Estructura de Proyecto Unificada Propuesta

```
my_recovered_website/
├── README.md                          # Documentación del proyecto unificado
├── package.json                       # Para scripts Node.js y dependencias
├── server.js                          # Servidor local con mocking de APIs
├── public/                            # Archivos públicos y landing
│   ├── index.html                     # Página principal de navegación
│   └── favicon.ico
├── sections/                          # Secciones principales del sitio
│   ├── pilgrim/                       # Demo del Pilgrim
│   │   ├── index.html
│   │   ├── assets/
│   │   │   ├── css/
│   │   │   ├── js/
│   │   │   ├── images/
│   │   │   ├── fonts/
│   │   │   └── data/                  # JSONs específicos del pilgrim
│   │   └── inline/                    # CSS/JS inline extraídos
│   │       ├── css/
│   │       └── js/
│   ├── merchant/                      # Demo del Merchant
│   │   ├── index.html                 # Página principal del merchant
│   │   ├── variations/                # Diferentes estados capturados
│   │   │   ├── initial_load.html
│   │   │   ├── after_scroll.html
│   │   │   ├── button_clicked.html
│   │   │   └── final_state.html
│   │   ├── assets/
│   │   │   ├── css/
│   │   │   ├── js/
│   │   │   ├── images/
│   │   │   ├── fonts/
│   │   │   └── data/                  # JSONs específicos del merchant
│   │   └── inline/
│   │       ├── css/
│   │       └── js/
│   └── red-pill/                      # Demo del Red Pill Interactive
│       ├── index.html                 # Página inicial del flujo
│       ├── journey/                   # Diferentes pasos del journey
│       │   ├── initial.html
│       │   ├── video_ended.html
│       │   ├── left_path.html
│       │   ├── right_path.html
│       │   ├── response_1.html
│       │   ├── response_2.html
│       │   └── final.html
│       ├── assets/
│       │   ├── css/
│       │   ├── js/
│       │   ├── images/
│       │   ├── videos/                # Videos del flujo interactivo
│       │   ├── fonts/
│       │   └── data/                  # JSONs y respuestas API
│       ├── inline/
│       │   ├── css/
│       │   └── js/
│       └── analytics/                 # Mapas de interacción y sesiones
│           ├── interaction_maps/
│           ├── interaction_paths/
│           └── sessions/
├── shared/                            # Recursos compartidos entre secciones
│   ├── css/                           # CSS común/global
│   ├── js/                            # JavaScript común/utilitarios
│   ├── images/                        # Imágenes compartidas
│   ├── fonts/                         # Fuentes comunes
│   └── data/                          # Configuración global y datos compartidos
├── api/                               # Mock APIs para desarrollo local
│   ├── routes/                        # Definiciones de rutas API
│   ├── data/                          # Respuestas JSON mockeadas
│   └── middleware/                    # Middleware para el servidor local
└── docs/                              # Documentación y reportes
    ├── extraction_reports/            # Reportes de extracción originales
    ├── interaction_analysis/          # Análisis de interacciones
    └── deployment_guide.md            # Guía de despliegue
```

## Parte 2: Estrategias de Unificación

### 2.1 Mapeo de Archivos Fuente a Destino

| Fuente | Destino | Procesamiento |
|--------|---------|---------------|
| `recovered_code/pilgrim_demo/demo_pilgrim_index_full_assets.html` | `sections/pilgrim/index.html` | Reescritura de rutas |
| `recovered_code/merchant_dev/merchant_home_09_final_state_*.html` | `sections/merchant/index.html` | Mejor estado capturado |
| `recovered_code/merchant_dev/merchant_home_*.html` | `sections/merchant/variations/` | Estados alternativos |
| `recovered_code/red_pill_interactive/red_pill_*.html` | `sections/red-pill/journey/` | Flujo interactivo |
| `recovered_code/*/assets/` | `sections/*/assets/` | Copia directa + ajuste rutas |
| `recovered_code/*/inline_css/` | `sections/*/inline/css/` | Consolidación opcional |
| `recovered_code/*/inline_js/` | `sections/*/inline/js/` | Consolidación opcional |

### 2.2 Estrategias de Reescritura de Rutas

#### Patrones de Rutas a Detectar y Corregir:

1. **HTML (`src`, `href`, `data-src`)**:
   - `/assets/css/style.css` → `assets/css/style.css`
   - `../images/logo.png` → `assets/images/logo.png` (si es necesario)
   - `/js/script.js` → `assets/js/script.js`

2. **CSS (`url()`)**:
   - `url(/images/bg.jpg)` → `url(../images/bg.jpg)`
   - `url(../fonts/font.woff)` → `url(../fonts/font.woff)` (verificar)

3. **JavaScript (cadenas literales)**:
   - `fetch('/api/data')` → `fetch('/api/data')` (mantener para mock)
   - `'/images/icon.png'` → `'assets/images/icon.png'`

## Parte 3: Servidor Local con Mocking

### 3.1 Funcionalidades del Servidor
- Servir archivos estáticos desde `my_recovered_website/`
- Mock de APIs usando JSONs recuperados
- Proxy para assets cross-section si es necesario
- Hot-reload para desarrollo

### 3.2 Rutas API Mockeadas
```javascript
// Ejemplos de rutas que el servidor debería manejar
GET /api/pilgrim/data     → sections/pilgrim/assets/data/
GET /api/merchant/matches → sections/merchant/assets/data/
GET /api/red-pill/videos  → sections/red-pill/assets/data/
```

## Parte 4: Plan de Implementación

### Fase 1: Preparación (Script de Unificación)
1. Crear estructura de directorios
2. Copiar y organizar archivos
3. Reescribir rutas en HTML/CSS/JS
4. Generar índice de navegación

### Fase 2: Servidor Local
1. Configurar Express.js con servido estático
2. Implementar rutas API mockeadas
3. Configurar CORS y middleware necesario

### Fase 3: Testing y Depuración
1. Verificar carga de cada sección
2. Probar funcionalidades JavaScript
3. Validar flujos interactivos
4. Documentar problemas pendientes

### Fase 4: Optimización
1. Consolidar CSS/JS inline si es beneficioso
2. Optimizar estructura de assets
3. Mejorar navegación entre secciones
4. Preparar para despliegue 