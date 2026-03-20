(function () {
if (document.getElementById('ion-start-modal')) return;

const FREE_RECORDING_LIMIT = 5;

let ionMediaRecorder = null;

// Shared timing state between overlay and recording
let ionRecordingStartTime = 0;
let ionPausedMs = 0;
let ionPauseStartTime = 0;

function ionGetRecordings() {
    return new Promise(resolve => {
        chrome.storage.local.get('ion_recordings', result => {
            resolve(result.ion_recordings || []);
        });
    });
}

function ionSaveRecording(metadata) {
    return new Promise(resolve => {
        ionGetRecordings().then(recordings => {
            recordings.push(metadata);
            chrome.storage.local.set({ ion_recordings: recordings }, resolve);
        });
    });
}

function ionInjectRecordingOverlay() {
    if (document.getElementById('ion-recording-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'ion-recording-overlay';
    overlay.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2147483647;
        background: rgba(0,0,0,0.7);
        padding: 5px;
        border-radius: 24px;
        font-family: Arial, sans-serif;
    `;

    overlay.innerHTML = `
        <div style="display:flex;align-items:center;background:#fff;padding:15px 25px;border-radius:20px;gap:5px;box-shadow:0 4px 10px rgba(0,0,0,0.2);">
            <button id="ion-stop-btn" title="Stop" style="display:flex;align-items:center;background:none;border:none;font-size:20px;cursor:pointer;color:#555;">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em"><path d="M504 256C504 119 393 8 256 8S8 119 8 256s111 248 248 248 248-111 248-248zm-448 0c0-110.5 89.5-200 200-200s200 89.5 200 200-89.5 200-200 200S56 366.5 56 256zm296-80v160c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V176c0-8.8 7.2-16 16-16h160c8.8 0 16 7.2 16 16z"/></svg>
            </button>
            <button id="ion-pause-btn" title="Pause/Resume" style="display:flex;align-items:center;background:none;border:none;font-size:20px;cursor:pointer;color:#555;">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em"><path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"/></svg>
            </button>
            <div style="display:flex;align-items:center;margin:0 15px;">
                <span id="ion-timer" style="font-size:16px;color:#333;font-weight:bold;cursor:pointer;">0:00</span>
                <span id="ion-rec-status" style="margin-left:5px;font-size:12px;color:#4CAF50;animation:ion-pulse 1s infinite;">REC</span>
            </div>
            <button id="ion-delete-btn" title="Delete" style="display:flex;align-items:center;background:none;border:none;font-size:20px;cursor:pointer;color:#8f0000;">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="15px" width="1em"><path d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z"/></svg>
            </button>
        </div>
        <style>
            @keyframes ion-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        </style>
    `;

    document.body.appendChild(overlay);

    let isPaused = false;
    let showMs = false;
    let lastText = '';

    function updateTimer() {
        if (isPaused) return;
        const elapsed = Date.now() - ionRecordingStartTime - ionPausedMs;
        const totalSec = Math.floor(elapsed / 1000);
        const m = Math.floor(totalSec / 60);
        const s = totalSec % 60;
        const cs = Math.floor((elapsed % 1000) / 10);
        const text = showMs
            ? `${m}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
            : `${m}:${String(s).padStart(2, '0')}`;

        if (text !== lastText) {
            lastText = text;
            const el = document.getElementById('ion-timer');
            if (el) el.textContent = text;
        }
    }

    const timerInterval = setInterval(updateTimer, 100);

    document.getElementById('ion-timer').addEventListener('click', () => {
        showMs = !showMs;
        updateTimer();
    });

    document.getElementById('ion-stop-btn').addEventListener('click', () => {
        clearInterval(timerInterval);
        overlay.remove();
        if (ionMediaRecorder && ionMediaRecorder.state !== 'inactive') {
            ionMediaRecorder.stop();
        }
    });

    document.getElementById('ion-delete-btn').addEventListener('click', () => {
        clearInterval(timerInterval);
        overlay.remove();
        if (ionMediaRecorder && ionMediaRecorder.state !== 'inactive') {
            ionMediaRecorder.ondataavailable = null;
            ionMediaRecorder.onstop = null;
            ionMediaRecorder.stop();
            ionMediaRecorder.stream.getTracks().forEach(t => t.stop());
        }
    });

    document.getElementById('ion-pause-btn').addEventListener('click', () => {
        const statusEl = document.getElementById('ion-rec-status');
        if (!isPaused) {
            isPaused = true;
            ionPauseStartTime = Date.now();
            if (ionMediaRecorder && ionMediaRecorder.state === 'recording') ionMediaRecorder.pause();
            if (statusEl) { statusEl.textContent = 'PAUSED'; statusEl.style.color = '#FF9800'; statusEl.style.animation = 'none'; }
        } else {
            isPaused = false;
            ionPausedMs += Date.now() - ionPauseStartTime;
            if (ionMediaRecorder && ionMediaRecorder.state === 'paused') ionMediaRecorder.resume();
            if (statusEl) { statusEl.textContent = 'REC'; statusEl.style.color = '#4CAF50'; statusEl.style.animation = 'ion-pulse 1s infinite'; }
        }
    });
}

async function ionStartRecording(fileName) {
    // Ask where to save BEFORE starting — so chunks go straight to disk
    let writableStream;
    let bytesWritten = 0;

    try {
        const fileHandle = await window.showSaveFilePicker({
            suggestedName: fileName,
            types: [{ description: 'WebM Video', accept: { 'video/webm': ['.webm'] } }],
        });
        writableStream = await fileHandle.createWritable();
    } catch {
        // User cancelled the save dialog
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });

        ionInjectRecordingOverlay();
        ionRecordingStartTime = Date.now();
        ionPausedMs = 0;

        ionMediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm; codecs=vp9',
            videoBitsPerSecond: 2500000,
        });

        ionMediaRecorder.ondataavailable = async (event) => {
            if (event.data.size > 0) {
                bytesWritten += event.data.size;
                await writableStream.write(event.data);
            }
        };

        ionMediaRecorder.onstop = async () => {
            stream.getTracks().forEach(t => t.stop());
            await writableStream.close();

            const duration = Math.round((Date.now() - ionRecordingStartTime - ionPausedMs) / 10) / 100;
            await ionSaveRecording({
                name: fileName,
                date: new Date().toISOString(),
                duration,
                size: bytesWritten,
            });
        };

        ionMediaRecorder.start(2000);

        stream.getVideoTracks()[0].addEventListener('ended', () => {
            const overlay = document.getElementById('ion-recording-overlay');
            if (overlay) overlay.remove();
            if (ionMediaRecorder && ionMediaRecorder.state !== 'inactive') ionMediaRecorder.stop();
        });

    } catch (err) {
        await writableStream.abort();
        console.error('[Ion] Erro ao capturar a tela:', err);
    }
}

