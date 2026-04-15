-- 各メインチャプターに「トラブルシューティング」サブチャプターを追加
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
    'github-enterprise-troubleshooting',
    'github',
    'github-enterprise',
    'トラブルシューティング',
    '認証エラー、監査ログ、設定に関するよくある問題と対処法を学びます。',
    99,
    'published',
    '[]'::jsonb,
    NOW(),
    NOW()
  ),
  (
    'github-actions-troubleshooting',
    'github',
    'github-1767002543754-i64d4wz',
    'トラブルシューティング',
    'ビルド失敗、ワークフローのトリガー、キャッシュ・Artifactのエラー対処法を学びます。',
    99,
    'published',
    '[]'::jsonb,
    NOW(),
    NOW()
  ),
  (
    'github-copilot-troubleshooting',
    'github',
    'github-1767073756824-whxljzx',
    'トラブルシューティング',
    'Copilotの提案が表示されない、品質が低い場合の対処法を学びます。',
    99,
    'published',
    '[]'::jsonb,
    NOW(),
    NOW()
  ),
  (
    'github-admin-troubleshooting',
    'github',
    'github-1770228766026-b8na1vc',
    'トラブルシューティング',
    'ポリシー適用エラー、ライセンス不足などの対処法を学びます。',
    99,
    'published',
    '[]'::jsonb,
    NOW(),
    NOW()
  ),
  (
    'github-ghas-troubleshooting',
    'github',
    'github-1770333814514-4idy0to',
    'トラブルシューティング',
    'Code Scanning、Dependabot、Secret Scanning、GHAS有効化に関するエラー対処法を学びます。',
    99,
    'published',
    '[]'::jsonb,
    NOW(),
    NOW()
  ),
  (
    'github-pages-troubleshooting',
    'github',
    'github-pages',
    'トラブルシューティング',
    'サイトが表示されない、ビルド失敗、カスタムドメインの設定に関する対処法を学びます。',
    99,
    'published',
    '[]'::jsonb,
    NOW(),
    NOW()
  ),
  (
    'github-projects-troubleshooting',
    'github',
    'github-enterprise-org-projects',
    'トラブルシューティング',
    'プロジェクトが表示されない、Issue/PRが追加できない場合の対処法を学びます。',
    99,
    'published',
    '[]'::jsonb,
    NOW(),
    NOW()
  ),
  (
    'github-cli-api-troubleshooting',
    'github',
    'github-cli-api',
    'トラブルシューティング',
    '認証エラー、API 401/403、レート制限の対処法を学びます。',
    99,
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
