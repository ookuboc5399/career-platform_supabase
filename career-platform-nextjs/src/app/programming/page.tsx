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
  type: 'language' | 'framework' | 'ai-platform';
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
          <h2 className="text-2xl font-bold mb-6">AIアプリ開発プラットフォーム</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses
              .filter(course => course.type === 'ai-platform')
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
