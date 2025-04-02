let pinnedTabId = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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
});