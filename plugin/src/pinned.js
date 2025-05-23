const apiDomain = 'http://localhost:3001';
let mediaRecorder;
let recordedChunks = [];
let chunkIndex = 0;
const uuid = crypto.randomUUID();

const uploadChunk = async (formData, token) => {
    try {
      const response = await fetch(`${apiDomain}/record/upload-chunks`, {
        method: 'POST',
        body: formData,
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!response.ok) {
        console.error('Falha no upload do chunk', await response.text());
      }
    } catch (err) {
      console.error('Erro no envio do chunk:', err);
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Request the screen media stream
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true, // Set to true if you want to capture audio
        });

        // Add overlay to the screen
        chrome.runtime.sendMessage({ action: "injectOverlay" });

        const options = {
            mimeType: 'video/webm; codecs=vp9',
            videoBitsPerSecond: 2500000 // 2.5 Mbps (ajuste conforme necessidade)
        };
        // Create a MediaRecorder instance
        mediaRecorder = new MediaRecorder(stream, options);

        // Collect chunks of recorded data
        mediaRecorder.ondataavailable = async (event) => {            
            if (event.data.size > 0) {
                const formData = new FormData();
                formData.append('chunk', event.data);
                formData.append('index', chunkIndex++);
                formData.append('token', uuid);
                formData.append('filename', 'video.webm'); // Add the filename to identify the file on the server
      
                chrome.storage.local.get("ion_token", async (result) => {
                    const token = result.ion_token;
                    await uploadChunk(formData, token);
                });

                recordedChunks.push(event.data);
            }
        };

        // Handle when recording stops
        mediaRecorder.onstop = () => {
            // Stop the recording
            chrome.runtime.sendMessage({ action: "recordingStopped" });
            // Stop all tracks to release the screen capture
            mediaRecorder.stream.getTracks().forEach((track) => track.stop());

            chrome.storage.local.get("ion_token", async (result) => {
                const token = result.ion_token;
                
                // Notify server that the upload is complete
                fetch(`${apiDomain}/record/complete`, {
                    method: 'POST',
                    body: JSON.stringify({ filename: 'video.webm', token: uuid }),
                    headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
                }).then(() => {
                    chrome.runtime.sendMessage({ action: "closePinnedTab" }, (response) => {
                        if (response && response.success) {
                            console.log("Aba fixada criada com sucesso!", response.tabId);
                        }
                    });
                }).catch(err => {
                    console.error("Error close pinned tab:", err);
                });
            });

            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
            
            stream = null;
        };

        // Start recording
        mediaRecorder.start(2000);

        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.action === "stopMediaRecorder") {
                if (mediaRecorder) {
                    mediaRecorder.stop(); // Para a gravação
                }
            }
        });
    } catch (error) {
        console.error("Erro ao capturar a tela:", error);
    }
});

window.addEventListener('beforeunload', (event) => {
    // Enviar mensagem para o service worker antes de fechar a página
    if (mediaRecorder) {
        mediaRecorder.stop(); // Para a gravação
    }
});

window.addEventListener('unload', (event) => {
    // Enviar mensagem para o service worker antes de fechar a página
    if (mediaRecorder) {
        mediaRecorder.stop(); // Para a gravação
    }
});