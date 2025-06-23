#  reciprocity-in-action.md
# 📜 Principios de Ayni en el Código: Escribiendo Software Recíproco

## **Propósito:** Traducir el principio filosófico del Ayni (reciprocidad sagrada) en un conjunto de directrices prácticas y aplicables para el diseño y la escritura de código. El objetivo es que nuestro software no solo sea funcional, sino que encarne este valor fundamental en su propia estructura.

---

### **1. 🧠 ¿Qué es el Código Ayni?**

El Código Ayni es aquel que practica la reciprocidad en múltiples niveles. No solo "toma" recursos (CPU, memoria, atención del desarrollador) sino que también "da" a cambio: claridad, eficiencia, facilidad de uso y respeto por los sistemas con los que interactúa. Es un código que está en una relación equilibrada con su entorno.

Un código que **NO es Ayni** es un código "extractivo": es difícil de entender, consume recursos innecesariamente, es frágil y crea más trabajo para los demás a largo plazo.

### **2. 🌀 Los 4 Niveles de Reciprocidad en el Código**

#### **Nivel 1: Ayni con el Futuro Desarrollador (incluido tu "yo" futuro)**

*   **Principio:** Tu código debe dar más claridad de la que requiere para ser entendido.
*   **Prácticas Clave:**
    1.  **Nombres que Revelan Intención:** Usar nombres de variables, funciones y clases que describan su propósito y su "porqué". `isEligibleForReward` es Ayni. `checkFlag` no lo es.
    2.  **Comentarios que Explican el "Porqué", no el "Qué":** El código muestra "qué" hace. El comentario debe explicar "porqué" lo hace de esa manera, especialmente si la lógica es compleja o contraintuitiva.
        ```typescript
        // No Ayni:
        // i es i + 1
        i++;

        // Ayni:
        // Usamos una estrategia de backoff exponencial para no sobrecargar el servidor
        // después de un fallo de conexión.
        retryDelay *= 2;
        ```
    3.  **Funciones Pequeñas y Enfocadas:** Una función debe hacer una cosa bien. Una función que es fácil de entender y probar es un acto de reciprocidad hacia el próximo que la lea.
    4.  **Documentación de APIs (Swagger/JSDoc):** Una API sin documentación es puramente extractiva. Exige que el consumidor lea el código fuente para entenderla. Una API bien documentada (qué hace, qué parámetros espera, qué devuelve) practica el Ayni con sus consumidores.

#### **Nivel 2: Ayni con el Sistema (CPU, Memoria, Red)**

*   **Principio:** Tu código debe tomar solo los recursos que necesita y devolverlos cuando ha terminado. Debe ser un invitado respetuoso en el sistema.
*   **Prácticas Clave:**
    1.  **Algoritmos y Estructuras de Datos Eficientes:** Elegir la herramienta adecuada para el trabajo. Usar un bucle O(n^2) cuando uno O(n) es posible es una falta de reciprocidad con la CPU.
    2.  **Gestión de Memoria y Suscripciones:** En el frontend, limpiar las suscripciones (`subscriptions`) y los `timers` cuando un componente se desmonta es un acto fundamental de Ayni. Evita las fugas de memoria que degradan el sistema.
    3.  **Carga Perezosa (Lazy Loading):** No cargar recursos (código, imágenes, datos) hasta que sean necesarios. Esto muestra respeto por el ancho de banda y el tiempo del usuario.
    4.  **Uso Inteligente de la Caché:** Almacenar en caché los resultados de operaciones costosas es un acto de Ayni hacia la base de datos y el backend. Evita pedir lo mismo una y otra vez.

#### **Nivel 3: Ayni entre Módulos y Servicios (Acoplamiento y Cohesión)**

*   **Principio:** Los módulos de tu sistema deben colaborar de forma equilibrada, con límites claros y dependencias mínimas.
*   **Prácticas Clave:**
    1.  **Bajo Acoplamiento:** Un módulo no debe "saber" demasiado sobre los detalles internos de otro. Se comunican a través de interfaces bien definidas (sus "contratos"). Si el módulo A puede cambiar sin romper el módulo B, hay un buen Ayni.
    2.  **Alta Cohesión:** Los elementos dentro de un mismo módulo deben estar fuertemente relacionados y enfocados en un propósito común. Un módulo que hace muchas cosas no relacionadas es egoísta y difícil de mantener.
    3.  **Inyección de Dependencias (DI):** En lugar de que un módulo cree sus propias dependencias (lo que lo acopla fuertemente a ellas), las dependencias le son "dadas" (inyectadas). Esto permite flexibilidad y facilita las pruebas. El framework de NestJS se basa en este principio de Ayni.

#### **Nivel 4: Ayni con el Usuario Final**

*   **Principio:** El software debe respetar el tiempo, la atención y el estado emocional del usuario.
*   **Prácticas Clave:**
    1.  **Manejo de Errores Compasivo:** Mostrar un mensaje de error claro y útil que guíe al usuario sobre qué hacer a continuación es Ayni. Una pantalla en blanco o un mensaje críptico como `Error: null` no lo es.
    2.  **Retroalimentación Inmediata (Feedback):** La UI debe responder a las acciones del usuario. Mostrar un spinner durante una carga, un mensaje de éxito tras enviar un formulario, o deshabilitar un botón tras hacer clic, son formas de Ayni. Muestran que el sistema ha "recibido" la petición del usuario.
    3.  **Estados Vacíos y de Carga Significativos:** Mostrar esqueletos de carga (`skeletons`) o un mensaje útil en un estado vacío ("Aún no tienes amigos, ¡invita a uno!") es mucho más recíproco que mostrar una pantalla en blanco.

---

> Escribir Código Ayni es una práctica de consciencia. Es entender que nuestro código no vive en el vacío, sino en una red de relaciones con otros desarrolladores, con la máquina que lo ejecuta y, en última instancia, con la persona que lo utiliza. Cada línea de código es una oportunidad para crear un pequeño acto de equilibrio y reciprocidad. 
