# syntax=docker/dockerfile:1

FROM node:18-alpine AS base

WORKDIR /app

# Adiciona dependências que algumas libs podem precisar
RUN apk add --no-cache libc6-compat

# Copia arquivos de dependência
COPY package.json package-lock.json* tsconfig.json ./

# Instala dependências
RUN npm install 

# Copia o resto da aplicação
COPY . .

# ✅ IMPORTANTE:
# Para Next.js reconhecer as variáveis NEXT_PUBLIC_ no build,
# devemos definir elas como ARG e depois converter para ENV
# assim o processo 'npm run build' consegue acessar
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_PLUGIN_ID
ARG NEXTAUTH_SECRET

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_PLUGIN_ID=$NEXT_PUBLIC_PLUGIN_ID
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET

# Build da aplicação
RUN npm run build

# Exposição da porta
EXPOSE 3000

# Define variáveis de ambiente runtime (opcional, se quiser redundância)
ENV NODE_ENV=production
ENV PORT=3000

# Comando para iniciar o Next em produção
CMD ["npm", "start"]
