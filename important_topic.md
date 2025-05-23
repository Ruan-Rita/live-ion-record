## improve recording
Se quiser gravação ultra estável, outra alternativa que a galera usa em Electron ou plugins é gravar tudo localmente na memória (ou IndexedDB) e só enviar no final. Ou usar streams WebRTC peer-to-peer para reduzir latência.

## Improve code
if (stream) {
  stream.getTracks().forEach((track) => track.stop());
}
stream = null;

Pra garantir que o garbage collector descarte o stream. Como garbage collector funciona do javascript

## videos and codecs
const options = {
  mimeType: 'video/webm; codecs=vp9',
  videoBitsPerSecond: 2500000 // 2.5 Mbps (ajuste conforme necessidade)
};
Pesquisar por Mbps e codecs

## 📌 Problemas principais que causam congelamento de video:
Frequência dos chunks muito curta (100ms no mediaRecorder.start(100) — padrão geralmente é 1000~2000ms)

Taxa de bits (bitrate) e codec default do MediaRecorder podem ser instáveis para gravações longas ou em alta resolução

Falta de tratamento para erro de upload ou congestionamento de rede (isso pode travar ou atrasar a gravação)

Não liberar o stream explicitamente no final (embora você pare as tracks, o objeto stream continua em memória)

Browser buffer enchendo se os chunks forem muito grandes ou a rede lenta