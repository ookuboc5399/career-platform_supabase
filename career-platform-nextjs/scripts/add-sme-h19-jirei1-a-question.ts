/**
 * 中小企業診断士 平成19年度 第2次試験 事例Ⅰ 問題A を certification_questions に追加（または更新）
 *
 * 実行（career-platform-nextjs で）:
 *   npx ts-node --transpile-only scripts/add-sme-h19-jirei1-a-question.ts
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

config({ path: '.env.local' });
config({ path: '.env' });

const QUESTION_ID = 'sme-h19-2ji-jirei1-a';
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

【第1問】宝飾品市場の不透明性・複雑性（嗜好の多様化、価格帯、代替品、景気変動、海外トレンドなど）を100字で。

【第2問】インストアのメリット（集客・信用・初期費用等）とデメリット（制約・差別化・手数料・運営権限等）を150字でバランスよく。

【第3問】都心路面店の戦略的意味（ブランド発信・旗艦・情報収集）と必要施策（人材・演出・CRM等）を100字で。

【第4問】（ア）X店で労働満足度が低い理由（売上プレッシャー、成果連動、高額接客ストレス等）100字。（イ）インストアで権限・連携・迅速性が低い理由100字。（ウ）上司不信の原因と対策（権限委譲、教育、コミュニケーション）100字。

【第5問】粗利率・販管費・仕入・人件費・店舗効率など収益改善の具体策を100字で。

※店舗数・売上・人数は公式問題PDFと照合してください。`;

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

  const txtPath = path.join(__dirname, 'data', 'sme-h19-jirei1-a-question.txt');
  const questionBody = fs.readFileSync(txtPath, 'utf8');
  const questionText =
    questionBody +
    '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    '（※選択肢は学習UI用です。本番試験はすべて記述式です。）';

  const now = new Date().toISOString();
  const row: Record<string, unknown> = {
    id: QUESTION_ID,
    certification_id: certificationId,
    question_number: 5,
    question: questionText,
    explanation: EXPLANATION,
    year: 'H19年2次',
    category: '事例Ⅰ（組織・マーケティング）',
    choices: [
      {
        id: 'a',
        text: '【記述式】選択式の正解はありません。解説の論点に沿ってノートに答案を作成し、教材で採点・自己添削してください。',
      },
      {
        id: 'b',
        text: '（参考）設問の配点を無視して書く',
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
