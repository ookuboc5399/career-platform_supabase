-- GitHub Enterprise に「認証とセキュリティ（Authentication and security）」サブチャプターを追加
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
  'github-enterprise-auth-sso',
  'github',
  'github-enterprise',
  '認証とセキュリティ（Authentication and security）',
  'Enterprise / Organization の Settings にある Authentication and security に対応。SSO、2FA、IP 制限、EMU、Entra ID、Okta などの認証・アイデンティティ管理を学びます。',
  5,
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
