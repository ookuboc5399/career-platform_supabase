/**
 * 中小企業診断士 平成19年度 第1次試験「経営法務」（2日目）第1～18問を
 * certification_questions に1レコードで追加（または更新）
 *
 * 実行（career-platform-nextjs で）:
 *   npx ts-node --transpile-only scripts/add-sme-h19-1ji-keiei-houmu-question.ts
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

config({ path: '.env.local' });
config({ path: '.env' });

const QUESTION_ID = 'sme-h19-1ji-keiei-houmu';
const DEFAULT_SMEC_CERT_ID = 'chusho-shindanshi';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    '警告: SUPABASE_SERVICE_ROLE_KEY が未設定です。RLS により書き込みが拒否される場合があります。'
  );
}

const EXPLANATION = `【本問について】第1次試験・経営法務（選択式・第1～18問収録）の問題文を1件にまとめています。表・英語条項は原文に近い形で記載しています。第15問の解答群はOCR欠落のため補完しています。設問数が多い年度は公式問題集で補完してください。

【学習のすすめ】会社法・独占禁止法・知的財産・税務は改正が多いため、出題当時の論点と現行法の両方を確認してください。

アプリの演習画面は1問1答形式のため、本データは「試験全体のテキスト」として閲覧・検索用です。`;

async function resolveCertificationId(supabase: ReturnType<typeof createClient>): Promise<string> {
  const explicit = process.env.SMEC_CERTIFICATION_ID?.trim();
  if (explicit) return explicit;

  const { data, error } = await supabase.from('certifications').select('id, name').limit(500);
  if (error) throw error;
  const rows = data ?? [];
  const hit =
    rows.find((r) => /中小企業\s*診断士|診断士/.test(r.name)) ||
    rows.find((r) => r.name.includes('診断士')) ||
    rows.find((r) => r.name.includes('中小企業'));

  if (hit?.id) {
    console.log(`資格: ${hit.name} (${hit.id})`);
    return hit.id;
  }

  const now = new Date().toISOString();
  const { error: upErr } = await supabase.from('certifications').upsert(
    {
      id: DEFAULT_SMEC_CERT_ID,
      name: '中小企業診断士',
      description: '中小企業支援の国家資格。1次試験（科目別）・2次試験（事例・論文）',
      category: 'finance',
      main_category: '企業と法務',
      difficulty: 'advanced',
      estimated_study_time: '400時間',
      created_at: now,
      updated_at: now,
    },
    { onConflict: 'id' }
  );
  if (upErr) {
    console.error('certifications upsert:', JSON.stringify(upErr, null, 2));
    throw upErr;
  }
  console.log(`✓ 資格を登録: ${DEFAULT_SMEC_CERT_ID}`);
  return DEFAULT_SMEC_CERT_ID;
}

async function main() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('NEXT_PUBLIC_SUPABASE_URL と Supabase キーを設定してください。');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const certificationId = await resolveCertificationId(supabase);

  const p1 = fs.readFileSync(path.join(__dirname, 'data', 'sme-h19-1ji-keiei-houmu-part1.txt'), 'utf8');
  const p2 = fs.readFileSync(path.join(__dirname, 'data', 'sme-h19-1ji-keiei-houmu-part2.txt'), 'utf8');
  const questionText =
    p1 +
    '\n' +
    p2 +
    '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    '（※学習UI用の選択肢です。本番はマークシート方式の選択式です。）';

  const now = new Date().toISOString();
  const row: Record<string, unknown> = {
    id: QUESTION_ID,
    certification_id: certificationId,
    question_number: 8,
    question: questionText,
    explanation: EXPLANATION,
    year: 'H19年1次',
    category: '経営法務',
    choices: [
      {
        id: 'a',
        text: '【1次・選択式】上記は第1～18問の問題文です。正答は解答解説書で確認し、法令は改正されている点に注意してください。',
      },
      {
        id: 'b',
        text: '（参考）設問を飛ばして結果だけ知りたい',
      },
    ],
    correct_answer: 0,
    question_type: 'normal',
    created_at: now,
    updated_at: now,
  };

  const { error } = await supabase.from('certification_questions').upsert(row, { onConflict: 'id' });
  if (error) {
    console.error('upsert エラー:', error);
    process.exit(1);
  }

  console.log(`✓ 追加・更新完了: certification_questions.id = ${QUESTION_ID}`);
  console.log(`  certification_id = ${certificationId}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
