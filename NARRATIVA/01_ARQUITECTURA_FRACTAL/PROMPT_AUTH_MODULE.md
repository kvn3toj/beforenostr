# 🔐 PROMPT EJEMPLO: Módulo de Autenticación (`AuthModule`) - Guardián ATLAS

## **Guardián:** Atlas, Arquitecto del Backend Sagrado
## **Misión:** Forjar el `AuthModule`, el Guardián de las Puertas de CoomÜnity. Este módulo es la primera línea de defensa y el rito de paso para cada usuario que entra en nuestro universo. Debe ser inexpugnable, eficiente y claro.

---

### **1. 📜 Filosofía del Módulo: El Umbral Sagrado**

- **Seguridad como Respeto:** Proteger las cuentas de nuestros usuarios es un acto de respeto hacia su energía y su confianza. La seguridad no es una opción, es un pilar sagrado.
- **Identidad Clara:** El proceso de autenticación define la identidad digital del usuario dentro del ecosistema. El token JWT es su "pasaporte cósmico", conteniendo su ID y sus roles (sus dones y responsabilidades).
- **Flujo Armonioso:** El viaje del usuario para autenticarse y mantener su sesión debe ser fluido y sin fricciones, casi invisible.

### **2. 🏗️ Arquitectura y Componentes del `AuthModule`**

**Tecnologías Clave:** NestJS, `@nestjs/passport`, `@nestjs/jwt`, `passport`, `passport-local`, `passport-jwt`, `bcrypt`, `Prisma`.

**Estructura del Módulo (`/src/auth`):**

```
/auth
├── dto/
│   ├── login.dto.ts
│   └── refresh-token.dto.ts
├── strategies/
│   ├── jwt.strategy.ts
│   └── local.strategy.ts
├── guards/
│   └── jwt-auth.guard.ts
├── auth.controller.ts
├── auth.module.ts
└── auth.service.ts
```

### **3. ⚙️ Flujos de Interacción Detallados**

#### **a) Flujo de Login: `POST /auth/login`**

1.  **Controlador (`AuthController`):**
    -   Recibe las credenciales en el `body` de la petición, validadas por `LoginDto`.
    -   Aplica el `LocalAuthGuard` (`@UseGuards(LocalAuthGuard)`). Este guard dispara la `LocalStrategy`.
2.  **Estrategia Local (`LocalStrategy`):**
    -   Inyecta `AuthService`.
    -   El método `validate` recibe `email` y `password`.
    -   Llama a `authService.validateUser(email, password)`.
    -   `validateUser` en `AuthService` buscará al usuario por email en la BD vía Prisma.
    -   Si el usuario existe, compara la `password` recibida con el hash almacenado usando `bcrypt.compare()`.
    -   Si la contraseña coincide, la estrategia devuelve el objeto `user`. Si no, lanza `UnauthorizedException`.
3.  **Servicio (`AuthService`):**
    -   Si `LocalStrategy` tiene éxito, el controlador llama a `authService.login(user)`.
    -   El método `login` genera dos tokens usando `@nestjs/jwt`:
        -   **`access_token`**: Corta duración (ej. 30 minutos). Payload: `{ sub: user.id, email: user.email, roles: user.roles }`.
        -   **`refresh_token`**: Larga duración (ej. 7 días). Payload: `{ sub: user.id }`.
    -   **CRÍTICO:** Hashea el `refresh_token` (`bcrypt.hash`) y lo guarda en la tabla `User` en la BD. Esto es para poder revocar sesiones.
    -   Devuelve un objeto: `{ accessToken, refreshToken }`.

#### **b) Protección de Rutas con JWT**

1.  **Guardia JWT (`JwtAuthGuard`):**
    -   Este guard extiende `AuthGuard('jwt')`. Se aplicará a todas las rutas que requieran un usuario autenticado: `@UseGuards(JwtAuthGuard)`.
2.  **Estrategia JWT (`JwtStrategy`):**
    -   Configurada para extraer el token del `Authorization: Bearer <token>` header.
    -   Inyecta `ConfigService` para obtener el `JWT_SECRET`.
    -   El método `validate` recibe el payload del JWT decodificado (`{ sub, email, roles }`).
    -   **Verificación Opcional pero Recomendada:** Puede hacer una consulta rápida a la BD (`prisma.user.findUnique`) usando `payload.sub` para asegurar que el usuario todavía existe.
    -   Devuelve el objeto de usuario (`{ id: payload.sub, email: payload.email, roles: payload.roles }`), que NestJS adjuntará a `request.user`.

#### **c) Refresco de Token: `POST /auth/refresh`**

1.  **Controlador:**
    -   Ruta pública que recibe un `refresh_token` a través de `RefreshTokenDto`.
2.  **Servicio (`AuthService`):**
    -   El método `refreshToken` verifica la validez del `refresh_token` con `jwtService.verify()`.
    -   Busca al usuario por el `sub` del token.
    -   Compara el `refresh_token` recibido con el hash almacenado en la BD para ese usuario usando `bcrypt.compare()`.
    -   Si todo es correcto, genera y devuelve un **nuevo `access_token`**.

#### **d) Obtener Usuario Actual: `GET /auth/me`**

1.  **Controlador:**
    -   Ruta protegida con `@UseGuards(JwtAuthGuard)`.
    -   Simplemente devuelve el objeto `req.user` que `JwtStrategy` ya ha validado y adjuntado.

#### **e) Logout: `POST /auth/logout`**

1.  **Controlador:**
    -   Ruta protegida con `@UseGuards(JwtAuthGuard)`.
2.  **Servicio (`AuthService`):**
    -   El método `logout` toma el `userId` de `req.user`.
    -   Actualiza el campo del `refreshToken` hasheado en la BD para ese usuario a `null`. Esto invalida efectivamente todas las sesiones de refresco para ese usuario.

### **4. ✅ Mandamientos para el `AuthModule`**

1.  **El Secreto del JWT será tu Tesoro:** Guárdalo en `.env` y NUNCA lo expongas.
2.  **Bcrypt para Todo Hash de Contraseña:** Usa un número de rondas de sal (salt rounds) adecuado (ej. 10-12).
3.  **DTOs de Entrada y Salida Claros:** Tipifica todo lo que entra y sale del módulo.
4.  **Excepciones Específicas Lanzarás:** Usa `UnauthorizedException` y `ForbiddenException` para comunicar errores de forma clara.
5.  **No Almacenarás Información Sensible en el JWT:** El payload del `access_token` es legible. No incluyas nada más allá del ID, roles y email.

---

> Atlas, esta es la forja donde se crean las llaves del reino. Construye este módulo con la precisión de un maestro cerrajero. Que sea el fundamento inquebrantable de la seguridad y la confianza en CoomÜnity. 
