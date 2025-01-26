import axios from 'axios';
import { 
  EnglishContent, 
  UpdateProgressDto, 
  University,
  Certification,
  CertificationChapter,
  ProgrammingLanguage,
  ProgrammingChapter,
  CertificationProgress,
  EnglishProgress,
  ProgrammingProgress
} from '@/types/api';

const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side
    return process.env.EXPRESS_API_URL || 'http://localhost:4000';
  }
  // Client-side
  return process.env.NEXT_PUBLIC_EXPRESS_API_URL || 'http://localhost:4000';
};

const createApiInstance = () => {
  return axios.create({
    baseURL: getBaseUrl(),
    withCredentials: false,
  });
};

const api = createApiInstance();

// ファイルアップロード関連
export async function uploadFile(file: File, type: string): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const data = response.data;
    return data.url;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

export async function generateSasToken(containerName: string, blobName: string): Promise<string> {
  const response = await api.post('/api/upload/sas', {
    containerName,
    blobName,
  });

  return response.data.sasToken;
}

export async function deleteFile(containerName: string, url: string): Promise<void> {
  await api.delete('/api/upload', {
    data: {
      containerName,
      url,
    },
  });
}

// 資格学習関連
export async function getCertifications(): Promise<Certification[]> {
  const response = await api.get('/api/certifications');
  return response.data;
}

export async function getCertification(id: string): Promise<Certification> {
  const response = await api.get(`/api/certifications/${id}`);
  return response.data;
}

export async function createCertification(data: FormData): Promise<Certification> {
  const response = await api.post('/api/certifications', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function updateCertification(id: string, data: Partial<Certification>): Promise<Certification> {
  const response = await api.put(`/api/certifications/${id}`, data);
  return response.data;
}

export async function deleteCertification(id: string): Promise<void> {
  await api.delete(`/api/certifications/${id}`);
}

// チャプター関連
export async function getChaptersByCertificationId(certificationId: string): Promise<CertificationChapter[]> {
  const response = await api.get(`/api/certifications/${certificationId}/chapters`);
  return response.data;
}

export async function createChapter(certificationId: string, data: Omit<CertificationChapter, 'id'>): Promise<CertificationChapter> {
  console.log('Creating chapter with data:', { certificationId, data });
  const response = await api.post(`/api/certifications/${certificationId}/chapters`, data);
  console.log('Create chapter response:', response.data);
  return response.data;
}

export async function updateChapter(certificationId: string, chapterId: string, data: Partial<CertificationChapter>): Promise<CertificationChapter> {
  const response = await api.put(`/api/certifications/${certificationId}/chapters/${chapterId}`, data);
  return response.data;
}

export async function deleteChapter(certificationId: string, chapterId: string): Promise<void> {
  await api.delete(`/api/certifications/${certificationId}/chapters/${chapterId}`);
}

export async function getCertificationChapter(chapterId: string): Promise<CertificationChapter> {
  const response = await api.get(`/api/certifications/chapters/${chapterId}`);
  return response.data;
}

export async function updateCertificationProgress(data: {
  userId: string;
  certificationId: string;
  completedQuestions: string[];
}): Promise<CertificationProgress> {
  const response = await api.post('/api/certifications/progress', data);
  return response.data;
}

// プログラミング学習関連
export async function getProgrammingLanguages(): Promise<ProgrammingLanguage[]> {
  const response = await api.get('/api/programming');
  return response.data;
}

export async function getProgrammingLanguage(id: string): Promise<ProgrammingLanguage> {
  const response = await api.get(`/api/programming/${id}`);
  return response.data;
}

export async function getProgrammingChapters(languageId: string): Promise<ProgrammingChapter[]> {
  const response = await api.get(`/api/programming/chapters?languageId=${languageId}`);
  return response.data;
}

export async function getProgrammingChapter(chapterId: string): Promise<ProgrammingChapter> {
  const response = await api.get(`/api/programming/chapters/${chapterId}`);
  return response.data;
}

export async function createProgrammingChapter(languageId: string, data: Omit<ProgrammingChapter, 'id' | 'languageId' | 'createdAt' | 'updatedAt'>): Promise<ProgrammingChapter> {
  const response = await api.post('/api/programming/chapters', {
    languageId,
    ...data,
  });
  return response.data;
}

export async function updateProgrammingChapter(chapterId: string, data: Partial<ProgrammingChapter>): Promise<ProgrammingChapter> {
  const response = await api.put(`/api/programming/chapters/${chapterId}`, data);
  return response.data;
}

export async function deleteProgrammingChapter(chapterId: string): Promise<void> {
  await api.delete(`/api/programming/chapters/${chapterId}`);
}

export async function updateProgrammingProgress(userId: string, languageId: string, chapterId: string, data: UpdateProgressDto): Promise<ProgrammingProgress> {
  const response = await api.post('/api/programming/progress', {
    userId,
    languageId,
    chapterId,
    ...data,
  });
  return response.data;
}

// 英語学習関連
export async function getEnglishContent(): Promise<EnglishContent[]> {
  try {
    const response = await api.get('/api/english');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch English content:', error);
    throw new Error('Failed to fetch English content');
  }
}

export async function getEnglishContentById(id: string): Promise<EnglishContent> {
  try {
    const response = await api.get(`/api/english/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch English content with ID ${id}:`, error);
    throw new Error('Failed to fetch English content');
  }
}

export async function createEnglishContent(data: Omit<EnglishContent, 'id' | 'createdAt' | 'updatedAt'>): Promise<EnglishContent> {
  try {
    const response = await api.post('/api/english', data);
    return response.data;
  } catch (error) {
    console.error('Failed to create English content:', error);
    throw new Error('Failed to create English content');
  }
}

export async function updateEnglishContent(id: string, data: Partial<EnglishContent>): Promise<EnglishContent> {
  try {
    const response = await api.put(`/api/english/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to update English content:', error);
    throw new Error('Failed to update English content');
  }
}

export async function deleteEnglishContent(id: string): Promise<void> {
  try {
    await api.delete(`/api/english/${id}`);
  } catch (error) {
    console.error('Failed to delete English content:', error);
    throw new Error('Failed to delete English content');
  }
}

export async function updateEnglishProgress(userId: string, lessonId: string, data: UpdateProgressDto): Promise<EnglishProgress> {
  try {
    const response = await api.post('/api/english/progress', {
      userId,
      lessonId,
      ...data,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update English progress:', error);
    throw new Error('Failed to update English progress');
  }
}

// 大学情報関連
export async function getUniversities(): Promise<any[]> {
  const response = await api.get('/api/universities');
  return response.data;
}

export async function scrapeUniversities(): Promise<{ message: string; added: number; total: number }> {
  const response = await api.post('/api/universities/scrape');
  return response.data;
}

export async function updateUniversity(id: string, data: any): Promise<any> {
  const response = await api.put(`/api/universities/${id}`, data);
  return response.data;
}

export async function deleteUniversity(id: string): Promise<void> {
  await api.delete(`/api/universities/${id}`);
}

export default api;
