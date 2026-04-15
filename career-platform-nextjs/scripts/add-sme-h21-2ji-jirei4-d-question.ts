/**
 * 中小企業診断士 平成21年度 第2次試験 事例Ⅳ（D社・スポーツウエア）を certification_questions に追加（または更新）
 *
 * 実行（career-platform-nextjs で）:
 *   npx ts-node --transpile-only scripts/add-sme-h21-2ji-jirei4-d-question.ts
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

config({ path: '.env.local' });
config({ path: '.env' });

const QUESTION_ID = 'sme-h21-2ji-jirei4-d';
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

【第1問】財務諸表から長所・短所を複数取り上げ、経営指標名・値・原因（60字以内）。収益性・安全性・効率性・成長性などから問題文の指示に従う。

【第2問】総資本営業利益率の確率シナリオから税引前自己資本利益率の期待値。負債コスト・利息の扱いに注意。売却・負債返済後のリスク（変動）の変化を100字で。

【第3問】売上原価の固定費・変動費の分解、経常利益ベースの損益分岐点売上高。売上20％減時の経常利益。本社売却後の固定費構造の変化と営業レバレッジ。

【第4問】為替予約（売り建て）と実績・スポットとの差額による損益。プット・コールの使い分け（円建ての受取想定）とオプションの長所短所。

※表の欠落・○は公式問題集・PDFで補完してください。`;

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

  const txtPath = path.join(__dirname, 'data', 'sme-h21-2ji-jirei4-d-question.txt');
  const questionBody = fs.readFileSync(txtPath, 'utf8');
  const questionText =
    questionBody +
    '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    '（※選択肢は学習UI用です。本番試験はすべて記述式です。）';

  const now = new Date().toISOString();
  const row: Record<string, unknown> = {
    id: QUESTION_ID,
    certification_id: certificationId,
    question_number: 12,
    question: questionText,
    explanation: EXPLANATION,
    year: 'H21年2次',
    category: '事例Ⅳ（財務・会計・為替）',
    choices: [
      {
        id: 'a',
        text: '【記述式】選択式の正解はありません。解説の論点に沿ってノートに答案を作成し、教材で採点・自己添削してください。',
      },
      {
        id: 'b',
        text: '（参考）数式だけ計算して文章設問を飛ばす',
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
