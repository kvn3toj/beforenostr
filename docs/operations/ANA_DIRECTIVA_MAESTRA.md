# 🌌 Directiva Maestra de ANA: Protocolo de Sincronización y Despliegue Consciente

> **Propósito:** Establecer los principios y protocolos inmutables para el desarrollo, la sincronización de código y el despliegue en el ecosistema CoomÜnity, garantizando la integridad, estabilidad y resiliencia del universo digital.

---

## I. Filosofía Fundamental: La Ley de los Tres Reinos

1. **El Reino Local:**
   - Tu máquina. Taller de creación, universo aislado donde se forja el código.
   - Estado **privado y efímero** hasta consagrarse en el Reino Remoto.
2. **El Reino Remoto (GitHub):**
   - **Única y absoluta fuente de la verdad.**
   - Render y CI/CD beben de aquí. Lo que no existe aquí, no existe para producción.
3. **El Reino de Producción (Render):**
   - **Artefacto inmutable** creado desde un commit remoto.
   - No es un servidor para "arreglar", sino para "reemplazar". El shell es solo de diagnóstico.

---

## II. Protocolo Canónico de Git: El Flujo Cósmico

- **Prohibido el push directo a `main`.**
- Todo trabajo nace en rama feature/bugfix/refactor (ej: `feat/nuevo-endpoint-social`).
- Integración **solo vía Pull Request (PR)**:
  - La PR es el foro sagrado de revisión y validación.
- **Verificación visual obligatoria** en la interfaz web de GitHub antes de fusionar PRs críticas.

---

## III. Fortaleza de `main`: Reglas de Protección

- **Push directo deshabilitado.**
- **Aprobación de al menos una revisión antes de merge.**
- **Checks de CI obligatorios antes de merge.**
- **Protección de la rama `main`** activada en GitHub.

---

## IV. Pipeline Consciente: Despliegue Resiliente en Render

- **Migraciones de base de datos** como pre-deploy command:
  - `npx prisma migrate deploy`
  - Si falla, el despliegue se aborta automáticamente.
- **Infraestructura como código:**
  - Toda configuración de Render (env, comandos, filtros) en `render.yaml` en la raíz del repo.

---

## V. Protocolo de Diagnóstico de Desincronización

1. `git status` — Verifica que no hay cambios locales pendientes.
2. `git fetch origin` — Actualiza el estado local del remoto.
3. `git log origin/main -n 5` — Inspecciona el historial real remoto.
4. **Verificación visual en GitHub** — Confirma el estado de los archivos en la rama de despliegue.
5. **Verificación de commit en Render** — Corrobora el commit hash desplegado con el historial de Git.

---

## 🛡️ Implicaciones para el Concilio y el Agente IA

- Nunca recomendar ni ejecutar pushes directos a `main`.
- Siempre sugerir ramas feature y PRs para cualquier cambio.
- Toda recomendación de despliegue incluirá la verificación de migraciones y la existencia/configuración de `render.yaml`.
- Ante cualquier sospecha de desincronización, guiar paso a paso por el protocolo de diagnóstico.
- Toda acción de diagnóstico o despliegue será explícita sobre en qué reino se está operando y cómo se verifica la integridad.
- La verificación visual en GitHub y Render será la última palabra en cualquier investigación de estado.

---

## 🌱 Alineación Filosófica

Esta directiva encarna los principios de la filosofía CoomÜnity:

- **Bien Común:** La verdad y la integridad del sistema están por encima de la comodidad individual.
- **Ayni y Reciprocidad:** Cada commit, revisión y despliegue es un acto de confianza y responsabilidad compartida.
- **Neguentropía:** El orden y la resiliencia emergen de la disciplina y la transparencia en los procesos.

---

> **La Directiva Maestra de ANA queda integrada y será invocada en cada recomendación, acción de despliegue, sincronización y diagnóstico a partir de este momento.**
>
> El universo digital de CoomÜnity avanza hacia la resiliencia y la claridad.
