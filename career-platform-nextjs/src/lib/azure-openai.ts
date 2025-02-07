import axios from 'axios';
import { Subtitle, VocabularyItem } from '@/types/english';
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import { SpeechConfig, AudioConfig, SpeechRecognizer } from 'microsoft-cognitiveservices-speech-sdk';

// Azure OpenAI クライアントの作成
function createOpenAIClient() {
  const apiKey = process.env.AZURE_OPENAI_API_KEY!;
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT!;
  return new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));
}

// Azure Speech Services の設定を作成
function createSpeechConfig() {
  const speechKey = process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY!;
  const speechRegion = process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION!;
  return SpeechConfig.fromSubscription(speechKey, speechRegion);
}

export async function generateNewsContent() {
  try {
    const response = await axios.post('/api/english/news/generate');
    return response.data;
  } catch (error) {
    console.error('Error generating news content:', error);
    throw error;
  }
}

// 動画から音声認識でテキストを抽出
export async function extractTranscript(audioBuffer: Buffer): Promise<string> {
  const speechConfig = createSpeechConfig();
  speechConfig.speechRecognitionLanguage = 'en-US';
  
  const audioConfig = AudioConfig.fromWavFileInput(audioBuffer);
  const recognizer = new SpeechRecognizer(speechConfig, audioConfig);

  return new Promise((resolve, reject) => {
    let transcript = '';
    
    recognizer.recognized = (s, e) => {
      if (e.result.text) {
        transcript += e.result.text + ' ';
      }
    };

    recognizer.recognizeOnceAsync(
      result => {
        recognizer.close();
        resolve(transcript.trim());
      },
      error => {
        recognizer.close();
        reject(error);
      }
    );
  });
}

// テキストから英単語を抽出
export async function extractVocabulary(text: string, timestamp: number): Promise<VocabularyItem[]> {
  const client = createOpenAIClient();

  const prompt = `
    Extract important English vocabulary from the following text. For each word:
    1. Provide the Japanese meaning
    2. Show how it's used in context
    
    Text: "${text}"
    
    Format the response as a JSON array of objects with properties:
    - word: the English word
    - meaning: Japanese meaning
    - context: example usage from the text
  `;

  const response = await client.getCompletions(process.env.AZURE_OPENAI_DEPLOYMENT_NAME!, [prompt]);
  const result = JSON.parse(response.choices[0].text);
  
  return result.map((item: any) => ({
    ...item,
    timestamp
  }));
}

// 英語テキストを日本語に翻訳
export async function translateToJapanese(text: string): Promise<string> {
  const client = createOpenAIClient();

  const prompt = `Translate the following English text to natural Japanese:
    "${text}"`;

  const response = await client.getCompletions(process.env.AZURE_OPENAI_DEPLOYMENT_NAME!, [prompt]);
  return response.choices[0].text.trim();
}

// テキストから字幕を生成
export async function generateSubtitles(transcript: string): Promise<Subtitle[]> {
  // テキストを文単位で分割
  const sentences = transcript.match(/[^.!?]+[.!?]+/g) || [];
  const subtitles: Subtitle[] = [];
  let currentTime = 0;

  for (const sentence of sentences) {
    const translation = await translateToJapanese(sentence);
    
    // 簡易的な時間計算（1文字あたり0.1秒と仮定）
    const duration = sentence.length * 0.1;
    
    subtitles.push({
      startTime: currentTime,
      endTime: currentTime + duration,
      text: sentence.trim(),
      translation
    });
    
    currentTime += duration;
  }

  return subtitles;
}
