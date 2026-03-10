'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { VideoGrid } from "@/components/video/video-grid"
import { SERVICE_PLUGIN_ID } from "@/contants"
import { Search, Video } from "lucide-react"

export default function Library() {
    const [search, setSearch] = useState('')

    function handleNewVideo() {
        window.open(`chrome-extension://${SERVICE_PLUGIN_ID}/index.html`);
    }

    return (
        <div className="flex flex-col gap-6 py-8">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-muted-foreground">My Library</p>
                    <h1 className="text-3xl font-bold tracking-tight">Videos</h1>
                </div>
                <Button
                    className="text-white gap-2"
                    style={{ background: 'linear-gradient(90deg, #7c24d9, #4a03b8)' }}
                    onClick={handleNewVideo}
                >
                    <Video className="h-4 w-4" />
                    New Recording
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <Input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9 rounded-full bg-gray-50 border-gray-200 focus-visible:ring-purple-400"
                    placeholder="Search videos by title..."
                />
            </div>

            <VideoGrid search={search} />
        </div>
    )
}
