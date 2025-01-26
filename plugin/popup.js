const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const preview = document.getElementById("preview");

let mediaRecorder;
let recordedChunks = [];

startButton.addEventListener("click", async () => {
    try {
        // Request the screen media stream
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true, // Set to true if you want to capture audio
        });

        // Show live screen preview
        preview.srcObject = stream;
        preview.play();

        // Create a MediaRecorder instance
        mediaRecorder = new MediaRecorder(stream);

        // Collect chunks of recorded data
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
            recordedChunks.push(event.data);
            }
        };

        // Handle when recording stops
        mediaRecorder.onstop = () => {
            // Create a Blob from the recorded chunks
            const blob = new Blob(recordedChunks, { type: "video/webm" });
            recordedChunks = [];

            // Create a downloadable URL
            const url = URL.createObjectURL(blob);
            preview.srcObject = null; // Stop live preview
            preview.src = url; // Load the recorded video
            preview.controls = true;

            // Optional: Create a download link
            const downloadLink = document.createElement("a");
            downloadLink.href = url;
            downloadLink.download = "recording.webm";
            downloadLink.textContent = "Download Recording";
            document.body.appendChild(downloadLink);
        };

        // Start recording
        mediaRecorder.start();
        startButton.disabled = true;
        stopButton.disabled = false;
    } catch (err) {
        console.error("Error accessing screen capture:", err);
    }
});

stopButton.addEventListener("click", () => {
    // Stop the recording
    mediaRecorder.stop();

    // Stop all tracks to release the screen capture
    mediaRecorder.stream.getTracks().forEach((track) => track.stop());

    startButton.disabled = false;
    stopButton.disabled = true;
});