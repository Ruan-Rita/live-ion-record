# 🎥 Ion Recording

> Sistema completo de gravação, armazenamento e entrega de vídeos otimizados, com encoding multi-qualidade e integração via plugin.

---

## 📖 Sobre o projeto

O **Ion Recording** é uma solução de gravação e gestão de vídeos integrada com backend, frontend e plugin de captura. Ele permite que usuários gravem vídeos via navegador ou aplicação desktop, armazene vídeos brutos, realize o encoding automático para múltiplas qualidades e disponibilize os arquivos otimizados para reprodução online.

---

## 📦 Tecnologias utilizadas

- **Backend:** Laravel  
- **Frontend:** Vue 3 (Composition API)  
- **Plugin:** Electron / JavaScript  
- **Encoding:** FFmpeg (local) ou AWS MediaConvert (cloud)  
- **Armazenamento:** AWS S3  
- **Fila de Jobs:** Laravel Queue + Redis  
- **Banco de Dados:** MySQL  

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

Plugin → Backend → Armazena vídeo bruto ↓ Job Encoding ↓ Gera múltiplas versões ↓ Salva vídeos otimizados ↓ Atualiza status e exibe no frontend

yaml
Copiar
Editar

---

## 🚀 Como rodar o projeto

### 📌 Requisitos

- PHP 8+
- Composer
- Node.js
- Redis (para filas)
- FFmpeg instalado (para encoding local)
- MySQL

### 📦 Instalação

```bash
git clone https://github.com/seuusuario/ion-recording.git
cd ion-recording
composer install
npm install && npm run dev
php artisan migrate
php artisan queue:work
📂 Estrutura do projeto
bash
Copiar
Editar
/backend
/frontend
/plugin
/storage/raw
/storage/processed
🛠️ Encoding manual (local)
Para processar um vídeo:

bash
Copiar
Editar
ffmpeg -i storage/raw/video.mp4 -preset fast -crf 23 -s 1280x720 storage/processed/video-720p.mp4
🤝 Como contribuir
Fork este repositório

Crie sua branch (git checkout -b feature/nova-feature)

Commit suas alterações (git commit -m 'feat: nova funcionalidade')

Push na sua branch (git push origin feature/nova-feature)

Crie um Pull Request 🚀

📑 Licença
Este projeto está sob a licença MIT.

📬 Contato
Desenvolvido por Ruan
Email: seuemail@exemplo.com
LinkedIn: linkedin.com/in/seuusuario

yaml
Copiar
Editar

---

Se quiser, posso gerar também a versão com badgezinhos (ex.: PHP version, license, status do projeto) ou estilizar com emojis e seções extras (ex.: roadmap, changelog, FAQ). Quer? 🚀
