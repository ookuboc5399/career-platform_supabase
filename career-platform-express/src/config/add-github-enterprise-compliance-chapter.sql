-- GitHub Enterprise に「コンプライアンス」チャプターを追加

INSERT INTO programming_chapters (
  id, language_id, parent_id, title, description, "order", status, exercises, created_at, updated_at
) VALUES (
  'github-enterprise-compliance',
  'github',
  'github-enterprise',
  'コンプライアンス（Compliance）',
  'Enterprise Settings の Compliance。SOC 等のコンプライアンス資料、監査ログとの役割分担、法務・監査向けの参照先を学びます。',
  12,
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
