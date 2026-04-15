-- GitHub Copilot に「初期セットアップ（VS Code編）」サブチャプターを追加
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
) VALUES (
  'github-copilot-setup-vscode',
  'github',
  'github-1767073756824-whxljzx',
  '初期セットアップ（VS Code編）',
  'VS Code で GitHub Copilot を利用するための初期セットアップ手順（拡張機能のインストール、認証、稼働確認）を学びます。',
  1,
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
