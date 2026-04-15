-- 履歴用: 旧チャプター github-enterprise-repository（現行は migrate-github-enterprise-organizations-hub.sql の github-enterprise-org-repositories に統合）
-- GitHub Enterprise に「リポジトリ運用」サブチャプターを追加
-- 実行: Supabase SQL Editor または psql で実行

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
  'github-enterprise-repository',
  'github',
  'github-enterprise',
  'リポジトリ運用',
  'リポジトリの作成ルール、基本設定、権限管理、ライフサイクル管理に関する運用ルールを学びます。',
  3,
  'published',
  '[]'::jsonb,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "order" = EXCLUDED."order",
  status = EXCLUDED.status,
  updated_at = NOW();
