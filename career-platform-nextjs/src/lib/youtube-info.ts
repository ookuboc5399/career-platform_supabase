import { google } from 'googleapis';
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';

// 環境変数のチェック
if (!process.env.NEXT_PUBLIC_YOUTUBE_API_KEY) {
  throw new Error('NEXT_PUBLIC_YOUTUBE_API_KEY is not defined');
}

if (!process.env.NEXT_PUBLIC_AZURE_OPENAI_MOVIE_API_KEY) {
  throw new Error('NEXT_PUBLIC_AZURE_OPENAI_MOVIE_API_KEY is not defined');
}

if (!process.env.NEXT_PUBLIC_AZURE_OPENAI_MOVIE_ENDPOINT) {
  throw new Error('NEXT_PUBLIC_AZURE_OPENAI_MOVIE_ENDPOINT is not defined');
}

const youtube = google.youtube('v3');
const endpoint = process.env.NEXT_PUBLIC_AZURE_OPENAI_MOVIE_ENDPOINT?.replace(/\/$/, '') || '';
const deploymentName = process.env.NEXT_PUBLIC_AZURE_OPENAI_MOVIE_DEPLOYMENT_NAME || 'gpt-4';
const apiVersion = process.env.NEXT_PUBLIC_AZURE_OPENAI_MOVIE_API_VERSION || '2024-10-01-preview';

console.log('Initializing Azure OpenAI client with:', {
  endpoint,
  deploymentName,
  apiVersion
});

const client = new OpenAIClient(
  endpoint,
  new AzureKeyCredential(process.env.NEXT_PUBLIC_AZURE_OPENAI_MOVIE_API_KEY || ''),
  { apiVersion }
);

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
  try {
    // YouTube URLからビデオIDを抽出
    console.log('Step 1: Extracting video ID from URL:', url);
    const videoId = extractVideoId(url);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }
    console.log('Video ID extracted:', videoId);

    // YouTube Data APIを使用して動画情報を取得
    console.log('Step 2: Fetching video info from YouTube API...');
    const response = await youtube.videos.list({
      key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
      part: ['snippet', 'contentDetails'],
      id: [videoId]
    });

    if (!response.data.items?.[0]) {
      throw new Error('Video not found');
    }
    console.log('YouTube API response received:', {
      id: response.data.items[0].id,
      snippet: response.data.items[0].snippet,
      contentDetails: response.data.items[0].contentDetails
    });

    const video = response.data.items[0];
    const originalTitle = video.snippet?.title || 'Untitled Video';
    const originalDescription = video.snippet?.description || '';
    const duration = parseDuration(video.contentDetails?.duration || 'PT0S');
    const thumbnailUrl = video.snippet?.thumbnails?.standard?.url || 
                        video.snippet?.thumbnails?.high?.url || 
                        video.snippet?.thumbnails?.default?.url || '';

    console.log('Processed video details:', {
      originalTitle,
      originalDescription: originalDescription.substring(0, 100) + '...',
      duration,
      thumbnailUrl,
      rawDuration: video.contentDetails?.duration,
      availableThumbnails: Object.keys(video.snippet?.thumbnails || {})
    });

    // GPT-4を使用して英語学習用のタイトルと説明を生成
    console.log('Step 3: Generating English learning content info...');
    console.log('Preparing prompt with video details...');
    const prompt = `Based on this YouTube video:
    Title: ${originalTitle}
    Description: ${originalDescription}
    Duration: ${duration} seconds

    Generate English learning content information in JSON format with:
    1. A clear, educational title focusing on English learning
    2. A description explaining what English skills can be learned
    3. Appropriate difficulty level (beginner/intermediate/advanced)
    4. Relevant tags for categorization (max 5 tags)

    Example response format:
    {
      "title": "Business English: Mastering Professional Communication",
      "description": "Learn essential business English skills through real-world examples...",
      "level": "intermediate",
      "tags": ["business", "communication", "professional", "vocabulary", "speaking"]
    }`;

    console.log('Preparing GPT-4 request:', {
      endpoint,
      deploymentName,
      apiVersion,
      promptLength: prompt.length,
      videoTitle: originalTitle,
      videoDuration: duration
    });
    console.time('gpt-request');
    let content = '';
    try {
      const gptResponse = await client.getChatCompletions(deploymentName, [{
        role: 'system',
        content: 'You are an AI that helps create English learning content from YouTube videos. Generate responses in JSON format.'
      }, {
        role: 'user',
        content: prompt
      }], {
        temperature: 0.3,
        maxTokens: 1000
      });
      console.timeEnd('gpt-request');
      console.log('GPT-4 response received:', {
        status: 'success',
        choices: gptResponse.choices.length,
        firstChoice: {
          content: gptResponse.choices[0]?.message?.content?.substring(0, 100) + '...',
          finishReason: gptResponse.choices[0]?.finishReason
        }
      });
      content = gptResponse.choices[0]?.message?.content || '';
    } catch (error) {
      console.timeEnd('gpt-request');
      console.error('Error from GPT-4:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      }
      throw error;
    }
    console.log('GPT-4 response received, length:', content.length);
    
    try {
      console.log('Step 4: Parsing GPT-4 response...');
      const generatedInfo = JSON.parse(content);
      console.log('Generated info:', generatedInfo);
      
      const result = {
        title: typeof generatedInfo.title === 'string' ? generatedInfo.title : originalTitle,
        description: typeof generatedInfo.description === 'string' ? generatedInfo.description : originalDescription,
        level: ['beginner', 'intermediate', 'advanced'].includes(generatedInfo.level) 
          ? generatedInfo.level as 'beginner' | 'intermediate' | 'advanced'
          : 'intermediate',
        tags: Array.isArray(generatedInfo.tags) 
          ? generatedInfo.tags
              .filter((tag: unknown): tag is string => typeof tag === 'string')
              .slice(0, 5)
          : [],
        originalTitle,
        originalDescription,
        duration,
        thumbnailUrl
      };
      console.log('Step 5: Processing complete');
      return result;
    } catch (parseError) {
      console.error('Error parsing GPT response:', parseError);
      console.log('Raw GPT response:', content);
      // パース失敗時はオリジナルの情報を使用
      console.log('Falling back to original video info');
      return {
        title: originalTitle,
        description: originalDescription,
        level: 'intermediate',
        tags: [],
        originalTitle,
        originalDescription,
        duration,
        thumbnailUrl
      };
    }
  } catch (error) {
    console.error('Error getting YouTube info:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        context: {
          url,
          stage: 'youtube_info'
        }
      });
    }
    throw new Error(`Failed to get YouTube video information: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// YouTube URLからビデオIDを抽出するヘルパー関数
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

// ISO 8601 期間形式を秒数に変換するヘルパー関数
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const [, hours, minutes, seconds] = match;
  return (parseInt(hours || '0') * 3600) +
         (parseInt(minutes || '0') * 60) +
         parseInt(seconds || '0');
}
