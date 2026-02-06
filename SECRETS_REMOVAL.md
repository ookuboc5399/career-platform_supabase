# リポジトリからシークレットを削除する手順

GitHub の Push Protection により、過去のコミットに含まれるシークレット（.env や Google サービスアカウント JSON）が検出されプッシュがブロックされています。

## 重要: 漏洩したシークレットは無効化してください

以下のキーはすでに漏洩しているため、**Azure Portal / Google Cloud Console で再発行または無効化**してください。

- Azure OpenAI API Key
- Azure Cosmos DB Key
- Azure Storage Account Key
- Google Cloud サービスアカウント鍵（`roadtoentrepreneur-6b8b51ad767a.json`）

## 手順 1: 追跡から外す（実施済みの変更）

次のコマンドで、シークレットファイルを Git の追跡から外します（ファイルはローカルに残ります）。

```bash
git rm --cached career-platform-nextjs/roadtoentrepreneur-6b8b51ad767a.json 2>/dev/null || true
git rm --cached career-platform-express/roadtoentrepreneur-6b8b51ad767a.json 2>/dev/null || true
```

## 手順 2: 履歴からシークレットを完全に削除する

履歴に残っているシークレットを削除するには、`git filter-repo` を使う方法がおすすめです。

### git-filter-repo のインストール（未導入の場合）

```bash
# macOS (Homebrew)
brew install git-filter-repo
```

### 履歴の書き換え

```bash
cd /Users/ookubo/ookuboc5399/perpetualtraveler/career-platform_supabase

# 以下のファイルを履歴から完全に削除
git filter-repo --path career-platform-nextjs/.env --invert-paths --force
git filter-repo --path career-platform-express/.env --invert-paths --force
git filter-repo --path career-platform-nextjs/roadtoentrepreneur-6b8b51ad767a.json --invert-paths --force
git filter-repo --path career-platform-express/roadtoentrepreneur-6b8b51ad767a.json --invert-paths --force
```

**注意:** `git filter-repo` は 1 ファイルごとに実行すると履歴が複数回書き換わります。複数パスをまとめて指定する場合の例:

```bash
git filter-repo --path career-platform-nextjs/.env \
  --path career-platform-express/.env \
  --path career-platform-nextjs/roadtoentrepreneur-6b8b51ad767a.json \
  --path career-platform-express/roadtoentrepreneur-6b8b51ad767a.json \
  --invert-paths --force
```

### 再度リモートを追加してプッシュ

履歴を書き換えたため、リモートの履歴と一致しなくなります。

```bash
git remote add origin https://github.com/ookuboc5399/career-platform_supabase.git
git push --force-with-lease origin main
```

（既に `origin` がある場合は `git remote add` は不要です。`git filter-repo` 実行後は `origin` が消えることがあるので、消えていたら上記で追加し直します。）

## 手順 3: 今後の運用

- `.env` と `*credentials*.json` はルートの `.gitignore` に追加済みです。
- 本番・開発用のキーは必ず環境変数またはシークレット管理サービスで扱い、リポジトリにはコミットしないでください。
