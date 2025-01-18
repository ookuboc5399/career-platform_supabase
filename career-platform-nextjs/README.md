# Career Platform

## Google Drive画像からのコンテンツ生成機能のセットアップ

### 1. Google Cloud Projectの設定

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成または既存のプロジェクトを選択
3. 以下のAPIを有効化:
   - Google Drive API
   - Cloud Vision API

### 2. サービスアカウントの作成

1. Google Cloud Consoleで「IAM & 管理」→「サービスアカウント」に移動
2. 「サービスアカウントを作成」をクリック
3. 名前と説明を入力（例: career-platform-service）
4. 以下の役割を付与:
   - Cloud Vision API 利用者
   - Drive API 利用者
5. 「キーを作成」→「JSON」を選択してキーファイルをダウンロード
6. ダウンロードしたJSONファイルを`secrets/service-account-key.json`として保存

### 3. OpenAI APIキーの取得

1. [OpenAI](https://platform.openai.com/)にアクセス
2. APIキーを作成
3. `.env`ファイルの`OPENAI_API_KEY`に設定

### 4. Google Driveの設定

1. コンテンツ用の画像を保存するフォルダを作成
2. フォルダのIDをコピー（URLの末尾の文字列）
3. フォルダをサービスアカウントと共有（サービスアカウントのメールアドレスに閲覧権限を付与）

### 使用方法

1. チャプター作成画面で「Google Drive画像からコンテンツを生成」セクションを使用
2. Google DriveフォルダIDを入力
3. 「生成」ボタンをクリック
4. 画像から抽出されたテキストがAIによって解析され、チャプターコンテンツが自動生成

### トラブルシューティング

1. 認証エラー:
   - サービスアカウントキーのパスが正しく設定されているか確認
   - 必要なAPIが有効化されているか確認

2. 画像の読み取りエラー:
   - フォルダがサービスアカウントと共有されているか確認
   - 画像形式がサポートされているか確認（JPEG, PNG, GIF, BMP, WEBP）

3. テキスト抽出エラー:
   - 画像の品質が十分か確認
   - テキストが明確で読みやすいか確認

4. コンテンツ生成エラー:
   - OpenAI APIキーが正しく設定されているか確認
   - 抽出されたテキストが意味のある内容か確認
