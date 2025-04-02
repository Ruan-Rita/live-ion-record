const apiDomain = 'http://localhost:3001';
let mediaRecorder;
let recordedChunks = [];
let chunkIndex = 0;

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Request the screen media stream
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true, // Set to true if you want to capture audio
        });

        // Create a MediaRecorder instance
        mediaRecorder = new MediaRecorder(stream);

        // Collect chunks of recorded data
        mediaRecorder.ondataavailable = async (event) => {
            if (event.data.size > 0) {
                const formData = new FormData();
                formData.append('chunk', event.data);
                formData.append('index', chunkIndex++);
                formData.append('filename', 'video.webm'); // Add the filename to identify the file on the server
      
                await fetch(`${apiDomain}/record/upload-chunks`, {
                  method: 'POST',
                  body: formData,
                });

                recordedChunks.push(event.data);
            }
        };

        // Handle when recording stops
        mediaRecorder.onstop = () => {
            // Stop the recording
            // mediaRecorder.stop();
            // Stop all tracks to release the screen capture
            mediaRecorder.stream.getTracks().forEach((track) => track.stop());

            // Notify server that the upload is complete
            fetch(`${apiDomain}/record/complete`, {
                method: 'POST',
                body: JSON.stringify({ filename: 'video.webm' }),
                headers: { 'Content-Type': 'application/json' },
            }).then(() => {
                try {
                    chrome.runtime.sendMessage({ action: "closePinnedTab" }, (response) => {
                        if (response && response.success) {
                            console.log("Aba fixada criada com sucesso!", response.tabId);
                        }
                    });
                } catch (err) {
                    console.error("Error close pinned tab:", err);
                }
            });
        };

        // Start recording
        mediaRecorder.start(1000);
        // Agora você pode enviar essa stream para processamento ou gravá-la
    } catch (error) {
        console.error("Erro ao capturar a tela:", error);
    }
});