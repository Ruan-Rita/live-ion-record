let pinnedTabId = null;

/**
 * Listeners
 */
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
    if (message.type === "AUTH_TOKEN") {
        console.log("Token salvo da sessão do site! token: ", message.data);

        chrome.storage.local.set({ ion_token: message.data }, () => {
            console.log("Token salvo no plugin! token: " + message.data);
        });
    }
});

/**
 * Listeners
 */
// chrome.storage.onChanged.addListener((changes, namespace) => {
//     for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
//       console.log(
//         `Storage key "${key}" in namespace "${namespace}" changed.`,
//         `Old value was "${oldValue}", new value is "${newValue}".`
//       );
//     }
// });

/**
 * Listeners
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Mensagem recebida:', message);

    if (message.action === "openPinnedTab") {
        chrome.tabs.create({
            url: chrome.runtime.getURL("pinned.html"),
            pinned: true,
            active: true
        }, (tab) => {
            pinnedTabId = tab.id;
            sendResponse({ success: true, tabId: tab.id });
        });

        return true; // Mantém a conexão assíncrona aberta
    }

    if (message.action === "closePinnedTab" && pinnedTabId) {
        chrome.tabs.remove(pinnedTabId, () => {
            pinnedTabId = null; // Reseta o ID após fechar
            sendResponse({ success: true });
        });

        return true; // Mantém a conexão assíncrona aberta
    }

    if (message.action === "injectOverlay") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) return;
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: injectOverlay
            });
        });
    }

    if (message.action === "stopRecording") {
        // Envia mensagem para o pinned.js parar a gravação
        chrome.runtime.sendMessage({ action: "stopMediaRecorder" });
        removeOverlay();
    }
    
    if (message.action === "recordingStopped") {
        removeOverlay();
    }
});

function injectOverlay() {
    // Criar o overlay
    const overlay = document.createElement("div");
    overlay.id = "ion-recording-overlay";
    overlay.style = `
        margin-left: 50%;
        position: fixed;
        bottom: 30px;
        left: 0px;
        width: fit-content;
        height: fit-content;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transform: translateX(-50%);
        padding: 5px;
        border-radius: 24px;
    `;

    // Criar o conteúdo do overlay
    overlay.innerHTML = `
        <div style="
            display: flex;
            align-items: center;
            background: #fff;
            padding: 15px 25px;
            border-radius: 20px;
            gap: 5px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        ">
            <button id="stopRecording" style="display: flex; align-items: center; background: none; border: none; font-size: 20px; cursor: pointer; color: #555;">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M504 256C504 119 393 8 256 8S8 119 8 256s111 248 248 248 248-111 248-248zm-448 0c0-110.5 89.5-200 200-200s200 89.5 200 200-89.5 200-200 200S56 366.5 56 256zm296-80v160c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V176c0-8.8 7.2-16 16-16h160c8.8 0 16 7.2 16 16z"></path></svg>
            </button>
            <button id="resumeRecording" style="display: flex; align-items: center; background: none; border: none; font-size: 20px; cursor: pointer; color: #555;">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"></path></svg>
            </button>
            <div id="timerContainer" style="display: flex; align-items: center; margin: 0 15px;">
                <span id="recordingTimer" style="font-size: 16px; color: #333; font-weight: bold;">0:00</span>
                <span id="recordingStatus" style="margin-left: 5px; font-size: 12px; color: #4CAF50;">REC</span>
            </div>
            <button id="deleteRecording" style="display: flex; align-items: center; background: none; border: none; font-size: 20px; cursor: pointer; fill: #8f0000;">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="15px" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z"></path></svg>
            </button>
        </div>
    `;
    
    document.body.appendChild(overlay);

    // Variáveis para controlar o timer
    let startTime = Date.now();
    let timerInterval;
    let isRecording = true;
    let pausedTime = 0;
    let totalPausedTime = 0;
    let showMilliseconds = false; // Alternar entre mostrar segundos ou milissegundos

    // Adicionar estilos para o efeito de pulso
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        .recording-pulse {
            animation: pulse 1s infinite;
        }
        .paused-status {
            color: #FF9800 !important;
        }
    `;
    document.head.appendChild(style);

    // Função para atualizar o timer
    function updateTimer() {
        if (!isRecording) return;
        
        const elapsedTime = Date.now() - startTime - totalPausedTime;
        const seconds = Math.floor(elapsedTime / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const milliseconds = Math.floor((elapsedTime % 1000) / 10);
        
        const timerElement = document.getElementById('recordingTimer');
        if (timerElement) {
            if (showMilliseconds) {
                timerElement.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
            } else {
                timerElement.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
            }
        }
    }

    // Iniciar o timer
    timerInterval = setInterval(updateTimer, 10); // Atualizar a cada 10ms para milissegundos

    // Adicionando eventos aos botões
    document.getElementById("stopRecording").addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "stopRecording" });
        clearInterval(timerInterval);
        document.body.removeChild(overlay);
    });

    document.getElementById("deleteRecording").addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "deleteRecording" });
        clearInterval(timerInterval);
        document.body.removeChild(overlay);
    });

    document.getElementById("resumeRecording").addEventListener("click", () => {
        if (!isRecording) {
            // Retomar a gravação
            isRecording = true;
            startTime = Date.now() - pausedTime;
            timerInterval = setInterval(updateTimer, 10);
            
            // Atualizar o status visual
            const statusElement = document.getElementById('recordingStatus');
            if (statusElement) {
                statusElement.textContent = 'REC';
                statusElement.style.color = '#4CAF50';
                statusElement.classList.add('recording-pulse');
                statusElement.classList.remove('paused-status');
            }
            
            chrome.runtime.sendMessage({ action: "resumeRecording" });
        } else {
            // Pausar a gravação
            isRecording = false;
            pausedTime = Date.now() - startTime;
            totalPausedTime += pausedTime;
            clearInterval(timerInterval);
            
            // Atualizar o status visual
            const statusElement = document.getElementById('recordingStatus');
            if (statusElement) {
                statusElement.textContent = 'PAUSED';
                statusElement.style.color = '#FF9800';
                statusElement.classList.remove('recording-pulse');
                statusElement.classList.add('paused-status');
            }
            
            chrome.runtime.sendMessage({ action: "pauseRecording" });
        }
    });
    
    // Adicionar evento para alternar entre segundos e milissegundos
    document.getElementById("recordingTimer").addEventListener("click", () => {
        showMilliseconds = !showMilliseconds;
        updateTimer();
    });
    
    // Adicionar evento para detectar quando a página está sendo fechada
    window.addEventListener('beforeunload', (event) => {
        chrome.runtime.sendMessage({ action: "stopMediaRecorder" });
    });
}

// Remover overlay ao parar a gravação
function removeOverlay() {
    if (hasDocument()) {
        const overlay = document.getElementById("ion-recording-overlay");
        if (overlay) {
            overlay.remove();
        }
    }
}

function hasDocument() {
    return typeof document !== "undefined";
}