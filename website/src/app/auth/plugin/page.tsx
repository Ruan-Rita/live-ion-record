'use client'
import { notifyPluginService } from "@/service/plugin/ServiceWorker";
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

        if (sessionData?.user?.accessToken) {
            const message = {
                type: "AUTH_TOKEN",
                data: sessionData?.user?.accessToken,
            }
            notifyPluginService(message)
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