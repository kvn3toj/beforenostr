# [ADMIN] API de Tareas (`/tasks`)

> Documentación de referencia para la integración y sincronización de tareas entre el Gamifier Admin y la Red de Acción Sistémica CoomÜnity.

---

## Autenticación
- **Tipo:** JWT (Bearer Token)
- **Rol requerido:** `admin`
- **Header:**
  ```http
  Authorization: Bearer <token>
  Content-Type: application/json
  ```

---

## Endpoints

### 1. Obtener todas las tareas
- **GET** `/tasks`
- **Descripción:** Devuelve la lista de tareas actuales.
- **Respuesta:**
  ```json
  [
    {
      "id": "103.1",
      "missionId": "103",
      "description": "Definir y documentar el TaskDTO unificado.",
      "status": "PENDING",
      "assignee": "ANA",
      "priority": "CRITICAL",
      "effort": 2,
      "dependencies": [],
      "successCriteria": "El DTO está definido, tipado y commiteado en el repositorio."
    }
  ]
  ```

### 2. Crear una nueva tarea
- **POST** `/tasks`
- **Descripción:** Crea una nueva tarea.
- **Payload:**
  ```json
  {
    "id": "103.2",
    "missionId": "103",
    "description": "Verificar y documentar los endpoints /tasks del Gamifier Admin.",
    "status": "PENDING",
    "assignee": "ATLAS",
    "priority": "HIGH",
    "effort": 3,
    "dependencies": [],
    "successCriteria": "Documento de Postman o similar validando todos los endpoints de tareas."
  }
  ```
- **Respuesta:** Objeto de la tarea creada.

### 3. Actualizar una tarea existente
- **PUT** `/tasks/:id`
- **Descripción:** Actualiza una tarea existente.
- **Payload:**
  ```json
  {
    "status": "IN_PROGRESS",
    "assignee": "PHOENIX"
  }
  ```
- **Respuesta:** Objeto de la tarea actualizada.

---

## Estados y Prioridades
- **status:** `PENDING` | `IN_PROGRESS` | `DONE` | `BLOCKED`
- **priority:** `CRITICAL` | `HIGH` | `MEDIUM` | `LOW`

---

## Ejemplo de uso con fetch (TypeScript)
```typescript
const response = await fetch('http://localhost:3002/tasks', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const tasks = await response.json();
```

---

## Notas de Seguridad
- Todos los endpoints requieren JWT válido y rol `admin`.
- Respuestas de error:
  - `401 Unauthorized`: Token inválido o ausente.
  - `403 Forbidden`: Permisos insuficientes.

---

## Referencia de TaskDTO
Ver `types/task.dto.ts` para la definición completa del contrato de datos. 
