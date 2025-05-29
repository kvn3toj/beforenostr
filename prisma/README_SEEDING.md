# 🌱 Database Seeding Instructions

Este documento explica cómo usar el script de seeding para poblar la base de datos PostgreSQL con datos de ejemplo.

## 📋 Prerrequisitos

1. **Base de datos PostgreSQL funcionando**
2. **Variables de entorno configuradas** en `.env`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/gamifier_db"
   ```
3. **Dependencias instaladas**:
   ```bash
   npm install
   ```

## 🚀 Ejecución del Script de Seeding

### Opción 1: Usando el script npm
```bash
npm run db:seed
```

### Opción 2: Ejecución directa
```bash
npx ts-node prisma/seed.ts
```

### Opción 3: Reset completo de la base de datos (con seeding automático)
```bash
npm run db:reset
```
> ⚠️ **Advertencia**: Este comando borrará TODOS los datos existentes y ejecutará todas las migraciones desde cero.

## 📊 Datos Creados por el Script

El script de seeding crea los siguientes datos de ejemplo:

### 📹 VideoItems (6 videos)
- **Introducción a la Gamificación** (Activo)
- **Elementos de Juego en Educación** (Activo)  
- **Mecánicas de Recompensa** (Activo)
- **Narrativa y Storytelling** (Activo)
- **Evaluación Gamificada** (Activo)
- **Caso de Estudio: Gamificación en Universidad** (Inactivo - para pruebas)

### 📝 Subtítulos (4 subtítulos)
- Subtítulos en español e inglés para los primeros videos
- Formatos SRT y VTT
- Estados activos e inactivos para pruebas

### ❓ Preguntas Interactivas (6 preguntas)
- **Pregunta 1**: Opción múltiple - "¿Qué es la gamificación?" (en español)
- **Pregunta 2**: Respuesta corta - "Menciona tres elementos de juego..." (en español)
- **Pregunta 3**: Verdadero/Falso - "Las recompensas extrínsecas..." (en español)
- **Pregunta 4**: Opción múltiple - "What is the most important element..." (en inglés)
- **Pregunta 5**: Opción múltiple - "¿Cuál es la ventaja principal..." (en español)
- **Pregunta 6**: Respuesta corta inactiva (para pruebas)

### 🔤 Opciones de Respuesta (13 opciones)
- Opciones para preguntas de opción múltiple
- Respuestas correctas e incorrectas marcadas
- Orden de visualización establecido

## 🎯 UUIDs de Referencias

El script utiliza UUIDs fijos para entidades relacionadas que podrían existir en otros schemas:

```typescript
// Usuarios
const adminUserId = '00000000-0000-0000-0000-000000000001';
const regularUserId = '00000000-0000-0000-0000-000000000002';

// Mundos
const mundo1Id = '11111111-1111-1111-1111-111111111111';
const mundo2Id = '22222222-2222-2222-2222-222222222222';

// Playlists
const playlist1Id = '33333333-3333-3333-3333-333333333333';
const playlist2Id = '44444444-4444-4444-4444-444444444444';
const playlist3Id = '55555555-5555-5555-5555-555555555555';

// Tipos de Items
const videoItemTypeId = '66666666-6666-6666-6666-666666666666';
const articleItemTypeId = '77777777-7777-7777-7777-777777777777';
```

## 🧪 Testeo de la Funcionalidad

Después de ejecutar el seeding, puedes probar la funcionalidad en el frontend:

1. **Inicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

2. **Navega a cualquier video** en VideoConfigPage

3. **Ve a la pestaña "Preguntas"** para ver las preguntas interactivas creadas

4. **Prueba las funcionalidades**:
   - Crear nuevas preguntas
   - Editar preguntas existentes
   - Eliminar preguntas
   - Ver diferentes tipos de preguntas

## 🛠️ Personalización del Script

Si necesitas modificar los datos de ejemplo:

1. **Edita el archivo** `prisma/seed.ts`
2. **Modifica las secciones** correspondientes:
   - VideoItems en STEP 3
   - Subtítulos en STEP 4  
   - Preguntas en STEP 5
3. **Ejecuta el script nuevamente**

## 🐛 Solución de Problemas

### Error: "Environment variable not found: DATABASE_URL"
- Asegúrate de que el archivo `.env` existe y tiene la variable `DATABASE_URL`
- Verifica que la URL de conexión sea correcta

### Error: "Can't reach database server"
- Verifica que PostgreSQL esté ejecutándose
- Confirma que las credenciales en `DATABASE_URL` sean correctas
- Asegúrate de que la base de datos existe

### Error: "Table doesn't exist"
- Ejecuta las migraciones primero: `npx prisma migrate dev`
- O usa el reset completo: `npm run db:reset`

### Error de dependencias
- Instala las dependencias: `npm install`
- Genera el cliente de Prisma: `npx prisma generate`

## 🔄 Actualizaciones Futuras

Cuando se añadan nuevas entidades al schema (User, Role, Permission, etc.), el script está preparado para incluirlas:

1. **Descomenta las secciones correspondientes** en el script
2. **Añade la lógica de creación** para las nuevas entidades
3. **Actualiza este README** con la nueva información

---

💡 **Tip**: El script está diseñado para ser idempotente - puedes ejecutarlo múltiples veces de forma segura. 