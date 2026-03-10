'use client'

import { useEffect, useState, useCallback } from "react";
import { VideoCard } from "./video-card";
import { useSession } from "next-auth/react";
import { listRecordsApi } from "@/service/record";
import { Skeleton } from "@/components/ui/skeleton";
import { Video } from "lucide-react";

interface VideoGridProps {
    search?: string;
}

export function VideoGrid({ search = '' }: VideoGridProps) {
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { data: sessionData } = useSession();

    const fetchVideos = useCallback(async (name?: string) => {
        if (!sessionData?.user?.accessToken) return;
        setLoading(true);
        const response = await listRecordsApi(sessionData.user.accessToken, name);
        setVideos(Array.isArray(response) ? response : []);
        setLoading(false);
    }, [sessionData]);

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    useEffect(() => {
        if (!sessionData?.user?.accessToken) return;
        const timer = setTimeout(() => {
            fetchVideos(search || undefined);
        }, 400);
        return () => clearTimeout(timer);
    }, [search, fetchVideos, sessionData]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="rounded-xl overflow-hidden border border-gray-100">
                        <Skeleton className="aspect-video w-full" />
                        <div className="p-3 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/3" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (videos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="rounded-full bg-purple-50 p-6 mb-4">
                    <Video className="h-10 w-10 text-purple-300" />
                </div>
                <h3 className="text-base font-medium text-gray-800 mb-1">
                    {search ? 'No videos found' : 'No recordings yet'}
                </h3>
                <p className="text-sm text-gray-400">
                    {search ? `No results for "${search}"` : 'Click "New Recording" to get started.'}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
            ))}
        </div>
    );
}
