/**
 * 中小企業診断士 平成19年度 第2次試験 事例Ⅲ 問題C を certification_questions に追加（または更新）
 *
 * 実行（career-platform-nextjs で）:
 *   npx ts-node --transpile-only scripts/add-sme-h19-jirei3-c-question.ts
 *
 * 環境変数: add-sme-h19-jirei4-d-question.ts と同じ（SMEC_CERTIFICATION_ID 任意）
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

config({ path: '.env.local' });
config({ path: '.env' });

const QUESTION_ID = 'sme-h19-2ji-jirei3-c';
const DEFAULT_SMEC_CERT_ID = 'chusho-shindanshi';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    '警告: SUPABASE_SERVICE_ROLE_KEY が未設定です。RLS により書き込みが拒否される場合があります。'
  );
}

const EXPLANATION = `【本問について】2次試験事例はすべて記述式です。アプリ上は学習用に1択を正解にしています。ノートに答案を書いてから教材と照合してください。

【第1問】印刷業界・C社の立ち位置から強み・弱みを各3つ、各20字以内。一貫生産、DTP、顧客基盤、本社高齢化、代理店依存、利益率などから整理。

【第2問】広告代理店経由取引増の本質（手数料・データ仕様・顧客接点喪失）と、収益・生産両面の対策（顧客区分、受注基準、工程連携、価格政策など）を120字で。

【第3問】受注〜納期までの情報項目（納期、数量、色、仕様変更履歴、優先度等）と、本社・工場間の伝達手段・責任分界・定例化を140字で。

【第4問】両面機投資の妥当性を、投資額・稼働率・繁忙期のみのボトルネック・競合動向・財務余力で整理し、「投資する／しない」の立場を明確に160字で。

【第5問】名簿・個人情報を含む新規領域への参入について、リスク（法令・セキュリティ・業務範囲）、経営資源、既存説明書事業とのシナジーを140字で助言。

※本社・工場の人数など、本文の数値は公式問題PDFで必ず確認してください。`;

async function resolveCertificationId(supabase: ReturnType<typeof createClient>): Promise<string> {
  const explicit = process.env.SMEC_CERTIFICATION_ID?.trim();
  if (explicit) return explicit;

  const { data, error } = await supabase.from('certifications').select('id, name').limit(500);
  if (error) throw error;
  const rows = data ?? [];
  const hit =
    rows.find((r) => /中小企業\s*診断士|診断士.*2次|診断士/.test(r.name)) ||
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

  const txtPath = path.join(__dirname, 'data', 'sme-h19-jirei3-c-question.txt');
  const questionBody = fs.readFileSync(txtPath, 'utf8');
  const questionText =
    questionBody +
    '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    '（※選択肢は学習UI用です。本番試験はすべて記述式です。）';

  const now = new Date().toISOString();
  const row: Record<string, unknown> = {
    id: QUESTION_ID,
    certification_id: certificationId,
    question_number: 2,
    question: questionText,
    explanation: EXPLANATION,
    year: 'H19年2次',
    category: '事例Ⅲ（生産・運営）',
    choices: [
      {
        id: 'a',
        text: '【記述式】選択式の正解はありません。解説の論点に沿ってノートに答案を作成し、教材で採点・自己添削してください。',
      },
      {
        id: 'b',
        text: '（参考）設問だけ読んで本文を読まない',
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
