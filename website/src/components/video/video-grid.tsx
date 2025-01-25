import { VideoCard } from "./video-card"

// This is sample data. Replace it with your actual data fetching logic.

const img = 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/594650/ss_1440bf64dfd9cac71a607230cc972fc6e43419a1.1920x1080.jpg?t=1737651636';
const img2 = 'https://conteudo.imguol.com.br/c/entretenimento/2a/2021/02/01/subnautica-below-zero-1612200254274_v2_900x506.jpg'
const videos = [
  { id: "1", title: "Introduction to Our SaaS", thumbnail: img, duration: "5:30" },
  { id: "2", title: "How to Use Feature X", thumbnail: img2, duration: "3:45" },
  { id: "3", title: "Advanced Tips and Tricks", thumbnail: img, duration: "7:15" },
  { id: "4", title: "Troubleshooting Common Issues", thumbnail: img2, duration: "6:20" },
  { id: "5", title: "Integrating with Third-party Tools", thumbnail: img, duration: "8:10" },
  { id: "6", title: "Optimizing Your Workflow", thumbnail: img2, duration: "4:55" },
]

export function VideoGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}

