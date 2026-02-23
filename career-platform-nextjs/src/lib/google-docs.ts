import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

// Google Docs APIの設定
const SCOPES = ['https://www.googleapis.com/auth/documents.readonly'];

export class GoogleDocsClient {
  private auth: JWT;

  constructor(credentials: any) {
    this.auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: SCOPES,
    });
  }

  /**
   * ドキュメントIDからテキストを取得する
   * @param documentId Googleドキュメントのドキュメントid
   * @returns ドキュメントのテキスト
   */
  async getDocumentText(documentId: string): Promise<string> {
    try {
      const docs = google.docs({ version: 'v1', auth: this.auth });
      const response = await docs.documents.get({ documentId });

      // ドキュメントの内容を取得
      const document = response.data;
      const content = document.body?.content;
      if (!content) {
        throw new Error('Document content is empty');
      }

      // テキストを抽出
      let text = '';
      content.forEach(element => {
        if (element.paragraph) {
          element.paragraph.elements?.forEach(elem => {
            if (elem.textRun?.content) {
              text += elem.textRun.content;
            }
          });
        }
      });

      return text;
    } catch (error) {
      console.error('Error getting document text:', error);
      throw new Error('Failed to get document text');
    }
  }

  /**
   * GoogleドキュメントのURLからドキュメントIDを抽出する
   * @param url GoogleドキュメントのURL
   * @returns ドキュメントID
   */
  static extractDocumentId(url: string): string {
    try {
      const match = url.match(/\/document\/d\/([a-zA-Z0-9-_]+)/);
      if (!match) {
        throw new Error('Invalid Google Docs URL');
      }
      return match[1];
    } catch (error) {
      throw new Error('Failed to extract document ID from URL');
    }
  }
}

// 認証情報を環境変数またはローカルファイルから取得（ビルド時はファイル参照を避ける）
function getCredentials(): Record<string, unknown> {
  const envCreds = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
  if (envCreds) {
    try {
      return JSON.parse(envCreds) as Record<string, unknown>;
    } catch {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_CREDENTIALS の JSON が不正です');
    }
  }
  // ローカル開発時のみ: ファイルが存在する場合に読み込み（動的 require でビルドエラー回避）
  if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
    try {
      const path = require('path');
      const fs = require('fs');
      const filePath = path.join(process.cwd(), 'roadtoentrepreneur-6b8b51ad767a.json');
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
    } catch {
      // ファイルがなければスキップ
    }
  }
  throw new Error(
    'Google 認証情報が設定されていません。GOOGLE_SERVICE_ACCOUNT_CREDENTIALS 環境変数に JSON を設定するか、ローカルで roadtoentrepreneur-6b8b51ad767a.json を配置してください。'
  );
}

let _client: GoogleDocsClient | null = null;

function getClient(): GoogleDocsClient {
  if (!_client) {
    _client = new GoogleDocsClient(getCredentials());
  }
  return _client;
}

/** シングルトンインスタンス（認証未設定時は使用時にエラー） */
export const googleDocsClient = {
  getDocumentText: (documentId: string) => getClient().getDocumentText(documentId),
};
