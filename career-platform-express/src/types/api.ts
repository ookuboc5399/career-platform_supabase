export interface Certification {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: 'finance' | 'it' | 'business';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedStudyTime: string;
  createdAt: string;
  updatedAt: string;
  chapters: CertificationChapter[];
}

export interface CertificationChapter {
  id: string;
  certificationId: string;
  title: string;
  description: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: string;
  order: number;
  status: 'draft' | 'published';
  content: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  question: string;
  choices: Choice[];
  correctAnswer: number;
  explanation: string;
}

export interface Choice {
  id: string;
  text: string;
}

export interface CertificationProgress {
  userId: string;
  certificationId: string;
  completedQuestions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCertificationDto {
  name: string;
  description: string;
  image?: File;
  category: 'finance' | 'it' | 'business';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedStudyTime: string;
}

export interface NewsContent {
  id: string;
  title: string;
  content: string;
  sourceUrl?: string;
  audioUrl?: string;
  audioFileName?: string;
  imageUrl?: string;
  createdAt: string;
  isPublished: boolean;
  publishedAt: string | null;
  conversation?: string;
  vocabulary?: Array<{
    word: string;
    definition: string;
    example: string;
  }>;
  grammar?: Array<{
    point: string;
    explanation: string;
  }>;
  expressions?: Array<{
    phrase: string;
    meaning: string;
  }>;
}
