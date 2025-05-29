# Usa una imagen base de Node.js LTS (Long Term Support)
FROM node:lts-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json
# Esto ayuda a aprovechar la caché de Docker para la instalación de dependencias
COPY package.json package-lock.json ./

# Instala las dependencias del proyecto
# Usamos --legacy-peer-deps ya que se usó localmente para resolver conflictos
RUN npm install --legacy-peer-deps

# Copia el resto del código fuente del proyecto al contenedor
COPY . .

# Opcional: Si la caché de Vite/Vitest causa problemas, descomenta la siguiente línea
# RUN rm -rf node_modules/.vite

# Define el comando por defecto para ejecutar cuando el contenedor se inicie
CMD ["npm", "test"] 