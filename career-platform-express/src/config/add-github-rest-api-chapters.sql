-- GitHub REST API（Enterprise Cloud）シリーズ — 親 + フェーズ1子（ローカル / マイグレーション用）
-- Supabase 本番は MCP または Next スクリプト scripts/add-github-rest-api-chapters.ts で同期済み想定

INSERT INTO programming_chapters (
  id, language_id, parent_id, title, description, "order", status, exercises,
  video_url, thumbnail_url, duration, created_at, updated_at
) VALUES
  (
    'github-rest-api',
    'github',
    NULL,
    'GitHub REST API（Enterprise Cloud）',
    '公式 REST ドキュメントの構造に沿ったハブです。共通事項・リポジトリ / PR・Organization などカテゴリ別に要点と公式リンクをまとめます。',
    41,
    'published',
    '[]'::jsonb,
    '',
    '',
    '',
    NOW(),
    NOW()
  ),
  (
    'github-rest-api-overview',
    'github',
    'github-rest-api',
    'REST API — 概要・認証・バージョン',
    'REST の前提、認証方式の俯瞰、API バージョニング、ページネーション、レート制限の読み方。公式 About the REST API への導線です。',
    1,
    'published',
    '[]'::jsonb,
    '',
    '',
    '',
    NOW(),
    NOW()
  ),
  (
    'github-rest-api-repos',
    'github',
    'github-rest-api',
    'REST API — リポジトリとプルリクエスト',
    'repos / pulls カテゴリの公式 REST への導線と、自動化でよく使う観点の整理です。',
    2,
    'published',
    '[]'::jsonb,
    '',
    '',
    '',
    NOW(),
    NOW()
  ),
  (
    'github-rest-api-orgs',
    'github',
    'github-rest-api',
    'REST API — Organization',
    'orgs カテゴリの公式 REST への導線と、組織レベル API を使うときの注意点です。',
    3,
    'published',
    '[]'::jsonb,
    '',
    '',
    '',
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO UPDATE SET
  language_id = EXCLUDED.language_id,
  parent_id = EXCLUDED.parent_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "order" = EXCLUDED."order",
  status = EXCLUDED.status,
  exercises = EXCLUDED.exercises,
  updated_at = NOW();
