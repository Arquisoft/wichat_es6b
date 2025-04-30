# Usa la imagen oficial de Node.js como base
FROM node:22

# Establecer el directorio de trabajo en el contenedor
WORKDIR /usr/src/questionservice

# Copiar los archivos de dependencias primero
COPY package*.json ./

# Instalar las dependencias de la aplicación
RUN npm install 

# Copiar el código fuente de la aplicación después de instalar las dependencias
COPY . .

# Exponer el puerto en el que corre la aplicación
EXPOSE 8010

# Ejecutar la aplicación
CMD ["node", "questions.js"]
