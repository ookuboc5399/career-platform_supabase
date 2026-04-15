-- Organization Settings › Codespaces の子: General / Policies
-- 実行: Supabase MCP execute_sql またはサービスロールで実行。

INSERT INTO programming_chapters (
  id, language_id, parent_id, title, description, "order", status, exercises,
  video_url, thumbnail_url, duration, created_at, updated_at
) VALUES
  ('github-enterprise-org-settings-codespaces-general', 'github', 'github-enterprise-org-settings-codespaces', 'General',
   'Organization Settings › Codespaces › General。利用対象、既定設定、開発環境の土台を整理します。',
   1, 'published', '[]'::jsonb, '', '', '', NOW(), NOW()),
  ('github-enterprise-org-settings-codespaces-policies', 'github', 'github-enterprise-org-settings-codespaces', 'Policies',
   'Organization Settings › Codespaces › Policies。アクセス範囲やセキュリティ制御などの利用ポリシーを整理します。',
   2, 'published', '[]'::jsonb, '', '', '', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  parent_id = EXCLUDED.parent_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "order" = EXCLUDED."order",
  status = EXCLUDED.status,
  exercises = EXCLUDED.exercises,
  updated_at = NOW();
