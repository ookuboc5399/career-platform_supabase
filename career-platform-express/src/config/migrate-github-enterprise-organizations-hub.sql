-- Organizations ハブの再編（セクション名変更・子チャプター追加・旧リポジトリ/ブランチチャプターの統合）
-- 実行: Supabase MCP execute_sql またはサービスロールで順に実行

UPDATE programming_chapters
SET title = 'Organizations',
    description = 'Organization の Repositories・Projects・Packages・Teams・People・Settings を扱うセクションです。',
    updated_at = NOW()
WHERE id = 'github-enterprise-sec-orgs-and-repos';

INSERT INTO programming_chapters (
  id, language_id, parent_id, title, description, "order", status, exercises,
  video_url, thumbnail_url, duration, created_at, updated_at
) VALUES
  ('github-enterprise-org-repositories', 'github', 'github-enterprise-sec-orgs-and-repos', 'Repositories',
   'リポジトリの命名・可視性・外部コラボレーターなどの運用ルールと、ブランチ戦略・マージ手法をまとめて学びます。',
   1, 'published', '[]'::jsonb, '', '', '', NOW(), NOW()),
  ('github-enterprise-org-projects', 'github', 'github-enterprise-sec-orgs-and-repos', 'Projects',
   'Organization レベルでの GitHub Projects の位置づけ、テンプレート、リポジトリ横断の計画の進め方を学びます。',
   2, 'published', '[]'::jsonb, '', '', '', NOW(), NOW()),
  ('github-enterprise-org-packages', 'github', 'github-enterprise-sec-orgs-and-repos', 'Packages',
   'GitHub Packages の概要、Organization での公開範囲、認証とワークフロー連携の要点を学びます。',
   3, 'published', '[]'::jsonb, '', '', '', NOW(), NOW()),
  ('github-enterprise-org-teams', 'github', 'github-enterprise-sec-orgs-and-repos', 'Teams',
   'Organization の Team 作成、メンバー追加、リポジトリとの紐づけ手順と Maintainer の役割を学びます。',
   4, 'published', '[]'::jsonb, '', '', '', NOW(), NOW()),
  ('github-enterprise-org-people', 'github', 'github-enterprise-sec-orgs-and-repos', 'People',
   'Organization メンバー・ロール・招待、ベース権限とメンバー管理の流れを学びます。',
   5, 'published', '[]'::jsonb, '', '', '', NOW(), NOW()),
  ('github-enterprise-org-settings', 'github', 'github-enterprise-sec-orgs-and-repos', 'Organization の Settings',
   'Organization 設定の主要カテゴリ（Member privileges、Actions、Packages、Security など）の見方と運用上の注意を学びます。',
   6, 'published', '[]'::jsonb, '', '', '', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  parent_id = EXCLUDED.parent_id,
  "order" = EXCLUDED."order",
  status = EXCLUDED.status,
  updated_at = NOW();

UPDATE programming_progress
SET chapter_id = 'github-enterprise-org-repositories', updated_at = NOW()
WHERE chapter_id IN ('github-enterprise-repository', 'github-enterprise-branch-merge');

DELETE FROM programming_progress p1 USING programming_progress p2
WHERE p1.user_id = p2.user_id
  AND p1.language_id = p2.language_id
  AND p1.chapter_id = 'github-enterprise-org-repositories'
  AND p2.chapter_id = 'github-enterprise-org-repositories'
  AND p1.id > p2.id;

DELETE FROM programming_chapters WHERE id IN ('github-enterprise-repository', 'github-enterprise-branch-merge');
