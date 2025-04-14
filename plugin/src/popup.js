const startButton = document.getElementById("start");

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

window.addEventListener("message", (event) => {
    chrome.runtime.sendMessage({
        type: "FROM_PAGE",
        token: event
    });

    if (event.source !== window) return;

    if (event.data.type === "FROM_PAGE") {
        chrome.runtime.sendMessage({
            type: "FROM_PAGE",
            token: event.data.token
        });
    }
});

if (true) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTabId = tabs[0].id;
    
        chrome.tabs.create({
            url: "http://localhost:3000/auth/plugin",
            active: false, // Não traz a aba pro foco
        }, (newTab) => {
            // Aguarda autenticação (você pode escutar ou usar chrome.runtime.onMessage)
    
            // Depois de um tempo, volta para a aba original (se quiser):
            setTimeout(() => {
                chrome.tabs.update(currentTabId, { active: true });
            }, 3000);
        });
    });
}