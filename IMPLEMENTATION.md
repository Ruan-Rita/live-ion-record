# ION — Fases de Implementação

---

## Status atual

- Extensão Chrome funcional (gravação WebM VP9)
- Modal de início com limite FREE (5 gravações)
- File System Access API (chunks direto no disco, RAM ~zero)
- Backend existente (auth, upload de chunks, /complete)

---

## Plano FREE

### Regras
- Conta obrigatória (JWT via extensão)
- Até 5 gravações no histórico
- 2GB de armazenamento na nuvem (padrão)
- Gravação padrão: WebM VP9

### Armazenamento
- **Nuvem selecionado por padrão** — chunks sobem pro servidor durante a gravação
- **Local disponível** — File System Access API, arquivo vai direto pro disco

### Modal de gravação (extensão)
- Seletor de destino: ☁️ Nuvem (default) / 💾 Local
- Exibir espaço disponível na nuvem ao selecionar essa opção
- Contador de gravações usadas (X/5)
- Ao atingir limite: banner de aviso + link para upgrade

---

## Conversão de formato (página `/convert` no website)

### Fluxo
```
Grava → WebM VP9 (nuvem ou local)
            ↓
Abre /convert no site
            ↓
[LOCAL]  Seleciona o arquivo → FFmpeg.wasm → download MP4
[NUVEM]  Arquivo já no servidor → conversão server-side → link MP4
```

### Regras
- Formato de saída padrão: MP4
- Permitir outros formatos futuramente
- Limite para conversão local (client-side): 1GB
- FFmpeg.wasm roda inteiramente no browser (não sobe pro servidor)

### UX importante
- Loading state ao inicializar FFmpeg.wasm (~30MB, só na primeira vez)
- Barra de progresso com estimativa de tempo durante a conversão
- **Se a conversão estiver lenta:** exibir mensagem sugerindo upload para nuvem:

  > *"Conversão demorada? Faça upload para a nuvem — é muito mais rápido."*

  - Ao clicar, verificar espaço disponível na nuvem do usuário
  - Se tiver espaço: iniciar upload e conversão server-side
  - Se não tiver espaço: exibir quanto falta + link para upgrade PRO

### Avisos de performance (client-side)
- Arquivos grandes (>500MB) podem levar 5-10min dependendo da máquina
- Sem aceleração de hardware no browser
- Conversão server-side (nuvem) é significativamente mais rápida

---

## Plano PRO (implementar depois)

- 10GB armazenamento cloud
- Histórico ilimitado
- Link compartilhável (ion.app/v/abc)
- Player online
- Conversão server-side ilimitada
- Share direto (WhatsApp/Slack/Email)
- Acesso de qualquer dispositivo

---

## Pendente / decisões abertas

- [ ] Duração no arquivo WebM: usar `fix-webm-duration` após gravação
- [ ] Player na dashboard: extensão injeta blob URL na página via content script
- [ ] Verificação de espaço na nuvem antes de iniciar gravação/upload
- [ ] Página `/convert` no website
- [ ] Publicação na Chrome Web Store
