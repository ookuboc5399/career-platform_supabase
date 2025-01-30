import { Subtitle, Vocabulary } from '@/types/english';
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import { google } from 'googleapis';

// 環境変数のチェック
if (!process.env.NEXT_PUBLIC_AZURE_OPENAI_MOVIE_API_KEY) {
  throw new Error('NEXT_PUBLIC_AZURE_OPENAI_MOVIE_API_KEY is not defined');
}

if (!process.env.NEXT_PUBLIC_AZURE_OPENAI_MOVIE_ENDPOINT) {
  throw new Error('NEXT_PUBLIC_AZURE_OPENAI_MOVIE_ENDPOINT is not defined');
}

if (!process.env.NEXT_PUBLIC_YOUTUBE_API_KEY) {
  throw new Error('NEXT_PUBLIC_YOUTUBE_API_KEY is not defined');
}

if (!process.env.NEXT_PUBLIC_AZURE_OPENAI_MOVIE_API_VERSION) {
  throw new Error('NEXT_PUBLIC_AZURE_OPENAI_MOVIE_API_VERSION is not defined');
}

if (!process.env.NEXT_PUBLIC_AZURE_OPENAI_MOVIE_DEPLOYMENT_NAME) {
  throw new Error('NEXT_PUBLIC_AZURE_OPENAI_MOVIE_DEPLOYMENT_NAME is not defined');
}

// OpenAI クライアントの設定
const client = new OpenAIClient(
  process.env.NEXT_PUBLIC_AZURE_OPENAI_MOVIE_ENDPOINT,
  new AzureKeyCredential(process.env.NEXT_PUBLIC_AZURE_OPENAI_MOVIE_API_KEY),
  { apiVersion: process.env.NEXT_PUBLIC_AZURE_OPENAI_MOVIE_API_VERSION }
);

const deploymentName = process.env.NEXT_PUBLIC_AZURE_OPENAI_MOVIE_DEPLOYMENT_NAME;

// YouTube API クライアントの設定
const youtube = google.youtube('v3');

// YouTube動画のIDを抽出
function extractVideoId(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  if (!match) {
    throw new Error('Invalid YouTube URL');
  }
  return match[1];
}

// Markdown形式のJSONをパース
function parseMarkdownJSON(content: string): any {
  try {
    // Markdown の ```json と ``` を削除
    const jsonContent = content.replace(/^```json\n/, '').replace(/\n```$/, '');
    return JSON.parse(jsonContent);
  } catch (error) {
    console.error('Error parsing Markdown JSON:', error);
    console.error('Content:', content);
    throw error;
  }
}

// YouTube動画の内容を分析して学習コンテンツを生成
export async function processYouTubeContent(videoUrl: string, title: string, description: string, duration: number) {
  try {
    console.log('Starting YouTube content analysis:', { videoUrl, title, description });

    const prompt = `Based on this YouTube video content:
    Title: ${title}
    Description: ${description}
    Duration: ${duration} seconds

    Generate English learning content in the following JSON format:

    {
      "title": "A catchy title for the English learning content",
      "description": "A description explaining what learners will learn",
      "level": "beginner|intermediate|advanced",
      "tags": ["tag1", "tag2", "tag3"],
      "subtitles": [
        {
          "startTime": 30,
          "endTime": 40,
          "text": "English text",
          "translation": "Japanese translation"
        }
      ],
      "vocabulary": [
        {
          "word": "English word",
          "translation": "Japanese meaning",
          "example": "Example sentence",
          "partOfSpeech": "noun|verb|adjective|adverb"
        }
      ]
    }

    Requirements:
    1. Generate at least 20 key moments with timestamps and translations
    2. Ensure timestamps are evenly distributed throughout the video duration
    3. Each subtitle should be 5-10 seconds long
    4. Extract 10 important vocabulary words with meanings and examples
    5. Ensure all Japanese translations are natural and accurate
    6. Set appropriate difficulty level based on the content
    7. Add relevant tags for categorization

    Important:
    - Timestamps must be in seconds and within the video duration (${duration} seconds)
    - Each subtitle should capture a complete thought or sentence
    - Translations should be natural Japanese, not literal translations
    - Include both casual and formal expressions for better learning`;

    console.log('Sending request to GPT-4...');
    console.log('Prompt:', prompt);

    const startTime = Date.now();
    const gptResponse = await client.getChatCompletions(deploymentName, [{
      role: 'system',
      content: 'You are an AI that helps create English learning content from YouTube videos. Generate detailed responses in JSON format including subtitles and vocabulary. Focus on creating natural, conversational content that helps learners understand real-world English usage.'
    }, {
      role: 'user',
      content: prompt
    }], {
      temperature: 0.3,
      maxTokens: 4000
    });
    const endTime = Date.now();

    console.log('GPT-4 response received in', (endTime - startTime) / 1000, 'seconds');
    console.log('Response:', gptResponse.choices[0]?.message?.content);

    const content = gptResponse.choices[0]?.message?.content || '';
    console.log('Parsing response...');
    const generatedInfo = parseMarkdownJSON(content);
    console.log('Content parsed successfully');

    console.log('Validating response...');
    console.log('Content Information:');
    console.log('Title:', generatedInfo.title);
    console.log('Level:', generatedInfo.level);
    console.log('Tags:', generatedInfo.tags);
    console.log('\nSubtitles:', generatedInfo.subtitles.length);
    console.log('First subtitle:', generatedInfo.subtitles[0]);
    console.log('\nVocabulary:', generatedInfo.vocabulary.length);
    console.log('First word:', generatedInfo.vocabulary[0]);
    console.log('\nTest completed');

    return generatedInfo;

  } catch (error) {
    console.error('Error in processYouTubeContent:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        context: {
          videoUrl,
          title,
          description,
          duration
        }
      });
    }
    throw new Error(`Failed to process YouTube content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
