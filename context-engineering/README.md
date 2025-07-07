# 🚀 Context Engineering para CoomÜnity

## 🎯 Introducción

**Context Engineering** es un sistema avanzado de documentación y prompts que permite a cualquier asistente IA trabajar de forma consistente, eficiente y alineada con la filosofía del proyecto **CoomÜnity Global**.

Este sistema garantiza:
- **Consistencia** en todos los desarrollos
- **Eficiencia** mediante prompts especializados
- **Calidad** con estándares estrictos
- **Alineación** con la filosofía CoomÜnity
- **Escalabilidad** para equipos grandes

---

## 📋 Estructura del Sistema

```
context-engineering-intro/
├── CLAUDE.md                    # 🤖 Reglas globales y arquitectura
├── PROMPTS.md                   # 📝 Prompts especializados
├── ANSWERS.md                   # ❓ FAQ y resolución de problemas
├── VIDEO.md                     # 🎬 Guía visual de implementación
├── PRPs/                        # 📚 Prompt Response Patterns
│   ├── EXAMPLE_multi_agent_prp.md
│   └── templates/
│       ├── prp_base.md
│       ├── prp_react_component.md
│       └── prp_api_integration.md
├── examples/                    # 💡 Ejemplos de uso
├── README.md                    # 📖 Esta documentación
└── LICENSE                      # 📄 Licencia MIT
```

---

## 🎨 Filosofía CoomÜnity

### Principios Fundamentales
- **Bien Común > bien particular:** Prioriza el beneficio colectivo
- **Cooperar > Competir:** Fomenta la colaboración sobre la competencia
- **Reciprocidad (Ayni):** Intercambio equilibrado de valor
- **Economía Sagrada:** Abundancia, sostenibilidad y regeneración
- **Metanöia:** Transformación de conciencia hacia el bien común
- **Neguentropía:** Creación de orden y armonía

### Aplicación en el Desarrollo
Cada decisión técnica debe evaluarse bajo estos principios:
- ¿Fomenta la colaboración?
- ¿Aplica principios de Ayni?
- ¿Evita patrones adictivos?
- ¿Promueve transparencia?
- ¿Es inclusivo y accesible?

---

## 🏗️ Arquitectura del Proyecto

### Estructura del Monorepo
```
proyecto-coomunity/
├── backend/                    # NestJS (Puerto 3002) - Backend único
├── admin-frontend/             # React (Puerto 3000) - Gamifier Admin
├── Demo/apps/superapp-unified/ # React (Puerto 3001) - SuperApp Principal
└── shared/                     # Tipos y utilidades compartidas
```

### Stack Tecnológico Definitivo

#### Backend Compartido (Puerto 3002)
- **Framework:** NestJS 11+, TypeScript
- **Base de Datos:** PostgreSQL + Prisma ORM
- **Cache:** Redis
- **Autenticación:** JWT + RBAC
- **Logging:** Winston
- **Testing:** Jest

#### Frontend SuperApp (Puerto 3001)
- **Framework:** React 18+, TypeScript
- **UI:** Material UI v7 + Tailwind CSS
- **Estado:** Zustand + React Query
- **Testing:** Playwright + Vitest
- **Build:** Vite

#### Frontend Admin (Puerto 3000)
- **Framework:** React 18+, TypeScript
- **UI:** Material UI v7 (Design System)
- **Estado:** Zustand + React Query
- **Testing:** Playwright + Vitest

---

## 🚀 Inicio Rápido

### 1. Configuración Inicial

```bash
# Clonar el repositorio
git clone [repository-url]
cd context-engineering-intro

# Verificar estructura
ls -la
```

### 2. Protocolo Pre-flight Check

```bash
# Verificar procesos activos
ps aux | grep -E "(node|tsx|npm)" | grep -v grep

# Verificar conectividad del backend
curl http://localhost:3002/health -v

# Si el backend no responde, iniciarlo
cd backend/ && npm run dev
```

### 3. Iniciar Frontends

```bash
# SuperApp (Puerto 3001)
cd Demo/apps/superapp-unified/
npm run dev

# Admin (Puerto 3000) - en otra terminal
cd admin-frontend/
npm run dev
```

### 4. Verificar Funcionamiento

