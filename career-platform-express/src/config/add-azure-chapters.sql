-- Azure 言語とチャプターを追加
-- 実行: Supabase SQL Editor で実行

-- Azure 言語（存在しない場合のみ）
INSERT INTO programming_languages (id, title, description, type, created_at, updated_at)
VALUES (
  'azure',
  'Azure入門',
  'Microsoftが提供するクラウドプラットフォーム、Azureの基礎から学びます。',
  'cloud',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Azure チャプター
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
    'azure-overview',
    'azure',
    NULL,
    'Azure の概要',
    'Microsoft Azure の基本構成、主要サービス、企業での活用の概要を学びます。',
    1,
    'published',
    '[]'::jsonb,
    NOW(),
    NOW()
  ),
  (
    'azure-entra-id',
    'azure',
    NULL,
    'Microsoft Entra ID（旧 Azure AD）',
    'Entra ID の概要、SSO、MFA、条件付きアクセス、GitHub との連携を学びます。',
    2,
    'published',
    '[]'::jsonb,
    NOW(),
    NOW()
  ),
  (
    'azure-scim-github',
    'azure',
    NULL,
    'Azure SCIM と GitHub のプロビジョニング',
    'Entra ID の SCIM を使って GitHub Organization のメンバーを自動プロビジョニングする設定方法を学びます。',
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
