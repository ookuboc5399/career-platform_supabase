import { NextRequest, NextResponse } from 'next/server';
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
const client = new OpenAIClient(
  process.env.NEXT_PUBLIC_AZURE_OPENAI_MOVIE_ENDPOINT,
  new AzureKeyCredential(process.env.NEXT_PUBLIC_AZURE_OPENAI_MOVIE_API_KEY),
  { apiVersion: process.env.NEXT_PUBLIC_AZURE_OPENAI_MOVIE_API_VERSION || '2024-02-01' }
);

const deploymentName = process.env.NEXT_PUBLIC_AZURE_OPENAI_MOVIE_DEPLOYMENT_NAME || 'gpt-4';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // YouTube URLからビデオIDを抽出
    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    // YouTube Data APIを使用して動画情報を取得
    console.log('Fetching YouTube video info:', videoId);
    const response = await youtube.videos.list({
      key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
      part: ['snippet', 'contentDetails'],
      id: [videoId]
    });

    if (!response.data.items?.[0]) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    const video = response.data.items[0];
    const originalTitle = video.snippet?.title || 'Untitled Video';
    const originalDescription = video.snippet?.description || '';
    const duration = parseDuration(video.contentDetails?.duration || 'PT0S');
    const thumbnailUrl = video.snippet?.thumbnails?.standard?.url || 
                        video.snippet?.thumbnails?.high?.url || 
                        video.snippet?.thumbnails?.default?.url || '';

    // まずYouTube情報を返す
    const initialInfo = {
      title: originalTitle,
      description: originalDescription,
      level: 'intermediate',
      tags: [],
      originalTitle,
      originalDescription,
      duration,
      thumbnailUrl
    };

    // バックグラウンドでGPT-4の処理を開始
    console.log('Starting GPT-4 processing in background...');
    processWithGPT4(videoId, initialInfo).catch(error => {
      console.error('Background GPT-4 processing failed:', error);
    });

    return NextResponse.json(initialInfo);

  } catch (error) {
    console.error('Error getting YouTube info:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get YouTube video information' },
      { status: 500 }
    );
  }
}

async function processWithGPT4(videoId: string, info: any) {
  try {
    // まず動画の内容を分析
    const analysisPrompt = `Based on this YouTube video:
    Title: ${info.originalTitle}
    Description: ${info.originalDescription}
    Duration: ${info.duration} seconds

    1. Generate English learning content information in JSON format:
    {
      "title": "Business English: Mastering Professional Communication",
      "description": "Learn essential business English skills through real-world examples...",
      "level": "intermediate",
      "tags": ["business", "communication", "professional", "vocabulary", "speaking"]
    }

    2. Generate 5 key moments from the video with timestamps and subtitles in JSON format:
    {
      "subtitles": [
        {
          "startTime": 0,
          "endTime": 10,
          "text": "Hello everyone, today we'll discuss...",
          "translation": "皆さん、こんにちは。今日は...について話します"
        }
      ]
    }

    3. Generate 5 important vocabulary words with meanings and example sentences in JSON format:
    {
      "vocabulary": [
        {
          "word": "negotiate",
          "meaning": "交渉する",
          "example": "It's important to negotiate the terms of the contract carefully."
        }
      ]
    }

    Combine all information into a single JSON response.`;

    const gptResponse = await client.getChatCompletions(deploymentName, [{
      role: 'system',
      content: 'You are an AI that helps create English learning content from YouTube videos. Generate detailed responses in JSON format including subtitles and vocabulary.'
    }, {
      role: 'user',
      content: analysisPrompt
    }], {
      temperature: 0.3,
      maxTokens: 2000
    });

    const content = gptResponse.choices[0]?.message?.content || '';
    console.log('GPT-4 response received:', content);

    try {
      const generatedInfo = JSON.parse(content);
      console.log('Generated info:', generatedInfo);

      // TODO: ここでデータベースを更新する処理を追加
      // await updateMovieInfo(videoId, {
      //   ...info,
      //   ...generatedInfo,
      //   processed: true,
      //   lastProcessingStage: 'completed'
      // });
    } catch (error) {
      console.error('Error parsing GPT-4 response:', error);
    }

  } catch (error) {
    console.error('Error in GPT-4 processing:', error);
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
