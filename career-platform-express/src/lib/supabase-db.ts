import { supabaseAdmin } from './supabase';

// 型定義
export interface University {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  websiteUrl: string;
  type: 'university' | 'program';
  location: 'japan' | 'overseas';
  programType?: 'mba' | 'data-science';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUniversityInput {
  title: string;
  description: string;
  imageUrl: string;
  websiteUrl: string;
  type: 'university' | 'program';
  location: 'japan' | 'overseas';
  programType?: 'mba' | 'data-science';
}

export interface UpdateUniversityInput extends Partial<CreateUniversityInput> {}

export interface ProgrammingChapter {
  id: string;
  languageId: string;
  title: string;
  description: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration: string;
  order: number;
  exercises: {
    id: string;
    title: string;
    description: string;
    testCases: {
      input: string;
      expectedOutput: string;
    }[];
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProgrammingProgress {
  id: string;
  userId: string;
  languageId: string;
  chapterId: string;
  videoCompleted: boolean;
  exercisesCompleted: string[];
  lastAccessedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Certification {
  id: string;
  type: string;
  name: string;
  description: string;
  imageUrl: string;
  mainCategory: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedStudyTime: string;
  chapters?: CertificationChapter[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCertificationInput {
  name: string;
  description: string;
  imageUrl: string;
  mainCategory: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedStudyTime: string;
}

export interface UpdateCertificationInput extends Partial<CreateCertificationInput> {}

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
  questions: {
    id: string;
    question: string;
    choices: {
      id: string;
      text: string;
    }[];
    correctAnswer: number;
    explanation: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CertificationProgress {
  id: string;
  userId: string;
  certificationId: string;
  chapterId: string;
  videoCompleted: boolean;
  completedQuestions: string[];
  lastAccessedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

// データベース操作関数 - Universities
export async function getUniversities(): Promise<University[]> {
  const { data, error } = await supabaseAdmin!
    .from('universities')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching universities:', error);
    throw error;
  }
  
  return (data || []).map(mapUniversityFromDB);
}

export async function getUniversity(id: string): Promise<University | undefined> {
  const { data, error } = await supabaseAdmin!
    .from('universities')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return undefined; // Not found
    console.error('Error fetching university:', error);
    throw error;
  }

  return data ? mapUniversityFromDB(data) : undefined;
}

export async function createUniversity(data: CreateUniversityInput): Promise<University> {
  const id = Math.random().toString(36).substring(2, 15);
  const now = new Date().toISOString();
  
  const { data: result, error } = await supabaseAdmin!
    .from('universities')
    .insert({
      id,
      title: data.title,
      description: data.description,
      image_url: data.imageUrl,
      website_url: data.websiteUrl,
      type: data.type,
      location: data.location,
      program_type: data.programType,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating university:', error);
    throw error;
  }

  return mapUniversityFromDB(result);
}

export async function updateUniversity(id: string, data: UpdateUniversityInput): Promise<University | undefined> {
  const updateData: any = {
    updated_at: new Date().toISOString(),
  };

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.imageUrl !== undefined) updateData.image_url = data.imageUrl;
  if (data.websiteUrl !== undefined) updateData.website_url = data.websiteUrl;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.location !== undefined) updateData.location = data.location;
  if (data.programType !== undefined) updateData.program_type = data.programType;

  const { data: result, error } = await supabaseAdmin!
    .from('universities')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return undefined;
    console.error('Error updating university:', error);
    throw error;
  }

  return result ? mapUniversityFromDB(result) : undefined;
}

export async function deleteUniversity(id: string): Promise<void> {
  const { error } = await supabaseAdmin!
    .from('universities')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting university:', error);
    throw error;
  }
}

// プログラミング学習関連の操作関数
export async function getProgrammingChapter(id: string): Promise<ProgrammingChapter | undefined> {
  const { data, error } = await supabaseAdmin!
    .from('programming_chapters')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return undefined;
    console.error('Error fetching programming chapter:', error);
    throw error;
  }

  return data ? mapProgrammingChapterFromDB(data) : undefined;
}

export async function getProgrammingProgress(
  userId: string,
  languageId: string,
  chapterId: string
): Promise<ProgrammingProgress | undefined> {
  const id = `${userId}-${languageId}-${chapterId}`;
  
  const { data, error } = await supabaseAdmin!
    .from('programming_progress')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return undefined;
    console.error('Error fetching programming progress:', error);
    throw error;
  }

