'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { VideoGrid } from "@/components/video/video-grid"
import { Search } from "lucide-react"

export default function Library() {

    return (
        <>
            <section className="relative flex items-center">
                <Search className="absolute ml-2 text-gray-700"/>
                <Input type="search" className="pl-10 rounded-full" placeholder="Search videos by title"/>
            </section>
            <div className="my-16 mb-8 flex justify-between items-center">
                <div>
                    <p className="mt-2 text-lg text-muted-foreground">My Library</p>
                    <h1 className="text-3xl font-bold tracking-tight">Videos</h1>
                </div>
                <div>
                    <Button>New Video</Button>
                </div>
            </div>
            <VideoGrid />
        </>
    )
}