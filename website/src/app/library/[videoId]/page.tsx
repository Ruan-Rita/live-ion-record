'use client'

import { findRecordApi } from "@/service/record"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function Library() {
    const params = useParams();
    const [video, setVideo] = useState<any>(null);
    const { data: sessionData } = useSession()
    
    useEffect(() => {
        if (params?.videoId && sessionData?.user?.accessToken) {
            getVideo(params.videoId as string);
        }
    }, [params, sessionData]);

    async function getVideo(videoId: string) {
        const response = await findRecordApi(sessionData?.user?.accessToken, videoId);
        setVideo(response);
    }

    return (
        <>
            <h1>Video {video?.name}</h1>
            {video && <video id={video.id} src={video.url} controls style={{ width: "100%" }} />}
        </>
    )
}