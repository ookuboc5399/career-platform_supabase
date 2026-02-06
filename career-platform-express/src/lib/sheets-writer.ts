import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import * as path from 'path';

// GoogleスプレッドシートのID
const SPREADSHEET_ID = '1EcWg-FYJXfCJ1oMZi39p3ypdPofUsG8UYW1lNtJzb-8';

// Google Sheets APIの認証設定（読み書き可能）
async function getAuth() {
  const credentialsPath = path.join(__dirname, '../../../roadtoentrepreneur-6b8b51ad767a.json');
  
  try {
    const credentials = require(credentialsPath);
    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'], // 読み書き可能
    });
    return auth;
  } catch (error) {
    console.error('認証情報ファイルが見つかりません:', credentialsPath);
    throw error;
  }
}

interface University {
  name: string;
  location: string;
  website: string;
}

/**
 * Googleスプレッドシートから既存の大学名を取得
 */
export async function getExistingUniversityNames(): Promise<string[]> {
  try {
    const auth = await getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    // スプレッドシート情報を取得してシート名を確認
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const firstSheetName = spreadsheet.data.sheets?.[0]?.properties?.title || 'Sheet1';
    console.log(`シート名: ${firstSheetName}`);

    // A列のすべての値を取得（ヘッダー行を含む）
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${firstSheetName}!A:A`,
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return []; // ヘッダー行のみまたはデータなし
    }

    // ヘッダー行をスキップして大学名のリストを返す（小文字で正規化して比較しやすくする）
    const universityNames = rows.slice(1)
      .map(row => row?.[0]?.trim())
      .filter((name): name is string => !!name && name.length > 0);

    return universityNames;
  } catch (error) {
    console.error('スプレッドシートからのデータ取得に失敗:', error);
    throw error;
  }
}

/**
 * 大学情報をスプレッドシートに書き込む（重複チェック付き）
 */
export async function writeUniversitiesToSheet(universities: University[]): Promise<{
  written: number;
  skipped: number;
  total: number;
}> {
  try {
    const auth = await getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    // スプレッドシート情報を取得してシート名を確認
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const firstSheetName = spreadsheet.data.sheets?.[0]?.properties?.title || 'Sheet1';
    console.log(`シート名: ${firstSheetName}`);

    // 既存の大学名を取得
    const existingNames = await getExistingUniversityNames();
    const existingNamesLower = existingNames.map(name => name.toLowerCase().trim());

    // 重複をチェックして、新しい大学のみをフィルタリング
    const newUniversities = universities.filter(university => {
      const universityNameLower = university.name.toLowerCase().trim();
      return !existingNamesLower.includes(universityNameLower);
    });

    if (newUniversities.length === 0) {
      console.log('新しい大学情報はありません。すべて既に存在しています。');
      return {
        written: 0,
        skipped: universities.length,
        total: existingNames.length,
      };
    }

    // 書き込むデータを準備（A列: 大学名、B列: 学部・学科（空欄））
    const values = newUniversities.map(university => [
      university.name,
      '', // B列は学部・学科（今回は空欄、後で手動で入力してもらう）
    ]);

    // スプレッドシートに追記
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${firstSheetName}!A:B`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: values,
      },
    });

    console.log(`${newUniversities.length}件の大学情報をスプレッドシートに追加しました`);

    // 最終的なデータ数を取得
    const finalResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${firstSheetName}!A:A`,
    });

    const finalRows = finalResponse.data.values || [];
    const finalTotal = finalRows.length > 1 ? finalRows.length - 1 : 0; // ヘッダー行を除外

    return {
      written: newUniversities.length,
      skipped: universities.length - newUniversities.length,
      total: finalTotal,
    };
  } catch (error) {
    console.error('スプレッドシートへの書き込みに失敗:', error);
    throw error;
  }
}

