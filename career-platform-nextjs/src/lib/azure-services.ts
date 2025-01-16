import axios from 'axios';

// Azure Video Indexer API configuration
const VIDEO_INDEXER_API = {
  location: process.env.NEXT_PUBLIC_AZURE_VIDEO_INDEXER_LOCATION || '',
  accountId: process.env.NEXT_PUBLIC_AZURE_VIDEO_INDEXER_ACCOUNT_ID || '',
  apiKey: process.env.NEXT_PUBLIC_AZURE_VIDEO_INDEXER_API_KEY || '',
  apiUrl: 'https://api.videoindexer.ai',
};

// Azure Cognitive Services Text-to-Speech configuration
const SPEECH_API = {
  key: process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY || '',
  region: process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION || '',
  endpoint: `https://${process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
};

interface VideoIndexerAccessToken {
  token: string;
  expiresOn: Date;
}

let accessToken: VideoIndexerAccessToken | null = null;

async function getAccessToken(): Promise<string> {
  if (accessToken && accessToken.expiresOn > new Date()) {
    return accessToken.token;
  }

  try {
    const response = await axios.get(
      `${VIDEO_INDEXER_API.apiUrl}/auth/${VIDEO_INDEXER_API.location}/Accounts/${VIDEO_INDEXER_API.accountId}/AccessToken`,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': VIDEO_INDEXER_API.apiKey,
        },
      }
    );

    accessToken = {
      token: response.data,
      expiresOn: new Date(Date.now() + 3600000), // Token expires in 1 hour
    };

    return accessToken.token;
  } catch (error) {
    console.error('Error getting Video Indexer access token:', error);
    throw new Error('Failed to get access token');
  }
}

export async function uploadToVideoIndexer(videoFile: File, name: string) {
  try {
    const token = await getAccessToken();
    
    // Create a form data object to send the video file
    const formData = new FormData();
    formData.append('video', videoFile);

    // Upload the video to Video Indexer
    const response = await axios.post(
      `${VIDEO_INDEXER_API.apiUrl}/${VIDEO_INDEXER_API.location}/Accounts/${VIDEO_INDEXER_API.accountId}/Videos`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          name,
          privacy: 'Private',
          language: 'en-US',
        },
      }
    );

    return response.data.id;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw new Error('Failed to upload video');
  }
}

export async function generateSpeechFromText(text: string): Promise<Blob> {
  try {
    const response = await axios.post(
      SPEECH_API.endpoint,
      `<speak version='1.0' xml:lang='en-US'>
        <voice xml:lang='en-US' xml:gender='Female' name='en-US-JennyNeural'>
          ${text}
        </voice>
      </speak>`,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': SPEECH_API.key,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
        },
        responseType: 'blob',
      }
    );

    return new Blob([response.data], { type: 'audio/mpeg' });
  } catch (error) {
    console.error('Error generating speech:', error);
    throw new Error('Failed to generate speech');
  }
}

export async function getVideoInsights(videoId: string) {
  try {
    const token = await getAccessToken();
    
    const response = await axios.get(
      `${VIDEO_INDEXER_API.apiUrl}/${VIDEO_INDEXER_API.location}/Accounts/${VIDEO_INDEXER_API.accountId}/Videos/${videoId}/Index`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error getting video insights:', error);
    throw new Error('Failed to get video insights');
  }
}
