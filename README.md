# Ion Recording

Sistema completo de gravação, armazenamento e entrega de vídeos, com integração via plugin de navegador.

---

## Sobre o projeto

O **Ion Recording** é uma solução de gravação e gestão de vídeos integrada com backend, frontend e plugin de captura. Permite que usuários gravem vídeos via navegador, armazene os arquivos e os disponibilize para reprodução online.

---

## Tecnologias

- **Backend:** NestJS
- **Frontend:** Next.js
- **Plugin:** Chrome Extension / JavaScript
- **Armazenamento:** Local ou AWS S3
- **Banco de Dados:** PostgreSQL
- **Infraestrutura:** Docker + Docker Compose

---

## Como rodar

### Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose

### 1. Clone o repositório

```bash
git clone https://github.com/seuusuario/live-ion-record.git
cd live-ion-record
```

### 2. Configure as variáveis de ambiente

O projeto usa arquivos `.env` separados por ambiente. Copie o arquivo de exemplo e ajuste os valores:

```bash
# Para desenvolvimento
cp .env.dev .env.dev.local   # opcional: personalize sem commitar

# Para produção
cp .env.prod .env.prod.local
```

> As chaves JWT já vêm preenchidas nos arquivos de exemplo. Em produção, gere novas chaves.

---

### Desenvolvimento (hot reload)

Sobe o backend e o banco. O NestJS recarrega automaticamente ao salvar arquivos em `backend/src/`.

```bash
docker compose -f compose.yaml -f compose.dev.yaml --env-file .env.dev up -d
```

Para subir também o frontend:

```bash
docker compose -f compose.yaml -f compose.dev.yaml --env-file .env.dev up -d server_api website db_app
```

| Serviço    | URL                    |
|------------|------------------------|
| Backend    | http://localhost:3001  |
| Frontend   | http://localhost:3000  |
| PostgreSQL | localhost:5432         |

---

### Produção

Faz o build das imagens e sobe todos os serviços.

```bash
docker compose -f compose.yaml -f compose.prod.yaml --env-file .env.prod up -d --build
```

| Serviço    | URL                   |
|------------|-----------------------|
| Frontend   | http://localhost:3000 |
| Backend    | http://localhost:3001 |

---

### Comandos úteis

```bash
# Ver logs de um serviço
docker compose -f compose.yaml -f compose.dev.yaml logs -f server_api

# Parar tudo
docker compose -f compose.yaml -f compose.dev.yaml down

# Rebuild de um serviço específico
docker compose -f compose.yaml -f compose.prod.yaml --env-file .env.prod up -d --build server_api
```

---

## Estrutura do projeto

```
live-ion-record/
├── compose.yaml          # base: databases, network, volumes
├── compose.dev.yaml      # dev: hot reload, volumes de código
├── compose.prod.yaml     # prod: build das imagens
├── .env.dev              # variáveis de desenvolvimento
├── .env.prod             # variáveis de produção
├── backend/              # API NestJS
│   ├── Dockerfile        # imagem de produção
│   └── Dockerfile.dev    # imagem de desenvolvimento
└── website/              # Frontend Next.js
    ├── Dockerfile        # imagem de produção
    └── Dockerfile.dev    # imagem de desenvolvimento
```

---

## Comunicação entre containers

- Requests do **navegador** usam `http://localhost:3001`
- Requests do **servidor Next.js** (server-side) usam `http://server_api:3001`

> Dentro da rede Docker os serviços se comunicam pelo nome definido no compose.
