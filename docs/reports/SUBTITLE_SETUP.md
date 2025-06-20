# Configuración del Administrador de Subtítulos

## Resumen de la Implementación

Se ha implementado exitosamente la **Fase 2: Implementación Frontend del Administrador de Subtítulos** con los siguientes componentes:

### Archivos Creados/Modificados:

#### 1. Página Principal Modificada:
- `src/pages/VideoConfigPage.tsx` - Añadida nueva pestaña "Subtítulos"

#### 2. Componentes de UI:
- `src/components/features/subtitles/SubtitleManager.tsx` - Contenedor principal
- `src/components/features/subtitles/SubtitleUploadForm.tsx` - Formulario de carga
- `src/components/features/subtitles/SubtitleListItem.tsx` - Elemento de lista

#### 3. Hooks de React Query:
- `src/hooks/features/subtitles/useSubtitlesQuery.ts` - Consultar subtítulos
- `src/hooks/features/subtitles/useCreateSubtitleMutation.ts` - Crear subtítulos
- `src/hooks/features/subtitles/useUpdateSubtitleMutation.ts` - Actualizar subtítulos
- `src/hooks/features/subtitles/useDeleteSubtitleMutation.ts` - Eliminar subtítulos

#### 4. Servicio HTTP:
- `src/services/subtitle.service.ts` - Cliente REST para el backend

#### 5. Traducciones:
- `public/locales/es/translation.json` - Claves en español
- `public/locales/en/translation.json` - Claves en inglés

#### 6. Utilidades:
- `src/subtitle/dto/index.ts` - Exportaciones de DTOs

## Configuración del Backend

### Variable de Entorno

El servicio está configurado para usar la variable de entorno `VITE_BACKEND_URL`. Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_BACKEND_URL=http://localhost:4000
```

Si no se especifica, por defecto usará `http://localhost:4000`.

### Endpoints del Backend

El frontend espera que el backend NestJS tenga los siguientes endpoints:

```
GET    /subtitles?videoItemId=123&languageCode=es&format=srt&isActive=true
POST   /subtitles
PATCH  /subtitles/:id
DELETE /subtitles/:id
```

### Estructura de Datos

Los endpoints deben manejar el modelo `Subtitle` de Prisma:

```typescript
interface Subtitle {
  id: number;
  videoItemId: number;
  languageCode: string;
  format: 'srt' | 'vtt';
  content?: string;
  contentUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Funcionalidades Implementadas

### ✅ Gestión de Subtítulos:
- Cargar archivos SRT/VTT
- Listar subtítulos existentes
- Activar/desactivar subtítulos
- Eliminar subtítulos
- Soporte multiidioma (es, en, fr, de, it, pt)

### ✅ UI/UX:
- Interfaz integrada en VideoConfigPage
- Estados de carga y error
- Confirmaciones de eliminación
- Notificaciones toast
- Diseño responsive con Material-UI

### ✅ Validaciones:
- Validación de archivos (solo .srt y .vtt)
- Validación de idioma requerido
- Manejo de errores de lectura de archivos
- Validación de backend con DTOs

## Próximos Pasos

1. **Configurar Backend**: Asegúrate de que el backend NestJS esté corriendo en el puerto configurado
2. **Probar Funcionalidad**: Navega a cualquier video y usa la nueva pestaña "Subtítulos"
3. **Autenticación**: Si es necesario, añadir headers de autenticación en `subtitle.service.ts`
4. **Almacenamiento**: Configurar almacenamiento de archivos (local o S3) en el backend

## Estructura de Archivos

```
src/
├── components/features/subtitles/
│   ├── SubtitleManager.tsx
│   ├── SubtitleUploadForm.tsx
│   └── SubtitleListItem.tsx
├── hooks/features/subtitles/
│   ├── useSubtitlesQuery.ts
│   ├── useCreateSubtitleMutation.ts
│   ├── useUpdateSubtitleMutation.ts
│   └── useDeleteSubtitleMutation.ts
├── services/
│   └── subtitle.service.ts
└── subtitle/dto/
    ├── create-subtitle.dto.ts
    ├── update-subtitle.dto.ts
    ├── find-all-subtitles.dto.ts
    └── index.ts
```

## Notas Técnicas

- Los componentes usan TypeScript estricto
- Integración completa con React Query para cache y sincronización
- Manejo de errores con `extractErrorMessage` utility
- Soporte para internacionalización (i18n)
- Diseño consistente con el resto de la aplicación 