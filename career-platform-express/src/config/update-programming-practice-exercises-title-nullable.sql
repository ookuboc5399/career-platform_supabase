-- programming_practice_exercisesテーブルのtitleカラムをNULL許可に変更
-- description_japaneseカラムを追加

-- titleカラムのNOT NULL制約を削除
ALTER TABLE programming_practice_exercises 
ALTER COLUMN title DROP NOT NULL;

-- description_japaneseカラムを追加（既に存在する場合はスキップ）
ALTER TABLE programming_practice_exercises 
ADD COLUMN IF NOT EXISTS description_japanese TEXT;
