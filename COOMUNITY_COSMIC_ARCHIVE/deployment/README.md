# 🚀 DOCUMENTACIÓN CENTRAL DE DESPLIEGUE - COOMUNITY

**Bienvenido/a al centro de comando para todo lo relacionado con el despliegue y la infraestructura de CoomÜnity.**

Este directorio contiene toda la documentación estratégica, táctica y técnica necesaria para desplegar, mantener y escalar la plataforma CoomÜnity de manera eficiente y sostenible.

---

## 🗺️ **Índice de Documentación**

Aquí tienes un mapa de los documentos clave y su propósito. Están organizados por categorías para facilitar su consulta.

### 🏛️ **1. Estrategia (`/strategy`)**

Documentos de alto nivel que definen el "porqué" y el "cómo" de nuestra infraestructura.

- **[📄 01_platform_analysis.md](./strategy/01_platform_analysis.md)**
  - **Propósito:** Análisis y justificación de por qué elegimos **Vercel para el Frontend y Railway para el Backend/DB**. Lectura obligatoria para entender nuestra arquitectura de despliegue.
  - **Cuándo usarlo:** Al incorporar nuevos miembros al equipo o al re-evaluar nuestra arquitectura en el futuro.

- **[📄 02_cost_analysis.md](./strategy/02_cost_analysis.md)**
  - **Propósito:** Un desglose detallado de los costos proyectados, desde el tier gratuito hasta la escala de 10,000 usuarios.
  - **Cuándo usarlo:** Para planificación de presupuesto y para tomar decisiones sobre cuándo actualizar a planes de pago.

---

### 📈 **2. Fases de Despliegue (`/phases`)**

Planes de acción concretos para cada etapa de nuestro crecimiento.

- **[📄 01_prelaunch_plan.md](./phases/01_prelaunch_plan.md)**
  - **Propósito:** Plan detallado para la Fase 1 (0-100 usuarios), utilizando los tiers gratuitos de Vercel y Railway. Incluye cronograma, KPIs y criterios de éxito.
  - **Cuándo usarlo:** Como la hoja de ruta principal durante el pre-lanzamiento y la beta cerrada.

- **[📄 (Próximamente) 02_scaling_plan.md](./phases/02_scaling_plan.md)**
  - **Propósito:** Estrategia para escalar de 100 a 10,000 usuarios, incluyendo la transición a planes "Pro", optimizaciones de base de datos y monitoreo avanzado.
  - **Cuándo usarlo:** Cuando nos preparemos para el lanzamiento público.

---

### 🛠️ **3. Guías y Soluciones (`/guides`)**

Manuales técnicos para resolver problemas específicos.

- **[📄 railway_resolution_guide.md](./guides/railway_resolution_guide.md)**
  - **Propósito:** Una guía paso a paso, exhaustiva y probada, para diagnosticar y solucionar cualquier problema de despliegue con nuestro backend NestJS en Railway.
  - **Cuándo usarlo:** **Es el primer documento a consultar si el despliegue del backend falla.**

---

### 🤖 **4. Automatización (`/automation`)**

Herramientas y scripts para hacer nuestra vida más fácil.

- **[📄 resolve_railway_deployment.sh](./automation/resolve_railway_deployment.sh)**
  - **Propósito:** Un script de shell que aplica automáticamente las correcciones más comunes a los problemas de despliegue de Railway.
  - **Cuándo usarlo:** Para intentar una solución rápida y automatizada antes de sumergirse en la guía de resolución manual.

- **[📄 background_agent_prompt.md](./automation/background_agent_prompt.md)**
  - **Propósito:** Un prompt detallado y optimizado para ser utilizado por un agente de IA (como yo) para diagnosticar y generar soluciones a problemas de despliegue complejos.
  - **Cuándo usarlo:** Como una herramienta para acelerar el soporte y la resolución de problemas de DevOps.

---

## 🔄 **Flujo de Trabajo Recomendado**

- **¿Nuevo en el proyecto?** Empieza por la sección de **Estrategia**.
- **¿Desplegando por primera vez?** Sigue el **Plan de Prelanzamiento**.
- **¿El backend falló?** Usa el **script de automatización** primero, y si no funciona, sigue la **guía de resolución de Railway**.
- **¿Necesitas planificar el presupuesto?** Consulta el **Análisis de Costos**.

*Este documento debe mantenerse vivo. Por favor, actualízalo a medida que nuestra arquitectura y procesos evolucionan.* 