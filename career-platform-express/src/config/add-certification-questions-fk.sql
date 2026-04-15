-- certification_questions の certification_id に外部キー制約を追加
-- 資格ごとに問題が正しく紐づくことを保証する
--
-- 実行前に、孤立した問題がないか確認することを推奨:
-- SELECT cq.id, cq.certification_id, cq.question
-- FROM certification_questions cq
-- LEFT JOIN certifications c ON c.id = cq.certification_id
-- WHERE c.id IS NULL;

-- 既存の制約がある場合はスキップ（エラーにならないよう DO ブロックを使用）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'certification_questions_certification_id_fkey'
    AND table_name = 'certification_questions'
  ) THEN
    ALTER TABLE certification_questions
    ADD CONSTRAINT certification_questions_certification_id_fkey
    FOREIGN KEY (certification_id) REFERENCES certifications(id) ON DELETE CASCADE;
  END IF;
END $$;
