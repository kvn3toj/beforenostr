# 👤 PROMPT EJEMPLO: Componente de Perfil de Usuario - Guardiana ARIA

## **Guardián:** Aria, Artista de Interfaces Conscientes
## **Misión:** Esculpir el componente de Perfil de Usuario para la SuperApp. Esto no es una simple página de "acerca de mí". Es el **Espejo del Alma Digital**, un reflejo vivo del viaje, la identidad y las contribuciones de un Jugador dentro de CoomÜnity.

---

### **1. 📜 Filosofía del Componente: El Reflejo del Ser**

- **Identidad en Evolución:** El perfil no es estático; es un lienzo que evoluciona a medida que el Jugador crece. Debe mostrar su progreso, sus logros y su historia.
- **Celebración de la Contribución:** Las métricas clave (Ünits, Öndas, Mëritos) no son solo números, son la manifestación visible del valor que el Jugador ha aportado. La interfaz debe celebrarlas y darles un lugar de honor.
- **Conexión Auténtica:** El perfil es una invitación a la conexión. Debe permitir a los Jugadores mostrar quiénes son de una manera auténtica, fomentando la confianza y la colaboración.

### **2. 🏗️ Arquitectura y Ubicación del Componente**

**Tecnologías Clave:** React, TypeScript, Material UI (para componentes complejos como Tabs), Tailwind CSS (para el layout y styling), React Query.

**Estructura de Archivos Sugerida:**

```
/src
├── pages/
│   └── ProfilePage.tsx   # La página contenedora que usa el ID de la URL
└── components/
    └── features/
        └── profile/
            ├── UserProfileCard.tsx      # El componente principal con la info del usuario
            ├── UserStats.tsx            # Componente visual para Ünits, Öndas, etc.
            ├── AchievementsList.tsx     # Lista/Galería de logros
            ├── ActivityFeed.tsx         # Feed de actividad reciente
            └── EditProfileModal.tsx     # Modal con formulario para editar
```

### **3. ⚙️ Desglose Funcional y de Datos**

#### **a) Obtención de Datos (React Query)**

-   Crea un hook personalizado: `useUserProfile(userId: string)`.
-   Dentro, usa `useQuery` de React Query:
    ```typescript
    const { data, isLoading, error } = useQuery({
      queryKey: ['userProfile', userId],
      queryFn: () => userService.fetchUserProfile(userId), // Llama al servicio de API
      enabled: !!userId, // Solo ejecuta la query si hay un userId
    });
    ```
-   El `userService` hará la llamada real al backend: `GET /users/:userId`.
-   El hook debe devolver un estado claro para que el componente pueda renderizar los estados de carga, error o éxito.
-   Para el perfil del propio usuario (`/profile/me`), el `userId` puede ser un string especial o puedes tener un endpoint/hook dedicado `useMyProfile` que llame a `GET /auth/me`.

#### **b) Estructura Visual (MUI + Tailwind)**

1.  **`UserProfileCard.tsx` (Componente Principal):**
    -   Usa Tailwind CSS para un layout de tarjeta flexible y responsivo (`flex flex-col items-center ...`).
    -   Un `<Avatar>` de MUI, de gran tamaño.
    -   El nombre del usuario y un `@handle` con tipografía clara de Tailwind.
    -   Una breve biografía.
    -   Botones de acción:
        -   Si es el perfil de otro: "Añadir Conexión", "Enviar Mensaje".
        -   Si es el perfil propio: "Editar Perfil". Este botón abrirá el `EditProfileModal`.
2.  **`UserStats.tsx`:**
    -   Un componente visualmente atractivo que muestra **Ünits (moneda), Öndas (energía) y Mëritos (reputación)**.
    -   Puedes usar `Paper` o `Card` de MUI como base y Tailwind para el styling interno de cada stat (ícono + valor + nombre).
3.  **Sistema de Pestañas (MUI `Tabs`):**
    -   Usa el componente `Tabs` de MUI para organizar el contenido secundario.
    -   **Pestaña 1: Actividad:** Renderiza `ActivityFeed.tsx`, que podría tener su propio hook `useUserActivity(userId)`.
    -   **Pestaña 2: Logros:** Renderiza `AchievementsList.tsx`.
    -   **Pestaña 3: Inventario GMP:** Muestra los productos/servicios del usuario en el Marketplace.

#### **c) Edición del Perfil (Formulario y Mutación)**

1.  **`EditProfileModal.tsx`:**
    -   Un componente `Modal` de MUI.
2.  **Formulario (`React Hook Form` + `Zod`):**
    -   Dentro del modal, un formulario para editar campos como `displayName`, `bio`, `avatarUrl`.
    -   Define un `editProfileSchema` con Zod.
3.  **Mutación de Datos (`React Query`):**
    -   Crea un hook `useUpdateUserProfile`.
    -   Dentro, usa `useMutation`:
        ```typescript
        const mutation = useMutation({
          mutationFn: (updatedData) => userService.updateMyProfile(updatedData),
          onSuccess: (data) => {
            // Invalida la query del perfil para que se refresque con los nuevos datos
            queryClient.invalidateQueries({ queryKey: ['userProfile', 'me'] });
            // Muestra una notificación de éxito
          },
          onError: (error) => {
            // Muestra una notificación de error
          }
        });
        ```
    -   El `onSubmit` del formulario llamará a `mutation.mutate(formData)`.

### **4. ✅ Mandamientos para el Perfil de Usuario**

1.  **Mobile-First, Siempre:** El perfil debe verse impecable en un teléfono.
2.  **Visual y Atractivo:** Usa íconos, colores y espacios para que la información respire y sea fácil de digerir.
3.  **Carga Optimista (Opcional):** Para una mejor UX, al editar el perfil, puedes usar la actualización optimista de React Query para que la UI se actualice instantáneamente, antes de que el backend confirme el cambio.
4.  **Componentes Puros:** Mantén los componentes de la UI lo más puros posible. La lógica de datos vive en los hooks; la lógica de la UI, en los componentes.

---

> Aria, el Perfil de Usuario es donde la identidad digital de un Jugador toma forma y color. Haz que sea un lugar donde se sientan orgullosos de lo que son y lo que han contribuido. Que sea un verdadero Espejo del Alma. 
