-- programming_chapters テーブルにサブチャプター用の parent_id カラムを追加
-- Supabase Dashboard の SQL Editor で実行してください

ALTER TABLE programming_chapters ADD COLUMN IF NOT EXISTS parent_id TEXT REFERENCES programming_chapters(id) ON DELETE CASCADE;
