import 'dotenv/config';
import { uploadFile, CONTAINERS } from './lib/storage';

async function testStorage() {
  try {
    console.log('Starting storage test...');
    console.log('Environment variables:');
    console.log('AZURE_STORAGE_ACCOUNT_NAME:', process.env.AZURE_STORAGE_ACCOUNT_NAME);
    console.log('AZURE_STORAGE_ACCOUNT_KEY:', process.env.AZURE_STORAGE_ACCOUNT_KEY ? '[Set]' : '[Not Set]');

    // テスト用のテキストデータ
    const testData = Buffer.from('Hello, this is a test file');
    const filename = 'test.txt';
    const contentType = 'text/plain';

    console.log('\nUploading test file...');
    console.log('File details:');
    console.log('- Name:', filename);
    console.log('- Size:', testData.length, 'bytes');
    console.log('- Type:', contentType);
    console.log('- Container:', CONTAINERS.CERTIFICATION_IMAGES);

    const url = await uploadFile(
      CONTAINERS.CERTIFICATION_IMAGES,
      testData,
      filename,
      contentType
    );

    console.log('\nUpload successful!');
    console.log('File URL:', url);
  } catch (error) {
    console.error('\nTest failed:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  }
}

// テストを実行
testStorage();
