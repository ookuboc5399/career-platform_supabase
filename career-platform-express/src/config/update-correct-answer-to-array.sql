-- correct_answerカラムをINTEGERからINTEGER[]に変更
-- 複数の選択肢を正解にできるようにするため

-- programming_practice_exercisesテーブルのcorrect_answerを配列型に変更
ALTER TABLE programming_practice_exercises 
ALTER COLUMN correct_answer TYPE INTEGER[] USING 
  CASE 
    WHEN correct_answer IS NULL THEN NULL
    ELSE ARRAY[correct_answer]
  END;


