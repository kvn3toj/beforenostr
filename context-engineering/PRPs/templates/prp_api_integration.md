# 🔌 PRP Template: API Integration

## 📋 Información del Template
- **Tipo:** Integración Backend-Frontend
- **Proyecto:** CoomÜnity SuperApp/Admin
- **Contexto:** NestJS Backend + React Frontend
- **Nivel:** Intermedio-Avanzado

---

## 🎯 Prompt Pattern

### Contexto Inicial
```
Eres un experto en integración API para CoomÜnity.

CONTEXTO CRÍTICO:
- Backend: NestJS en puerto 3002 (único backend)
- Frontend: React [SuperApp/Admin] en puerto [3001/3000]
- Autenticación: JWT con localStorage
- Cliente: Axios configurado con interceptors
- Patrones: React Query + Zustand + TypeScript

ARQUITECTURA OBLIGATORIA:
- UN solo backend NestJS compartido
- Autenticación JWT automática
- Manejo de errores consistente
- Estados loading/error/success
- Retry policies configuradas

PROTOCOLO PRE-FLIGHT OBLIGATORIO:
```bash
# 1. Verificar backend corriendo
curl http://localhost:3002/health -v

# 2. Si no responde, iniciar backend
cd backend/ && npm run dev

# 3. Verificar endpoints disponibles
curl http://localhost:3002/api -v
```

ANTES DE EMPEZAR:
1. Ejecuta protocolo pre-flight
2. Confirma que apiService esté configurado
3. Verifica JWT token en localStorage
4. Identifica endpoints del backend necesarios
```

### Especificación de la Integración
```
INTEGRACIÓN REQUERIDA:
- Entidad: [EntityName] (ej: User, Video, Project)
- Endpoints: [Lista de endpoints necesarios]
- Métodos: [GET, POST, PUT, DELETE]
- Autenticación: [Requerida/Opcional]
- Permisos: [Roles necesarios]
- Datos: [Estructura de request/response]

SERVICIOS A CREAR:
- [entity]Service.ts: Funciones de API
- use[Entity].ts: Hook de React Query
- [entity]Store.ts: Estado global (si necesario)
- [Entity].types.ts: Tipos TypeScript

REQUISITOS TÉCNICOS:
- Manejo de errores HTTP (401, 403, 404, 500)
- Loading states durante requests
- Retry automático en fallos de red
- Cache inteligente con React Query
- Optimistic updates cuando sea apropiado
- Validación de datos con Zod

FILOSOFÍA COOMUNITY:
- Transparencia en operaciones
- Feedback claro al usuario
- Manejo graceful de errores
- Respeto por la privacidad de datos
```

### Estructura Esperada
```
ESTRUCTURA REQUERIDA:

1. **Servicio API:**
```typescript
// src/services/[entity]Service.ts
export const [entity]Service = {
  getAll: (params?: QueryParams) => apiService.get('/[entity]', { params }),
  getById: (id: string) => apiService.get(`/[entity]/${id}`),
  create: (data: Create[Entity]Dto) => apiService.post('/[entity]', data),
  update: (id: string, data: Update[Entity]Dto) => apiService.put(`/[entity]/${id}`, data),
  delete: (id: string) => apiService.delete(`/[entity]/${id}`),
};
```

2. **Hook de React Query:**
```typescript
// src/hooks/use[Entity].ts
export const use[Entity] = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['[entity]'],
    queryFn: () => [entity]Service.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
  });

  return { data, isLoading, error, refetch };
};
```

3. **Tipos TypeScript:**
```typescript
// src/types/[Entity].types.ts
export interface [Entity] {
  id: string;
  // ... propiedades
}

export interface Create[Entity]Dto {
  // ... propiedades para crear
}

export interface Update[Entity]Dto {
  // ... propiedades para actualizar
}
```
```

---

## 🔄 Response Pattern

### Análisis Inicial
```
**ANÁLISIS DE INTEGRACIÓN:**

🎯 **Entidad:** [EntityName]
🔧 **Endpoints:** [Lista de endpoints]
📡 **Métodos:** [HTTP methods necesarios]
🔐 **Autenticación:** [JWT requerido/opcional]
🎨 **Filosofía CoomÜnity:** [Cómo se alinea con valores]

**DEPENDENCIAS IDENTIFICADAS:**
- Backend endpoints: [lista]
- DTOs necesarios: [lista]
- Permisos requeridos: [lista]
- Validaciones: [lista]

**ESTADOS DE DATOS:**
- Loading: [cuándo mostrar]
- Error: [tipos de errores]
- Success: [datos esperados]
- Empty: [cuando no hay datos]
```

### Implementación Paso a Paso
```
**PASO 1: CONFIGURACIÓN BASE**
```typescript
// Verificar y configurar apiService
```

**PASO 2: SERVICIO API**
```typescript
// Implementar funciones CRUD
```

**PASO 3: HOOK DE REACT QUERY**
```typescript
// Hook con query y mutations
```

**PASO 4: TIPOS TYPESCRIPT**
```typescript
// Interfaces y DTOs
```

**PASO 5: MANEJO DE ERRORES**
```typescript
// Error handling y retry logic
```

**PASO 6: INTEGRACIÓN EN COMPONENTES**
```typescript
// Uso en componentes React
```
```

