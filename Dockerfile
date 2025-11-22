# Usar una imagen base oficial de Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos necesarios
COPY package*.json ./
COPY .env ./
COPY src ./src

# Instalar dependencias
RUN npm install --production

# Exponer el puerto de la aplicación
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["node", "src/app.js"]