  return data ? mapProgrammingProgressFromDB(data) : undefined;
}

export async function updateProgrammingProgress(
  userId: string,
  languageId: string,
  chapterId: string,
  data: Partial<ProgrammingProgress>
): Promise<ProgrammingProgress> {
  const id = `${userId}-${languageId}-${chapterId}`;
  const now = new Date().toISOString();

  const { data: existing } = await supabaseAdmin!
    .from('programming_progress')
    .select('*')
    .eq('id', id)
    .single();

  if (existing) {
    const updateData: any = {
      ...data,
      exercises_completed: data.exercisesCompleted || existing.exercises_completed,
      video_completed: data.videoCompleted !== undefined ? data.videoCompleted : existing.video_completed,
      last_accessed_at: now,
      updated_at: now,
    };

    const { data: result, error } = await supabaseAdmin!
      .from('programming_progress')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating programming progress:', error);
      throw error;
    }

    return mapProgrammingProgressFromDB(result);
  } else {
    const insertData = {
      id,
      user_id: userId,
      language_id: languageId,
      chapter_id: chapterId,
      video_completed: data.videoCompleted || false,
      exercises_completed: data.exercisesCompleted || [],
      last_accessed_at: now,
      created_at: now,
      updated_at: now,
    };

    const { data: result, error } = await supabaseAdmin!
      .from('programming_progress')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating programming progress:', error);
      throw error;
    }

    return mapProgrammingProgressFromDB(result);
  }
}

// 資格マスタの操作関数
export async function getCertifications(includeChapters: boolean = false): Promise<Certification[]> {
  const { data, error } = await supabaseAdmin!
    .from('certifications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching certifications:', error);
    throw error;
  }

  const certifications = (data || []).map(mapCertificationFromDB);

  // chaptersが必要な場合のみ取得（パフォーマンス対策）
  if (includeChapters) {
    const certificationsWithChapters = await Promise.all(
      certifications.map(async (certification) => {
        try {
          // chaptersを取得
          const chapters = await getCertificationChapters(certification.id);
          certification.chapters = chapters;
        } catch (error) {
          console.error(`Error fetching chapters for certification ${certification.id}:`, error);
          certification.chapters = [];
        }
        return certification;
      })
    );
    return certificationsWithChapters;
  }

  return certifications;
}

export async function getCertification(id: string, includeQuestions: boolean = false): Promise<Certification | undefined> {
  const { data, error } = await supabaseAdmin!
    .from('certifications')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return undefined;
    console.error('Error fetching certification:', error);
    throw error;
  }

  const certification = data ? mapCertificationFromDB(data) : undefined;
  
  // questionsが必要な場合のみ取得（パフォーマンス対策）
  if (certification && includeQuestions) {
    try {
      const questions = await getCertificationQuestions(id);
      certification.questions = questions;
    } catch (error) {
      console.error(`Error fetching questions for certification ${id}:`, error);
      certification.questions = [];
    }
  }
  
  return certification;
}

export async function createCertification(data: CreateCertificationInput): Promise<Certification> {
  const id = Math.random().toString(36).substring(2, 15);
  const now = new Date().toISOString();

  const insertData: any = {
    id,
    name: data.name,
    // 一部環境では title NOT NULL のスキーマが残っているため互換のため重複保存
    title: data.name,
    description: data.description,
    image_url: data.imageUrl || null,
    main_category: data.mainCategory || null,
    category: data.category,
    difficulty: data.difficulty,
    estimated_study_time: data.estimatedStudyTime,
    created_at: now,
    updated_at: now,
  };

  const { data: result, error } = await supabaseAdmin!
    .from('certifications')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('Error creating certification:', error);
    throw error;
  }

  return mapCertificationFromDB(result);
}

