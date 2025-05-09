'use client'

import { findRecordApi } from "@/service/record"
import { MoveLeft } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function Library() {
    const params = useParams();
    const [video, setVideo] = useState<any>(null);
    const { data: sessionData } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (params?.videoId && sessionData?.user?.accessToken) {
            getVideo(params.videoId as string);
        }
    }, [params, sessionData]);

    async function getVideo(videoId: string) {
        const response = await findRecordApi(sessionData?.user?.accessToken, videoId);
        setVideo(response);
    }

    function goBack() {
        router.push('/library');
    }

    return (
        <>
            <button className="flex gap-2 items-center mb-10 border border-purple-700 bg-purple-500 text-white stroke-white px-3 py-1 rounded-md" onClick={goBack}>
               <MoveLeft className="stroke-white" />
               To go back
            </button>
            <h1 className="text-purple-700 text-2xl mb-5">Video {video?.name}</h1>
            {video && <video className="rounded-lg max-w-2xl]" id={video.id} src={video.url} controls style={{ width: "100%" }} />}
            <p className="mt-5">Description: </p>
            <p>Not found any transcription</p>
        </>
    )
}