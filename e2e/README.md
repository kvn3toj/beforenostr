# Tests End-to-End (E2E) - Administrador de Subtítulos

## Descripción

Este directorio contiene los tests End-to-End para el **Administrador de Subtítulos** en la página `VideoConfigPage`. Los tests verifican que el frontend y el backend funcionan correctamente juntos.

## Archivos de Test

### `subtitle-manager.spec.ts`

Tests completos para la funcionalidad del administrador de subtítulos:

#### Escenarios de Test Implementados:

1. **Renderizado de la pestaña Subtítulos**
   - Verifica que todos los elementos clave aparecen correctamente
   - Comprueba la presencia del formulario de carga y la lista de subtítulos

2. **Carga exitosa de archivo de subtítulo**
   - Prueba la carga completa de un archivo VTT
   - Verifica la selección de idioma y auto-detección de formato
   - Confirma que aparece el mensaje de éxito y el subtítulo en la lista

3. **Eliminación de subtítulo**
   - Prueba la eliminación con confirmación
   - Verifica el manejo del diálogo de confirmación
   - Confirma el mensaje de éxito

4. **Activar/Desactivar subtítulo**
   - Prueba el toggle del estado activo/inactivo
   - Verifica el cambio de estado en la UI

5. **Validación del formulario**
   - Verifica que el botón de carga se deshabilita sin archivo o idioma
   - Prueba la validación progresiva del formulario

6. **Estados de carga**
   - Verifica el estado de loading durante la carga
   - Prueba la deshabilitación de controles durante mutaciones

7. **Estado vacío**
   - Verifica el mensaje cuando no hay subtítulos

8. **Auto-detección de formato**
   - Prueba la detección automática de formato VTT/SRT

9. **Navegación entre pestañas**
   - Verifica la navegación entre Configuración y Subtítulos

### `auth.spec.ts`

Tests de autenticación (existente):
- Login exitoso
- Manejo de credenciales inválidas

## Datos de Prueba

### `test-data/`

- **`test.vtt`**: Archivo de subtítulos en formato WebVTT para pruebas
- **`test.srt`**: Archivo de subtítulos en formato SRT para pruebas

## Configuración

### Prerequisitos

1. **Backend funcionando**: Los tests asumen que hay un backend NestJS corriendo en `http://localhost:4000`
2. **Frontend funcionando**: Vite dev server en `http://localhost:5173`
3. **Base de datos**: Con al menos un video de prueba con ID `test-video-id`

### Variables de Entorno

Asegúrate de que el archivo `.env` contenga:

```env
VITE_BACKEND_URL=http://localhost:4000
```

## Ejecución de Tests

### Ejecutar todos los tests E2E

```bash
npx playwright test
```

### Ejecutar solo los tests del administrador de subtítulos

```bash
npx playwright test subtitle-manager.spec.ts
```

### Ejecutar en modo debug

```bash
npx playwright test --debug
```

### Ejecutar con UI

```bash
npx playwright test --ui
```

### Ejecutar en un navegador específico

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Estructura de los Tests

### Patrón de Test

Cada test sigue este patrón:

1. **Setup** (en `beforeEach`):
   - Navegar a `/videos/test-video-id/config`
   - Hacer clic en la pestaña "Subtítulos"
   - Esperar a que el administrador sea visible

2. **Acción**:
   - Realizar la acción específica del test

3. **Verificación**:
   - Verificar el resultado esperado
   - Comprobar mensajes de éxito/error
   - Validar cambios en la UI

### Selectores Utilizados

Los tests priorizan selectores accesibles:

- `page.getByRole()` - Para elementos con roles ARIA
- `page.getByText()` - Para texto visible
- `page.getByLabel()` - Para elementos con labels
- `page.locator()` - Para selectores más específicos cuando es necesario

## Consideraciones para Producción

### Datos de Test

En un entorno de producción, considera:

1. **Base de datos de test**: Usar una base de datos separada para tests
2. **Datos de semilla**: Crear datos de test consistentes
3. **Limpieza**: Limpiar datos después de cada test

### Configuración de CI/CD

Para integración continua:

```yaml
# Ejemplo para GitHub Actions
- name: Run E2E tests
  run: |
    npm run build
    npm run preview &
    npx playwright test
```

### Timeouts y Esperas

Los tests incluyen esperas apropiadas para:
- Carga de páginas
- Respuestas de API
- Animaciones de UI
- Toasts y notificaciones

## Troubleshooting

### Problemas Comunes

1. **Test falla en navegación inicial**
   - Verificar que el video `test-video-id` existe en la base de datos
   - Comprobar que el usuario está autenticado

2. **Archivos de test no encontrados**
   - Verificar que los archivos en `e2e/test-data/` existen
   - Comprobar permisos de lectura

3. **Timeouts en carga de archivos**
   - Verificar que el backend está corriendo
   - Comprobar la configuración de CORS

4. **Selectores no encontrados**
   - Verificar que las traducciones están cargadas
   - Comprobar que los componentes se renderizan correctamente

### Debug

Para debuggear tests:

```bash
# Ejecutar con cabeza visible
npx playwright test --headed

# Ejecutar paso a paso
npx playwright test --debug

# Generar trace
npx playwright test --trace on
```

## Próximos Pasos

### Mejoras Sugeridas

1. **Tests de integración con backend real**
2. **Tests de performance para carga de archivos grandes**
3. **Tests de accesibilidad**
4. **Tests de responsive design**
5. **Tests de múltiples idiomas**

### Extensiones

1. **Tests para otros formatos de subtítulos**
2. **Tests de validación de contenido de subtítulos**
3. **Tests de sincronización con video**
4. **Tests de exportación/importación masiva** 