export async function updateCertification(id: string, data: UpdateCertificationInput): Promise<Certification | undefined> {
  const updateData: any = {
    updated_at: new Date().toISOString(),
  };

  if (data.name !== undefined) updateData.name = data.name;
  // 互換のため title も一緒に更新
  if (data.name !== undefined) updateData.title = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.imageUrl !== undefined) updateData.image_url = data.imageUrl;
  if (data.mainCategory !== undefined) updateData.main_category = data.mainCategory;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.difficulty !== undefined) updateData.difficulty = data.difficulty;
  if (data.estimatedStudyTime !== undefined) updateData.estimated_study_time = data.estimatedStudyTime;

  const { data: result, error } = await supabaseAdmin!
    .from('certifications')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return undefined;
    console.error('Error updating certification:', error);
    throw error;
  }

  return result ? mapCertificationFromDB(result) : undefined;
}

export async function deleteCertification(id: string): Promise<void> {
  const { error } = await supabaseAdmin!
    .from('certifications')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting certification:', error);
    throw error;
  }
}

// チャプター関連の操作関数
export async function getCertificationChapters(certificationId: string): Promise<CertificationChapter[]> {
  const { data, error } = await supabaseAdmin!
    .from('certification_chapters')
    .select('*')
    .eq('certification_id', certificationId)
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching certification chapters:', error);
    throw error;
  }

  return (data || []).map(mapCertificationChapterFromDB);
}

export async function getCertificationChapter(id: string): Promise<CertificationChapter | undefined> {
  const { data, error } = await supabaseAdmin!
    .from('certification_chapters')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return undefined;
    console.error('Error fetching certification chapter:', error);
    throw error;
  }

  return data ? mapCertificationChapterFromDB(data) : undefined;
}

export async function createCertificationChapter(
  data: Omit<CertificationChapter, 'id' | 'createdAt' | 'updatedAt'>
): Promise<CertificationChapter> {
  const id = Math.random().toString(36).substring(2, 15);
  const now = new Date().toISOString();

  const { data: result, error } = await supabaseAdmin!
    .from('certification_chapters')
    .insert({
      id,
      certification_id: data.certificationId,
      title: data.title,
      description: data.description,
      video_url: data.videoUrl,
      thumbnail_url: data.thumbnailUrl,
      duration: data.duration,
      order: data.order,
      status: data.status,
      content: data.content,
      questions: data.questions,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating certification chapter:', error);
    throw error;
  }

  return mapCertificationChapterFromDB(result);
}

// 進捗関連の操作関数
export async function getCertificationProgress(
  userId: string,
  certificationId: string,
  chapterId: string
): Promise<CertificationProgress | undefined> {
  const id = `${userId}-${certificationId}-${chapterId}`;

  const { data, error } = await supabaseAdmin!
    .from('certification_progress')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return undefined;
    console.error('Error fetching certification progress:', error);
    throw error;
  }

  return data ? mapCertificationProgressFromDB(data) : undefined;
}

export async function updateCertificationProgress(
  userId: string,
  certificationId: string,
  chapterId: string,
  data: Partial<CertificationProgress>
): Promise<CertificationProgress> {
  const id = `${userId}-${certificationId}-${chapterId}`;
  const now = new Date().toISOString();

  const { data: existing } = await supabaseAdmin!
    .from('certification_progress')
    .select('*')
    .eq('id', id)
    .single();

  if (existing) {
    const updateData: any = {
      ...data,
      completed_questions: data.completedQuestions || existing.completed_questions,
      video_completed: data.videoCompleted !== undefined ? data.videoCompleted : existing.video_completed,
      last_accessed_at: now,
      updated_at: now,
    };

    const { data: result, error } = await supabaseAdmin!
      .from('certification_progress')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating certification progress:', error);
      throw error;
    }

    return mapCertificationProgressFromDB(result);
  } else {
    const insertData = {
      id,
      user_id: userId,
      certification_id: certificationId,
      chapter_id: chapterId,
      video_completed: data.videoCompleted || false,
      completed_questions: data.completedQuestions || [],
      last_accessed_at: now,
      created_at: now,
      updated_at: now,
    };

    const { data: result, error } = await supabaseAdmin!
      .from('certification_progress')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating certification progress:', error);
      throw error;
    }

    return mapCertificationProgressFromDB(result);
  }
}

