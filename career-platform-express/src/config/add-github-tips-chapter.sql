-- GitHub Tips を GitHub コース直下（トップ階層）に追加
INSERT INTO programming_chapters (
  id, language_id, parent_id, title, description, "order", status, exercises,
  video_url, thumbnail_url, duration, created_at, updated_at
) VALUES
  ('github-tips', 'github', NULL, 'GitHub Tips',
   'Enterprise と Organization の役割分担など、現場で混同しやすい設定の「考え方」を短く整理するチップス集です。',
   31, 'published', '[]'::jsonb, '', '', '', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  parent_id = EXCLUDED.parent_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "order" = EXCLUDED."order",
  status = EXCLUDED.status,
  exercises = EXCLUDED.exercises,
  updated_at = NOW();
