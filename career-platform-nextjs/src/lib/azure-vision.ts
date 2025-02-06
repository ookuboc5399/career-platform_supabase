import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { ApiKeyCredentials } from '@azure/ms-rest-js';

const key = process.env.AZURE_COMPUTER_VISION_KEY || '';
const endpoint = process.env.AZURE_COMPUTER_VISION_ENDPOINT || '';

// Azure Computer Vision APIの設定を確認
if (!key) {
  console.error('Azure Computer Vision API key is not configured');
  throw new Error('Azure Computer Vision API key is not configured');
}
if (!endpoint) {
  console.error('Azure Computer Vision endpoint is not configured');
  throw new Error('Azure Computer Vision endpoint is not configured');
}

console.log('Initializing Azure Vision client with endpoint:', endpoint);

interface TextLine {
  text: string;
}

interface ReadResult {
  status?: string;
  analyzeResult?: {
    readResults?: Array<{
      lines?: TextLine[];
    }>;
  };
}

const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }),
  endpoint
);

export async function extractTextFromImage(imageUrl: string): Promise<string> {
  try {
    console.log('Starting OCR operation with URL:', imageUrl);

    // OCR操作を開始
    console.log('Initiating OCR operation...');
    const result = await computerVisionClient.read(imageUrl);
    
    // 操作IDを取得
    const operationId = result.operationLocation.split('/').pop() || '';
    console.log('Operation ID:', operationId);
    
    // 結果が準備できるまで待機
    console.log('Waiting for results...');
    let textResult: ReadResult = await computerVisionClient.getReadResult(operationId);
    let attempts = 0;
    const maxAttempts = 60; // 最大60秒待機

    while (textResult.status && ['running', 'notStarted'].includes(textResult.status)) {
      console.log('Operation status:', textResult.status, 'Attempt:', attempts + 1);
      await new Promise(resolve => setTimeout(resolve, 1000));
      textResult = await computerVisionClient.getReadResult(operationId);
      attempts++;

      if (attempts >= maxAttempts) {
        throw new Error('OCR operation timed out after 60 seconds');
      }
    }

    // テキストを抽出
    let extractedText = '';
    if (!textResult.status) {
      throw new Error('Invalid response from OCR service');
    }

    if (textResult.status === 'failed') {
      throw new Error('OCR operation failed');
    }

    if (textResult.status === 'succeeded') {
      console.log('OCR operation succeeded');
      console.log('Full result:', JSON.stringify(textResult, null, 2));
      
      if (!textResult.analyzeResult?.readResults?.length) {
        console.error('No read results in response');
        throw new Error('OCRの結果が不正です');
      }

      for (const page of textResult.analyzeResult.readResults) {
        console.log('Processing page with', page.lines?.length || 0, 'lines');
        for (const line of page.lines || []) {
          extractedText += line.text + '\n';
          console.log('Found line:', line.text);
        }
      }
      console.log('Extracted text length:', extractedText.length);

      if (extractedText.trim().length === 0) {
        throw new Error('No text was found in the image');
      }
    } else {
      console.error('Unexpected status:', textResult.status);
      throw new Error(`OCR operation failed with status: ${textResult.status}`);
    }

    return extractedText.trim();
  } catch (error) {
    console.error('Error extracting text from image:', error);
    if (error instanceof Error) {
      throw new Error(`テキスト抽出に失敗しました: ${error.message}`);
    }
    throw error;
  }
}

export async function extractTextFromBuffer(imageBuffer: Buffer): Promise<string> {
  try {
    console.log('Starting OCR operation with buffer size:', imageBuffer.length);

    // OCR操作を開始
    console.log('Initiating OCR operation...');
    const result = await computerVisionClient.readInStream(imageBuffer);
    
    // 操作IDを取得
    const operationId = result.operationLocation.split('/').pop() || '';
    console.log('Operation ID:', operationId);
    
    // 結果が準備できるまで待機
    console.log('Waiting for results...');
    let textResult: ReadResult = await computerVisionClient.getReadResult(operationId);
    let attempts = 0;
    const maxAttempts = 60; // 最大60秒待機

    while (textResult.status && ['running', 'notStarted'].includes(textResult.status)) {
      console.log('Operation status:', textResult.status, 'Attempt:', attempts + 1);
      await new Promise(resolve => setTimeout(resolve, 1000));
      textResult = await computerVisionClient.getReadResult(operationId);
      attempts++;

      if (attempts >= maxAttempts) {
        throw new Error('OCR operation timed out after 60 seconds');
      }
    }

    // テキストを抽出
    let extractedText = '';
    if (!textResult.status) {
      throw new Error('Invalid response from OCR service');
    }

    if (textResult.status === 'failed') {
      throw new Error('OCR operation failed');
    }

    if (textResult.status === 'succeeded') {
      console.log('OCR operation succeeded');
      console.log('Full result:', JSON.stringify(textResult, null, 2));
      
      if (!textResult.analyzeResult?.readResults?.length) {
        console.error('No read results in response');
        throw new Error('OCRの結果が不正です');
      }

      for (const page of textResult.analyzeResult.readResults) {
        console.log('Processing page with', page.lines?.length || 0, 'lines');
        for (const line of page.lines || []) {
          extractedText += line.text + '\n';
          console.log('Found line:', line.text);
        }
      }
      console.log('Extracted text length:', extractedText.length);

      if (extractedText.trim().length === 0) {
        throw new Error('No text was found in the image');
      }
    } else {
      console.error('Unexpected status:', textResult.status);
      throw new Error(`OCR operation failed with status: ${textResult.status}`);
    }

    return extractedText.trim();
  } catch (error) {
    console.error('Error extracting text from buffer:', error);
    if (error instanceof Error) {
      throw new Error(`テキスト抽出に失敗しました: ${error.message}`);
    }
    throw error;
  }
}