// 総合問題（certification_questions）関連の操作関数
export interface CertificationQuestion {
  id: string;
  certificationId: string;
  questionNumber?: number; // 問題番号（問〇〇）
  question: string;
  explanation?: string;
  year?: string;
  category?: string;
  mainCategory?: string;
  choices: {
    id: string;
    text: string;
    imageUrl?: string;
  }[];
  correctAnswer: number;
  questionImage?: string;
  explanationImage?: string;
  questionType?: 'normal' | 'truefalse' | 'programming';
  codeSnippet?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCertificationQuestionInput {
  certificationId: string;
  questionNumber?: number;
  question: string;
  explanation?: string;
  year?: string;
  category?: string;
  mainCategory?: string;
  choices: {
    id: string;
    text: string;
    imageUrl?: string;
  }[];
  correctAnswer: number;
  questionImage?: string;
  explanationImage?: string;
  questionType?: 'normal' | 'truefalse' | 'programming';
  codeSnippet?: string;
}

export async function getCertificationQuestions(certificationId: string): Promise<CertificationQuestion[]> {
  const { data, error } = await supabaseAdmin!
    .from('certification_questions')
    .select('*')
    .eq('certification_id', certificationId)
    .order('question_number', { ascending: true, nullsFirst: false }) // 問題番号順に並び替え（番号なしは最後）
    .order('created_at', { ascending: true }); // 番号が同じ場合は作成日時順

  if (error) {
    console.error('Error fetching certification questions:', error);
    throw error;
  }

  return (data || []).map(mapCertificationQuestionFromDB);
}

export async function getCertificationQuestion(id: string): Promise<CertificationQuestion | undefined> {
  const { data, error } = await supabaseAdmin!
    .from('certification_questions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return undefined;
    console.error('Error fetching certification question:', error);
    throw error;
  }

  return data ? mapCertificationQuestionFromDB(data) : undefined;
}

export async function searchCertificationQuestions(
  certificationId: string,
  params: { keyword?: string; year?: string; category?: string }
): Promise<CertificationQuestion[]> {
  let query = supabaseAdmin!
    .from('certification_questions')
    .select('*')
    .eq('certification_id', certificationId);

  // 検索条件を追加
  if (params.keyword) {
    // PostgreSQLのILIKEで部分一致検索（大文字小文字を区別しない）
    // Supabaseのor()メソッドの正しい構文: "column1.ilike.value1,column2.ilike.value2"
    query = query.or(`question.ilike.%${params.keyword}%,explanation.ilike.%${params.keyword}%`);
  }
  if (params.year) {
    query = query.eq('year', params.year);
  }
  if (params.category) {
    query = query.eq('category', params.category);
  }

  const { data, error } = await query
    .order('question_number', { ascending: true, nullsFirst: false }) // 問題番号順
    .order('created_at', { ascending: true }); // 番号が同じ場合は作成日時順

  if (error) {
    console.error('Error searching certification questions:', error);
    throw error;
  }

  return (data || []).map(mapCertificationQuestionFromDB);
}

export async function createCertificationQuestion(data: CreateCertificationQuestionInput): Promise<CertificationQuestion> {
  const id = Math.random().toString(36).substring(2, 15);
  const now = new Date().toISOString();

  // questionNumberが指定されていればそれを使用（未指定の場合はnull）
  const questionNumberToUse = typeof data.questionNumber === 'number' && data.questionNumber > 0
    ? data.questionNumber
    : null;

  const { data: result, error } = await supabaseAdmin!
    .from('certification_questions')
    .insert({
      id,
      certification_id: data.certificationId,
      question_number: questionNumberToUse,
      question: data.question,
      explanation: data.explanation || null,
      year: data.year || null,
      category: data.category || null,
      choices: data.choices || [],
      correct_answer: data.correctAnswer,
      question_image: data.questionImage || null,
      explanation_image: data.explanationImage || null,
      question_type: data.questionType || 'normal',
      code_snippet: data.codeSnippet || null,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating certification question:', error);
    throw error;
  }

  return mapCertificationQuestionFromDB(result);
}

export async function updateCertificationQuestion(
  id: string,
  data: Partial<CreateCertificationQuestionInput>
): Promise<CertificationQuestion | undefined> {
  const updateData: any = {
    updated_at: new Date().toISOString(),
  };

  if (data.question !== undefined) updateData.question = data.question;
  if (data.explanation !== undefined) updateData.explanation = data.explanation;
  if (data.year !== undefined) updateData.year = data.year;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.choices !== undefined) updateData.choices = data.choices;
  if (data.correctAnswer !== undefined) updateData.correct_answer = data.correctAnswer;
  if (data.questionNumber !== undefined) updateData.question_number = data.questionNumber;

  const { data: result, error } = await supabaseAdmin!
    .from('certification_questions')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return undefined;
    console.error('Error updating certification question:', error);
    throw error;
  }

