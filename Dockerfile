# Etapa base
FROM node:18-alpine

WORKDIR /app

# 1. Copiar solo lo necesario para producción
COPY package.json . 
COPY dist/ ./dist/

# 2. Instalar SOLO dependencias de producción
RUN npm install -g pnpm && \
    pnpm install --prod

# 3. Variables de entorno desde el archivo .env
# Asegúrate de copiar el archivo .env en el contenedor si es necesario
COPY .env .env

# 4. Establecer las variables de entorno desde el archivo .env
# Usamos el archivo .env para cargar las variables en el contenedor
ENV NODE_ENV=production
ENV PORT=${APP_PORT}

EXPOSE ${PORT}

CMD ["node", "dist/main.js"]
