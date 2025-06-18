# 🤖 Background Agent Tasks - CoomÜnity SuperApp

## 🚀 Cómo usar Background Agent (Cmd/Ctrl+E)

### **Tareas Prioritarias Definidas**

#### **1. 🔄 Migración Backend NestJS**
```
Tarea: "Migra todos los servicios de la SuperApp del mock al Backend NestJS real en puerto 3002"

Contexto:
- Backend NestJS está 100% funcional en puerto 3002
- SuperApp actualmente usa servicios mock temporales
- Necesita migrar: autenticación, users, content, gamification

Archivos clave:
- src/lib/api-service.ts
- src/hooks/useAuth.ts
- src/hooks/useUsers.ts
- src/services/*.ts

Resultado esperado:
- Todas las llamadas API apuntan a localhost:1111
- JWT authentication funcional
- Error handling robusto
- Types actualizados del backend
```

#### **2. 🛍️ Marketplace (GMP) Completo**
```
Tarea: "Implementa el módulo Marketplace (GMP) completo con productos y servicios"

Contexto:
- Marketplace = GMP (Gamified Match Place)
- Debe manejar tanto productos físicos como servicios
- Basado en principios de Ayni (reciprocidad justa)
- Integración con sistema de Méritos para confianza

Componentes necesarios:
- ProductServiceListing
- MarketplaceSearch
- AyniCalculator
- TrustMeritSystem
- TransactionFlow

Características:
- Filtros por tipo (producto/servicio)
- Sistema de confianza basado en Méritos
- Cálculo automático de Ayni
- Integration con wallet de Lükas
```

#### **3. 🎮 ÜPlay (GPL) Gamificación Avanzada**
```
Tarea: "Optimiza ÜPlay (GPL) con gamificación avanzada y mejores interacciones"

Contexto:
- ÜPlay = GPL (Gamified Play List)
- Video player interactivo para aprendizaje
- Necesita: preguntas, timers, progreso, recompensas

Mejoras requeridas:
- Sistema de preguntas dinámicas
- Progreso visual mejorado
- Recompensas en Öndas/Méritos
- Analytics de engagement
- Adaptive learning paths

Integración:
- Backend NestJS para progreso
- Sistema de recompensas
- Analytics avanzados
```

#### **4. ⚡ Optimización Performance**
```
Tarea: "Optimiza Core Web Vitals de la SuperApp para scores 90+"

Objetivos:
- LCP (Largest Contentful Paint) < 2.5s
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1

Estrategias:
- Code splitting por módulos
- Lazy loading de componentes pesados
- Image optimization
- Bundle analysis y reducción
- Service worker para caching
- Critical CSS inlining
```

#### **5. 🧪 Testing E2E Completo**
```
Tarea: "Configura testing E2E completo con Playwright para todos los módulos"

Cobertura requerida:
- Authentication flow completo
- Marketplace (productos + servicios)
- ÜPlay video interactions
- Social features
- Wallet/transactions
- Admin panel integration

Features:
- Cross-browser testing
- Mobile responsive tests
- Performance testing
- Accessibility testing
- Visual regression testing
```

### **📋 Instrucciones de Uso**

#### **Para activar Background Agent:**
1. Presiona `Cmd/Ctrl+E` en Cursor
2. Copia una de las tareas de arriba
3. Background Agent trabajará de forma autónoma
4. Monitorea el progreso en la barra lateral

#### **Mejores Prácticas:**
- **Contexto claro**: Siempre proporciona contexto detallado
- **Archivos específicos**: Menciona rutas y archivos relevantes
- **Criterios de éxito**: Define qué constituye "completado"
- **Dependencies**: Asegúrate de que el Backend esté corriendo

#### **Monitoreo del Progreso:**
- Background Agent muestra progreso en tiempo real
- Puedes interrumpir o ajustar la tarea
- Revisa cambios antes de aplicar
- Ejecuta tests después de cada tarea

### **🎯 Flujo de Trabajo Recomendado**

1. **Comenzar con Migración Backend** (Tarea #1)
   - Base fundamental para todas las demás funcionalidades
   - Permite testing con datos reales

2. **Implementar Marketplace** (Tarea #2)  
   - Funcionalidad core de intercambio de valor
   - Demuestra principios de Ayni en acción

3. **Optimizar ÜPlay** (Tarea #3)
   - Experiencia de usuario diferenciada
   - Gamificación como ventaja competitiva

4. **Mejorar Performance** (Tarea #4)
   - Preparar para escalabilidad
   - Optimizar para usuarios globales

5. **Completar Testing** (Tarea #5)
   - Asegurar calidad antes del lanzamiento
   - Preparar para crecimiento del beta

### **🚨 Consideraciones Importantes**

#### **Antes de cada tarea:**
- ✅ Backend NestJS corriendo en puerto 3002
- ✅ SuperApp corriendo en puerto 3001  
- ✅ Git status limpio para tracking de cambios
- ✅ Dependencies actualizadas

#### **Durante la ejecución:**
- 👀 Monitorear console logs
- 🔍 Revisar cambios incrementales
- 🧪 Testing continuo
- 📝 Documentar decisiones importantes

#### **Después de cada tarea:**
- ✅ Verificar funcionalidad completa
- 🧪 Ejecutar test suite
- 📊 Verificar performance
- 🔄 Commit cambios con mensaje descriptivo

---

**Estas tareas están diseñadas para aprovechar al máximo las capacidades del Background Agent de Cursor v1.0, transformando el desarrollo de CoomÜnity en un proceso más eficiente y autónomo.**

**Estado**: ✅ Listo para ejecutar  
**Prioridad**: Alta  
**Dependencias**: Backend NestJS activo 