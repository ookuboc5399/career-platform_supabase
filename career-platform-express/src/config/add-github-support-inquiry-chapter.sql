-- GitHub コース: 「GitHubサポート問い合わせ」チャプター（order 30）
-- 実行: Supabase MCP の execute_sql、またはサービスロールで INSERT 相当を実行

INSERT INTO programming_chapters (
  id,
  language_id,
  parent_id,
  title,
  description,
  "order",
  status,
  exercises,
  created_at,
  updated_at
) VALUES (
  'github-support-inquiry',
  'github',
  NULL,
  'GitHubサポート問い合わせ',
  'GitHubサポートへの問い合わせ方法、サポートプラン（Community／Standard）、対象範囲、チケット作成・優先度、言語と営業時間、問い合わせ時の注意点を学びます。',
  30,
  'published',
  '[]'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "order" = EXCLUDED."order",
  status = EXCLUDED.status,
  exercises = EXCLUDED.exercises,
  parent_id = EXCLUDED.parent_id,
  updated_at = NOW();
