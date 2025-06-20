# Migración de Gamificación - Frontend

## Resumen

Se ha completado exitosamente la migración de la **Gestión de Gamificación** en el frontend para que consuma nuestro backend NestJS local. Esta migración incluye la gestión de Méritos, Wallets, Transacciones y Desafíos.

## Archivos Creados/Modificados

### Servicios del Frontend

1. **`src/services/merit.service.ts`** - Gestión de tipos de méritos
   - `fetchMerits()` - Obtener todos los méritos
   - `fetchMeritById(id)` - Obtener mérito por ID
   - `createMerit(data)` - Crear nuevo mérito (Admin)
   - `updateMerit(id, data)` - Actualizar mérito (Admin)
   - `deleteMerit(id)` - Eliminar mérito (Admin)

2. **`src/services/wallet.service.ts`** - Gestión de balances de wallet
   - `fetchMyWalletBalances(userId)` - Obtener balances del usuario
   - `fetchMyWalletBalance(userId, meritSlug)` - Obtener balance específico
   - `fetchUserWalletBalancesAdmin(userId)` - Admin: balances de cualquier usuario
   - `fetchUserWalletBalanceAdmin(userId, meritSlug)` - Admin: balance específico

3. **`src/services/transaction.service.ts`** - Gestión de transacciones de méritos
   - `fetchMyTransactions(userId)` - Obtener transacciones del usuario
   - `fetchTransactionById(id)` - Obtener transacción por ID
   - `fetchTransactionByIdAdmin(id)` - Admin: cualquier transacción
   - `fetchAllTransactionsAdmin()` - Admin: todas las transacciones

4. **`src/services/challenge.service.ts`** - Gestión de desafíos
   - `fetchActiveChallenges()` - Obtener desafíos activos (público)
   - `fetchChallengeById(id)` - Obtener desafío por ID
   - `fetchAllChallengesAdmin()` - Admin: todos los desafíos
   - `createChallenge(data)` - Admin: crear desafío
   - `updateChallenge(id, data)` - Admin: actualizar desafío
   - `deleteChallenge(id)` - Admin: eliminar desafío
   - `addRewardToChallenge(challengeId, reward)` - Admin: añadir recompensa
   - `removeChallengeReward(rewardId)` - Admin: eliminar recompensa

5. **`src/services/userChallenge.service.ts`** - Gestión de desafíos de usuario
   - `startChallenge(challengeId)` - Iniciar desafío
   - `updateChallengeProgress(userChallengeId, data)` - Actualizar progreso
   - `completeChallenge(userChallengeId)` - Completar desafío
   - `fetchMyChallenges()` - Obtener mis desafíos
   - `fetchUserChallengeById(id)` - Obtener desafío específico
   - Funciones admin correspondientes

6. **`src/services/gamification.service.ts`** - Servicio consolidado
   - Re-exporta todas las funcionalidades
   - Funciones utilitarias para cálculos de estadísticas
   - Tipos consolidados para overview de gamificación

### Hooks de React Query

1. **`src/hooks/features/gamification/useMeritsQuery.ts`**
2. **`src/hooks/features/gamification/useWalletBalancesQuery.ts`**
3. **`src/hooks/features/gamification/useMyTransactionsQuery.ts`**
4. **`src/hooks/features/gamification/useActiveChallengesQuery.ts`**
5. **`src/hooks/features/gamification/useMyChallengesQuery.ts`**
6. **`src/hooks/features/gamification/useStartChallengeMutation.ts`**
7. **`src/hooks/features/gamification/useCompleteChallengeMutation.ts`**
8. **`src/hooks/features/gamification/useGamificationStats.ts`** - Hook consolidado
9. **`src/hooks/features/gamification/index.ts`** - Exportaciones

### Componentes de Ejemplo

1. **`src/components/features/gamification/GamificationDashboard.tsx`**
   - Dashboard completo de gamificación
   - Muestra estadísticas del usuario
   - Lista balances de wallet
   - Muestra desafíos disponibles y del usuario
   - Historial de transacciones
   - Funcionalidad para iniciar desafíos

## Características Implementadas

