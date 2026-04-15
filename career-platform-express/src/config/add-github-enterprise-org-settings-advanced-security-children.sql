-- Organization Settings › Advanced Security の子: Configurations / Global settings

INSERT INTO programming_chapters (
  id, language_id, parent_id, title, description, "order", status, exercises,
  video_url, thumbnail_url, duration, created_at, updated_at
) VALUES
  ('github-enterprise-org-settings-advanced-security-configurations', 'github', 'github-enterprise-org-settings-advanced-security', 'Configurations',
   'Organization Settings › Advanced Security › Configurations。セキュリティ構成の定義・適用と保護率を整理します。',
   1, 'published', '[]'::jsonb, '', '', '', NOW(), NOW()),
  ('github-enterprise-org-settings-advanced-security-global-settings', 'github', 'github-enterprise-org-settings-advanced-security', 'Global settings',
   'Organization Settings › Advanced Security › Global settings。組織全体の既定設定を整理します。',
   2, 'published', '[]'::jsonb, '', '', '', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  parent_id = EXCLUDED.parent_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "order" = EXCLUDED."order",
  status = EXCLUDED.status,
  exercises = EXCLUDED.exercises,
  updated_at = NOW();