async function injectStartModal() {
    const recordings = await ionGetRecordings();
    const atLimit = recordings.length >= FREE_RECORDING_LIMIT;
    const fileName = `ion-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;

    const overlay = document.createElement('div');
    overlay.id = 'ion-start-modal';
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Arial, sans-serif;
    `;

    const limitBanner = atLimit ? `
        <div style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:10px 14px;margin-bottom:16px;font-size:13px;color:#856404;">
            Você atingiu o limite de ${FREE_RECORDING_LIMIT} gravações do plano Free.
            <a href="http://localhost:3000/pricing" target="_blank" style="color:#7c24d9;font-weight:600;text-decoration:none;">Fazer upgrade →</a>
        </div>
    ` : `
        <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;text-align:right;">${recordings.length}/${FREE_RECORDING_LIMIT} gravações usadas</p>
    `;

    overlay.innerHTML = `
        <div style="background:#fff;border-radius:12px;padding:24px;width:320px;box-shadow:0 20px 60px rgba(0,0,0,0.3);position:relative;">
            <button id="ion-close-modal" style="position:absolute;top:12px;right:12px;background:none;border:none;cursor:pointer;font-size:18px;color:#666;line-height:1;padding:4px;">✕</button>
            <h2 style="margin:0 0 4px;font-size:18px;font-weight:600;color:#111;">New Recording</h2>
            <p style="margin:0 0 16px;font-size:13px;color:#666;">Configure your recording settings.</p>
            ${limitBanner}
            <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px;">
                <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:#f1f5f9;border-radius:999px;color:#334155;font-weight:500;font-size:14px;">
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                    Window
                </div>
                <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:#f1f5f9;border-radius:999px;color:#94a3b8;font-weight:500;font-size:14px;opacity:0.6;cursor:not-allowed;">
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v1.76a2 2 0 0 0 .18.83L10 13M14.12 14.12A3 3 0 0 1 9 12v-1M17 17H4a2 2 0 0 1-2-2V7M22 15V4a2 2 0 0 0-2-2H9"/></svg>
                    No Camera
                </div>
                <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:#f1f5f9;border-radius:999px;color:#94a3b8;font-weight:500;font-size:14px;opacity:0.6;cursor:not-allowed;">
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                    No Microphone
                </div>
            </div>
            <button id="ion-start-recording" ${atLimit ? 'disabled' : ''} style="width:100%;padding:12px;background:${atLimit ? '#e2e8f0' : 'linear-gradient(90deg,#7c24d9,#4a03b8)'};color:${atLimit ? '#94a3b8' : 'white'};border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:${atLimit ? 'not-allowed' : 'pointer'};font-family:Arial,sans-serif;">
                Start Recording
            </button>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('ion-close-modal').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

    if (!atLimit) {
        document.getElementById('ion-start-recording').addEventListener('click', () => {
            overlay.remove();
            ionStartRecording(fileName);
        });
    }
}

injectStartModal();
})();
