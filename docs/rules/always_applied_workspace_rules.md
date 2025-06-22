### **❌ PROHIBIDO:**

1.  **Comandos desde subdirectorios:**
    ```bash
    # ❌ NUNCA HACER ESTO:
    cd Demo/apps/superapp-unified/ && npm run dev
    cd backend/ && npm run dev
    ```

2.  **Múltiples procesos simultáneos:**
    ```bash
    # ❌ NUNCA ejecutar múltiples instancias
    npm run dev  # Ya ejecutándose
    npm run dev  # ❌ Segunda instancia causa conflictos
    ```

3.  **🆕 Iniciar backend sin dependencias críticas:**
    ```bash
    # ❌ NUNCA iniciar backend sin verificar PostgreSQL Y Redis
    npm run dev:backend  # Sin verificar brew services list | grep postgresql
    npm run dev:backend  # Sin verificar brew services list | grep redis
    ```

4.  **Mezclar archivos backend/frontend:**
    ```bash
    # ❌ NUNCA poner archivos React en:
    ./src/components/          # ❌ Es directorio de backend
    ./src/pages/              # ❌ Es directorio de backend
    ```

5.  **Ignorar limpieza de procesos:**
    ```bash
    # ❌ NUNCA iniciar sin limpiar:
    npm run dev  # Sin pkill previo causa conflictos
    ```

6.  **Usar solo Turborepo global:**
    ```bash
    # ❌ EVITAR: Solo instalación global (causa advertencias)
    # WARNING: No locally installed `turbo` found
    ```

7.  **🆕 Importaciones lazy loading incorrectas:**
    ```bash
    # ❌ NUNCA usar nombres que no coincidan con archivos reales
    import('../pages/UPlayPage')    # ❌ Si UPlay.tsx es el archivo real
    import('../pages/ProfilePage')  # ❌ Si Profile.tsx es el archivo real
    ```

8.  **🆕 Configuración incorrecta del compilador NestJS para Prisma:**
    ```bash
    # ❌ NUNCA olvidar configurar nest-cli.json para copiar generated/prisma
    # Asegurarse de que el outDir sea 'dist'
    # { "include": "generated/prisma/**/*", "outDir": "dist" }
    ```

9.  **🆕 Enviar comandos de inicio a segundo plano durante la depuración:**
    ```bash
    # ❌ NUNCA enviar a segundo plano npm run dev o cd backend/ && npm run dev
    # cuando se están diagnosticando problemas de inicio.
    # Siempre observar la salida completa.
    ```

### **✅ OBLIGATORIO:**

1.  **🆕 Siempre verificar dependencias críticas primero:**
    ```bash
    brew services list | grep postgresql  # Verificar PostgreSQL
    brew services list | grep redis       # Verificar Redis
    brew services start postgresql@15     # Iniciar PostgreSQL si es necesario
    brew services start redis            # Iniciar Redis si es necesario
    lsof -i :5432                        # Verificar conectividad PostgreSQL
    lsof -i :6379                        # Verificar conectividad Redis
    ```

2.  **Siempre verificar ubicación:**
    ```bash
    pwd  # Debe mostrar: /Users/kevinp/Movies/GAMIFIER-copy
    ```

3.  **Siempre limpiar procesos:**
    ```bash
    pkill -f "vite" && pkill -f "npm run dev" && pkill -f "turbo"
    ```

4.  **Instalar Turborepo localmente:**
    ```bash
    npm install turbo --save-dev --legacy-peer-deps
    npm ls turbo  # Verificar instalación local
    ```

5.  **Siempre usar workspace sintaxis:**
    ```bash
    npm run <script> --workspace=<nombre_del_paquete>
    ```

6.  **Siempre mantener separación arquitectónica:**
    ```bash
    # Backend: ./src/ - SOLO NestJS
    # Frontend: Demo/apps/superapp-unified/src/ - SOLO React
    ```

7.  **🆕 Verificar importaciones lazy loading:**
    ```bash
    ls Demo/apps/superapp-unified/src/pages/  # Verificar archivos reales
    # Mapear correctamente: UPlay.tsx → import('../pages/UPlay')
    ```

8.  **🆕 Observar la salida completa de los comandos de inicio:**
    ```bash
    # Al depurar problemas de inicio del backend, siempre ejecutar los comandos
    # en primer plano para ver los logs y errores completos.
    ``` 