### Validación y Testing
```
**VALIDACIÓN TÉCNICA:**
- [ ] Endpoints funcionando correctamente
- [ ] Autenticación JWT automática
- [ ] Manejo de errores HTTP
- [ ] Loading states implementados
- [ ] Retry logic configurado
- [ ] Cache funcionando correctamente

**VALIDACIÓN DE DATOS:**
- [ ] Tipos TypeScript correctos
- [ ] Validación con Zod
- [ ] DTOs alineados con backend
- [ ] Serialización correcta

**TESTING SUGERIDO:**
```typescript
// Test de servicio
describe('[entity]Service', () => {
  it('should fetch all entities', async () => {
    const entities = await [entity]Service.getAll();
    expect(entities).toBeDefined();
  });
});

// Test de hook
describe('use[Entity]', () => {
  it('should return data and loading state', () => {
    const { result } = renderHook(() => use[Entity]());
    expect(result.current.isLoading).toBe(true);
  });
});
```
```

---

## 📝 Ejemplo de Uso

### Prompt de Ejemplo
```
Necesito integrar la gestión de usuarios con el backend NestJS.

ESPECIFICACIONES:
- Endpoints: GET /users, GET /users/:id, POST /users, PUT /users/:id, DELETE /users/:id
- Autenticación: JWT requerido para todas las operaciones
- Permisos: Solo admin puede crear/actualizar/eliminar
- Datos: id, name, email, role, createdAt, updatedAt
- Funcionalidades: Listar, ver detalle, crear, editar, eliminar

FILOSOFÍA:
- Transparencia en operaciones de usuario
- Feedback claro en cada acción
- Manejo graceful de errores de permisos
- Respeto por la privacidad de datos
```

### Response Esperada
```
**ANÁLISIS DE INTEGRACIÓN:**

🎯 **Entidad:** User
🔧 **Endpoints:** /users (GET, POST), /users/:id (GET, PUT, DELETE)
📡 **Métodos:** GET, POST, PUT, DELETE
🔐 **Autenticación:** JWT requerido
🎨 **Filosofía CoomÜnity:** Transparencia y respeto por privacidad

**IMPLEMENTACIÓN:**

**PASO 1: SERVICIO API**
```typescript
// src/services/userService.ts
import { apiService } from './api-service';
import { User, CreateUserDto, UpdateUserDto } from '../types/User.types';

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await apiService.get('/users');
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await apiService.get(`/users/${id}`);
    return response.data;
  },

  create: async (userData: CreateUserDto): Promise<User> => {
    const response = await apiService.post('/users', userData);
    return response.data;
  },

  update: async (id: string, userData: UpdateUserDto): Promise<User> => {
    const response = await apiService.put(`/users/${id}`, userData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiService.delete(`/users/${id}`);
  },
};
```

**PASO 2: HOOK DE REACT QUERY**
```typescript
// src/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { CreateUserDto, UpdateUserDto } from '../types/User.types';

export const useUsers = () => {
  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
  });

  const createUserMutation = useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Error creating user:', error);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
      userService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: userService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    users,
    isLoading,
    error,
    refetch,
    createUser: createUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
  };
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });
};
```

**PASO 3: TIPOS TYPESCRIPT**
```typescript
// src/types/User.types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user' | 'moderator';
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: 'admin' | 'user' | 'moderator';
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}
```

**PASO 4: USO EN COMPONENTE**
```typescript
// src/components/pages/UsersPage.tsx
import { FC } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow,
  CircularProgress,
  Alert 
} from '@mui/material';
import { useUsers } from '../../hooks/useUsers';

export const UsersPage: FC = () => {
  const { 
    users, 
    isLoading, 
    error, 
    deleteUser, 
    isDeleting 
  } = useUsers();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error al cargar usuarios: {error.message}
      </Alert>
    );
  }

  const handleDeleteUser = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      deleteUser(id);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Gestión de Usuarios
      </Typography>
      
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleDeleteUser(user.id)}
                  disabled={isDeleting}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};
```

**FILOSOFÍA APLICADA:**
- ✅ Transparencia en operaciones (loading states claros)
- ✅ Feedback inmediato en acciones
- ✅ Manejo graceful de errores
- ✅ Confirmación antes de acciones destructivas
- ✅ Respeto por la privacidad (no mostrar datos sensibles)
```

---

## 🎯 Criterios de Éxito

### Técnicos
- [ ] Conexión exitosa con backend NestJS
- [ ] Autenticación JWT funcionando
- [ ] Todos los endpoints integrados
- [ ] Manejo de errores HTTP
- [ ] Loading states implementados
- [ ] Cache y retry funcionando

### Funcionales
- [ ] CRUD operations completas
- [ ] Validación de datos
- [ ] Permisos verificados
- [ ] Estados de UI apropiados
- [ ] Feedback al usuario

### Calidad
- [ ] Código TypeScript estricto
- [ ] Tests unitarios pasando
- [ ] Performance optimizado
- [ ] Manejo de memoria correcto
- [ ] Documentación completa

---

## 📚 Recursos Adicionales

### Documentación
- [CLAUDE.md](../CLAUDE.md) - Reglas globales
- [React Query Docs](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com/docs/intro)

### Herramientas
- **React Query DevTools:** Debugging de queries
- **Network Tab:** Monitoreo de requests
- **Postman:** Testing de APIs

### Patrones Relacionados
- [PRP React Component](./prp_react_component.md)
- [PRP Testing](./prp_testing.md)
- [PRP Error Handling](./prp_error_handling.md)

---

**Este template PRP garantiza integraciones API robustas, eficientes y alineadas con la arquitectura CoomÜnity.** 