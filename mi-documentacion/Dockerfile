# 1️⃣ Etapa de construcción
FROM node:20-alpine AS builder
WORKDIR /app

# Copiamos dependencias
COPY package*.json ./
RUN npm install

# Copiamos el resto del proyecto
COPY . .

# Construimos Docusaurus
RUN npm run build

# 2️⃣ Etapa de producción
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80