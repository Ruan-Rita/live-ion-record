'use client'

import { findRecordApi } from "@/service/record"
import { MoveLeft } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export default function VideoPage() {
    const params = useParams();
    const [video, setVideo] = useState<any>(null);
    const { data: sessionData } = useSession();
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (params?.videoId && sessionData?.user?.accessToken) {
            getVideo(params.videoId as string);
        }
    }, [params, sessionData]);

    useEffect(() => {
        if (video && videoRef.current) {
            videoRef.current.play().catch(() => {});
        }
    }, [video]);

    async function getVideo(videoId: string) {
        const response = await findRecordApi(sessionData?.user?.accessToken, videoId);
        setVideo(response);
    }

    return (
        <div className="py-8 max-w-4xl mx-auto">
            <button
                className="flex gap-2 items-center mb-8 text-sm text-gray-500 hover:text-purple-700 transition-colors"
                onClick={() => router.push('/library')}
            >
                <MoveLeft className="h-4 w-4" />
                Back to Library
            </button>

            {video ? (
                <>
                    <h1 className="text-xl font-semibold text-gray-900 mb-4">{video.name}</h1>
                    <div className="rounded-xl overflow-hidden bg-gray-900 shadow-lg">
                        <video
                            ref={videoRef}
                            src={video.url}
                            controls
                            autoPlay
                            className="w-full"
                        />
                    </div>
                </>
            ) : (
                <div className="aspect-video rounded-xl bg-gray-100 animate-pulse" />
            )}
        </div>
    )
}
