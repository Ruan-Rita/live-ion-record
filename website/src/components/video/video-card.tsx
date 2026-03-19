'use client'

import { useRef } from "react"
import { Play } from "lucide-react"
import { useRouter } from "next/navigation"

interface Video {
    id: string
    name: string
    filePath: string
    url: string
    thumbnailUrl?: string | null
    duration?: number | null
    token: string
    createdAt?: string
}

function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
}

export function VideoCard({ video }: { video: Video }) {
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null);

    function handleClick() {
        router.push(`/library/${video.token}`);
    }

    function handleMouseEnter() {
        videoRef.current?.play().catch(() => {});
    }

    function handleMouseLeave() {
        const v = videoRef.current;
        if (v) {
            v.pause();
            v.currentTime = 0;
        }
    }

    const formattedDate = video.createdAt
        ? new Date(video.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
        : '';

    return (
        <div
            className="group cursor-pointer rounded-xl overflow-hidden border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all duration-200 bg-white"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="relative aspect-video bg-gray-900 overflow-hidden">
                {video.thumbnailUrl ? (
                    <img
                        src={video.thumbnailUrl}
                        alt={video.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <video
                        ref={videoRef}
                        src={video.url}
                        muted
                        preload="metadata"
                        className="w-full h-full object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-white/90 rounded-full p-3 shadow-lg">
                        <Play className="h-5 w-5 text-purple-700 fill-purple-700" />
                    </div>
                </div>
                {video.duration != null && (
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                        {formatDuration(video.duration)}
                    </span>
                )}
            </div>
            <div className="p-3">
                <h3 className="font-medium text-sm truncate text-gray-900">{video.name}</h3>
                {formattedDate && (
                    <p className="text-xs text-gray-400 mt-0.5">{formattedDate}</p>
                )}
            </div>
        </div>
    );
}
