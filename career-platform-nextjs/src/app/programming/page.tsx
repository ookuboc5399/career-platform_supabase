import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  level: string;
  chapters: number;
  exercises: number;
  type: 'language' | 'framework' | 'ai-platform' | 'data-warehouse' | 'others' | 'saas' | 'cloud' | 'network';
}

const courses: Course[] = [
  {
    id: 'dify',
    title: 'Dify入門',
    description: 'ノーコードでAIアプリケーションを開発できるDifyプラットフォームの使い方を学びます。',
    icon: '🤖',
    features: [
      'AIアプリケーションの設計',
      'プロンプトエンジニアリング',
      'APIの活用方法',
    ],
    level: '初級',
    chapters: 5,
    exercises: 10,
    type: 'ai-platform',
  },
  {
    id: 'n8n',
    title: 'n8n入門',
    description: 'オープンソースのワークフロー自動化ツールn8nの使い方を学びます。',
    icon: '⚙️',
    features: [
      'ワークフローの設計と自動化',
      '多様なサービスとの連携',
      'カスタムノードの作成',
    ],
    level: '初級',
    chapters: 6,
    exercises: 12,
    type: 'ai-platform',
  },
  {
    id: 'php',
    title: 'PHP入門',
    description: 'Webアプリケーション開発で広く使用されているPHPを基礎から学びます。',
    icon: '🐘',
    features: [
      'PHPの基本構文と機能',
      'データベース連携（MySQL）',
      'フレームワーク入門（Laravel）',
    ],
    level: '初級',
    chapters: 8,
    exercises: 20,
    type: 'language',
  },
  {
    id: 'python',
    title: 'Python入門',
    description: 'データサイエンス、機械学習、Webアプリケーション開発で人気のPythonを基礎から学びます。',
    icon: '🐍',
    features: [
      '基本的なプログラミング概念',
      'データ構造とアルゴリズム',
      'ファイル操作とデータ処理',
    ],
    level: '初級',
    chapters: 9,
    exercises: 23,
    type: 'language',
  },
  {
    id: 'javascript',
    title: 'JavaScript入門',
    description: 'Web開発に不可欠なJavaScriptの基礎から応用までを実践的に学習します。',
    icon: '🌐',
    features: [
      'Web開発の基礎',
      'DOM操作とイベント処理',
      '非同期プログラミング',
    ],
    level: '初級',
    chapters: 8,
    exercises: 20,
    type: 'language',
  },
  {
    id: 'go',
    title: 'Go入門',
    description: '高性能で効率的なバックエンド開発のためのGo言語を基礎から学びます。',
    icon: '🔷',
    features: [
      '並行処理とゴルーチン',
      'メモリ管理とポインタ',
      'マイクロサービス開発',
    ],
    level: '中級',
    chapters: 7,
    exercises: 18,
    type: 'language',
  },
  {
    id: 'react',
    title: 'React入門',
    description: 'モダンなWebフロントエンド開発のためのReactフレームワークを学びます。',
    icon: '⚛️',
    features: [
      'コンポーネント設計',
      'Hooksの活用',
      'ステート管理',
    ],
    level: '中級',
    chapters: 6,
    exercises: 15,
    type: 'framework',
  },
  {
    id: 'django',
    title: 'Django入門',
    description: 'Pythonで高速に安全なWebアプリケーションを開発するためのフレームワーク、Djangoを学びます。',
    icon: '🐍',
    features: ['MTVアーキテクチャ', 'ORMの活用', '認証機能の実装'],
    level: '中級',
    chapters: 8,
    exercises: 18,
    type: 'framework',
  },
  {
    id: 'nextjs',
    title: 'Next.js入門',
    description: 'Reactをベースにしたサーバーサイドレンダリングや静的サイト生成が可能なフレームワーク、Next.jsを学びます。',
    icon: '🚀',
    features: ['サーバーサイドレンダリング (SSR)', '静的サイト生成 (SSG)', 'APIルートの作成'],
    level: '中級',
    chapters: 7,
    exercises: 16,
    type: 'framework',
  },
  {
    id: 'express',
    title: 'Express入門',
    description: 'Node.jsのための高速で最小限のWebアプリケーションフレームワーク、Expressを学びます。',
    icon: '⚡️',
    features: ['ルーティング', 'ミドルウェアの作成', 'REST APIの構築'],
    level: '中級',
    chapters: 6,
    exercises: 14,
    type: 'framework',
  },
  {
    id: 'rails',
    title: 'Ruby on Rails入門',
    description: '「設定より規約」の原則に基づいた効率的なWebアプリケーション開発フレームワーク、Ruby on Railsを学びます。',
    icon: '💎',
    features: ['MVCアーキテクチャ', 'Active RecordによるDB操作', 'Scaffoldingによる高速開発'],
    level: '中級',
    chapters: 8,
    exercises: 20,
    type: 'framework',
  },
  {
    id: 'snowflake',
    title: 'Snowflake入門',
    description: 'クラウドベースのデータウェアハウスプラットフォーム、Snowflakeの基礎から学びます。',
    icon: '❄️',
    features: ['データウェアハウジングの基本', 'SQLによるデータ操作', 'データの共有と管理'],
    level: '初級',
    chapters: 7,
    exercises: 15,
    type: 'data-warehouse',
  },
  {
    id: 'semantic-layer',
    title: 'セマンティックレイヤー入門',
    description: 'ビジネスインテリジェンスとデータ分析のためのセマンティックレイヤーの概念と構築方法を学びます。',
    icon: '📊',
    features: ['セマンティックレイヤーの役割', 'dbt Semantic Layerの活用', 'Looker Studioとの連携'],
    level: '中級',
    chapters: 5,
    exercises: 10,
    type: 'others',
  },
  {
    id: 'github',
    title: 'GitHub入門',
    description: '世界最大のコードホスティングサービス、GitHubの使い方を基礎から実践的に学びます。',
    icon: '🐙',
    features: [
      'リポジトリの作成と管理',
      'ブランチとマージの基本',
      'プルリクエストとコードレビュー',
    ],
    level: '初級',
    chapters: 6,
    exercises: 15,
    type: 'others',
  },
  {
    id: 'jira',
    title: 'Jira入門',
    description: 'プロジェクト管理と課題追跡のための強力なツール、Jiraの使い方を基礎から実践的に学びます。',
    icon: '🎯',
    features: [
      'プロジェクトとボードの作成',
      '課題（Issue）の管理とワークフロー',
      'アジャイル開発の実践',
    ],
    level: '初級',
    chapters: 6,
    exercises: 15,
    type: 'saas',
  },
];

