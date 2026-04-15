/**
 * 中小企業診断士 平成20年度 第2次試験 事例Ⅰ 問題A（A社・機内食）を certification_questions に追加（または更新）
 *
 * 実行（career-platform-nextjs で）:
 *   npx ts-node --transpile-only scripts/add-sme-h20-2ji-jirei1-a-question.ts
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

config({ path: '.env.local' });
config({ path: '.env' });

const QUESTION_ID = 'sme-h20-2ji-jirei1-a';
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

【第1問】強み—航空機内食の供給実績・ノウハウ、HACCP、主要航空会社との取引、ホット／コールド両方、配送体制、料理長・シェフなど。要因—長年の取引、設備投資、品質・温度管理、メニュー対応などから100字で。

【第2問】商品特性—機内食は代替困難だが燃料費・競争で航空会社はコスト圧力、大量・計画生産・廃棄リスク、安全・タイム厳守などからコスト転嫁が強い、など100字で。

【第3問】権限移管—購買の専門化・交渉・規格統一、人事と現場の一体管理、料理長の恣意排除、原価意識の現場浸透、など150字で。

【第4問】SWS—一人完結による責任明確化・習熟・ムダ削減の可能性。必要な点—標準作業・教育、ライン平衡、品質検査、動線・治工具、モチベーションなど150字で。

【第5問】成功／失敗の明確な立場と理由100字—BtoCブランド・チャネル・競合（小売・惣菜）、休眠工場活用の可否、航空向けとの相乗効果／経営資源分散など。

※工場番号・交代制などは公式問題PDFと照合してください。`;

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

  const txtPath = path.join(__dirname, 'data', 'sme-h20-2ji-jirei1-a-question.txt');
  const questionBody = fs.readFileSync(txtPath, 'utf8');
  const questionText =
    questionBody +
    '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    '（※選択肢は学習UI用です。本番試験はすべて記述式です。）';

  const now = new Date().toISOString();
  const row: Record<string, unknown> = {
    id: QUESTION_ID,
    certification_id: certificationId,
    question_number: 15,
    question: questionText,
    explanation: EXPLANATION,
    year: 'H20年2次',
    category: '事例Ⅰ（食品加工・機内食）',
    choices: [
      {
        id: 'a',
        text: '【記述式】選択式の正解はありません。解説の論点に沿ってノートに答案を作成し、教材で採点・自己添削してください。',
      },
      {
        id: 'b',
        text: '（参考）字数を守らず長文で書く',
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
