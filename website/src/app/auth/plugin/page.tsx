'use client'
import { useSession } from "next-auth/react";
import { useEffect } from "react";

// Add type declaration for chrome object
declare global {
    interface Window {
        chrome?: {
            runtime: {
                sendMessage: (id:string, message: any) => void;
            };
        };
    }
}

export default function AuthPlugin() {

    const { data: sessionData } = useSession()

    useEffect(() => {
        if (typeof window === 'undefined') return; // Evita SSR

        console.log('testando comunicação com a extensão...');
      
        console.log('sessionData?.user', sessionData?.user);
        if (sessionData?.user?.accessToken) {
            if (typeof window.chrome?.runtime !== 'undefined') {
            console.log('chrome.runtime disponível!');
        
            const tokenToSend = sessionData?.user?.accessToken || 'token falso';
                
            window.chrome.runtime.sendMessage('aaijjlclkonknacikpiemijipdblgghe', {
                type: "AUTH_TOKEN",
                token: tokenToSend,
            });
        
            setTimeout(() => {
                window.close();
            }, 500);
        
            } else {
                console.log('chrome.runtime não está disponível.');
            }
        }
    }, [sessionData]);
    
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold text-center mb-4">Plugin Authentication</h1>
            <p className="text-center text-gray-600">
                This page is for automatic sign-in from external applications. 
                If you were redirected here from an application, please wait while we complete the authentication process.
            </p>
        </div>
    )
}