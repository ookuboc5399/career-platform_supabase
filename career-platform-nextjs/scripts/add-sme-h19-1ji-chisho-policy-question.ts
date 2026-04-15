/**
 * 中小企業診断士 平成19年度 第1次試験「中小企業経営・中小企業政策」（2日目）第1～30問を
 * certification_questions に30レコードで追加（または更新）。旧1件まとめレコードは削除する。
 *
 * 実行（career-platform-nextjs で）:
 *   npx ts-node --transpile-only scripts/add-sme-h19-1ji-chisho-policy-question.ts
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

config({ path: '.env.local' });
config({ path: '.env' });

const LEGACY_SINGLE_QUESTION_ID = 'sme-h19-1ji-chisho-policy';
const QUESTION_ID_PREFIX = 'sme-h19-1ji-chisho-policy-q';
const DEFAULT_SMEC_CERT_ID = 'chusho-shindanshi';

const SEP = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    '警告: SUPABASE_SERVICE_ROLE_KEY が未設定です。RLS により書き込みが拒否される場合があります。'
  );
}

const EXPLANATION = `【本問について】平成19年度 第1次試験「中小企業経営・中小企業政策」（2日目）の1問です。数値・図表が欠落している箇所は「要確認」としています。正答は公式問題集・協会発行の解答解説で確認してください。

【注意】制度・法律は改正されています。アプリ上の正答は未設定（学習用プレースホルダー）です。`;

/** 〔解答群〕直後の1行にア・イ・オが並ぶ形式を分割 */
function splitInlineKatakanaLine(line: string): { label: string; text: string }[] {
  const out: { label: string; text: string }[] = [];
  const re = /(ア|イ|ウ|エ|オ)\s+(.+?)(?=\s+(?:イ|ウ|エ|オ)\s|$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    out.push({ label: m[1], text: m[2].trim() });
  }
  return out;
}

function extractChoices(body: string): { id: string; text: string }[] {
  const gIdx = body.indexOf('〔解答群〕');
  if (gIdx >= 0) {
    const after = body.slice(gIdx + '〔解答群〕'.length).trim();
    const firstLine = after.split('\n')[0]?.trim() ?? '';
    if (firstLine && /(イ|ウ|エ|オ)[\s　]/.test(firstLine) && /^ア[\s　]/.test(firstLine)) {
      const inline = splitInlineKatakanaLine(firstLine);
      if (inline.length >= 2) {
        return inline.map((p, i) => ({
          id: String.fromCharCode(97 + i),
          text: `${p.label} ${p.text}`,
        }));
      }
    }
  }

  const collected: string[] = [];
  for (const line of body.split('\n')) {
    const t = line.trim();
    const m = t.match(/^(ア|イ|ウ|エ|オ)[\s　]+(.+)$/);
    if (m && m[2].trim().length > 0) {
      collected.push(`${m[1]} ${m[2].trim()}`);
    }
  }

  if (collected.length >= 2) {
    return collected.slice(0, 20).map((text, i) => ({
      id: i < 26 ? String.fromCharCode(97 + i) : `o${i}`,
      text,
    }));
  }

  return [
    { id: 'a', text: 'ア（解答解説書で正答を確認してください）' },
    { id: 'b', text: 'イ' },
    { id: 'c', text: 'ウ' },
    { id: 'd', text: 'エ' },
  ];
}

function splitIntoQuestionBlocks(p1: string, p2: string): { num: number; body: string }[] {
  const full = `${p1.trim()}\n${p2.trim()}`;
  const chunks = full.split(SEP).map((c) => c.trim()).filter(Boolean);
  const map = new Map<number, string>();

  for (const ch of chunks) {
    const m = ch.match(/^第(\d+)問\s*\n?([\s\S]*)$/);
    if (!m) continue;
    const n = parseInt(m[1], 10);
    if (n < 1 || n > 30) continue;
    map.set(n, `第${n}問\n${m[2].trim()}`);
  }

  const out: { num: number; body: string }[] = [];
  for (let n = 1; n <= 30; n++) {
    const body = map.get(n);
    if (!body) throw new Error(`第${n}問のブロックが見つかりません`);
    out.push({ num: n, body });
  }
  return out;
}

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

  const p1 = fs.readFileSync(path.join(__dirname, 'data', 'sme-h19-1ji-chisho-policy-part1.txt'), 'utf8');
  const p2 = fs.readFileSync(path.join(__dirname, 'data', 'sme-h19-1ji-chisho-policy-part2.txt'), 'utf8');

  const blocks = splitIntoQuestionBlocks(p1, p2);
  const now = new Date().toISOString();

  const rows: Record<string, unknown>[] = blocks.map(({ num, body }) => {
    const id = `${QUESTION_ID_PREFIX}${String(num).padStart(2, '0')}`;
    const choices = extractChoices(body);
    return {
      id,
      certification_id: certificationId,
      question_number: num,
      question: body,
      explanation: EXPLANATION,
      year: 'H19年1次',
      category: '中小企業経営・中小企業政策',
      choices,
      correct_answer: 0,
      question_type: 'normal',
      created_at: now,
      updated_at: now,
    };
  });

  const { error: delErr } = await supabase
    .from('certification_questions')
    .delete()
    .eq('id', LEGACY_SINGLE_QUESTION_ID);
  if (delErr) {
    console.warn('旧1件レコードの削除（無くても可）:', delErr.message);
  } else {
    console.log(`✓ 旧レコードを削除: id = ${LEGACY_SINGLE_QUESTION_ID}`);
  }

  const { error } = await supabase.from('certification_questions').upsert(rows, { onConflict: 'id' });
  if (error) {
    console.error('upsert エラー:', error);
    process.exit(1);
  }

  console.log(`✓ 30問を追加・更新: ${QUESTION_ID_PREFIX}01 … ${QUESTION_ID_PREFIX}30`);
  console.log(`  certification_id = ${certificationId}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
