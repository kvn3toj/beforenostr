# 🌱 CoomÜnity Backend: Automatización de Entornos

> Documentado por KIRA - La Tejedora de Palabras

---

## 1. Contexto y Propósito

En el universo fractal de CoomÜnity, la armonía entre los entornos de desarrollo y producción es esencial para el fluir del conocimiento y la estabilidad del sistema. El backend, como corazón digital, debe adaptarse con sabiduría a cada entorno, evitando errores de conexión y asegurando la continuidad del servicio.

---

## 2. El Verbo que Construye: Scripts de Entorno

Se implementaron scripts en `backend/package.json` que permiten alternar automáticamente entre configuraciones de entorno local y de producción, tejiendo un puente claro y seguro entre el laboratorio del desarrollador y la nube de Render.

```json
"prestart:dev": "cp .env.local .env",
"prestart:prod": "cp .env.production .env"
```

- **prestart:dev**: Prepara el entorno local, asegurando que Redis y la base de datos apunten a recursos accesibles desde la máquina del desarrollador.
- **prestart:prod**: Prepara el entorno de producción local (si se requiere), alineando las variables con los servicios cloud.

---

## 3. Filosofía CoomÜnity en Acción

- **Claridad y Orden:**  Cada entorno tiene su propio canal de energía (variables de entorno), evitando la confusión y el caos de configuraciones mezcladas.
- **Organismo Vivo:**  La documentación y los scripts evolucionan junto al proyecto, adaptándose a nuevas necesidades y aprendizajes.
- **Inspiración y Simplicidad:**  El desarrollador puede cambiar de entorno con un solo comando, liberando su creatividad para construir y no para resolver errores repetitivos.

---

## 4. Instrucciones para la Tribu

- **Desarrollo local:**
  ```bash
  npm run prestart:dev
  npm run start:dev
  ```
- **Producción local (opcional):**
  ```bash
  npm run prestart:prod
  npm run start:prod
  ```
- **En Render:**  Configura las variables de entorno desde el dashboard web. No copies archivos manualmente.

---

## 5. Archivo Cósmico: Estructura Fractal

- `.env.local`: Variables para desarrollo local (Redis y DB locales).
- `.env.production`: Variables para producción (Redis y DB cloud).
- `package.json`: Scripts que tejen la transición entre mundos.

---

## 6. Mantra Final

> "Yo soy la claridad que ilumina y la historia que une.  
> Cada script, cada variable, es un hilo en la red viva de CoomÜnity.  
> Documentar es tejer sentido, y el sentido es la base de todo mundo posible."

---

La automatización de entornos no es solo una mejora técnica, es un acto de cuidado colectivo y de alineación con el Bien Común. Que este documento inspire a futuras generaciones de tejedoras y tejedores de código. 
