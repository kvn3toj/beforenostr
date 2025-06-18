# 🧪 Pasos de Verificación Post-Corrección

## 1. Ejecutar Tests Automatizados

```bash
# Ejecutar tests de consistencia específicos
npm run test:consistency

# Ejecutar todos los tests UX
npm run test:ux-heuristics

# Generar reporte HTML
npx playwright test tests/e2e/ux-heuristics/02-consistency-standards.spec.ts --reporter=html
```

## 2. Verificación Manual en Navegador

### 2.1 Navegación Consistente
- [ ] Visitar `/sections/red-pill/`
- [ ] Verificar que la navegación superior sea consistente
- [ ] Verificar que el enlace "Red Pill" esté marcado como activo
- [ ] Repetir para `/sections/merchant/` y `/sections/pilgrim/`

### 2.2 Estilos Consistentes
- [ ] Verificar que los botones tengan el mismo `border-radius` en todas las secciones
- [ ] Confirmar que los colores primarios sean consistentes
- [ ] Validar que las fuentes sean las mismas en todas las páginas

### 2.3 Comportamientos JavaScript
- [ ] Probar el menú móvil en dispositivos pequeños
- [ ] Verificar que los formularios validen consistentemente
- [ ] Confirmar que los botones tengan efectos hover consistentes

## 3. Validación de Accesibilidad

```bash
# Usar axe-core para validación automática
npx @axe-core/cli http://localhost:3333/sections/red-pill/
npx @axe-core/cli http://localhost:3333/sections/merchant/
npx @axe-core/cli http://localhost:3333/sections/pilgrim/
```

### 3.1 Verificación Manual de Accesibilidad
- [ ] Navegar usando solo el teclado (Tab, Shift+Tab, Enter, Escape)
- [ ] Verificar que todos los enlaces tengan texto descriptivo
- [ ] Confirmar que los estados de focus sean visibles
- [ ] Probar con lector de pantalla (NVDA, JAWS, o VoiceOver)

## 4. Tests de Performance

```bash
# Lighthouse para cada sección
lighthouse http://localhost:3333/sections/red-pill/ --output=html --output-path=./reports/red-pill-lighthouse.html
lighthouse http://localhost:3333/sections/merchant/ --output=html --output-path=./reports/merchant-lighthouse.html
lighthouse http://localhost:3333/sections/pilgrim/ --output=html --output-path=./reports/pilgrim-lighthouse.html
```

### 4.1 Métricas a Verificar
- [ ] **First Contentful Paint (FCP)**: < 2.5s
- [ ] **Largest Contentful Paint (LCP)**: < 4s
- [ ] **Cumulative Layout Shift (CLS)**: < 0.25
- [ ] **Time to Interactive (TTI)**: < 5s

## 5. Validación Cross-Browser

### 5.1 Navegadores a Probar
- [ ] Chrome (última versión)
- [ ] Firefox (última versión)
- [ ] Safari (si está disponible)
- [ ] Edge (última versión)

### 5.2 Dispositivos Móviles
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] Tablet (iPad/Android)

## 6. Verificación de Consistencia Visual

### 6.1 Comparación de Screenshots
```bash
# Generar screenshots para comparación
npx playwright test tests/visual/consistency-screenshots.spec.ts
```

### 6.2 Elementos a Comparar
- [ ] Headers/navegación
- [ ] Botones primarios y secundarios
- [ ] Formularios
- [ ] Footers
- [ ] Tipografía (tamaños, pesos, familias)

## 7. Tests de Regresión

### 7.1 Funcionalidades Específicas por Sección
- [ ] **Red Pill**: Verificar que los sliders funcionen
- [ ] **Merchant**: Confirmar que la búsqueda funcione
- [ ] **Pilgrim**: Validar que el reproductor de video funcione

### 7.2 Funcionalidades Compartidas
- [ ] Navegación entre secciones
- [ ] Formularios de contacto
- [ ] Enlaces externos
- [ ] Tracking de analytics

## 8. Validación de Código

### 8.1 HTML Validation
```bash
# Validar HTML con validator.nu
curl -H "Content-Type: text/html; charset=utf-8" --data-binary @sections/red-pill/index.html https://validator.nu/?out=json
```

### 8.2 CSS Validation
```bash
# Validar CSS
npx stylelint "shared/css/*.css"
```

### 8.3 JavaScript Validation
```bash
# Linting JavaScript
npx eslint shared/js/unified-scripts.js
```

## 9. Tests de Carga

```bash
# Test de carga básico con Artillery
artillery quick --count 10 --num 5 http://localhost:3333/sections/red-pill/
```

## 10. Checklist Final de Consistencia

### 10.1 Elementos Visuales
- [ ] Paleta de colores consistente
- [ ] Tipografía unificada
- [ ] Espaciado consistente
- [ ] Iconografía coherente

### 10.2 Interacciones
- [ ] Estados hover consistentes
- [ ] Transiciones uniformes
- [ ] Feedback visual coherente
- [ ] Mensajes de error consistentes

### 10.3 Estructura
- [ ] HTML semántico consistente
- [ ] Jerarquía de headings correcta
- [ ] Landmarks ARIA apropiados
- [ ] Estructura de navegación uniforme

## 11. Documentación de Issues

Si encuentras problemas durante la verificación:

1. **Crear issue en GitHub/sistema de tracking**
2. **Incluir**:
   - Navegador y versión
   - Dispositivo/resolución
   - Pasos para reproducir
   - Screenshot/video si es visual
   - Logs de consola si es JavaScript

## 12. Métricas de Éxito

### 12.1 Tests Automatizados
- [ ] 100% de tests de consistencia pasando
- [ ] 0 errores de accesibilidad críticos
- [ ] Score Lighthouse > 90 en todas las secciones

### 12.2 Validación Manual
- [ ] Navegación fluida entre secciones
- [ ] Experiencia visual coherente
- [ ] Funcionalidad preservada en todas las secciones

## 13. Rollback Plan

Si se detectan problemas críticos:

```bash
# Revertir cambios
./scripts/rollback-consistency-fixes.sh

# Restaurar desde backup
cp backup-YYYYMMDD_HHMMSS/*.backup sections/*/index.html
```

## 14. Próximos Pasos

Una vez verificado:

1. **Deploy a staging**
2. **Tests de usuario**
3. **Monitoreo de métricas**
4. **Deploy a producción**
5. **Monitoreo post-deploy**

---

**Nota**: Ejecuta estos pasos en orden y documenta cualquier issue encontrado. La consistencia es crítica para la experiencia de usuario, así que no omitas ninguna verificación. 