### Autenticación y Autorización
- Todos los servicios utilizan `apiService` que incluye automáticamente el token JWT
- Endpoints protegidos requieren autenticación
- Endpoints de admin requieren rol de administrador

### Gestión de Estado
- Integración completa con React Query
- Cache inteligente con `staleTime` apropiado
- Invalidación automática de queries relacionadas tras mutaciones
- Manejo de estados de carga y error

### Tipos TypeScript
- Interfaces completas para todos los modelos de datos
- DTOs para operaciones de creación y actualización
- Tipos utilitarios para estadísticas y overview

### Funcionalidades de Usuario
- Ver balance de méritos por tipo
- Historial de transacciones
- Iniciar y completar desafíos
- Ver progreso de desafíos
- Estadísticas consolidadas de gamificación

### Funcionalidades de Admin
- Gestión completa de tipos de méritos
- Ver balances y transacciones de cualquier usuario
- Gestión completa de desafíos
- Gestión de recompensas de desafíos
- Administración de progreso de desafíos de usuarios

## Endpoints del Backend Utilizados

### Méritos (`/merits`)
- `GET /merits` - Listar méritos (Admin)
- `POST /merits` - Crear mérito (Admin)
- `GET /merits/:id` - Obtener mérito (Admin)
- `PATCH /merits/:id` - Actualizar mérito (Admin)
- `DELETE /merits/:id` - Eliminar mérito (Admin)

### Wallets (`/wallets`)
- `GET /wallets/user/:userId` - Balances del usuario
- `GET /wallets/user/:userId/:meritSlug` - Balance específico
- `GET /wallets/admin/user/:userId` - Admin: balances de usuario
- `GET /wallets/admin/user/:userId/:meritSlug` - Admin: balance específico

### Transacciones (`/transactions`)
- `GET /transactions/user/:userId` - Transacciones del usuario
- `GET /transactions/:id` - Transacción específica
- `GET /transactions/admin/:id` - Admin: cualquier transacción
- `GET /transactions/admin/all` - Admin: todas las transacciones

### Desafíos (`/challenges`)
- `GET /challenges` - Desafíos activos (público)
- `GET /challenges/:id` - Desafío específico (público)
- `GET /challenges/admin/all` - Admin: todos los desafíos
- `POST /challenges` - Admin: crear desafío
- `PUT /challenges/:id` - Admin: actualizar desafío
- `DELETE /challenges/:id` - Admin: eliminar desafío
- `POST /challenges/:challengeId/rewards` - Admin: añadir recompensa
- `DELETE /challenges/rewards/:rewardId` - Admin: eliminar recompensa

### Desafíos de Usuario (`/user-challenges`)
- `POST /user-challenges/start` - Iniciar desafío
- `PATCH /user-challenges/:id/progress` - Actualizar progreso
- `POST /user-challenges/:id/complete` - Completar desafío
- `GET /user-challenges/me` - Mis desafíos
- `GET /user-challenges/:id` - Desafío específico
- Endpoints admin correspondientes

## Uso en Componentes

```typescript
import {
  useGamificationStats,
  useActiveChallengesQuery,
  useStartChallengeMutation,
} from '../hooks/features/gamification';

const MyComponent = () => {
  const { stats, isLoading, walletBalances } = useGamificationStats();
  const { data: challenges } = useActiveChallengesQuery();
  const startChallenge = useStartChallengeMutation();

  // Usar los datos...
};
```

## Próximos Pasos

1. **Testing**: Crear tests unitarios para los servicios y hooks
2. **Componentes UI**: Desarrollar componentes específicos para cada funcionalidad
3. **Integración**: Integrar en las páginas principales de la aplicación
4. **Optimización**: Implementar paginación y filtros según sea necesario
5. **Notificaciones**: Añadir notificaciones para eventos de gamificación

## Notas Técnicas

- Todos los servicios manejan errores de forma consistente
- Los hooks invalidan automáticamente las queries relacionadas
- El componente de ejemplo demuestra el uso completo del sistema
- La autenticación JWT se maneja automáticamente
- Los tipos están completamente tipados con TypeScript 