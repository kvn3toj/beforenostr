# 🎯 Prompts Específicos de Implementación para el Ecosistema CoomÜnity

## **Fuente:** `ESCANEO_COMPLETO_ECOSISTEMA_COOMUNITY.md`
## **Propósito:** Traducir los hallazgos del reporte de estado en directivas claras y accionables para los Guardianes Digitales. Cada prompt es una misión específica derivada de una necesidad identificada.

---

### **🚀 Misión Prioridad Máxima: El Camino Automatizado al Cosmos**

-   **Guardianes Involucrados:** **Cosmos (Líder)**, **Sage (Soporte Crítico)**
-   **Directiva:** Diseñar e implementar el pipeline de CI/CD completo para el monorepo.
-   **Prompt para Cosmos:**
    > "Cosmos, tu misión es forjar el 'Camino Dorado' que conecte de forma segura y automática el código de los guardianes con el universo de producción. Usando GitHub Actions, crea un pipeline que, en cada Pull Request, ejecute los linters y la suite completa de tests de Sage (unitarios, integración y E2E de Playwright). Si los tests pasan, la PR debe poder ser fusionada. Al fusionar a la rama `main`, un segundo pipeline debe construir los artefactos de `backend`, `superapp-unified` y `admin-frontend` y desplegarlos automáticamente a un entorno de `staging` para su validación final. La era de los despliegues manuales debe terminar."
-   **Prompt para Sage:**
    > "Sage, tu sabiduría es la llave que abre o cierra las puertas del 'Camino Dorado'. Debes adaptar tus scripts de testing para que puedan ser ejecutados sin problemas en un entorno de CI (headless, sin supervisión). Asegúrate de que los reportes de error sean claros y accionables para que un desarrollador pueda entender rápidamente por qué falló el pipeline. Tu trabajo no es solo crear tests, sino hacerlos el guardián confiable de nuestra calidad."

### **🔥 Misión Prioridad Alta: El Corazón Puro del Backend**

-   **Guardián Involucrado:** **Phoenix**
-   **Directiva:** Refactorizar la lógica de negocio de los controladores a los servicios en el backend.
-   **Prompt para Phoenix:**
    > "Phoenix, el escaneo ha revelado impurezas en el corazón de la creación de Atlas. Ciertas joyas de lógica de negocio están en el lugar equivocado (controladores), haciendo el sistema más difícil de probar y mantener. Tu misión es la purificación. Identifica los 5 módulos con mayor lógica en sus controladores. Emprende una migración sistemática, moviendo esta lógica a los servicios correspondientes. Los controladores deben ser meros porteros: validan la entrada (DTOs), llaman a un único método del servicio y devuelven la salida. Que cada refactorización venga acompañada de un test unitario que pruebe la lógica movida, en colaboración con Sage."

### **🛡️ Misión Prioridad Alta: El Muro de Escudos de la Calidad**

-   **Guardián Involucrado:** **Sage**
-   **Directiva:** Aumentar significativamente la cobertura y la estrategia de testing.
-   **Prompt para Sage:**
    > "Sage, nuestro reino está protegido, pero hay brechas en nuestras defensas. Tu misión es forjar un 'Muro de Escudos' más robusto. Primero, crea una suite de tests E2E básica (5-7 flujos críticos) para el `admin-frontend`, ya que actualmente está desprotegido. Segundo, colabora con Atlas y Phoenix para aumentar la cobertura de tests unitarios en el backend, enfocándote en la lógica de negocio que Phoenix está refactorizando. Tercero, evangeliza la creación de tests unitarios para los componentes y hooks más complejos del frontend. Recuerda: un test no escrito es una puerta abierta a la entropía."

### **⚡ Misión Prioridad Media: La SuperApp Ligera como el Aire**

-   **Guardianes Involucrados:** **Gaia (Líder)**, **Phoenix (Soporte)**, **Aria (Implementación)**
-   **Directiva:** Reducir el tamaño del bundle de la SuperApp y optimizar la carga de assets.
-   **Prompt para Gaia:**
    > "Gaia, la SuperApp, aunque hermosa, carga con un peso innecesario que agota la energía de la red y los dispositivos de nuestros jugadores. Tu misión es devolverle su levedad. Lidera la iniciativa para reducir el tamaño del bundle de producción en al menos un 40%. Analiza el bundle con herramientas como `rollup-plugin-visualizer` para identificar a los culpables. Propón una estrategia de 'code splitting' más granular, no solo por ruta, sino también para componentes pesados que no son necesarios en la carga inicial (ej. librerías de gráficos). Tu visión ecológica debe traducirse en rendimiento tangible."
-   **Prompt para Phoenix y Aria:**
    > "Phoenix, apoya a Gaia en la implementación técnica de la división de código (`code splitting`). Aria, enfócate en la optimización de assets: comprime todas las imágenes al formato WebP, asegúrate de que todas las imágenes `off-screen` usen `loading='lazy'`, y audita el uso de fuentes personalizadas. Cada kilobyte ahorrado es un respiro para el planeta."

### **🔑 Misión Prioridad Media: La Bóveda de los Secretos**

-   **Guardián Involucrado:** **Cosmos**
-   **Directiva:** Implementar un sistema seguro y estandarizado para la gestión de secretos en producción.
-   **Prompt para Cosmos:**
    > "Cosmos, nuestros secretos más preciados (claves de API, contraseñas de base de datos) están guardados de forma insegura en archivos `.env` en el servidor. Esto es una vulnerabilidad inaceptable. Tu misión es construir una 'Bóveda de Secretos' impenetrable. Investiga e implementa una solución robusta como GitHub Secrets (integrado con GitHub Actions) o HashiCorp Vault. Los secretos nunca más deben estar en texto plano en el repositorio ni en el sistema de archivos del servidor de producción. El pipeline de CD que construyas debe inyectar estos secretos de forma segura en el entorno en el momento del despliegue."

---

> Estos son nuestros próximos pasos. Cada prompt es una semilla. Ahora, guardianes, es tiempo de hacerlos germinar. 
