-- Supabaseデータベーススキーマ
-- Cosmos DBコンテナに対応するPostgreSQLテーブル

-- Universities テーブル
CREATE TABLE IF NOT EXISTS universities (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  website_url TEXT,
  type TEXT CHECK (type IN ('university', 'program')),
  location TEXT CHECK (location IN ('japan', 'overseas')),
  program_type TEXT CHECK (program_type IN ('mba', 'data-science')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Programming Languages テーブル
CREATE TABLE IF NOT EXISTS programming_languages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('language', 'framework', 'ai-platform')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Programming Chapters テーブル
CREATE TABLE IF NOT EXISTS programming_chapters (
  id TEXT PRIMARY KEY,
  language_id TEXT NOT NULL REFERENCES programming_languages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  duration TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  exercises JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Programming Progress テーブル
CREATE TABLE IF NOT EXISTS programming_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  language_id TEXT NOT NULL,
  chapter_id TEXT NOT NULL,
  video_completed BOOLEAN DEFAULT FALSE,
  exercises_completed JSONB DEFAULT '[]'::jsonb,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certifications テーブル
CREATE TABLE IF NOT EXISTS certifications (
  id TEXT PRIMARY KEY,
  type TEXT,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  main_category TEXT,
  category TEXT,
  sub_category TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_study_time TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certification Chapters テーブル
CREATE TABLE IF NOT EXISTS certification_chapters (
  id TEXT PRIMARY KEY,
  certification_id TEXT NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  duration TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  content TEXT,
  questions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certification Progress テーブル
CREATE TABLE IF NOT EXISTS certification_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  certification_id TEXT NOT NULL,
  chapter_id TEXT NOT NULL,
  video_completed BOOLEAN DEFAULT FALSE,
  completed_questions JSONB DEFAULT '[]'::jsonb,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certification Questions テーブル
CREATE TABLE IF NOT EXISTS certification_questions (
  id TEXT PRIMARY KEY,
  certification_id TEXT NOT NULL,
  question TEXT NOT NULL,
  explanation TEXT,
  year TEXT,
  category TEXT,
  choices JSONB,
  correct_answer INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certification Questions Progress テーブル
CREATE TABLE IF NOT EXISTS certification_questions_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  certification_id TEXT NOT NULL,
  questions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- English News テーブル
CREATE TABLE IF NOT EXISTS english_news (
  id TEXT PRIMARY KEY,
  title TEXT,
  content JSONB,
  type TEXT,
  difficulty TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- English Movies テーブル
CREATE TABLE IF NOT EXISTS english_movies (
  id TEXT PRIMARY KEY,
  title TEXT,
  content JSONB,
  type TEXT,
  difficulty TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- English Business テーブル
CREATE TABLE IF NOT EXISTS english_business (
  id TEXT PRIMARY KEY,
  title TEXT,
  content JSONB,
  type TEXT,
  difficulty TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- English Questions テーブル
CREATE TABLE IF NOT EXISTS english_questions (
  id TEXT PRIMARY KEY,
  type TEXT CHECK (type IN ('reading', 'writing', 'vocabulary')),
  category TEXT,
  level TEXT,
  difficulty TEXT,
  content JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- English Progress テーブル（文法・語彙・ライティングの進捗）
CREATE TABLE IF NOT EXISTS english_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT CHECK (type IN ('grammar', 'vocabulary', 'writing')) NOT NULL,
  category TEXT,
  questions JSONB DEFAULT '[]'::jsonb,
  score INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- English Questions Progress テーブル（ユーザーごとの正解履歴）
CREATE TABLE IF NOT EXISTS english_questions_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  question_type TEXT CHECK (question_type IN ('reading', 'writing', 'vocabulary')),
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Settings テーブル
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_programming_chapters_language_id ON programming_chapters(language_id);
CREATE INDEX IF NOT EXISTS idx_programming_progress_user_language ON programming_progress(user_id, language_id);
CREATE INDEX IF NOT EXISTS idx_certification_chapters_certification_id ON certification_chapters(certification_id);
CREATE INDEX IF NOT EXISTS idx_certification_progress_user_certification ON certification_progress(user_id, certification_id);
CREATE INDEX IF NOT EXISTS idx_certification_questions_certification_id ON certification_questions(certification_id);
CREATE INDEX IF NOT EXISTS idx_english_questions_type ON english_questions(type);
CREATE INDEX IF NOT EXISTS idx_english_questions_category ON english_questions(category);
CREATE INDEX IF NOT EXISTS idx_english_questions_level ON english_questions(level);
CREATE INDEX IF NOT EXISTS idx_english_questions_progress_user_id ON english_questions_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_english_questions_progress_question_id ON english_questions_progress(question_id);
CREATE INDEX IF NOT EXISTS idx_english_questions_progress_user_question ON english_questions_progress(user_id, question_id);

