import { Router, Request, Response } from 'express';
import { AzureOpenAI } from 'openai';
import { DefaultAzureCredential, getBearerTokenProvider } from '@azure/identity';

const router = Router();

// Azure OpenAI設定の検証
const requiredEnvVars = [
  'AZURE_OPENAI_ENDPOINT',
  'AZURE_OPENAI_DEPLOYMENT_NAME',
  'AZURE_OPENAI_API_VERSION'
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Required environment variable ${envVar} is not set`);
  }
}

const endpoint = process.env.AZURE_OPENAI_ENDPOINT!;
const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME!;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION!;

// Azure OpenAIクライアントの設定
const openai = new AzureOpenAI({
  endpoint,
  apiVersion,
  deployment: deploymentName,
  apiKey: process.env.AZURE_OPENAI_API_KEY,
});

interface GenerateImageRequest {
  prompt: string;
}

interface GenerateImageResponse {
  url: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

const generateImage = async (
  req: Request<{}, GenerateImageResponse | ErrorResponse, GenerateImageRequest>,
  res: Response<GenerateImageResponse | ErrorResponse>
): Promise<void> => {
  try {
    console.log('\n=== Image Generation Request ===');
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);

    const { prompt } = req.body;
    if (!prompt) {
      console.log('Error: Prompt is missing');
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const fullPrompt = `${prompt}. The image should be professional and suitable for a learning platform.`;
    console.log('\n=== Azure OpenAI Request ===');
    console.log('Endpoint:', endpoint);
    console.log('Deployment:', deploymentName);
    console.log('API Version:', apiVersion);
    console.log('Full Prompt:', fullPrompt);

    const results = await openai.images.generate({
      prompt: fullPrompt,
      n: 1,
      size: "1024x1024",
      style: "vivid",
      model: "",
    });

    console.log('\n=== Azure OpenAI Response ===');
    console.log('Raw Response:', JSON.stringify(results, null, 2));

    if (!results?.data?.[0]?.url) {
      console.error('Invalid response format:', JSON.stringify(results, null, 2));
      throw new Error('Invalid response from image generation API');
    }

    const imageUrl = results.data[0].url;
    console.log('\n=== Generated Image URL ===');
    console.log(imageUrl);
    
    res.json({ url: imageUrl });

  } catch (error) {
    console.error('\n=== Error in Image Generation ===');
    console.error('Error details:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    res.status(500).json({ 
      error: 'Failed to generate image',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

router.post('/generate', generateImage);

export default router;
