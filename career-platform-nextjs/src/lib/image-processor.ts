import api from './api';

export interface ChapterContent {
  title: string;
  content: string;
  webText: string;
  questions: {
    question: string;
    options: string[];
    correctAnswers: number[];
    explanation: string;
    explanationImages: string[];
    explanationTable: {
      headers: string[];
      rows: string[][];
    };
  }[];
}

export async function processGoogleDriveImages(folderId: string): Promise<ChapterContent[]> {
  try {
    console.log('Processing images from folder:', folderId);
    const response = await api.post('/api/google-vision/process-images', { folderId });
    console.log('Received chapters:', response.data);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error processing images:', error);
    throw error;
  }
}
