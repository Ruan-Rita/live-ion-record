'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { VideoGrid } from "@/components/video/video-grid"
import { SERVICE_PLUGIN_ID } from "@/contants"
import { notifyPluginService } from "@/service/plugin/ServiceWorker"
import { Search } from "lucide-react"
import { useSession } from "next-auth/react"

export default function Library() {

    function handlNewVideo() {
        window.open(`chrome-extension://${SERVICE_PLUGIN_ID}/index.html`);
    }

    return (
        <>
            <div className="my-16 mb-8">
                <div className="my-16 mb-8 flex justify-between items-center">
                    <div>
                        <p className="mt-2 text-lg text-muted-foreground">My Library</p>
                        <h1 className="text-3xl font-bold tracking-tight">Videos</h1>
                    </div>
                    <div>
                        <Button style={{backgroundColor: '#7c24d9', background: 'linear-gradient(90deg, #7c24d9, #4a03b8)'}} onClick={handlNewVideo}>New Video</Button>
                    </div>
                </div>
                <form className="relative flex items-center">
                    <Search className="absolute ml-2 text-gray-700"/>
                    <Input type="search" className="pl-10 rounded-full" placeholder="Search videos by title"/>
                </form>
            </div>
            <VideoGrid />
        </>
    )
}