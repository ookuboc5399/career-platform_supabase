-- Programming Practice Exercises テーブル
-- チャプター学習用の問題とは別に、試験対策用の問題を保存するテーブル
CREATE TABLE IF NOT EXISTS programming_practice_exercises (
  id TEXT PRIMARY KEY,
  language_id TEXT NOT NULL REFERENCES programming_languages(id) ON DELETE CASCADE,
  chapter_id TEXT REFERENCES programming_chapters(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('code', 'multiple-choice')) NOT NULL DEFAULT 'code',
  title TEXT,
  description TEXT NOT NULL,
  description_japanese TEXT,
  explanation TEXT,
  -- コード入力形式の場合
  test_cases JSONB,
  -- 4択問題の場合
  choices JSONB,
  correct_answer INTEGER,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
  "order" INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_programming_practice_exercises_language_id ON programming_practice_exercises(language_id);
CREATE INDEX IF NOT EXISTS idx_programming_practice_exercises_chapter_id ON programming_practice_exercises(chapter_id);
CREATE INDEX IF NOT EXISTS idx_programming_practice_exercises_status ON programming_practice_exercises(status);


