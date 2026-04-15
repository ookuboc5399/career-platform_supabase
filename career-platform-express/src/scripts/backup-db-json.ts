/**
 * Supabase データベースを JSON 形式でバックアップ
 * 実行: npm run backup または ts-node src/scripts/backup-db-json.ts
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_* variants) are required.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TABLES = [
  'universities',
  'programming_languages',
  'programming_chapters',
  'programming_progress',
  'programming_practice_exercises',
  'certifications',
  'certification_chapters',
  'certification_progress',
  'certification_questions',
  'certification_questions_progress',
  'english_news',
  'english_movies',
  'english_business',
  'english_questions',
  'english_progress',
  'english_questions_progress',
  'settings',
  'companies2',
];

async function backupTable(tableName: string): Promise<unknown[]> {
  const { data, error } = await supabase.from(tableName).select('*');
  if (error) {
    console.warn(`  Skip ${tableName}: ${error.message}`);
    return [];
  }
  return data || [];
}

async function main() {
  const dateStr = new Date().toISOString().slice(0, 10);
  const backupDir = path.resolve(process.cwd(), '..', 'backups', 'db', 'json', dateStr);
  fs.mkdirSync(backupDir, { recursive: true });

  console.log(`Backup started: ${dateStr}`);
  console.log(`Output: ${backupDir}`);

  const manifest: { table: string; count: number; file: string }[] = [];

  for (const table of TABLES) {
    try {
      const rows = await backupTable(table);
      const filePath = path.join(backupDir, `${table}.json`);
      fs.writeFileSync(filePath, JSON.stringify(rows, null, 2), 'utf-8');
      manifest.push({ table, count: rows.length, file: `${table}.json` });
      console.log(`  ${table}: ${rows.length} rows`);
    } catch (err) {
      console.error(`  ${table}: Error`, err);
    }
  }

  const manifestPath = path.join(backupDir, '_manifest.json');
  fs.writeFileSync(
    manifestPath,
    JSON.stringify({ date: dateStr, tables: manifest, exportedAt: new Date().toISOString() }, null, 2),
    'utf-8'
  );

  console.log('Backup completed.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
