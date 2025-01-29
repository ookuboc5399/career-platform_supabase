import { NextRequest } from 'next/server';
import { CosmosClient } from '@azure/cosmos';
import axios from 'axios';
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import { textToSpeech } from '@/lib/azure-speech';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const sendProgress = async (step: number, total: number, message: string) => {
    console.log(`Progress: ${message} (${step}/${total})`);
    const progress = {
      step,
      total,
      message,
    };
    await writer.write(encoder.encode(`data: ${JSON.stringify(progress)}\n\n`));
  };

  const sendError = async (error: unknown, phase: string) => {
    console.error(`Error in ${phase}:`, error);
    let errorMessage = `Error in ${phase}: `;
    
    if (error instanceof Error) {
      errorMessage += error.message;
      console.error('Error stack:', error.stack);
    } else if (axios.isAxiosError(error)) {
      errorMessage += `API Error: ${error.message}`;
      if (error.response) {
        errorMessage += `\nStatus: ${error.response.status}\nData: ${JSON.stringify(error.response.data)}`;
        console.error('API Response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });
      }
      if (error.config) {
        console.error('API Request:', {
          url: error.config.url,
          method: error.config.method,
          headers: error.config.headers,
          data: error.config.data,
        });
      }
    } else {
      errorMessage += 'Unknown error occurred';
      console.error('Unknown error details:', error);
    }

    await writer.write(encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`));
    await writer.close();
  };

  try {
    // 環境変数のチェック
    console.log('1. Checking environment variables...');
    const requiredEnvVars = {
      'AZURE_OPENAI_NEWS_ENDPOINT': process.env.AZURE_OPENAI_NEWS_ENDPOINT,
      'AZURE_OPENAI_NEWS_API_KEY': process.env.AZURE_OPENAI_NEWS_API_KEY,
      'AZURE_OPENAI_NEWS_DEPLOYMENT_NAME': process.env.AZURE_OPENAI_NEWS_DEPLOYMENT_NAME,
    };

    const missingEnvVars = Object.entries(requiredEnvVars)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingEnvVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    }

    console.log('Environment variables loaded:', {
      openaiEndpoint: process.env.AZURE_OPENAI_NEWS_ENDPOINT,
      deploymentName: process.env.AZURE_OPENAI_NEWS_DEPLOYMENT_NAME,
    });

    await sendProgress(1, 2, 'ニュースを生成中...');

    // ニュースの生成
    console.log('2. Generating news...');
    const newsPrompt = `Generate 3 current news summaries in the following format:
    1. [Title]
    [Brief summary]
    2. [Title]
    [Brief summary]
    3. [Title]
    [Brief summary]`;

    const newsApiUrl = `${process.env.AZURE_OPENAI_NEWS_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_NEWS_DEPLOYMENT_NAME}/chat/completions?api-version=2023-05-15`;
    console.log('News API URL:', newsApiUrl);

    const newsApiHeaders = {
      'api-key': process.env.AZURE_OPENAI_NEWS_API_KEY,
      'Content-Type': 'application/json',
    };
    console.log('News API Headers:', {
      ...newsApiHeaders,
      'api-key': '***' // APIキーを隠す
    });

    const newsApiBody = {
      messages: [{ role: 'user', content: newsPrompt }],
      temperature: 0.7,
      max_tokens: 800,
    };
    console.log('News API Request Body:', newsApiBody);

    try {
      console.log('Sending request to Azure OpenAI...');
      const newsResponse = await axios.post(
        newsApiUrl,
        newsApiBody,
        { headers: newsApiHeaders }
      );

      console.log('News API Response:', {
        status: newsResponse.status,
        headers: newsResponse.headers,
        data: newsResponse.data,
      });

      const newsSummaries = newsResponse.data.choices[0].message?.content || '';
      console.log('Generated news summaries:', newsSummaries);

      await sendProgress(2, 2, '完了');

      // 最終データの送信
      await writer.write(encoder.encode(`data: ${JSON.stringify({ step: 2, total: 2, message: '完了', result: { content: newsSummaries } })}\n\n`));
      await writer.close();

      return new Response(stream.readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } catch (error) {
      console.error('Error in news generation:', error);
      throw error;
    }
  } catch (error) {
    await sendError(error, error instanceof Error ? error.stack?.split('\n')[1]?.trim() || 'Unknown phase' : 'Unknown phase');
    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  }
}

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