const CourseCard = ({ course }: { course: Course }) => (
  <Link
    href={`/programming/${course.id}`}
    key={course.id}
    className="block"
  >
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-4xl mr-4">{course.icon}</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{course.title}</h2>
              <p className="text-sm text-gray-500">
                {course.level} • {course.chapters}チャプター • {course.exercises}個の演習
              </p>
            </div>
          </div>
          <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            無料
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          {course.description}
        </p>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-900">学習内容:</h3>
          <ul className="space-y-1">
            {course.features.map((feature, index) => (
              <li key={index} className="flex items-center text-gray-600">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <div className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700">
            コースを始める
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-8 py-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-500">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            約10時間
          </div>
          <div className="flex items-center text-gray-500">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            修了証明書あり
          </div>
        </div>
      </div>
    </div>
  </Link>
);

export default function ProgrammingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">プログラミング学習</h1>
        <p className="text-xl text-gray-600">
          実践的なプログラミングスキルを身につけよう
        </p>
      </div>

      <div className="space-y-12">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold mb-2">ランダム問題演習</h2>
              <p className="text-gray-600">全てのジャンルから問題をランダムに解いて実力を試そう！</p>
            </div>
            <Link
              href="/programming/practice"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              問題を解く
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">プログラミング言語</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses
              .filter(course => course.type === 'language')
              .map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">フレームワーク</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses
              .filter(course => course.type === 'framework')
              .map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">ワークフロー開発プラットフォーム</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses
              .filter(course => course.type === 'ai-platform')
              .map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">データウェアハウス</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses
              .filter(course => course.type === 'data-warehouse')
              .map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">クラウド</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses
              .filter(course => course.type === 'cloud')
              .map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">ネットワーク</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses
              .filter(course => course.type === 'network')
              .map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">SaaS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses
              .filter(course => course.type === 'saas')
              .map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">その他</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses
              .filter(course => course.type === 'others')
              .map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
          </div>
        </div>
      </div>

      <div className="mt-12 bg-blue-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          学習の進め方
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">1. 動画で学習</h3>
              <p className="mt-2 text-gray-600">
                分かりやすい解説動画で基礎概念を理解します
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">2. コードを書く</h3>
              <p className="mt-2 text-gray-600">
                オンラインエディタで実際にコードを書いて試します
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">3. 演習で確認</h3>
              <p className="mt-2 text-gray-600">
                演習問題を解いて理解度を確認します
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
