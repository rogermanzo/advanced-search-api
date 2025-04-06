# Etapa base
FROM node:18-alpine

WORKDIR /app

# 1. Copiar solo lo necesario para producción
COPY package.json .
COPY dist/ ./dist/

# 2. Instalar SOLO dependencias de producción
RUN npm install -g pnpm && \
    pnpm install --prod

# 3. Variables de entorno (ajusta según necesites)
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
CMD ["node", "dist/main.js"]