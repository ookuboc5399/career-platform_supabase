-- Personal access tokens 配下にサブチャプターを追加
INSERT INTO programming_chapters (
  id, language_id, parent_id, title, description, "order", status,
  tags, body, body_html, body_markdown, created_at, updated_at
) VALUES
  (
    'github-enterprise-org-settings-personal-access-tokens-settings',
    'github',
    'github-enterprise-org-settings-personal-access-tokens',
    'settings',
    'Organization Settings › Personal access tokens › settings。Fine-grained token の許可・承認・有効期限ポリシーを学びます。',
    1, 'published', '[]'::jsonb, '', '', '', NOW(), NOW()
  ),
  (
    'github-enterprise-org-settings-personal-access-tokens-active-tokens',
    'github',
    'github-enterprise-org-settings-personal-access-tokens',
    'Active tokens',
    'Organization Settings › Personal access tokens › Active tokens。発行済み token の棚卸しを学びます。',
    2, 'published', '[]'::jsonb, '', '', '', NOW(), NOW()
  ),
  (
    'github-enterprise-org-settings-personal-access-tokens-prnding-requests',
    'github',
    'github-enterprise-org-settings-personal-access-tokens',
    'Prnding requests',
    'Organization Settings › Personal access tokens › Prnding requests。承認待ちリクエスト審査を学びます。',
    3, 'published', '[]'::jsonb, '', '', '', NOW(), NOW()
  )
ON CONFLICT (id) DO UPDATE SET
  parent_id = EXCLUDED.parent_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "order" = EXCLUDED."order",
  status = EXCLUDED.status,
  updated_at = NOW();
