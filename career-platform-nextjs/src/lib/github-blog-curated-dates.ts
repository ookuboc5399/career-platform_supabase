/**
 * GitHub Blog チャプター用: 日付別の教材まとめ（RSS とは独立）
 * キーはローカル日付 YYYY-MM-DD
 */
export type GitHubBlogCuratedItem = {
  title: string;
  /** 本文（段落は \n\n で区切り可） */
  body: string;
};

export type GitHubBlogCuratedDay = {
  /** 見出し用（例: 2026年4月15日） */
  displayLabel: string;
  items: GitHubBlogCuratedItem[];
};

export const GITHUB_BLOG_CURATED_BY_DATE: Record<string, GitHubBlogCuratedDay> = {
  '2026-04-15': {
    displayLabel: '2026年4月15日',
    items: [
      {
        title: 'Copilot cloud agent の管理機能強化',
        body:
          'Organization レベルで cloud agent のランナー制御やファイアウォール設定が追加されました。GitHub Enterprise 管理者として cloud agent の利用範囲やネットワーク制御を Organization 単位で設定できるようになっています。\n\n' +
          'また、Copilot coding agent が Copilot cloud agent に名称変更され、データスキーマも更新予定です。GitHub API やレポートを使っている場合はフィールド名の変更に注意が必要です。',
      },
      {
        title: 'Copilot 利用メトリクスの拡充',
        body:
          'CLI のアクティビティがトップレベルの集計に統合され、IDE と CLI を横断した統一ビューが管理者に提供されるようになりました。さらに Copilot code review のアクティブ／パッシブユーザーの識別も可能になりました。GitHub のコスト管理やプレミアムリクエストの部門別把握に活用できそうです。',
      },
      {
        title: 'Opus 4.6 Fast の廃止 & 新レート制限（4/10）',
        body:
          'サービス全体の信頼性確保のため、同時利用やモデルファミリー別の新しいレート制限が今後数週間で導入されます。GitHub Business／Enterprise ユーザーにも適用されるので、ヘビーユーザーがいる部門では影響が出る可能性があります。Opus 4.6 Fast の廃止自体は Pro+ 向けなので、すべてのプランに直接関係するとは限りません。',
      },
      {
        title: 'Code scanning: PR でセキュリティアラート提案の一括適用',
        body:
          'PR でコードスキャンのセキュリティアラート提案をバッチで一括適用できるようになりました。GitHub Advanced Security を使っている場合、修正作業の効率が上がります。',
      },
      {
        title: 'Copilot SDK のパブリックプレビュー',
        body:
          'Copilot SDK がパブリックプレビューとして公開されました。GitHub 社内ツールと Copilot を連携させるカスタムエージェント開発などに使える可能性があります。',
      },
    ],
  },
};

export function listCuratedDateKeysSorted(): string[] {
  return Object.keys(GITHUB_BLOG_CURATED_BY_DATE).sort((a, b) => b.localeCompare(a));
}

export function toYmdLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseYmd(ymd: string): Date | null {
  const [y, m, d] = ymd.split('-').map(Number);
  if (!y || !m || !d) return null;
  const dt = new Date(y, m - 1, d);
  return Number.isNaN(dt.getTime()) ? null : dt;
}
