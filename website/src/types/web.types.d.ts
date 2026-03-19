export type PluginMessageBody = {
    type?: string,
    action?: string,
    data?: string
}

declare global {
    interface Window {
        chrome?: {
            runtime: {
                sendMessage: (id: string, message: PluginMessageBody) => Promise<any>;
            };
        };
    }
}
