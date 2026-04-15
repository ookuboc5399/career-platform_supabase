-- Organization Settings › Planning の子: Projects / Issue Types
-- 実行: Supabase MCP execute_sql またはサービスロールで実行。

INSERT INTO programming_chapters (
  id, language_id, parent_id, title, description, "order", status, exercises,
  video_url, thumbnail_url, duration, created_at, updated_at
) VALUES
  ('github-enterprise-org-settings-planning-projects', 'github', 'github-enterprise-org-settings-planning', 'Projects',
   'Organization Settings › Planning における Projects。組織レベルのプロジェクト方針と Organization 横断の運用の考え方を学びます。',
   1, 'published', '[]'::jsonb, '', '', '', NOW(), NOW()),
  ('github-enterprise-org-settings-planning-issue-types', 'github', 'github-enterprise-org-settings-planning', 'Issue Types',
   'Organization Settings › Planning › Issue types。組織共通の issue の種類の作成・編集・無効化を学びます。',
   2, 'published', '[]'::jsonb, '', '', '', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  parent_id = EXCLUDED.parent_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "order" = EXCLUDED."order",
  status = EXCLUDED.status,
  exercises = EXCLUDED.exercises,
  updated_at = NOW();
