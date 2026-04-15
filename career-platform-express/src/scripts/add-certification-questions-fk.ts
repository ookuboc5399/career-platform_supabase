/**
 * certification_questions に certification_id の外部キー制約を追加
 * 実行: cd career-platform-express && npx ts-node src/scripts/add-certification-questions-fk.ts
 *
 * 環境変数: DATABASE_URL (Supabase接続文字列) または POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
 */
import 'dotenv/config';
import { Client } from 'pg';

function getConnectionConfig() {
  const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (databaseUrl) {
    return { connectionString: databaseUrl };
  }
  return {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'postgres',
  };
}

async function main() {
  const client = new Client(getConnectionConfig());

  try {
    await client.connect();
    console.log('Database connected.');

    // 1. 孤立した問題がないか確認
    console.log('\n--- 孤立した問題の確認 (certification_id が certifications に存在しない) ---');
    const orphanResult = await client.query(`
      SELECT cq.id, cq.certification_id, LEFT(cq.question, 50) as question_preview
      FROM certification_questions cq
      LEFT JOIN certifications c ON c.id = cq.certification_id
      WHERE c.id IS NULL
      LIMIT 20
    `);

    if (orphanResult.rows.length > 0) {
      console.log(`⚠️  孤立した問題が ${orphanResult.rows.length} 件見つかりました:`);
      orphanResult.rows.forEach((r) => console.log(`  - ${r.id} (certification_id: ${r.certification_id})`));
      console.log('\n外部キー制約を追加する前に、これらの問題を修正または削除してください。');
      return;
    }
    console.log('✓ 孤立した問題はありません。');

    // 2. 資格ごとの問題数確認
    console.log('\n--- 資格ごとの問題数 ---');
    const countResult = await client.query(`
      SELECT cq.certification_id, c.name as certification_name, COUNT(*) as question_count
      FROM certification_questions cq
      LEFT JOIN certifications c ON c.id = cq.certification_id
      GROUP BY cq.certification_id, c.name
      ORDER BY question_count DESC
    `);
    countResult.rows.forEach((r) =>
      console.log(`  ${r.certification_name || '(不明)'}: ${r.question_count} 件`)
    );

    // 3. 外部キー制約の追加
    console.log('\n--- 外部キー制約の追加 ---');
    const constraintExists = await client.query(`
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'certification_questions_certification_id_fkey'
      AND table_name = 'certification_questions'
    `);

    if (constraintExists.rows.length > 0) {
      console.log('✓ 外部キー制約は既に存在します。');
      return;
    }

    await client.query(`
      ALTER TABLE certification_questions
      ADD CONSTRAINT certification_questions_certification_id_fkey
      FOREIGN KEY (certification_id) REFERENCES certifications(id) ON DELETE CASCADE
    `);
    console.log('✓ 外部キー制約を追加しました。');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
