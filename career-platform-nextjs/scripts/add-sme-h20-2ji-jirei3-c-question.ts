/**
 * 中小企業診断士 平成20年度 第2次試験 事例Ⅲ（C社・金型）を certification_questions に追加（または更新）
 *
 * 実行（career-platform-nextjs で）:
 *   npx ts-node --transpile-only scripts/add-sme-h20-2ji-jirei3-c-question.ts
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

config({ path: '.env.local' });
config({ path: '.env' });

const QUESTION_ID = 'sme-h20-2ji-jirei3-c';
const DEFAULT_SMEC_CERT_ID = 'chusho-shindanshi';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    '警告: SUPABASE_SERVICE_ROLE_KEY が未設定です。RLS により書き込みが拒否される場合があります。'
  );
}

const EXPLANATION = `【本問について】2次試験は記述式です。学習用UIの選択肢は確認用です。

【第1問】VRIOや経営資源の分類（技術・顧客・ノウハウなど）から1つ選び、差別化・ニッチ・大型金型・海外対応などの戦略に80字で結びつける。

【第2問】（1）PEST・業界の機会として大型バンパー等の需要、発注集中、技術シナジー等。（2）設備投資・外注・レイアウト・工程能力・生産性の観点。

【第3問】外注との共有データ（工程進捗、在庫、負荷、マスター日程、図面改訂履歴等）と、納期短縮に加えた在庫・品質・連携効果。

【第4問】OJT・職能教育・メンター・標準化・評価制度・海外拠点との人材育成連携など。

※字数は問題文の指定どおり厳守して答案を作成してください。`;

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

  const txtPath = path.join(__dirname, 'data', 'sme-h20-2ji-jirei3-c-question.txt');
  const questionBody = fs.readFileSync(txtPath, 'utf8');
  const questionText =
    questionBody +
    '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    '（※選択肢は学習UI用です。本番試験はすべて記述式です。）';

  const now = new Date().toISOString();
  const row: Record<string, unknown> = {
    id: QUESTION_ID,
    certification_id: certificationId,
    question_number: 11,
    question: questionText,
    explanation: EXPLANATION,
    year: 'H20年2次',
    category: '事例Ⅲ（経営・生産・SCM）',
    choices: [
      {
        id: 'a',
        text: '【記述式】選択式の正解はありません。解説の論点に沿ってノートに答案を作成し、教材で採点・自己添削してください。',
      },
      {
        id: 'b',
        text: '（参考）字数制限を無視して長文で書く',
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
