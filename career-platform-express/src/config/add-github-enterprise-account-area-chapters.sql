-- GitHub Enterprise に Overview / Insights / Announcements / Hooks を追加
-- 実行: Supabase SQL Editor または psql

INSERT INTO programming_chapters (
  id, language_id, parent_id, title, description, "order", status, exercises, created_at, updated_at
) VALUES
  (
    'github-enterprise-overview',
    'github',
    'github-enterprise',
    'Overview（概要）',
    'Enterprise アカウントの Overview 画面。組織一覧・サマリー・他タブへの入口として公式 UI の「最初の 1 画面」に対応します。',
    8,
    'published',
    '[]'::jsonb,
    NOW(),
    NOW()
  ),
  (
    'github-enterprise-insights',
    'github',
    'github-enterprise',
    'Insights（利用状況）',
    'Enterprise の Insights タブ。アカウント横断の活動・利用状況の見方（リポジトリの Insights タブとは別）を学びます。',
    9,
    'published',
    '[]'::jsonb,
    NOW(),
    NOW()
  ),
  (
    'github-enterprise-announcements',
    'github',
    'github-enterprise',
    'お知らせ（Announcements）',
    'Enterprise Settings の Announcements。メンバー向けバナー・告知の掲出と運用上の注意を学びます。',
    10,
    'published',
    '[]'::jsonb,
    NOW(),
    NOW()
  ),
  (
    'github-enterprise-hooks',
    'github',
    'github-enterprise',
    'Hooks（Enterprise Webhooks）',
    'Enterprise Settings の Hooks。アカウントレベルの Webhook と Organization / Repository との違い、設定の流れを学びます。',
    11,
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
