-- GitHub Enterprise に「GitHub Connect・Policies・AI Controls」チャプターを追加

INSERT INTO programming_chapters (
  id, language_id, parent_id, title, description, "order", status, exercises, created_at, updated_at
) VALUES (
  'github-enterprise-connect-policies-ai',
  'github',
  'github-enterprise',
  'GitHub Connect・Policies・AI Controls',
  'Enterprise Settings における GitHub Connect（GHES と GitHub.com の連携）、組織横断の Policies、Copilot 等の AI Controls の役割と運用のポイントを学びます。',
  13,
  'published',
  '[]'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  parent_id = EXCLUDED.parent_id,
  "order" = EXCLUDED."order",
  status = EXCLUDED.status,
  updated_at = NOW();
