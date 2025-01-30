import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import dotenv from 'dotenv';
import path from 'path';

// .env ファイルを読み込む
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function testAzureOpenAI() {
  // 環境変数の確認
  console.log('Checking environment variables...');
  const endpoint = process.env.NEXT_PUBLIC_AZURE_OPENAI_MOVIE_ENDPOINT?.replace(/\/$/, '') || '';
  const apiKey = process.env.NEXT_PUBLIC_AZURE_OPENAI_MOVIE_API_KEY || '';
  const deploymentName = process.env.NEXT_PUBLIC_AZURE_OPENAI_MOVIE_DEPLOYMENT_NAME || 'gpt-4o-realtime-preview';
  const apiVersion = process.env.NEXT_PUBLIC_AZURE_OPENAI_MOVIE_API_VERSION || '2024-10-01-preview';

  console.log('Configuration:', {
    endpoint,
    deploymentName,
    apiVersion,
    apiKey: apiKey ? 'Present' : 'Missing'
  });

  try {
    console.log('Initializing Azure OpenAI client...');
    const client = new OpenAIClient(
      endpoint,
      new AzureKeyCredential(apiKey),
      { apiVersion }
    );

    // シンプルなプロンプトでテスト
    const prompt = 'Generate a short English learning tip in JSON format.';
    console.log('Sending test request...');
    console.time('request-time');

    try {
      // getCompletions を試す
      console.log('Testing getCompletions...');
      const completionResponse = await client.getCompletions(deploymentName, [prompt], {
        temperature: 0.3,
        maxTokens: 100
      });
      console.log('Completion response:', {
        choices: completionResponse.choices.length,
        firstChoice: completionResponse.choices[0]?.text
      });
    } catch (error) {
      console.error('getCompletions failed:', error);
    }

    try {
      // getChatCompletions も試す
      console.log('Testing getChatCompletions...');
      const chatResponse = await client.getChatCompletions(deploymentName, [{
        role: 'user',
        content: prompt
      }], {
        temperature: 0.3,
        maxTokens: 100
      });
      console.log('Chat response:', {
        choices: chatResponse.choices.length,
        firstChoice: chatResponse.choices[0]?.message
      });
    } catch (error) {
      console.error('getChatCompletions failed:', error);
    }

    console.timeEnd('request-time');
  } catch (error) {
    console.error('Test failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
  }
}

testAzureOpenAI().catch(console.error);
