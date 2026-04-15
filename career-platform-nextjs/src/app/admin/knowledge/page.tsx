'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Status = {
  defaultVaultRoot?: string;
  usingDefaultVault?: boolean;
  vaultPathConfigured: boolean;
  vaultExists: boolean;
  githubDocsContentExists: boolean;
  markdownFileCount: number;
  vaultPathHint: string | null;
  githubDocsDestHint: string | null;
  githubBlogJaDestHint?: string | null;
  githubBlogJaExists?: boolean;
  githubBlogJaMarkdownCount?: number;
};

export default function AdminKnowledgePage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [statusError, setStatusError] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [blogSyncing, setBlogSyncing] = useState(false);
  const [blogSyncMessage, setBlogSyncMessage] = useState('');

  const loadStatus = useCallback(async () => {
    setStatusError('');
    try {
      const res = await fetch('/api/admin/integrations/obsidian-status');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '状態の取得に失敗しました');
      setStatus(data);
    } catch (e) {
      setStatusError(e instanceof Error ? e.message : '状態の取得に失敗しました');
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const handleBlogSync = async () => {
    setBlogSyncing(true);
    setBlogSyncMessage('');
    try {
      const res = await fetch('/api/admin/integrations/sync-github-blog-obsidian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maxItems: 8, maxAgeDays: 90 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '同期に失敗しました');
      setBlogSyncMessage(
        `${data.message} 新規 ${data.newFiles} 件 / スキップ（済）${data.skippedAlreadySaved} / スキップ（古い）${data.skippedTooOld}`
      );
      await loadStatus();
    } catch (e) {
      setBlogSyncMessage(e instanceof Error ? e.message : '同期エラー');
    } finally {
      setBlogSyncing(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage('');
    try {
      const res = await fetch('/api/admin/integrations/sync-github-docs', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '同期に失敗しました');
      setSyncMessage(`${data.message}（${data.markdownFileCount} ファイル）`);
      await loadStatus();
    } catch (e) {
      setSyncMessage(e instanceof Error ? e.message : '同期エラー');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">学習ナレッジ（Obsidian / GitHub Docs）</h1>
      <p className="text-gray-600 mb-6">
        AI でチャプターを自動生成する<strong>前</strong>に、公式ドキュメントを Obsidian Vault に取り込みます。
        生成 API は Vault ルート（未設定時は既定の{' '}
        <code className="text-sm bg-gray-100 px-1 rounded">Documents/Obsidian Vault</code>）以下の Markdown
        からトピックに関連する抜粋を参照します。GitHub Docs のコピー先は{' '}
        <code className="text-sm bg-gray-100 px-1 rounded">…/GitHub/GitHub-docs/content</code> です。別パスにしたい場合は{' '}
        <code className="text-sm bg-gray-100 px-1 rounded">GITHUB_DOCS_OBSIDIAN_DEST</code> を指定します。
      </p>

      <section className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">現在の状態</h2>
        {statusError && (
          <p className="text-sm text-red-600 mb-3">{statusError}</p>
        )}
        {!status && !statusError && (
          <p className="text-sm text-gray-500">読み込み中…</p>
        )}
        {status && (
          <ul className="text-sm text-gray-700 space-y-2">
            <li>
              Vault ルート:{' '}
              {status.usingDefaultVault ? (
                <span className="text-amber-700">既定を使用中</span>
              ) : (
                <span className="text-green-700">OBSIDIAN_VAULT_PATH で指定</span>
              )}
              {status.defaultVaultRoot && (
                <span className="block text-xs text-gray-500 mt-1">
                  既定ルート: <span className="font-mono">{status.defaultVaultRoot}</span>
                </span>
              )}
              {status.vaultPathHint && (
                <span className="block text-xs text-gray-500 mt-1 font-mono">実効パス末尾: {status.vaultPathHint}</span>
              )}
            </li>
            <li>
              <code className="bg-gray-100 px-1 rounded">OBSIDIAN_VAULT_PATH</code> 明示:{' '}
              {status.vaultPathConfigured ? (
                <span className="text-green-700">あり</span>
              ) : (
                <span className="text-gray-600">なし（上記既定）</span>
              )}
            </li>
            <li>
              Vault パスが存在:{' '}
              {status.vaultExists ? (
                <span className="text-green-700">はい</span>
              ) : (
                <span className="text-red-600">いいえ（パスを確認してください）</span>
              )}
            </li>
            <li>
              <code className="bg-gray-100 px-1 rounded">GitHub/GitHub-docs/content</code>:{' '}
              {status.githubDocsContentExists ? (
                <span className="text-green-700">
                  あり（.md 約 {status.markdownFileCount} 件）
                </span>
              ) : (
                <span className="text-gray-600">未同期 — 下のボタンで取得できます</span>
              )}
              {status.githubDocsDestHint && (
                <span className="block text-xs text-gray-500 mt-1 font-mono">格納先末尾: {status.githubDocsDestHint}</span>
              )}
            </li>
            <li>
              <code className="bg-gray-100 px-1 rounded">GitHub/GitHub-blog-ja</code>（Blog 和訳ノート）:{' '}
              {status.githubBlogJaExists ? (
                <span className="text-green-700">あり（.md 約 {status.githubBlogJaMarkdownCount ?? 0} 件）</span>
              ) : (
                <span className="text-gray-600">未作成 — 下の「翻訳して Vault に保存」で初回作成されます</span>
              )}
              {status.githubBlogJaDestHint ? (
                <span className="block text-xs text-gray-500 mt-1 font-mono">格納先末尾: {status.githubBlogJaDestHint}</span>
              ) : null}
            </li>
          </ul>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => loadStatus()}>
            状態を再取得
          </Button>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          GitHub 公式ドキュメントを Vault に同期
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          オープンソースの{' '}
          <a
            href="https://github.com/github/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            github/docs
          </a>
          の <code className="bg-gray-100 px-1 rounded">content/</code> を浅い clone し、Vault 内の{' '}
          <code className="bg-gray-100 px-1 rounded">GitHub/GitHub-docs/content</code> にコピーします。
          リポジトリ上の本文は英語です。日本語の読み物は{' '}
          <a
            href="https://docs.github.com/ja"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            docs.github.com/ja
          </a>
          を参照してください。
        </p>
        <p className="text-xs text-gray-500 mb-4">
          サーバーに <code className="bg-gray-100 px-1 rounded">git</code> が必要です。本番ホストでは Vault
          パスが存在しないことが多いため、ローカルや自前サーバーで実行する想定です。
        </p>
        <Button
          type="button"
          onClick={handleSync}
          disabled={syncing}
          className="bg-gray-800 hover:bg-gray-900 text-white"
        >
          {syncing ? '同期中…' : 'GitHub Docs を Vault に同期'}
        </Button>
        {syncMessage && (
          <p
            className={`mt-3 text-sm ${
              syncMessage.includes('失敗') || syncMessage.includes('未設定') || syncMessage.includes('エラー')
                ? 'text-red-600'
                : 'text-green-700'
            }`}
          >
            {syncMessage}
          </p>
        )}
      </section>

      <section className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">GitHub Blog を翻訳して Vault に保存</h2>
        <p className="text-sm text-gray-600 mb-4">
          <a
            href="https://github.blog/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            The GitHub Blog
          </a>
          の RSS に載っている記事のうち、まだ保存していない URL を OpenAI（
          <code className="bg-gray-100 px-1 rounded">gpt-4o-mini</code>
          ）で<strong>日本語タイトル＋要約</strong>にし、Vault 内の{' '}
          <code className="bg-gray-100 px-1 rounded">GitHub/GitHub-blog-ja</code> に Markdown で追記します。既に保存した URL はスキップされるため、繰り返し実行してどんどん蓄積できます。
        </p>
        <p className="text-xs text-gray-500 mb-4">
          要約は自動生成です。別パスにしたい場合は{' '}
          <code className="bg-gray-100 px-1 rounded">GITHUB_BLOG_OBSIDIAN_DEST</code> を設定してください。
          1 回あたり最大 8 件まで新規保存します（タイムアウト対策）。残りは再度ボタンを押してください。
        </p>
        <Button
          type="button"
          onClick={handleBlogSync}
          disabled={blogSyncing}
          className="bg-emerald-700 hover:bg-emerald-800 text-white"
        >
          {blogSyncing ? '翻訳・保存中…' : 'GitHub Blog を翻訳して Vault に保存'}
        </Button>
        {blogSyncMessage && (
          <p
            className={`mt-3 text-sm ${
              blogSyncMessage.includes('失敗') || blogSyncMessage.includes('未設定') || blogSyncMessage.includes('エラー')
                ? 'text-red-600'
                : 'text-green-700'
            }`}
          >
            {blogSyncMessage}
          </p>
        )}
      </section>

      <section className="text-sm text-gray-600 space-y-2">
        <p>
          チャプター自動生成は{' '}
          <Link href="/admin/programming" className="text-blue-600 underline">
            プログラミング
          </Link>
          から各言語のチャプター管理を開き、「AIで自動生成」から実行できます。
        </p>
        <p>
          <Link href="/admin/settings" className="text-blue-600 underline">
            設定
          </Link>
          には環境変数の説明へのリンクがあります。
        </p>
      </section>
    </div>
  );
}
