# Usa la imagen oficial de Node.js como base
FROM node:alpine

# Establecer el directorio de trabajo en el contenedor
WORKDIR /usr/src/questionservice

# Crear un grupo y un usuario no root
RUN addgroup -S nonroot && adduser -S nonroot -G nonroot

# Cambiar la propiedad del directorio de trabajo al usuario no root
RUN chown -R nonroot:nonroot ./

# Copiar los archivos de dependencias primero
COPY package*.json ./

# Instalar las dependencias de la aplicación
RUN npm install --production --ignore-scripts

# Copiar el código fuente de la aplicación después de instalar las dependencias
COPY questions.js ./  
COPY question-model.js ./
COPY all_questions.js ./
COPY app.js ./
COPY questionservice.yaml ./

# Exponer el puerto en el que corre la aplicación
EXPOSE 8003

# Establecer la variable de entorno (si es necesario)o
ARG API_ORIGIN_URI="http://localhost:3000"
ENV REACT_APP_API_ORIGIN_ENDPOINT=$API_ORIGIN_URI

# Ejecutar la aplicación
CMD ["node", "questions.js"]
