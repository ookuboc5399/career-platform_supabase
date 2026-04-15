-- GitHub Actions に「ホステッドランナー」「セルフホステッドランナー」サブチャプターを追加
-- 実行: Supabase SQL Editor で実行

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
) VALUES
  (
    'github-actions-hosted-runner',
    'github',
    'github-1767002543754-i64d4wz',
    'ホステッドランナー',
    'GitHub が管理するランナー環境の概要、環境、利用料金、適用ケースを学びます。',
    2,
    'published',
    '[]'::jsonb,
    NOW(),
    NOW()
  ),
  (
    'github-actions-self-hosted-runner',
    'github',
    'github-1767002543754-i64d4wz',
    'セルフホステッドランナー',
    '独自インフラで構築するランナーの概要、利点、環境要件、セキュリティ、ワークフロー設定を学びます。',
    3,
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
  updated_at = NOW();
