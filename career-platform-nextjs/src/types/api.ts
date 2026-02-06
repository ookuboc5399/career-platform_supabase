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
export interface SubOption {
  text: string;
  imageUrl: string | null;
}

export interface Option {
  text: string;
  imageUrl: string | null;
  subOptions?: SubOption[];
}

export interface CertificationQuestion {
  id: string;
  certificationId: string;
  questionNumber: number;
  question: string;
  questionImage: string | null;
  questionType: 'normal' | 'truefalse' | 'programming';
  codeSnippet?: string;
  options: Option[];
  correctAnswers: number[];
  explanation: string;
  explanationImages: string[];
  year: string;
  category: string;
  mainCategory: string;
  createdAt: string;
  updatedAt: string;
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

export type MainCategory = 
  | '企業と法務'
  | '経営戦略'
  | 'システム戦略'
  | '開発技術'
  | 'プロジェクトマネジメント'
  | 'サービスマネジメント'
  | '基礎理論'
  | 'コンピュータシステム';

export interface Certification extends BaseEntity {
  name: string;
  description: string;
  imageUrl?: string;
  image?: {
    data: string;
    contentType: string;
    filename: string;
  };
  mainCategory?: MainCategory;
  category: string;
  subCategory?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedStudyTime: string;
  questions?: CertificationQuestion[];
  chapters?: CertificationChapter[];
}

export interface UpdateCertificationDto {
  name?: string;
  description?: string;
  imageUrl?: string;
  mainCategory?: MainCategory;
  category?: string;
  subCategory?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedStudyTime?: string;
  questions?: CertificationQuestion[];
  chapters?: CertificationChapter[];
}

export interface CreateCertificationDto {
  name: string;
  description: string;
  image?: File;
  mainCategory?: MainCategory;
  category: string;
  subCategory?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedStudyTime: string;
  questions?: CertificationQuestion[];
  chapters?: CertificationChapter[];
}

// プログラミング学習関連
export interface ProgrammingLanguage extends BaseEntity {
  title: string;
  description?: string;
  type: 'language' | 'framework' | 'ai-platform' | 'data-warehouse' | 'others' | 'saas' | 'cloud' | 'network';
}

export interface Exercise {
  id?: string;
  type: 'code' | 'multiple-choice';
  title: string;
  description: string;
  explanation?: string; // 解説
  // コード入力形式の場合
  testCases?: {
    input: string;
    expectedOutput: string;
  }[];
  // 4択問題の場合
  choices?: string[];
  correctAnswer?: number | number[]; // 0-3のインデックス、または複数のインデックスの配列
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

// 試験対策用の問題（チャプター学習用の問題とは別）
export interface ProgrammingPracticeExercise extends BaseEntity {
  languageId: string;
  chapterId?: string; // オプション: 特定のチャプターに紐づける場合
  type: 'code' | 'multiple-choice';
  title?: string;
  description: string;
  descriptionJapanese?: string;
  explanation?: string;
  testCases?: {
    input: string;
    expectedOutput: string;
  }[];
  choices?: string[];
  correctAnswer?: number | number[]; // 単一または複数のインデックスの配列
  difficulty?: 'easy' | 'medium' | 'hard';
  order: number;
  status: 'draft' | 'published';
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
  answers: Record<string, number>;
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
  answers?: Record<string, number>;
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

export interface NewsContent {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  originalTitle?: string;
  originalContent?: string;
  vocabulary?: {
    word: string;
    meaning: string;
    example: string;
  }[];
  sourceUrl?: string;
  sourceName?: string;
}
