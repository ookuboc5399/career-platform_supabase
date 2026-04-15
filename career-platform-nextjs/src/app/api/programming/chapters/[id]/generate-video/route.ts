import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import OpenAI from 'openai';
import { supabaseAdmin } from '@/lib/supabase';

const VIDEOS_BUCKET = 'programming-videos';
const REMOTION_PROJECT = path.resolve(
  process.cwd(),
  '../career-platform-remotion'
);
const REMOTION_PUBLIC = path.join(REMOTION_PROJECT, 'public');
const REMOTION_ENTRY = path.join(REMOTION_PROJECT, 'src', 'index.ts');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── Azure TTS ──
async function generateTts(text: string, outputPath: string): Promise<boolean> {
  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION || 'francecentral';
  if (!key) return false;

  const ssml = `<speak version='1.0' xml:lang='ja-JP'>
    <voice xml:lang='ja-JP' xml:gender='Female' name='ja-JP-NanamiNeural'>
      ${text.replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c] ?? c))}
    </voice>
  </speak>`;

  const res = await fetch(
    `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
    {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-48khz-96kbitrate-mono-mp3',
      },
      body: ssml,
    }
  );

  if (!res.ok) {
    console.error('Azure TTS error:', await res.text());
    return false;
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
  return true;
}

// ── Azure DALL-E 3 ──
async function generateImage(prompt: string, outputPath: string): Promise<boolean> {
  const key = process.env.AZURE_OPENAI_API_KEY;
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'dall-e-3';
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-02-01';

  if (!key || !endpoint) return false;

  try {
    const res = await fetch(
      `${endpoint}/openai/deployments/${deployment}/images/generations?api-version=${apiVersion}`,
      {
        method: 'POST',
        headers: {
          'api-key': key,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          n: 1,
          size: '1792x1024',
          quality: 'standard',
          style: 'vivid',
        }),
      }
    );

    if (!res.ok) {
      console.error('DALL-E error:', await res.text());
      return false;
    }

    const data = await res.json();
    const imageUrl = data.data?.[0]?.url;
    if (!imageUrl) return false;

    const imgRes = await fetch(imageUrl);
    const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
    fs.writeFileSync(outputPath, imgBuffer);
    return true;
  } catch (e) {
    console.error('DALL-E error:', e);
    return false;
  }
}

// ── Extract key points from description ──
async function extractPoints(title: string, description: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            '学習チャプターの説明文から3〜5個の重要なポイントを日本語で抽出してください。各ポイントは1〜2文で簡潔に。JSONで {"points": ["...","..."]} の形式で返してください。',
        },
        {
          role: 'user',
          content: `タイトル: ${title}\n\n説明: ${description}`,
        },
      ],
    });

    const content = response.choices[0].message.content ?? '{}';
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed.points) && parsed.points.length > 0) {
      return parsed.points.slice(0, 5);
    }
  } catch (e) {
    console.error('extractPoints error:', e);
  }

  // Fallback: split by。 or ・
  return description
    .split(/[。・\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10)
    .slice(0, 4);
}

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const chapterId = params.id;
  const tmpId = `${chapterId}-${Date.now()}`;
  const audioFile = `audio-${tmpId}.mp3`;
  const bgFile = `bg-${tmpId}.png`;
  const audioPublicPath = path.join(REMOTION_PUBLIC, audioFile);
  const bgPublicPath = path.join(REMOTION_PUBLIC, bgFile);
  const outputPath = path.join(os.tmpdir(), `chapter-${tmpId}.mp4`);

  const assetFiles: string[] = [];

  try {
    // 1. チャプター情報を取得
    const { data: chapter, error: chapErr } = await supabaseAdmin
      .from('programming_chapters')
      .select('id, language_id, title, description')
      .eq('id', chapterId)
      .single();

    if (chapErr || !chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    // 2. 言語名を取得
    const { data: lang } = await supabaseAdmin
      .from('programming_languages')
      .select('title')
      .eq('id', chapter.language_id)
      .single();
    const languageName = lang?.title ?? '';

    // 3. キーポイントを抽出
    const points = await extractPoints(chapter.title, chapter.description ?? '');

    // 4. 音声生成 (Azure TTS)
    const narrationText = `${chapter.title}。${points.join('。')}。以上が今回のチャプターのポイントです。`;
    fs.mkdirSync(REMOTION_PUBLIC, { recursive: true });
    const audioOk = await generateTts(narrationText, audioPublicPath);
    if (audioOk) assetFiles.push(audioPublicPath);

    // 5. 背景画像生成 (Azure DALL-E 3)
    const imagePrompt = `Abstract educational technology background representing "${chapter.title}" in the context of ${languageName || 'programming'}. Dark blue and purple gradient, futuristic, minimal, high quality, 16:9 aspect ratio.`;
    const imageOk = await generateImage(imagePrompt, bgPublicPath);
    if (imageOk) assetFiles.push(bgPublicPath);

    // 6. Remotion でレンダリング
    const props = JSON.stringify({
      title: chapter.title,
      description: chapter.description ?? '',
      points,
      audioFile: audioOk ? audioFile : undefined,
      bgImageFile: imageOk ? bgFile : undefined,
      languageName,
    });

    const renderCmd = [
      'npx remotion render',
      `"${REMOTION_ENTRY}"`,
      'ChapterVideo',
      `"${outputPath}"`,
      `--props '${props.replace(/'/g, "'\\''")}'`,
      '--log=error',
    ].join(' ');

    execSync(renderCmd, {
      cwd: REMOTION_PROJECT,
      encoding: 'utf-8',
      timeout: 600_000,
      env: {
        ...process.env,
        HOME: os.homedir(),
        PUPPETEER_EXECUTABLE_PATH: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      },
    });

    if (!fs.existsSync(outputPath)) {
      throw new Error('動画レンダリングに失敗しました (出力ファイルなし)');
    }

    // 7. Supabase Storage にアップロード
    const videoBuffer = fs.readFileSync(outputPath);
    const storagePath = `${chapter.language_id}/${chapterId}.mp4`;

    const { error: uploadErr } = await supabaseAdmin.storage
      .from(VIDEOS_BUCKET)
      .upload(storagePath, videoBuffer, {
        contentType: 'video/mp4',
        upsert: true,
      });

    if (uploadErr) throw new Error(`Storage upload failed: ${uploadErr.message}`);

    // 8. 署名付きURL (1年間)
    const { data: signedData, error: signErr } = await supabaseAdmin.storage
      .from(VIDEOS_BUCKET)
      .createSignedUrl(storagePath, 60 * 60 * 24 * 365);

    if (signErr || !signedData) throw new Error(`Signed URL failed: ${signErr?.message}`);

    // 9. DB 更新
    const { error: updateErr } = await supabaseAdmin
      .from('programming_chapters')
      .update({ video_url: signedData.signedUrl, updated_at: new Date().toISOString() })
      .eq('id', chapterId);

    if (updateErr) throw new Error(`DB update failed: ${updateErr.message}`);

    return NextResponse.json({ videoUrl: signedData.signedUrl });
  } catch (error) {
    console.error('generate-video error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '動画生成に失敗しました' },
      { status: 500 }
    );
  } finally {
    // 後処理: 一時ファイルを削除
    if (fs.existsSync(outputPath)) {
      try { fs.unlinkSync(outputPath); } catch { /* ignore */ }
    }
    for (const f of assetFiles) {
      if (fs.existsSync(f)) {
        try { fs.unlinkSync(f); } catch { /* ignore */ }
      }
    }
  }
}
