const { OpenAIClient, AzureKeyCredential } = require('@azure/openai');
const dotenv = require('dotenv');
const path = require('path');

// .env ファイルを読み込む
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function testAzureOpenAI() {
  // 環境変数の確認
  console.log('Checking environment variables...');
  const endpoint = process.env.NEXT_PUBLIC_AZURE_OPENAI_MOVIE_ENDPOINT?.replace(/\/$/, '') || '';
  const apiKey = process.env.NEXT_PUBLIC_AZURE_OPENAI_MOVIE_API_KEY || '';
  const deploymentName = 'gpt-4'; // 標準的なモデル名に変更
  const apiVersion = process.env.NEXT_PUBLIC_AZURE_OPENAI_MOVIE_API_VERSION || '2024-02-01';

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
      // getChatCompletions を試す（GPT-4 は chat completions のみサポート）
      console.log('Testing getChatCompletions...');
      const chatResponse = await client.getChatCompletions(deploymentName, [{
        role: 'system',
        content: 'You are an AI that helps create English learning content. Generate responses in JSON format.'
      }, {
        role: 'user',
        content: prompt
      }], {
        temperature: 0.3,
        maxTokens: 100
      });
      console.log('Chat response:', {
        choices: chatResponse.choices.length,
        firstChoice: chatResponse.choices[0]?.message,
        usage: chatResponse.usage
      });
    } catch (error) {
      console.error('getChatCompletions failed:', {
        code: error.code,
        message: error.message,
        details: error.details
      });
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
