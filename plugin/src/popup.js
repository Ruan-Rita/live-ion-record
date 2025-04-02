const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
// const preview = document.getElementById("preview");
const apiDomain = 'http://localhost:3001';

let mediaRecorder;
let recordedChunks = [];
let chunkIndex = 0;

startButton.addEventListener("click", async () => {
    try {
        chrome.runtime.sendMessage({ action: "openPinnedTab" }, (response) => {
            if (response && response.success) {
                console.log("Aba fixada criada com sucesso!", response.tabId);
            }
        });
    } catch (err) {
        console.error("Error accessing screen capture:", err);
    }
});

stopButton.addEventListener("click", () => {
    // // Stop the recording
    // mediaRecorder.stop();
    // // Stop all tracks to release the screen capture
    // mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    // startButton.disabled = false;
    // stopButton.disabled = true;

    // // Notify server that the upload is complete
    // fetch(`${apiDomain}/record/complete`, {
    //     method: 'POST',
    //     body: JSON.stringify({ filename: 'video.webm' }),
    //     headers: { 'Content-Type': 'application/json' },
    // });
});