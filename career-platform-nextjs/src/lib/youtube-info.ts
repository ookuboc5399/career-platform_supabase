export interface YouTubeInfo {
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  originalTitle: string;
  originalDescription: string;
  duration: number;
  thumbnailUrl: string;
}

export async function getYouTubeInfo(url: string): Promise<YouTubeInfo> {
  const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }
  return {
    title: 'YouTube Video',
    description: 'YouTube Video (スタブ)',
    level: 'intermediate',
    tags: [],
    originalTitle: 'YouTube Video',
    originalDescription: '',
    duration: 0,
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/default.jpg`,
  };
}
