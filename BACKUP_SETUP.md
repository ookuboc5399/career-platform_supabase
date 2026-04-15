# Supabase バックアップ セットアップ

## 概要

GitHub Actions で Supabase の DB を JSON 形式でバックアップし、Google Drive に自動アップロードします。

## GitHub Secrets の設定

リポジトリの Settings → Secrets and variables → Actions で以下を追加してください。

| Secret 名 | 説明 |
|-----------|------|
| `SUPABASE_URL` | Supabase プロジェクトの URL（または `NEXT_PUBLIC_SUPABASE_URL`） |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase の Service Role Key |
| `GDRIVE_SERVICE_ACCOUNT_JSON` | Google Drive 用サービスアカウントの JSON 全体 |
| `GDRIVE_FOLDER_ID` | バックアップ先フォルダの ID（任意だが推奨） |

## Google Drive の設定

1. [Google Cloud Console](https://console.cloud.google.com) でプロジェクトを作成
2. **Google Drive API** を有効化
3. **サービスアカウント**を作成
4. サービスアカウントの **JSON キー**をダウンロード
5. Google Drive にフォルダ（例: `SupabaseBackups`）を作成
6. そのフォルダを**サービスアカウントのメール**（`xxx@project.iam.gserviceaccount.com`）と「編集者」で共有
7. フォルダを開いたときの URL から `GDRIVE_FOLDER_ID` を取得（例: `https://drive.google.com/drive/folders/1ABC123xyz` → `1ABC123xyz`）

## 実行

- **自動**: 毎日 4:00 JST（19:00 UTC）に実行
- **手動**: `workflow_dispatch` で手動実行可能
- **ローカル**: `cd career-platform-express && npm run backup` でローカルにバックアップ

## 出力先

- ローカル: `backups/db/json/YYYY-MM-DD/` 配下に各テーブルの JSON ファイル
- Google Drive: 共有フォルダ内に `YYYY-MM-DD/` として保存
