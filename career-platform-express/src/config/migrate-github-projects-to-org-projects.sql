-- ルートの github-projects を github-enterprise-org-projects に統合
-- 実行: Supabase MCP execute_sql 等

UPDATE programming_chapters
SET parent_id = 'github-enterprise-org-projects', updated_at = NOW()
WHERE id = 'github-projects-troubleshooting';

UPDATE programming_chapters
SET description =
  'GitHub Projectsの概要、サイドバーで設定できること、プロジェクト作成・タスク追加・ビュー切り替え・カスタムフィールドの手順を学びます。',
    updated_at = NOW()
WHERE id = 'github-enterprise-org-projects';

UPDATE programming_progress
SET chapter_id = 'github-enterprise-org-projects', updated_at = NOW()
WHERE chapter_id = 'github-projects';

DELETE FROM programming_progress p1 USING programming_progress p2
WHERE p1.user_id = p2.user_id
  AND p1.language_id = p2.language_id
  AND p1.chapter_id = 'github-enterprise-org-projects'
  AND p2.chapter_id = 'github-enterprise-org-projects'
  AND p1.id > p2.id;

DELETE FROM programming_chapters WHERE id = 'github-projects';
