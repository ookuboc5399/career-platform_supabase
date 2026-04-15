-- programming_chapters テーブルに video_url と slide_url カラムが未作成の場合は追加
-- Supabase Dashboard の SQL Editor で実行してください

ALTER TABLE programming_chapters ADD COLUMN IF NOT EXISTS slide_url TEXT;
ALTER TABLE programming_chapters ADD COLUMN IF NOT EXISTS video_url TEXT;

-- programming-videos バケットが未作成の場合は Supabase Storage で作成してください
-- バケット名: programming-videos (public: false)
