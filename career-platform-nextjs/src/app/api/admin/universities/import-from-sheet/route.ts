import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { supabaseAdmin } from '@/lib/supabase';
import * as path from 'path';
import * as fs from 'fs';

// GoogleスプレッドシートのID
const SPREADSHEET_ID = '1EcWg-FYJXfCJ1oMZi39p3ypdPofUsG8UYW1lNtJzb-8';

// Google Sheets APIの認証設定
async function getAuth() {
  // 認証情報ファイルのパス（Next.jsの場合）
  // process.cwd()がNext.jsのプロジェクトルートを指すことを確認
  const possiblePaths = [
    path.join(process.cwd(), 'roadtoentrepreneur-6b8b51ad767a.json'),
    path.join(process.cwd(), 'career-platform-nextjs', 'roadtoentrepreneur-6b8b51ad767a.json'),
    path.join(__dirname, '../../../../roadtoentrepreneur-6b8b51ad767a.json'),
  ];
  
  let credentialsPath: string | null = null;
  
  // 存在するパスを探す
  for (const possiblePath of possiblePaths) {
    try {
      if (fs.existsSync(possiblePath)) {
        credentialsPath = possiblePath;
        break;
      }
    } catch (e) {
      // パスチェック中にエラーが発生しても続行
    }
  }
  
  if (!credentialsPath) {
    console.error('認証情報ファイルが見つかりません。以下のパスを確認しました:');
    possiblePaths.forEach(p => console.error(`  - ${p}`));
    throw new Error(`認証情報ファイルが見つかりません。プロジェクトルートに 'roadtoentrepreneur-6b8b51ad767a.json' を配置してください。`);
  }
  
  try {
    console.log(`認証情報ファイルのパス: ${credentialsPath}`);
    const credentialsContent = fs.readFileSync(credentialsPath, 'utf8');
    const credentials = JSON.parse(credentialsContent);
    
    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    return auth;
  } catch (error) {
    console.error('認証情報ファイルの読み込みエラー:', credentialsPath, error);
    throw error;
  }
}

interface UniversityRow {
  大学名: string;
  '学部・学科': string;
  大学情報: string;
  エリア: string;
}

/**
 * Googleスプレッドシートから大学情報を取得
 */
async function fetchUniversitiesFromSheet(): Promise<UniversityRow[]> {
  try {
    const auth = await getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    // スプレッドシート情報を取得してシート名を確認
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const firstSheetName = spreadsheet.data.sheets?.[0]?.properties?.title || 'Sheet1';
    console.log(`シート名: ${firstSheetName}`);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${firstSheetName}!A:D`, // A列（大学名）、B列（学部・学科）、C列（大学情報）、D列（エリア）を取得
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('スプレッドシートにデータが見つかりません');
      return [];
    }

    // ヘッダー行をスキップしてデータを変換
    const universities: UniversityRow[] = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      // A列（大学名）があれば追加
      if (row && row.length >= 1 && row[0] && row[0].trim()) {
        universities.push({
          大学名: row[0].trim(),
          '学部・学科': row[1]?.trim() || '', // B列：学部・学科
          大学情報: row[2]?.trim() || '', // C列：大学情報
          エリア: row[3]?.trim() || '', // D列：エリア
        });
      }
    }

    return universities;
  } catch (error) {
    console.error('スプレッドシートからのデータ取得に失敗:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('スプレッドシートから大学情報を取得中...');
    const sheetUniversities = await fetchUniversitiesFromSheet();
    console.log(`取得した大学数: ${sheetUniversities.length}`);

    // 既存の大学情報をSupabaseから取得
    const { data: existingUniversities, error: fetchError } = await supabaseAdmin!
      .from('universities')
      .select('*');

    if (fetchError) {
      console.error('Supabaseからの大学情報取得エラー:', fetchError);
      throw fetchError;
    }

    console.log(`既存の大学数: ${existingUniversities?.length || 0}`);

    let addedCount = 0;
    let skippedCount = 0;

    // 新しい大学情報をSupabaseに追加
    for (const sheetUniv of sheetUniversities) {
      const universityName = sheetUniv.大学名; // A列 → title
      const department = sheetUniv['学部・学科']; // B列 → department
      const universityInfo = sheetUniv.大学情報; // C列 → description
      const area = sheetUniv.エリア; // D列 → location（'japan'|'overseas'に変換が必要）

      // 既存の大学を検索（titleで比較）
      const existing = existingUniversities?.find(u => u.title === universityName);

      if (existing) {
        console.log(`既存の大学をスキップ: ${universityName}`);
        skippedCount++;
      } else {
        // 新しい大学を追加
        try {
          const id = Math.random().toString(36).substring(2, 15);
          const now = new Date().toISOString();
          
          // エリア情報をlocationに変換（'japan' または 'overseas'）
          // エリアが「海外」や「overseas」を含む場合は 'overseas'、それ以外は 'japan'
          let location: 'japan' | 'overseas' = 'japan';
          if (area && (area.toLowerCase().includes('海外') || area.toLowerCase().includes('overseas') || area.toLowerCase().includes('外国'))) {
            location = 'overseas';
          }
          
          // typeカラムは 'university' または 'program' のみ許可
          const type: 'university' | 'program' = 'university';

          // 挿入データを構築（departmentカラムは常に含める）
          const insertData: any = {
            id,
            title: universityName, // A列 → title
            department: department || '', // B列 → department（空文字列でもOK）
            description: universityInfo || '', // C列 → description
            type: type, // デフォルトで 'university'
            location: location, // D列（エリア）→ location（変換済み）
            image_url: '',
            website_url: '',
            program_type: null,
            created_at: now,
            updated_at: now,
          };

          const { error: insertError } = await supabaseAdmin!
            .from('universities')
            .insert(insertData);

          if (insertError) {
            console.error(`✗ 追加失敗: ${universityName}`, insertError);
            console.error(`エラー詳細:`, JSON.stringify(insertError, null, 2));
            
            // departmentカラムが存在しない場合のエラーの可能性
            if (insertError.message && insertError.message.includes('column') && insertError.message.includes('department')) {
              console.error('⚠️ departmentカラムがテーブルに存在しません。Supabaseでマイグレーションを実行してください。');
            }
          } else {
            console.log(`✓ 追加: ${universityName}${department ? ' (学部・学科: ' + department + ')' : ''}${area ? ' (エリア: ' + area + ')' : ''}`);
            addedCount++;
          }
        } catch (error) {
          console.error(`✗ 追加失敗: ${universityName}`, error);
        }
      }
    }

    // 最終的な大学数を取得
    const { data: finalUniversities } = await supabaseAdmin!
      .from('universities')
      .select('id');

    console.log('\n=== インポート完了 ===');
    console.log(`追加: ${addedCount}件`);
    console.log(`スキップ: ${skippedCount}件`);
    console.log(`合計: ${sheetUniversities.length}件`);

    return NextResponse.json({
      message: 'スプレッドシートからのインポートが完了しました',
      added: addedCount,
      skipped: skippedCount,
      total: finalUniversities?.length || 0,
    });
  } catch (error) {
    console.error('Error importing from sheet:', error);
    
    // より詳細なエラー情報を返す
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
      error: error
    });
    
    return NextResponse.json(
      { 
        error: 'スプレッドシートからのインポートに失敗しました',
        details: errorMessage,
        // 開発環境では詳細な情報も返す
        ...(process.env.NODE_ENV === 'development' && {
          stack: errorStack,
          fullError: error instanceof Error ? JSON.stringify(error, Object.getOwnPropertyNames(error)) : String(error)
        })
      },
      { status: 500 }
    );
  }
}

