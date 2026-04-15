-- Organization Settings › Repository の子:
-- General / Topics / Rulesets / Rule insights / Bypass requests / Custom properties

INSERT INTO programming_chapters (
  id, language_id, parent_id, title, description, "order", status, exercises,
  video_url, thumbnail_url, duration, created_at, updated_at
) VALUES
  ('github-enterprise-org-settings-repository-general', 'github', 'github-enterprise-org-settings-repository', 'General',
   'Organization Settings › Repository › General。リポジトリの基本設定・既定値を整理します。',
   1, 'published', '[]'::jsonb, '', '', '', NOW(), NOW()),
  ('github-enterprise-org-settings-repository-topics', 'github', 'github-enterprise-org-settings-repository', 'Topics',
   'Organization Settings › Repository › Topics。分類タグ運用を整理します。',
   2, 'published', '[]'::jsonb, '', '', '', NOW(), NOW()),
  ('github-enterprise-org-settings-repository-rulesets', 'github', 'github-enterprise-org-settings-repository', 'Rulesets',
   'Organization Settings › Repository › Rulesets。リポジトリルールの標準化を整理します。',
   3, 'published', '[]'::jsonb, '', '', '', NOW(), NOW()),
  ('github-enterprise-org-settings-repository-rule-insights', 'github', 'github-enterprise-org-settings-repository', 'Rule insights',
   'Organization Settings › Repository › Rule insights。ルール適用状況の分析を整理します。',
   4, 'published', '[]'::jsonb, '', '', '', NOW(), NOW()),
  ('github-enterprise-org-settings-repository-bypass-requests', 'github', 'github-enterprise-org-settings-repository', 'Bypass requests',
   'Organization Settings › Repository › Bypass requests。例外申請フローを整理します。',
   5, 'published', '[]'::jsonb, '', '', '', NOW(), NOW()),
  ('github-enterprise-org-settings-repository-custom-properties', 'github', 'github-enterprise-org-settings-repository', 'Custom properties',
   'Organization Settings › Repository › Custom properties。メタデータ管理と自動化の基盤を整理します。',
   6, 'published', '[]'::jsonb, '', '', '', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  parent_id = EXCLUDED.parent_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "order" = EXCLUDED."order",
  status = EXCLUDED.status,
  exercises = EXCLUDED.exercises,
  updated_at = NOW();
