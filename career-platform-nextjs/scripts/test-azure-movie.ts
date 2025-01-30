import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env ファイルを読み込む
dotenv.config({ path: resolve(__dirname, '../.env') });

// 環境変数のチェック
if (!process.env.NEXT_PUBLIC_AZURE_OPENAI_MOVIE_API_KEY) {
  throw new Error('NEXT_PUBLIC_AZURE_OPENAI_MOVIE_API_KEY is not defined');
}

if (!process.env.NEXT_PUBLIC_AZURE_OPENAI_MOVIE_ENDPOINT) {
  throw new Error('NEXT_PUBLIC_AZURE_OPENAI_MOVIE_ENDPOINT is not defined');
}

// OpenAI クライアントの設定
const client = new OpenAIClient(
  process.env.NEXT_PUBLIC_AZURE_OPENAI_MOVIE_ENDPOINT,
  new AzureKeyCredential(process.env.NEXT_PUBLIC_AZURE_OPENAI_MOVIE_API_KEY),
  { apiVersion: '2024-08-01-preview' }
);

const deploymentName = 'gpt-4-vision-';

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

async function testMovieProcessing() {
  try {
    // テスト用の動画情報
    const testData = {
      title: 'Every Time Selena Gomez Appeared on the Ellen Show',
      description: 'Selena Gomez is one of the world\'s biggest stars, and every appearance she made on Ellen is a must-watch. Enjoy all her unforgettable moments on the show!',
      duration: 3147
    };

    console.log('Test data:', testData);

    // プロンプトの作成
    const prompt = `Based on this YouTube video content:
    Title: ${testData.title}
    Description: ${testData.description}
    Duration: ${testData.duration} seconds

    1. Generate English learning content information in JSON format:
    {
      "title": "Celebrity Interviews: Learning English with Selena Gomez",
      "description": "Learn natural English conversation and entertainment vocabulary through Selena Gomez's interviews on The Ellen Show. Perfect for understanding casual American English and celebrity talk show interactions.",
      "level": "intermediate",
      "tags": ["interview", "celebrity", "talk show", "entertainment", "casual conversation"]
    }

    2. Generate 5 key moments from the video with timestamps and subtitles in JSON format:
    {
      "subtitles": [
        {
          "startTime": 30,
          "endTime": 40,
          "text": "Ellen: So, tell us about your new album!",
          "translation": "エレン：新しいアルバムについて教えてください！"
        }
      ]
    }

    3. Generate 5 important vocabulary words with meanings and example sentences in JSON format:
    {
      "vocabulary": [
        {
          "word": "appearance",
          "meaning": "出演、登場",
          "example": "This was her first appearance on a talk show."
        }
      ]
    }

    Combine all information into a single JSON response.`;

    console.log('Sending request to GPT-4 Vision...');
    console.log('Prompt:', prompt);

    const startTime = Date.now();
    const gptResponse = await client.getChatCompletions(deploymentName, [{
      role: 'system',
      content: 'You are an AI that helps create English learning content from YouTube videos. Generate detailed responses in JSON format including subtitles and vocabulary.'
    }, {
      role: 'user',
      content: prompt
    }], {
      temperature: 0.3,
      maxTokens: 2000
    });
    const endTime = Date.now();

    console.log('GPT-4 Vision response received in', (endTime - startTime) / 1000, 'seconds');
    console.log('Response:', gptResponse.choices[0]?.message?.content);

    // レスポンスをパース
    const content = gptResponse.choices[0]?.message?.content || '';
    console.log('\nParsing response...');
    const generatedInfo = parseMarkdownJSON(content);
    console.log('Content parsed successfully');

    // 結果の検証
    console.log('\nValidating response...');
    if (generatedInfo.content_information) {
      console.log('Content Information:');
      console.log('Title:', generatedInfo.content_information.title);
      console.log('Level:', generatedInfo.content_information.level);
      console.log('Tags:', generatedInfo.content_information.tags);
    }

    if (generatedInfo.key_moments?.subtitles) {
      console.log('\nSubtitles:', generatedInfo.key_moments.subtitles.length);
      console.log('First subtitle:', generatedInfo.key_moments.subtitles[0]);
    }

    if (generatedInfo.vocabulary?.words) {
      console.log('\nVocabulary:', generatedInfo.vocabulary.words.length);
      console.log('First word:', generatedInfo.vocabulary.words[0]);
    }

  } catch (error) {
    console.error('Error in test:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
  }
}

// テストを実行
console.log('Starting Azure OpenAI movie processing test...\n');
testMovieProcessing().then(() => {
  console.log('\nTest completed');
}).catch(error => {
  console.error('\nTest failed:', error);
});
