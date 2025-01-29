import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { RTClient } from '../../standalone/src/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function* readInputFile(
  filename: string,
  chunkSize: number = 4096,
): AsyncIterable<Uint8Array> {
  const file = await fs.open(filename, "r");
  try {
    while (true) {
      const buffer = new Uint8Array(chunkSize);
      const { bytesRead } = await file.read(buffer);
      if (bytesRead === 0) {
        break;
      }
      yield buffer.slice(0, bytesRead);
      if (bytesRead < buffer.length) {
        break;
      }
    }
  } finally {
    await file.close();
  }
}

async function main() {
  let client: RTClient | undefined;
  try {
    const endpoint = process.env.NEXT_PUBLIC_AZURE_OPENAI_CONVA_ENDPOINT;
    const apiKey = process.env.NEXT_PUBLIC_AZURE_OPENAI_CONVA_API_KEY;
    const deploymentName = process.env.NEXT_PUBLIC_AZURE_OPENAI_CONVA_DEPLOYMENT_NAME;

    if (!endpoint || !apiKey || !deploymentName) {
      throw new Error('Azure OpenAI environment variables are not set');
    }

    console.log('Creating realtime client...');
    client = new RTClient(
      new URL(endpoint),
      { key: apiKey },
      { deployment: deploymentName }
    );

    console.log('Initializing session...');
    await client.init();

    console.log('Configuring session...');
    await client.configure({
      instructions: 'You are a helpful assistant.',
    });

    const filePath = path.join(__dirname, '../../standalone/test/input/arc-easy-q237-tts.raw');
    console.log('Reading audio file:', filePath);

    for await (const chunk of readInputFile(filePath)) {
      console.log('Sending audio chunk:', chunk.length, 'bytes');
      await client.sendAudio(chunk);
    }

    console.log('Committing audio...');
    const audioItem = await client.commitAudio();
    await audioItem.waitForCompletion();

    console.log('Generating response...');
    const response = await client.generateResponse();
    if (response) {
      for await (const item of response) {
        if (item.type === 'message') {
          for await (const content of item) {
            if (content.type === 'text') {
              for await (const chunk of content.textChunks()) {
                console.log('Text chunk:', chunk);
              }
            } else if (content.type === 'audio') {
              for await (const chunk of content.audioChunks()) {
                console.log('Audio chunk:', chunk.length, 'bytes');
              }
              for await (const chunk of content.transcriptChunks()) {
                console.log('Transcript chunk:', chunk);
              }
            }
          }
        }
      }
    }

    console.log('Closing session...');
    await client.close();
    console.log('Session closed');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    if (client) {
      try {
        await client.close();
      } catch (error) {
        console.error('Error closing client:', error);
      }
    }
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
