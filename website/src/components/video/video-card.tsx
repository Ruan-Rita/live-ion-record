import Image from "next/image"
import { Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

interface Video {
  id: string
  name: string
  filePath: string
  url: string
  token: string
  duration: string
}

interface VideoCardProps {
  video: Video
}

export function VideoCard({ video }: VideoCardProps) {
  const router = useRouter();

  function handlePlay(videoId: string) {
    router.push(`/library/${videoId}`);
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative aspect-video">
          <video id={video.id} src={video.url} controls style={{ width: "100%", height: "100%" }} />
          <div onClick={() => handlePlay(video.token)} className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
            <Play className="h-12 w-12 text-white cursor-pointer"/>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg truncate">{video.name}</CardTitle>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{video.duration}</span>
        <Button variant="outline" size="sm" onClick={() => handlePlay(video.token)}>
          Watch Now
        </Button>
      </CardFooter>
    </Card>
  )
}

