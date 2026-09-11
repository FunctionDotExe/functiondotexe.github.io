import { Play } from "lucide-react";
import type { ProjectImage } from "@/lib/constants";

export function ProjectVideo({ title, youtubeId, poster }: {
  title: string;
  youtubeId: string;
  poster: ProjectImage;
}) {
  return <div className="project-video">
    <a href={`https://www.youtube.com/watch?v=${youtubeId}`} target="_blank" rel="noopener noreferrer"
      className="project-video-play" aria-label={`Watch ${title} on YouTube`}>
      <img src={poster.src} width={poster.width} height={poster.height} alt={`${title} video preview`} loading="lazy" decoding="async" />
      <span className="project-video-label"><Play size={20} fill="currentColor" aria-hidden="true" />Watch robot demo</span>
    </a>
  </div>;
}
