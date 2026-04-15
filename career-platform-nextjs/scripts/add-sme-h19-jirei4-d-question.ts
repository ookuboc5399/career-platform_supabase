/**
 * 中小企業診断士 平成19年度 第2次試験 事例Ⅳ 問題D を certification_questions に追加（または更新）
 *
 * 実行（プロジェクトルート career-platform-nextjs で）:
 *   npx ts-node --transpile-only scripts/add-sme-h19-jirei4-d-question.ts
 *
 * 環境変数:
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY（または NEXT_PUBLIC_SUPABASE_ANON_KEY）
 *   SMEC_CERTIFICATION_ID — 省略時は certifications.name に「中小企業」「診断士」を含む行を自動検索
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config({ path: '.env' });

const QUESTION_ID = 'sme-h19-2ji-jirei4-d';

/** DB に中小企業診断士が未登録のときに使う既定 ID（upsert で作成） */
const DEFAULT_SMEC_CERT_ID = 'chusho-shindanshi';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    '警告: SUPABASE_SERVICE_ROLE_KEY が未設定です。RLS により certifications / certification_questions への書き込みが拒否される場合があります。'
  );
}

const EXPLANATION = `【本問について】2次試験事例はすべて記述式です。アプリ上は「学習用の確認」として1つの選択肢を正解にしています。本番と同じように、ノートに答案を書いてから参考書・解答解説と照合してください。

【第1問の論点】予想BS・PLから、収益性（例：売上高営業利益率・ROAなど）、安全性（例：自己資本比率・流動比率・固定長期適合率）、活動性（例：総資産回転率）などから悪化が読み取れる指標を選び、薬局減少・売上減・競争激化など原因を60字以内で結びつける。

【第2問の論点】営業利益ベースの損益分岐分析。変動費率＝売上原価率（変動費一定の仮定）、固定費＝販管費＋営業外損益の扱いは問題の指示に従う。損益分岐点売上高と予想売上高の関係から、政策継続時のリスクを簡潔に。

【第3問の論点】0期末に研究開発支出（キャッシュアウト）、1期末に期待設備投資（確率1/2でXまたはY）、2～4期に年金CF。1期末時点のNPV＝研究開発DCF＋1期末時点での続行価値（設備投資と将来CFの期待値）をrで割り引く形に整理（問題の指示どおり単純化）。意思決定はNPV符号と非金利条件。

【第4問の論点】（ア）特定個人情報・利用目的・第三者提供・セキュリティ対策措置など個人情報保護法とECの実務。（イ）対面からECへシフトに伴い、棚卸・売掛・広告宣伝・物流コストなどの構造変化を40字で。

※数値解答は手元の教科書・模範解答で確認してください。`;

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

  console.warn(
    '「中小企業診断士」に該当する資格が見つかりません。既定 ID で資格行を作成します:',
    DEFAULT_SMEC_CERT_ID
  );
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
    console.error('certifications upsert 詳細:', JSON.stringify(upErr, null, 2));
    throw upErr;
  }
  console.log(`✓ 資格を登録しました: ${DEFAULT_SMEC_CERT_ID}`);
  return DEFAULT_SMEC_CERT_ID;
}

async function main() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY（または ANON）を設定してください。');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const certificationId = await resolveCertificationId(supabase);

  const txtPath = path.join(__dirname, 'data', 'sme-h19-jirei4-d-question.txt');
  const questionBody = fs.readFileSync(txtPath, 'utf8');

  const questionText =
    questionBody +
    '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    '（※選択肢は学習UI用です。本番試験はすべて記述式です。）';

  const now = new Date().toISOString();
  const row: Record<string, unknown> = {
    id: QUESTION_ID,
    certification_id: certificationId,
    question_number: 1,
    question: questionText,
    explanation: EXPLANATION,
    year: 'H19年2次',
    category: '事例Ⅳ（財務・会計）',
    choices: [
      {
        id: 'a',
        text: '【記述式】選択式の正解はありません。解説の論点に沿ってノートに答案を作成し、教材で採点・自己添削してください。',
      },
      {
        id: 'b',
        text: '（参考）財務諸表の数値だけ眺めて終わりにする',
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
