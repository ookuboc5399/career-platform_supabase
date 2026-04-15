-- GitHub Wiki, Issues, Insights, Security, Models チャプターを追加
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
    'github-wiki',
    'github',
    NULL,
    'GitHub Wiki',
    'リポジトリに紐づいたドキュメントを Markdown で作成・編集する Wiki 機能の概要と活用方法を学びます。',
    20,
    'published',
    '[]'::jsonb,
    NOW(),
    NOW()
  ),
  (
    'github-issues',
    'github',
    NULL,
    'GitHub Issues',
    'バグ報告、機能要望、タスク管理を行う Issues の基本と、ラベル・マイルストーン・テンプレートの活用を学びます。',
    21,
    'published',
    '[]'::jsonb,
    NOW(),
    NOW()
  ),
  (
    'github-insights',
    'github',
    NULL,
    'GitHub Insights',
    'リポジトリや Organization の活動を可視化する Insights の概要と、Pulse、Contributors、Traffic などの分析機能を学びます。',
    22,
    'published',
    '[]'::jsonb,
    NOW(),
    NOW()
  ),
  (
    'github-security',
    'github',
    NULL,
    'GitHub Security',
    'Security タブの構成、Dependabot、Code scanning、Secret scanning、SECURITY.md の設定を学びます。',
    23,
    'published',
    '[]'::jsonb,
    NOW(),
    NOW()
  ),
  (
    'github-models',
    'github',
    NULL,
    'GitHub Models',
    'Copilot で利用される AI モデルと、API のデータモデルについて学びます。',
    24,
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
