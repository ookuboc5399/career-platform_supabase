const { createProgrammingChapter } = require('../src/lib/programming-data');
// 環境変数を読み込む
require('dotenv').config({ path: '.env.local' });

const githubChapters = [
  // GitHub Foundations - 3チャプター
  {
    languageId: 'github',
    title: 'GitHubの基本概念とアカウント設定',
    description: 'GitHubとは何か、アカウントの作成方法、基本的な設定について学びます。リポジトリの概念とGitHubの基本的な使い方を理解します。',
    duration: '30分',
    order: 1,
    status: 'published' as const,
    exercises: [],
  },
  {
    languageId: 'github',
    title: 'リポジトリの作成と管理',
    description: '新しいリポジトリの作成方法、READMEファイルの書き方、リポジトリの設定変更など、リポジトリ管理の基本を学びます。',
    duration: '40分',
    order: 2,
    status: 'published' as const,
    exercises: [],
  },
  {
    languageId: 'github',
    title: 'ブランチとマージの基本',
    description: 'ブランチの作成、切り替え、マージの方法を学びます。Gitの基本操作とGitHubでのブランチ管理について理解を深めます。',
    duration: '50分',
    order: 3,
    status: 'published' as const,
    exercises: [],
  },
  // GitHub Actions - 3チャプター
  {
    languageId: 'github',
    title: 'GitHub Actions入門',
    description: 'GitHub Actionsとは何か、ワークフローの基本概念、YAMLファイルの書き方について学びます。CI/CDの基礎を理解します。',
    duration: '45分',
    order: 4,
    status: 'published' as const,
    exercises: [],
  },
  {
    languageId: 'github',
    title: 'ワークフローの作成と実行',
    description: '実際にGitHub Actionsのワークフローを作成し、自動テストやビルドプロセスを自動化する方法を学びます。',
    duration: '60分',
    order: 5,
    status: 'published' as const,
    exercises: [],
  },
  {
    languageId: 'github',
    title: 'アクションとマーケットプレイスの活用',
    description: '既存のアクションの使い方、GitHubマーケットプレイスからのアクションの導入、カスタムアクションの作成方法を学びます。',
    duration: '55分',
    order: 6,
    status: 'published' as const,
    exercises: [],
  },
  // GitHub Copilot - 3チャプター
  {
    languageId: 'github',
    title: 'GitHub Copilotの導入と設定',
    description: 'GitHub Copilotとは何か、インストール方法、エディタへの統合方法について学びます。AIアシスタントとしてのCopilotの基本を理解します。',
    duration: '35分',
    order: 7,
    status: 'published' as const,
    exercises: [],
  },
  {
    languageId: 'github',
    title: 'Copilotを使ったコーディング',
    description: 'GitHub Copilotを使った効率的なコーディング方法、プロンプトの書き方、コード生成の活用方法を学びます。',
    duration: '50分',
    order: 8,
    status: 'published' as const,
    exercises: [],
  },
  {
    languageId: 'github',
    title: 'Copilotのベストプラクティス',
    description: 'GitHub Copilotを効果的に使うためのコツ、コードレビューの方法、生成されたコードの品質管理について学びます。',
    duration: '45分',
    order: 9,
    status: 'published' as const,
    exercises: [],
  },
  // Advanced Security - 3チャプター
  {
    languageId: 'github',
    title: 'GitHubのセキュリティ機能',
    description: 'Dependabot、セキュリティアドバイザリ、コードスキャンなど、GitHubのセキュリティ機能の概要を学びます。',
    duration: '40分',
    order: 10,
    status: 'published' as const,
    exercises: [],
  },
  {
    languageId: 'github',
    title: 'シークレット管理とアクセス制御',
    description: 'GitHub Secretsの設定方法、環境変数の管理、リポジトリへのアクセス制御と権限管理について学びます。',
    duration: '50分',
    order: 11,
    status: 'published' as const,
    exercises: [],
  },
  {
    languageId: 'github',
    title: 'セキュリティポリシーの実装',
    description: 'ブランチ保護ルール、必須レビュー、セキュリティポリシーの設定など、組織レベルのセキュリティ管理について学びます。',
    duration: '55分',
    order: 12,
    status: 'published' as const,
    exercises: [],
  },
];

async function createGithubChapters() {
  try {
    console.log('GitHubチャプターの作成を開始します...');
    
    for (const chapter of githubChapters) {
      try {
        await createProgrammingChapter(chapter);
        console.log(`✓ 作成完了: ${chapter.title} (Order: ${chapter.order})`);
      } catch (error) {
        console.error(`✗ 作成失敗: ${chapter.title}`, error);
      }
    }
    
    console.log('\nすべてのGitHubチャプターの作成が完了しました！');
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
}

createGithubChapters();

