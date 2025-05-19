# syntax=docker/dockerfile:1

FROM node:18-alpine AS base

WORKDIR /app

# Adiciona dependências que algumas libs podem precisar
RUN apk add --no-cache libc6-compat

# Copia os arquivos de dependência
COPY package.json package-lock.json* tsconfig.json ./

# Instala dependências
RUN npm install 

# Copia o resto da aplicação
COPY . .

# Build da aplicação
RUN npm run build

# Exposição da porta
EXPOSE 3000

# Define variáveis
ENV NODE_ENV=production
ENV PORT=3000

# Comando pra iniciar o Next em produção
CMD ["npm", "start"]
