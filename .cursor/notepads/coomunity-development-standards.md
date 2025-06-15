# 📋 ESTÁNDARES DE DESARROLLO COOMUNITY

## 🏗️ **ARQUITECTURA MONOREPO**

### **Estructura Obligatoria**
```
/Users/kevinp/Movies/GAMIFIER copy/  # ← RAÍZ OBLIGATORIA
├── backend/                         # NestJS (Puerto 3002)
├── admin-frontend/                  # Admin React (Puerto 3000)  
├── Demo/apps/superapp-unified/      # SuperApp React (Puerto 3001)
├── package.json                     # Orquestador Turborepo
└── turbo.json                       # Configuración Turborepo
```

### **Separación Estricta**
- **Backend**: `./src/` → SOLO NestJS (controllers, services, modules)
- **SuperApp**: `Demo/apps/superapp-unified/src/` → SOLO React
- **Admin**: `admin-frontend/src/` → SOLO React

---

## 🎮 **COMANDOS CANÓNICOS**

### **REGLA DE ORO**: Siempre desde la raíz del monorepo

```bash
# ✅ DESARROLLO
turbo run dev                        # Ecosistema completo
npm run dev:backend                  # Backend solo
npm run dev:superapp                 # SuperApp solo

# ✅ TESTING  
npm run test:e2e --workspace=coomunity-superapp

# ✅ PRE-FLIGHT CHECK
pwd  # Debe mostrar: /Users/kevinp/Movies/GAMIFIER copy
pkill -f "vite" && pkill -f "npm run dev"
lsof -i :3001,3002 || echo "Puertos libres ✅"
```

---

## 🧠 **FILOSOFÍA COOMUNITY**

### **Principios Fundamentales**
- **Ayni**: Reciprocidad equilibrada en intercambios
- **Bien Común**: Beneficio colectivo > individual  
- **Mëritos**: Recompensas por contribuir al bien común
- **Lükas**: Moneda interna para intercambio de valor
- **Öndas**: Energía vibracional por contribuciones positivas

### **Aplicación en Código**
```typescript
// ✅ Ejemplo: Lógica de Ayni en transacciones
interface AyniTransaction {
  giver: User;
  receiver: User;
  value: number;
  reciprocityBalance: number; // Debe tender a 0
}

// ✅ Ejemplo: UI que promueve Bien Común
<Button 
  variant="contained" 
  color="primary"
  onClick={contributeToCommonGood}
>
  Contribuir al Bien Común (+Mëritos)
</Button>
```

---

## 🔒 **AUTENTICACIÓN Y CREDENCIALES**

### **Credenciales Verificadas**
```typescript
// Para desarrollo y testing
const DEV_CREDENTIALS = {
  admin: { email: 'admin@gamifier.com', password: 'admin123' },
  user: { email: 'user@gamifier.com', password: '123456' },
  premium: { email: 'premium@gamifier.com', password: '123456' }
};

// Configuración obligatoria
VITE_ENABLE_MOCK_AUTH=false
```

### **Storage Keys Canónicos**
```typescript
const AUTH_STORAGE_KEYS = {
  TOKEN: 'COOMUNITY_AUTH_TOKEN',
  USER_DATA: 'COOMUNITY_USER_DATA'
};
```

---

## 🎯 **MÓDULOS ESPECÍFICOS**

### **ÜPlay (GPL - Gamified Play List)**
- **Propósito**: Reproductor de video interactivo gamificado
- **Características**: Preguntas, temporizadores, elementos gamificados
- **Puerto**: 3001 (dentro de SuperApp)

### **Marketplace (GMP - Gamified Match Place)**  
- **Propósito**: Plataforma de intercambio de valor
- **Incluye**: Productos Y servicios (no solo uno)
- **Principio**: Implementar lógica de Ayni

### **Social Module**
- **Propósito**: Interacciones sociales y colaboración
- **Incluye**: Perfiles, mensajería, engagement comunitario

### **UStats Module**
- **Propósito**: Estadísticas y analytics
- **Incluye**: Métricas de usuario, tracking de progreso

---

## 🔧 **STACK TECNOLÓGICO**

### **Backend (Puerto 3002)**
```json
{
  "framework": "NestJS",
  "language": "TypeScript", 
  "database": "PostgreSQL",
  "orm": "Prisma",
  "cache": "Redis",
  "auth": "JWT + RBAC"
}
```

### **SuperApp (Puerto 3001)**
```json
{
  "framework": "React 18+",
  "language": "TypeScript",
  "ui": ["Material UI v7", "Tailwind CSS"],
  "state": ["React Query", "Zustand"],
  "testing": "Playwright 1.53.0",
  "build": "Vite"
}
```

---

## ✅ **CHECKLIST DE CALIDAD**

### **Antes de Commit**
- [ ] Código ejecutado desde raíz del monorepo
- [ ] Principios CoomÜnity integrados
- [ ] Credenciales verificadas usadas
- [ ] Tests E2E pasando
- [ ] Separación arquitectónica respetada
- [ ] Puertos correctos (3001/3002)
- [ ] Sin procesos múltiples

### **Patrones Obligatorios**
- [ ] Componentes funcionales únicamente
- [ ] Hooks personalizados para lógica reutilizable  
- [ ] React Query para llamadas API
- [ ] Context API para estado global
- [ ] MUI con `sx` prop (no styled-components)
- [ ] Loading/Error/Empty states obligatorios

---

## 🚨 **ERRORES CRÍTICOS A EVITAR**

### **❌ NUNCA HACER**
```bash
# ❌ Comandos desde subdirectorios
cd Demo/apps/superapp-unified/ && npm run dev

# ❌ Múltiples procesos simultáneos  
npm run dev  # Ya ejecutándose
npm run dev  # ❌ Causa conflictos

# ❌ Mezclar archivos backend/frontend
./src/components/  # ❌ Es directorio de backend
```

### **✅ SIEMPRE HACER**
```bash
# ✅ Verificar ubicación
pwd  # Debe ser raíz

# ✅ Limpiar procesos
pkill -f "vite" && pkill -f "npm run dev"

# ✅ Usar workspace sintaxis
npm run <script> --workspace=<nombre>
```

---

**Estos estándares aseguran desarrollo consistente, eficiente y alineado con la filosofía CoomÜnity.** 