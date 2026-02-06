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

// サービスアカウントの認証情報を読み込む
const credentials = require('../../roadtoentrepreneur-6b8b51ad767a.json');

// シングルトンインスタンスを作成
export const googleDocsClient = new GoogleDocsClient(credentials);
