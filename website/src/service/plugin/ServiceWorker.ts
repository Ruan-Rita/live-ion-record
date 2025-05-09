import { SERVICE_PLUGIN_ID } from "@/contants";
import { PluginMessageBody } from "@/types/web.types";

export function notifyPluginService(message: PluginMessageBody)
{
    if (typeof window.chrome?.runtime !== 'undefined') {

        if (SERVICE_PLUGIN_ID) {
            window.chrome.runtime.sendMessage(SERVICE_PLUGIN_ID, message);
        
            setTimeout(() => {
                window.close();
            }, 500);
        } 
        
        throw new Error('Error: ID_PLUGIN NOT FOUND');
    } else {
        console.log('chrome.runtime não está disponível.');
    }
}