  return result ? mapCertificationQuestionFromDB(result) : undefined;
}

export async function deleteCertificationQuestion(id: string): Promise<void> {
  const { error } = await supabaseAdmin!
    .from('certification_questions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting certification question:', error);
    throw error;
  }
}

// =========================
// ユーザー回答進捗（正誤記録）
// =========================

export interface QuestionAnswerProgressItem {
  questionId: string;
  correct: boolean;
  selectedAnswer: number | null;
  answeredAt: string;
}

export interface UserQuestionProgress {
  id: string;
  userId: string;
  certificationId: string;
  questions: QuestionAnswerProgressItem[];
  createdAt: string;
  updatedAt: string;
}

export async function getUserQuestionProgress(
  userId: string,
  certificationId: string
): Promise<UserQuestionProgress | undefined> {
  const { data, error } = await supabaseAdmin!
    .from('certification_questions_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('certification_id', certificationId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return undefined;
    console.error('Error fetching user question progress:', error);
    throw error;
  }

  return data
    ? {
        id: data.id,
        userId: data.user_id,
        certificationId: data.certification_id,
        questions: data.questions || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    : undefined;
}

export async function recordQuestionAnswer(
  params: {
    userId: string;
    certificationId: string;
    questionId: string;
    correct: boolean;
    selectedAnswer: number | null;
  }
): Promise<UserQuestionProgress> {
  const now = new Date().toISOString();

  // 既存の進捗を取得
  const existing = await getUserQuestionProgress(params.userId, params.certificationId);

  if (!existing) {
    // 新規作成
    const id = Math.random().toString(36).substring(2, 15);
    const questions: QuestionAnswerProgressItem[] = [
      {
        questionId: params.questionId,
        correct: params.correct,
        selectedAnswer: params.selectedAnswer,
        answeredAt: now,
      },
    ];

    const { data, error } = await supabaseAdmin!
      .from('certification_questions_progress')
      .insert({
        id,
        user_id: params.userId,
        certification_id: params.certificationId,
        questions,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting user question progress:', error);
      throw error;
    }

    return {
      id: data.id,
      userId: data.user_id,
      certificationId: data.certification_id,
      questions: data.questions || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  // 既存のレコードを更新（同一questionIdがあれば上書き、なければ追加）
  const updatedQuestions = Array.isArray(existing.questions) ? [...existing.questions] : [];
  const idx = updatedQuestions.findIndex((q) => q.questionId === params.questionId);
  const item: QuestionAnswerProgressItem = {
    questionId: params.questionId,
    correct: params.correct,
    selectedAnswer: params.selectedAnswer,
    answeredAt: now,
  };
  if (idx >= 0) {
    updatedQuestions[idx] = item;
  } else {
    updatedQuestions.push(item);
  }

  const { data: updated, error: updateError } = await supabaseAdmin!
    .from('certification_questions_progress')
    .update({
      questions: updatedQuestions,
      updated_at: now,
    })
    .eq('id', existing.id)
    .select()
    .single();

  if (updateError) {
    console.error('Error updating user question progress:', updateError);
    throw updateError;
  }

  return {
    id: updated.id,
    userId: updated.user_id,
    certificationId: updated.certification_id,
    questions: updated.questions || [],
    createdAt: updated.created_at,
    updatedAt: updated.updated_at,
  };
}

// =========================
// English News
// =========================

export interface EnglishNews {
  id: string;
  title?: string;
  content?: any;
  type?: string;
  difficulty?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export async function getEnglishNewsList(): Promise<EnglishNews[]> {
  const { data, error } = await supabaseAdmin!
    .from('english_news')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching english news:', error);
    throw error;
  }
  return (data || []).map((row: any) => {
    const base = {
      id: row.id,
      title: row.title,
      content: row.content,
      type: row.type,
      difficulty: row.difficulty,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
    return typeof row.content === 'object' && row.content !== null
      ? { ...base, ...row.content }
      : base;
  });
}

export async function getEnglishNewsById(id: string): Promise<EnglishNews | undefined> {
  const { data, error } = await supabaseAdmin!
    .from('english_news')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return undefined;
    throw error;
  }
  if (!data) return undefined;
  const base = {
    id: data.id,
    title: data.title,
    content: data.content,
    type: data.type,
    difficulty: data.difficulty,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
  return typeof data.content === 'object' && data.content !== null
    ? { ...base, ...data.content }
    : base;
}

export async function createEnglishNews(item: Partial<EnglishNews> & Record<string, any>): Promise<EnglishNews> {
  const id = item.id || Math.random().toString(36).substring(2, 15);
  const now = new Date().toISOString();
  const content = item.content ?? item;
  const { data, error } = await supabaseAdmin!
    .from('english_news')
    .insert({
      id,
      title: item.title ?? null,
      content: content,
      type: item.type ?? null,
      difficulty: item.difficulty ?? null,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();

  if (error) throw error;
  return { ...data, createdAt: data.created_at, updatedAt: data.updated_at };
}

export async function updateEnglishNews(id: string, updates: Partial<EnglishNews>): Promise<EnglishNews | undefined> {
  const updateData: any = { updated_at: new Date().toISOString() };
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.content !== undefined) updateData.content = updates.content;
  if (updates.type !== undefined) updateData.type = updates.type;
  if (updates.difficulty !== undefined) updateData.difficulty = updates.difficulty;

  const { data, error } = await supabaseAdmin!
    .from('english_news')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return undefined;
    throw error;
  }
  return data ? { ...data, createdAt: data.created_at, updatedAt: data.updated_at } : undefined;
}

export async function deleteEnglishNews(id: string): Promise<void> {
  const { error } = await supabaseAdmin!
    .from('english_news')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// =========================
// English Questions
// =========================

export async function getEnglishQuestions(filters?: { type?: string; category?: string; level?: string; difficulty?: string }): Promise<any[]> {
  let query = supabaseAdmin!.from('english_questions').select('*');
  if (filters?.type) query = query.eq('type', filters.type);
  if (filters?.category) query = query.eq('category', filters.category);
  if (filters?.level) query = query.eq('level', filters.level);
  if (filters?.difficulty) query = query.eq('difficulty', filters.difficulty);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((row: any) => ({
    ...row,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function getEnglishQuestionById(id: string): Promise<any | undefined> {
  const { data, error } = await supabaseAdmin!
    .from('english_questions')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return undefined;
    throw error;
  }
  return data ? { ...data, createdAt: data.created_at, updatedAt: data.updated_at } : undefined;
}

export async function createEnglishQuestion(item: any): Promise<any> {
  const id = item.id || Math.random().toString(36).substring(2, 15);
  const now = new Date().toISOString();
  const { data, error } = await supabaseAdmin!
    .from('english_questions')
    .insert({
      id,
      type: item.type,
      category: item.category,
      level: item.level,
      difficulty: item.difficulty ?? null,
      content: item.content,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();
  if (error) throw error;
  return { ...data, createdAt: data.created_at, updatedAt: data.updated_at };
}

export async function updateEnglishQuestion(id: string, updates: any): Promise<any | undefined> {
  const updateData: any = { updated_at: new Date().toISOString() };
  if (updates.type !== undefined) updateData.type = updates.type;
  if (updates.category !== undefined) updateData.category = updates.category;
  if (updates.level !== undefined) updateData.level = updates.level;
  if (updates.difficulty !== undefined) updateData.difficulty = updates.difficulty;
  if (updates.content !== undefined) updateData.content = updates.content;

  const { data, error } = await supabaseAdmin!
    .from('english_questions')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  if (error) {
    if (error.code === 'PGRST116') return undefined;
    throw error;
  }
  return data ? { ...data, createdAt: data.created_at, updatedAt: data.updated_at } : undefined;
}

export async function deleteEnglishQuestion(id: string): Promise<void> {
  const { error } = await supabaseAdmin!
    .from('english_questions')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// マッピング関数: DB形式からアプリ形式へ
function mapUniversityFromDB(data: any): University {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    imageUrl: data.image_url,
    websiteUrl: data.website_url,
    type: data.type,
    location: data.location,
    programType: data.program_type,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

function mapProgrammingChapterFromDB(data: any): ProgrammingChapter {
  return {
    id: data.id,
    languageId: data.language_id,
    title: data.title,
    description: data.description,
    videoUrl: data.video_url,
    thumbnailUrl: data.thumbnail_url,
    duration: data.duration,
    order: data.order,
    exercises: data.exercises || [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

function mapProgrammingProgressFromDB(data: any): ProgrammingProgress {
  return {
    id: data.id,
    userId: data.user_id,
    languageId: data.language_id,
    chapterId: data.chapter_id,
    videoCompleted: data.video_completed,
    exercisesCompleted: data.exercises_completed || [],
    lastAccessedAt: data.last_accessed_at,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

function mapCertificationFromDB(data: any): Certification {
  return {
    id: data.id,
    type: data.type,
    // nameが無いスキーマでも動くように、titleからのフォールバック
    name: data.name ?? data.title,
    description: data.description,
    imageUrl: data.image_url,
    mainCategory: data.main_category,
    category: data.category,
    difficulty: data.difficulty,
    estimatedStudyTime: data.estimated_study_time,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

function mapCertificationChapterFromDB(data: any): CertificationChapter {
  return {
    id: data.id,
    certificationId: data.certification_id,
    title: data.title,
    description: data.description,
    videoUrl: data.video_url,
    thumbnailUrl: data.thumbnail_url,
    duration: data.duration,
    order: data.order,
    status: data.status,
    content: data.content,
    questions: data.questions || [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

function mapCertificationQuestionFromDB(data: any): CertificationQuestion {
  const choices = data.choices || [];
  
  return {
    id: data.id,
    certificationId: data.certification_id,
    questionNumber: data.question_number || null, // 問題番号をマッピング
    question: data.question,
    explanation: data.explanation || '',
    year: data.year || '',
    category: data.category || '',
    mainCategory: data.main_category || '',
    choices: choices,
    correctAnswer: data.correct_answer ?? 0,
    questionImage: data.question_image || null,
    explanationImage: data.explanation_image || null,
    questionType: data.question_type || 'normal',
    codeSnippet: data.code_snippet || null,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

function mapCertificationProgressFromDB(data: any): CertificationProgress {
  return {
    id: data.id,
    userId: data.user_id,
    certificationId: data.certification_id,
    chapterId: data.chapter_id,
    videoCompleted: data.video_completed,
    completedQuestions: data.completed_questions || [],
    lastAccessedAt: data.last_accessed_at,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

