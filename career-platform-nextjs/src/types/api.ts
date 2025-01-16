// 共通の型
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Choice {
  id: string;
  text: string;
  content?: string;
  type?: 'text' | 'image';
  imageUrl?: string;
}

// 大学情報関連
export interface University extends BaseEntity {
  title: string;
  description: string;
  imageUrl: string;
  websiteUrl: string;
  type: 'university' | 'program';
  location: 'japan' | 'overseas';
  programType?: 'mba' | 'data-science';
}

// 資格学習関連
export interface CertificationQuestion {
  id: string;
  question: string;
  type?: 'text' | 'image';
  imageUrl?: string;
  choices: Choice[];
  correctAnswer: number;
  explanation: string;
  explanationType?: 'text' | 'image';
  explanationImageUrl?: string;
}

export interface CertificationChapter extends BaseEntity {
  certificationId: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  order: number;
  status: 'draft' | 'published';
  content: string;
  questions: CertificationQuestion[];
}

export interface Certification extends BaseEntity {
  name: string;
  description: string;
  imageUrl: string;
  category: 'finance' | 'it' | 'business';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedStudyTime: string;
  questions?: CertificationQuestion[];
  chapters?: CertificationChapter[];
}

export interface UpdateCertificationDto {
  name?: string;
  description?: string;
  image?: File;
  category?: 'finance' | 'it' | 'business';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedStudyTime?: string;
  questions?: CertificationQuestion[];
  chapters?: CertificationChapter[];
}

export interface CreateCertificationDto {
  name: string;
  description: string;
  image?: File;
  category: 'finance' | 'it' | 'business';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedStudyTime: string;
  questions?: CertificationQuestion[];
  chapters?: CertificationChapter[];
}

// プログラミング学習関連
export interface ProgrammingLanguage extends BaseEntity {
  name: string;
  description: string;
  imageUrl: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Exercise {
  title: string;
  description: string;
  testCases: {
    input: string;
    expectedOutput: string;
  }[];
}

export interface ProgrammingChapter extends BaseEntity {
  languageId: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  order: number;
  status: 'draft' | 'published';
  exercises: Exercise[];
}

// 英語学習関連
export interface EnglishContent extends BaseEntity {
  title: string;
  description: string;
  type: 'movie' | 'tv' | 'news' | 'article' | 'practice';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  year?: number;
  term?: 'spring' | 'fall';
  category?: string;
  videoUrl?: string;
  imageUrl?: string;
  content?: string;
  exercises: EnglishExercise[];
  resources: EnglishResource[];
}

export interface EnglishExercise {
  id: string;
  question: string;
  choices: Choice[];
  correctAnswer: number;
  explanation: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
}

export interface EnglishResource {
  title: string;
  url: string;
  type: 'video' | 'article' | 'document';
}

// 進捗関連
export interface Progress extends BaseEntity {
  userId: string;
  contentId: string;
  contentType: 'programming' | 'certification' | 'english';
  videoCompleted: boolean;
  completedExercises: string[];
  lastAccessedAt: string;
}

export interface CertificationProgress extends Progress {
  contentType: 'certification';
  certificationId: string;
  chapterId: string;
  completedQuestions: string[];
}

export interface ProgrammingProgress extends Progress {
  contentType: 'programming';
  languageId: string;
  chapterId: string;
}

export interface EnglishProgress extends Progress {
  contentType: 'english';
  lessonId: string;
  weakPoints?: string[];
  strengths?: string[];
  averageScore?: number;
  totalAttempts?: number;
  correctAnswers?: number;
  categoryScores?: {
    [category: string]: {
      attempts: number;
      correct: number;
      score: number;
    };
  };
}

export interface UpdateProgressDto {
  videoCompleted?: boolean;
  completedExercises?: string[];
  completedQuestions?: string[];
  weakPoints?: string[];
  strengths?: string[];
  categoryScores?: {
    [category: string]: {
      attempts: number;
      correct: number;
      score: number;
    };
  };
}

// AI推薦システム関連
export interface RecommendationRequest {
  userId: string;
  contentType: 'english';
  count?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  categories?: string[];
  focusOnWeakPoints?: boolean;
}

export interface RecommendationResponse {
  recommendations: {
    contentId: string;
    reason: string;
    confidence: number;
    targetedWeakPoint?: string;
  }[];
}
