# 🎥 Ion Recording

Sistema completo de gravação, armazenamento e entrega de vídeos otimizados, com encoding multi-qualidade e integração via plugin.

---

## 📖 Sobre o projeto

O **Ion Recording** é uma solução de gravação e gestão de vídeos integrada com backend, frontend e plugin de captura. Ele permite que usuários gravem vídeos via navegador ou aplicação desktop, armazene vídeos brutos, realize o encoding automático para múltiplas qualidades e disponibilize os arquivos otimizados para reprodução online.

---

## 📦 Tecnologias utilizadas

- **Backend:** NestJs  
- **Frontend:** Vue 3 (Composition API)  
- **Plugin:** GoogleExtension / JavaScript  
- **Encoding:** FFmpeg (local) ou AWS MediaConvert (cloud)  
- **Armazenamento:** AWS S3  
- **Fila de Jobs:** Express Queue + Redis  
- **Banco de Dados:** MySQL  
- **Infraestrutura:** Docker + Docker Compose  

---

## 🎛️ Como funciona

1. O plugin grava o vídeo e envia para o backend.
2. O backend armazena o vídeo bruto.
3. Um job de encoding é disparado via fila.
4. O vídeo é processado para gerar múltiplas versões (ex.: 1080p, 720p, 480p).
5. Os vídeos otimizados são armazenados e o status é atualizado.
6. O frontend exibe os vídeos disponíveis para reprodução com seleção de qualidade.

---

## 📊 Fluxo resumido

Plugin → Backend → Armazena vídeo bruto  
↓  
Job Encoding  
↓  
Gera múltiplas versões  
↓  
Salva vídeos otimizados  
↓  
Atualiza status e exibe no frontend  

---

## 🐳 Estrutura com Docker

O projeto utiliza **Docker Compose** para orquestrar os serviços:

- **WEB_SITE:** Frontend (Next.js)
- **SERVER_API:** Backend (Laravel)
- **Redis:** Para gerenciamento das filas
- **MySQL:** Banco de dados

### 📡 Comunicação entre containers

- Requests feitas pelo navegador (client-side) usam `http://localhost:3001`
- Requests feitas pelo backend (server-side ou middleware) usam `http://server_api:3001`  
  > Dentro da rede Docker, os serviços se comunicam pelo nome definido no `docker-compose.yml`

---

## 🚀 Como rodar o projeto

### 📌 Requisitos

- Docker e Docker Compose  
**ou**  
- PHP 8+
- Composer
- Node.js
- Redis (para filas)
- FFmpeg instalado (para encoding local)
- MySQL

### 📦 Instalação com Docker

```bash
git clone https://github.com/seuusuario/ion-recording.git
cd ion-recording
docker-compose up -d --build
📂 Estrutura do projeto
bash
Copiar
Editar
/backend
/frontend
/plugin
/storage/raw
/storage/processed
/docker-compose.yml
🛠️ Encoding manual (local)
Para processar um vídeo via FFmpeg:

bash
Copiar
Editar
ffmpeg -i storage/raw/video.mp4 -preset fast -crf 23 -s 1280x720 storage/processed/video-720p.mp4