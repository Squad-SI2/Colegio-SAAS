# Usamos una imagen base oficial de Node.js
FROM node:20-bookworm
# node:20-bookworm 
# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de archivos del proyecto
COPY . .

# Establecer variables de entorno necesarias para hot reload
# ENV HOST=0.0.0.0

# Exponer el puerto en el que React/Vite corre (por defecto 5173)
EXPOSE 5173

# Comando para iniciar el servidor de desarrollo de Vite con hot reload
CMD ["npm", "run", "dev"]