- Backend: http://localhost:3002/health
- SuperApp: http://localhost:3001
- Admin: http://localhost:3000

---

## 📚 Documentación Principal

### 🤖 [CLAUDE.md](./CLAUDE.md)
**Reglas globales y arquitectura definitiva**
- Filosofía y valores CoomÜnity
- Arquitectura final del sistema
- Patrones de código obligatorios
- Protocolo pre-flight check
- Estándares UI/UX
- Criterios de éxito

### 📝 [PROMPTS.md](./PROMPTS.md)
**Prompts especializados para diferentes tareas**
- Prompt de inicialización general
- Desarrollo de componentes React
- Desarrollo de hooks personalizados
- Integración con backend NestJS
- Testing y validación
- Debugging y resolución de problemas

### ❓ [ANSWERS.md](./ANSWERS.md)
**FAQ y resolución de problemas**
- Preguntas sobre arquitectura
- Stack tecnológico
- Patrones de desarrollo
- Integración backend-frontend
- Testing y validación
- Debugging común

### 🎬 [VIDEO.md](./VIDEO.md)
**Guía visual de implementación**
- Tutorial paso a paso
- Preparación del entorno
- Implementación de componentes
- Testing y validación
- Métricas de éxito

---

## 🎯 Prompt Response Patterns (PRPs)

### 📚 Templates Disponibles

#### 🎨 [React Component Development](./PRPs/templates/prp_react_component.md)
Para crear componentes React consistentes y alineados con la filosofía CoomÜnity.

**Uso:**
```
Necesito crear un componente VideoItemCard para mostrar videos.
[Usar el template PRP de React Component]
```

#### 🔌 [API Integration](./PRPs/templates/prp_api_integration.md)
Para integrar frontend con el backend NestJS de forma robusta.

**Uso:**
```
Necesito integrar la gestión de usuarios con el backend.
[Usar el template PRP de API Integration]
```

#### 📋 [Base Template](./PRPs/templates/prp_base.md)
Template base para crear nuevos PRPs específicos.

### Cómo Usar los PRPs

1. **Identifica tu tarea:** Desarrollo de componente, integración API, testing, etc.
2. **Selecciona el PRP apropiado:** Usa el template más específico para tu caso
3. **Personaliza el prompt:** Adapta el template a tu situación específica
4. **Ejecuta el patrón:** Sigue la estructura prompt → response → validación

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Crear Componente React

```markdown
**Prompt usando PRP React Component:**

Necesito crear un componente UserProfileCard para la SuperApp.

ESPECIFICACIONES:
- Muestra avatar, nombre, email, rol, mëritos
- Permite editar perfil (solo el propio usuario)
- Integra con backend para obtener/actualizar datos
- Responsive para mobile y desktop
- Debe fomentar reconocimiento mutuo

FILOSOFÍA:
- Transparencia en mëritos y contribuciones
- Facilita reconocimiento de otros usuarios
- Promueve colaboración a través del perfil
```

### Ejemplo 2: Integración API

```markdown
**Prompt usando PRP API Integration:**

Necesito integrar la gestión de proyectos colaborativos.

ESPECIFICACIONES:
- Endpoints: /projects (GET, POST), /projects/:id (GET, PUT, DELETE)
- Autenticación: JWT requerido
- Permisos: Creador puede editar, todos pueden ver
- Datos: id, title, description, collaborators, status, meritos
- Funcionalidades: Crear, listar, unirse, editar, completar

FILOSOFÍA:
- Fomenta colaboración transparente
- Reconoce contribuciones de todos
- Facilita formación de equipos
```

---

## 🧪 Testing y Validación

### Comandos de Validación

```bash
# Lint y formato
npm run lint
npm run format

# Testing
npm run test              # Tests unitarios
npm run test:e2e         # Tests E2E
npm run test:coverage    # Cobertura

# Build y verificación
npm run build
npm run type-check

# Validación completa
npm run preflight
```

### Criterios de Éxito

- ✅ **100% features implementadas** en primera iteración
- ✅ **95%+ cobertura de tests**
- ✅ **0 violaciones de arquitectura**
- ✅ **0 errores de TypeScript**
- ✅ **100% alineación con valores CoomÜnity**
- ✅ **Tiempo de carga < 3 segundos**

