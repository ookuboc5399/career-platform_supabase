-- 解説画像を複数登録できるように explanation_images (JSONB) を追加
-- 既存の explanation_image のデータを explanation_images に移行
--
-- 実行方法: Supabase Dashboard > SQL Editor でこのファイルの内容を実行

-- explanation_images カラムを追加
ALTER TABLE certification_questions
ADD COLUMN IF NOT EXISTS explanation_images JSONB DEFAULT '[]'::jsonb;

-- 既存の explanation_image を explanation_images に移行
UPDATE certification_questions
SET explanation_images = jsonb_build_array(explanation_image)
WHERE explanation_image IS NOT NULL
  AND (explanation_images IS NULL OR explanation_images = '[]'::jsonb);

-- explanation_image カラムを削除（オプション: 移行後に実行）
-- ALTER TABLE certification_questions DROP COLUMN IF EXISTS explanation_image;
