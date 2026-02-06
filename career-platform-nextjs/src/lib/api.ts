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
  ProgrammingProgress,
  CertificationQuestion,
  NewsContent
} from '@/types/api';

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_EXPRESS_API_URL || 'http://localhost:4000';
};

const createApiInstance = () => {
  return axios.create({
    baseURL: getBaseUrl(),
    withCredentials: false,
  });
};

const api = createApiInstance();

// お問い合わせフォーム送信
export async function submitContactForm(data: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  try {
    await api.post('/api/contact', data);
  } catch (error) {
    console.error('Failed to submit contact form:', error);
    throw new Error('Failed to submit contact form');
  }
}

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

// ブログ関連
export async function getBlogPosts() {
  const response = await api.get('/api/blog');
  return response.data;
}

// サービス関連
export async function getServices() {
  const response = await api.get('/api/services');
  return response.data;
}

// 資格学習関連
export async function getCertifications(): Promise<Certification[]> {
  const response = await api.get('/api/certifications');
  return response.data;
}

export async function searchQuestions(certificationId: string, params: { keyword?: string; year?: string; category?: string }): Promise<any[]> {
  const searchParams = new URLSearchParams();
  if (params.keyword) searchParams.append('keyword', params.keyword);
  if (params.year) searchParams.append('year', params.year);
  if (params.category) searchParams.append('category', params.category);
  
  const response = await api.get(`/api/certifications/${certificationId}/questions/search`, {
    params: {
      keyword: params.keyword,
      year: params.year,
      category: params.category
    }
  });
  return response.data;
}

export async function getQuestions(certificationId: string): Promise<any[]> {
  const response = await api.get(`/api/certifications/${certificationId}/questions`);
  return response.data;
}

export async function createQuestion(certificationId: string, data: {
  questionNumber?: number;
  question: string;
  questionImage?: string;
  questionType: 'normal' | 'truefalse' | 'programming';
  codeSnippet?: string;
  options: {
    text: string;
    imageUrl?: string;
    subOptions?: {
      text: string;
      imageUrl?: string;
    }[];
  }[];
  correctAnswers: number[];
  explanation: string;
  explanationImage?: string;
  year: string;
  category: string;
  mainCategory: string;
}): Promise<CertificationQuestion> {
  const response = await api.post(`/api/certifications/${certificationId}/questions`, data);
  return response.data;
}

export async function updateQuestion(certificationId: string, questionId: string, data: any): Promise<any> {
  const response = await api.put(`/api/certifications/${certificationId}/questions/${questionId}`, data);
  return response.data;
}

export async function deleteQuestion(certificationId: string, questionId: string): Promise<void> {
  await api.delete(`/api/certifications/${certificationId}/questions/${questionId}`);
}

// ユーザー回答の記録
export async function submitAnswer(certificationId: string, data: {
  userId: string;
  questionId: string;
  correct: boolean;
  selectedAnswer: number | null;
}) {
  const response = await api.post(`/api/certifications/${certificationId}/questions/answers`, data);
  return response.data;
}

// ユーザー進捗の取得
export async function getProgress(certificationId: string, userId: string) {
  const response = await api.get(`/api/certifications/${certificationId}/questions/progress`, {
    params: { userId }
  });
  return response.data;
}

// 会社情報関連
export interface Company {
  id?: string;
  company_name: string;
  parent_industry: string;
  industry: string;
  business_tags: string[];
  original_tags: string[];
  region: string;
  prefecture: string;
  notes?: string;
  strengths: string[];
  challenges: string[];
  source_url?: string;
  extracted_at: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCompanyInput {
  company_name: string;
  parent_industry: string;
  industry: string;
  business_tags: string[];
  original_tags: string[];
  region: string;
  prefecture: string;
  notes?: string;
  strengths: string[];
  challenges: string[];
  source_url?: string;
  extracted_at?: string;
}

// 会社情報を作成
export async function createCompany(data: CreateCompanyInput): Promise<Company> {
  const response = await api.post('/api/companies', data);
  return response.data;
}

// 全会社情報を取得
export async function getCompanies(): Promise<Company[]> {
  const response = await api.get('/api/companies');
  return response.data;
}

// 特定の会社情報を取得
export async function getCompany(id: string): Promise<Company> {
  const response = await api.get(`/api/companies/${id}`);
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
  const response = await api.post(`/api/certifications/${certificationId}/chapters`, data);
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

export async function getProgrammingChapter(chapterId: string, languageId: string): Promise<ProgrammingChapter> {
  const response = await api.get(`/api/programming/chapters/${chapterId}?languageId=${languageId}`);
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
    throw new Error('Failed to fetch English content');
  }
}

export async function getEnglishContentById(id: string): Promise<EnglishContent> {
  try {
    const response = await api.get(`/api/english/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch English content');
  }
}

export async function getNewsById(id: string): Promise<NewsContent> {
  try {
    const isExternal = id.startsWith('newsapi-');
    const endpoint = isExternal ? `/api/english/news/external/${id}` : `/api/english/news/${id}`;
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch news');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error in getNewsById:', error);
    throw error;
  }
}

export async function createEnglishContent(data: Omit<EnglishContent, 'id' | 'createdAt' | 'updatedAt'>): Promise<EnglishContent> {
  try {
    const response = await api.post('/api/english', data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create English content');
  }
}

export async function updateEnglishContent(id: string, data: Partial<EnglishContent>): Promise<EnglishContent> {
  try {
    const response = await api.put(`/api/english/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update English content');
  }
}

export async function deleteEnglishContent(id: string): Promise<void> {
  try {
    await api.delete(`/api/english/${id}`);
  } catch (error) {
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
    throw new Error('Failed to update English progress');
  }
}

// 大学情報関連
export async function getUniversities(): Promise<any[]> {
  // Next.js APIルートに直接リクエストを送る（Supabase対応）
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_EXPRESS_API_URL || 'http://localhost:3000';
  
  const response = await fetch(`${baseUrl}/api/universities`);
  if (!response.ok) {
    throw new Error('Failed to fetch universities');
  }
  const data = await response.json();
  // Next.js APIルートは { universities: [...] } 形式で返すので、universities を取得
  return data.universities || [];
}

export async function scrapeUniversities(): Promise<{ 
  message: string; 
  added: number; 
  total: number;
  sheetWritten?: number;
  sheetSkipped?: number;
  sheetTotal?: number;
}> {
  const response = await api.post('/api/universities/scrape');
  return response.data;
}

export async function importUniversitiesFromSheet(): Promise<{ 
  message: string; 
  added: number;
  skipped: number;
  total: number;
}> {
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_EXPRESS_API_URL || 'http://localhost:3000';
  
  const response = await fetch(`${baseUrl}/api/admin/universities/import-from-sheet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to import universities from sheet');
  }
  
  return await response.json();
}

export async function updateUniversity(id: string, data: any): Promise<any> {
  const response = await api.put(`/api/universities/${id}`, data);
  return response.data;
}

export async function deleteUniversity(id: string): Promise<void> {
  await api.delete(`/api/universities/${id}`);
}

export default api;
