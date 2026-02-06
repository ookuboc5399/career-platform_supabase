import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { createUniversity, getUniversities } from '../lib/supabase-db';
import * as path from 'path';

// GoogleスプレッドシートのID
const SPREADSHEET_ID = '1EcWg-FYJXfCJ1oMZi39p3ypdPofUsG8UYW1lNtJzb-8';
const SHEET_NAME = 'Sheet1'; // または適切なシート名

// Google Sheets APIの認証設定
async function getAuth() {
  // サービスアカウントの認証情報ファイルパス
  const credentialsPath = path.join(__dirname, '../../../roadtoentrepreneur-6b8b51ad767a.json');
  
  try {
    const credentials = require(credentialsPath);
    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    return auth;
  } catch (error) {
    console.error('認証情報ファイルが見つかりません:', credentialsPath);
    throw error;
  }
}

interface UniversityRow {
  大学名: string;
  学部・学科: string;
}

/**
 * Googleスプレッドシートから大学情報を取得
 */
async function fetchUniversitiesFromSheet(): Promise<UniversityRow[]> {
  try {
    const auth = await getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    // スプレッドシートからデータを取得
    // まず、スプレッドシートの情報を取得してシート名を確認
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const firstSheetName = spreadsheet.data.sheets?.[0]?.properties?.title || 'Sheet1';
    console.log(`シート名: ${firstSheetName}`);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${firstSheetName}!A:B`, // A列とB列を取得
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
      if (row && row.length >= 2 && row[0] && row[0].trim() && row[1] && row[1].trim()) {
        universities.push({
          大学名: row[0].trim(),
          学部・学科: row[1].trim(),
        });
      }
    }

    return universities;
  } catch (error) {
    console.error('スプレッドシートからのデータ取得に失敗:', error);
    throw error;
  }
}

/**
 * 大学情報をSupabaseにインポート
 */
async function importUniversitiesToSupabase() {
  try {
    console.log('スプレッドシートから大学情報を取得中...');
    const sheetUniversities = await fetchUniversitiesFromSheet();
    console.log(`取得した大学数: ${sheetUniversities.length}`);

    // 既存の大学情報を取得
    const existingUniversities = await getUniversities();
    console.log(`既存の大学数: ${existingUniversities.length}`);

    let addedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (const sheetUniv of sheetUniversities) {
      const universityName = sheetUniv.大学名;
      const department = sheetUniv.学部・学科;

      // 既存の大学を検索
      const existing = existingUniversities.find(u => u.title === universityName);

      if (existing) {
        // 既に存在する場合は、学部・学科情報をdescriptionに追加
        const updatedDescription = existing.description 
          ? `${existing.description}\n学部・学科: ${department}`
          : `学部・学科: ${department}`;
        
        // 更新は別途実装が必要な場合はコメントアウト
        console.log(`既存の大学をスキップ: ${universityName}`);
        skippedCount++;
      } else {
        // 新しい大学を追加
        try {
          await createUniversity({
            title: universityName,
            description: `学部・学科: ${department}`,
            imageUrl: '',
            websiteUrl: '',
            type: 'university',
            location: 'japan',
          });
          console.log(`✓ 追加: ${universityName} - ${department}`);
          addedCount++;
        } catch (error) {
          console.error(`✗ 追加失敗: ${universityName}`, error);
        }
      }
    }

    console.log('\n=== インポート完了 ===');
    console.log(`追加: ${addedCount}件`);
    console.log(`更新: ${updatedCount}件`);
    console.log(`スキップ: ${skippedCount}件`);
    console.log(`合計: ${sheetUniversities.length}件`);

  } catch (error) {
    console.error('インポートエラー:', error);
    throw error;
  }
}

// スクリプトを実行
if (require.main === module) {
  importUniversitiesToSupabase()
    .then(() => {
      console.log('インポートが正常に完了しました');
      process.exit(0);
    })
    .catch((error) => {
      console.error('インポート中にエラーが発生しました:', error);
      process.exit(1);
    });
}

export { importUniversitiesToSupabase, fetchUniversitiesFromSheet };