---

## 🔧 Herramientas y Utilidades

### Debugging
- **React DevTools:** Debugging de componentes
- **Network Tab:** Monitoreo de API calls
- **React Query DevTools:** Estado de queries
- **Prisma Studio:** Gestión de base de datos

### Development
- **VS Code Extensions:** TypeScript, Prettier, ESLint
- **Chrome DevTools:** Performance, Network, Console
- **Playwright:** Testing E2E automatizado
- **Postman:** Testing de APIs

---

## 📈 Métricas de Éxito

### Desarrollo
- **Tiempo de setup:** < 15 minutos
- **Tiempo de debugging:** Reducido 80%
- **Consistencia de código:** 100%
- **Velocidad de desarrollo:** Aumentada 3x

### Técnicas
- **Cobertura de tests:** 95%+
- **Tiempo de build:** < 2 minutos
- **Tiempo de carga:** < 3 segundos
- **Errores en producción:** < 0.1%

### Filosóficas
- **Alineación con valores:** 100%
- **Fomento de colaboración:** Medible en UI/UX
- **Transparencia:** Implementada en todas las funcionalidades
- **Inclusión:** Accesibilidad AAA

---

## 🤝 Contribución

### Cómo Contribuir

1. **Fork el repositorio**
2. **Crea una rama para tu feature:** `git checkout -b feature/nueva-funcionalidad`
3. **Sigue las reglas de CLAUDE.md**
4. **Usa los PRPs apropiados**
5. **Ejecuta tests:** `npm run test`
6. **Commit con mensaje descriptivo**
7. **Push y crea Pull Request**

### Estándares de Contribución

- **Código:** Sigue patrones de CLAUDE.md
- **Tests:** Mínimo 95% cobertura
- **Documentación:** Actualiza si es necesario
- **Filosofía:** Alineado con valores CoomÜnity

---

## 🆘 Soporte y Resolución de Problemas

### Problemas Comunes

#### Backend no responde
```bash
# Verificar estado
curl http://localhost:3002/health -v

# Reiniciar si es necesario
cd backend/ && npm run dev
```

#### Frontend no se conecta
```bash
# Verificar variables de entorno
echo $VITE_API_BASE_URL

# Debería ser: http://localhost:3002
```

#### Errores de TypeScript
```bash
# Verificar tipos
npm run type-check

# Limpiar cache si es necesario
rm -rf node_modules/.cache
```

### Recursos de Ayuda

- **ANSWERS.md:** FAQ detallado
- **CLAUDE.md:** Reglas y patrones
- **VIDEO.md:** Guía visual
- **Issues:** Reportar problemas en GitHub

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](./LICENSE) para más detalles.

---

## 🎯 Próximos Pasos

### Para Desarrolladores Nuevos
1. Lee **CLAUDE.md** completo
2. Revisa **ANSWERS.md** para dudas comunes
3. Practica con **ejemplos** del directorio
4. Usa **PRPs** para tareas específicas

### Para Equipos Existentes
1. Migra código existente usando **PRPs**
2. Implementa **protocolo pre-flight**
3. Actualiza **tests** según estándares
4. Documenta **patrones específicos**

### Para Contribuidores
1. Crea **nuevos PRPs** para casos específicos
2. Mejora **documentación** existente
3. Añade **ejemplos** de uso real
4. Optimiza **métricas** de éxito

---

## 🌟 Reconocimientos

Este sistema de Context Engineering está diseñado para servir al **Bien Común** y fomentar la **colaboración** en el desarrollo de software. Cada contribución es valorada y reconocida según los principios de **Ayni**.

**¡Gracias por contribuir a CoomÜnity y al desarrollo de una tecnología más consciente y colaborativa!**

---

*"En CoomÜnity, el código no solo funciona, sino que también sirve al bien común."*

---

## 📞 Contacto

- **Proyecto:** CoomÜnity Global
- **Documentación:** [Context Engineering Docs](./README.md)
- **Issues:** [GitHub Issues](https://github.com/[repo]/issues)
- **Filosofía:** [Valores CoomÜnity](./CLAUDE.md#filosofía-y-valores)

**¡Bienvenido a la revolución del desarrollo colaborativo y consciente!** 🚀