'use client'
import { useSession } from "next-auth/react";
import { useEffect } from "react";

// Add type declaration for chrome object
declare global {
    interface Window {
        chrome?: {
            runtime: {
                sendMessage: (message: any) => void;
            };
        };
    }
}

export default function AuthPlugin() {

    const { data: sessionData } = useSession()

    useEffect(() => {
        if (sessionData?.user.accessToken) {
            // Use window.chrome instead of chrome directly
            window.chrome?.runtime.sendMessage({
                type: "AUTH_TOKEN",
                token: sessionData?.user.accessToken,
            });
            
            console.log('enviou?', sessionData?.user.accessToken);

            // Aguarda 500ms para dar tempo da extensão capturar
            setTimeout(() => {
                window.close();
            }, 500);
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