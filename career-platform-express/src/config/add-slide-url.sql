-- programming_chaptersテーブルにslide_urlカラムを追加
ALTER TABLE programming_chapters ADD COLUMN IF NOT EXISTS slide_url TEXT;
