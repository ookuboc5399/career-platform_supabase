const dummyChapters = {
  python: [
    { id: 'py-1', title: '環境構築と基本構文', description: 'Pythonのインストールから、変数、データ型、基本的な演算子までを学びます。', duration: '30分', order: 1, status: 'published', exercises: [] },
    { id: 'py-2', title: 'データ構造：リストとタプル', description: '複数の値をまとめて扱うためのリストとタプルの使い方を学びます。', duration: '45分', order: 2, status: 'published', exercises: [] },
    { id: 'py-3', title: '制御フロー：条件分岐とループ', description: 'if文による条件分岐や、for, while文によるループ処理を学びます。', duration: '50分', order: 3, status: 'published', exercises: [] },
    { id: 'py-4', title: 'データ構造：辞書とセット', description: 'キーと値のペアで管理する辞書と、重複しない要素を持つセットを学びます。', duration: '40分', order: 4, status: 'published', exercises: [] },
    { id: 'py-5', title: '関数とモジュール', description: '処理をまとめる関数や、コードを分割管理するためのモジュールについて学びます。', duration: '60分', order: 5, status: 'published', exercises: [] },
    { id: 'py-6', title: 'クラスとオブジェクト指向', description: 'オブジェクト指向プログラミングの基本であるクラスの概念と使い方を学びます。', duration: '75分', order: 6, status: 'published', exercises: [] },
    { id: 'py-7', title: 'ファイル操作と例外処理', description: 'ファイルの読み書きや、エラー発生時の対処法である例外処理を学びます。', duration: '45分', order: 7, status: 'published', exercises: [] },
  ],
  javascript: [
    { id: 'js-1', title: 'JavaScriptの概要と基本文法', description: 'JavaScriptとは何か、変数、データ型、演算子などの基本を学びます。', duration: '35分', order: 1, status: 'published', exercises: [] },
    { id: 'js-2', title: '制御構文：条件分岐とループ', description: 'if文やswitch文、for文やwhile文などプログラムの流れを制御する方法を学びます。', duration: '45分', order: 2, status: 'published', exercises: [] },
    { id: 'js-3', title: '関数とスコープ', description: '処理を部品化する関数の作り方と、変数が有効な範囲であるスコープについて学びます。', duration: '55分', order: 3, status: 'published', exercises: [] },
    { id: 'js-4', title: 'オブジェクトと配列', description: '複雑なデータを扱うためのオブジェクトと配列の操作方法を学びます。', duration: '50分', order: 4, status: 'published', exercises: [] },
    { id: 'js-5', title: 'DOM操作とイベント処理', description: 'HTML要素をJavaScriptで操作するDOMと、ユーザーのアクションに応答するイベント処理を学びます。', duration: '60分', order: 5, status: 'published', exercises: [] },
    { id: 'js-6', title: '非同期処理とPromise', description: '時間がかかる処理を扱うための非同期処理と、その状態を管理するPromiseオブジェクトについて学びます。', duration: '70分', order: 6, status: 'published', exercises: [] },
    { id: 'js-7', title: 'ES6+のモダンな機能', description: 'アロー関数、クラス、分割代入など、現代的なJavaScript開発で必須の機能を学びます。', duration: '50分', order: 7, status: 'published', exercises: [] },
  ],
  react: [
    { id: 'react-1', title: 'Reactの導入とJSX', description: 'Reactプロジェクトの作成方法と、HTMLライクな構文であるJSXの書き方を学びます。', duration: '40分', order: 1, status: 'published', exercises: [] },
    { id: 'react-2', title: 'コンポーネントとProps', description: 'UIを部品化するコンポーネントの概念と、親から子へデータを渡すPropsを学びます。', duration: '50分', order: 2, status: 'published', exercises: [] },
    { id: 'react-3', title: 'Stateとライフサイクル', description: 'コンポーネントが状態を持つためのStateと、コンポーネントの生成から破棄までを管理するライフサイクルを学びます。', duration: '60分', order: 3, status: 'published', exercises: [] },
    { id: 'react-4', title: 'イベント処理とフォーム', description: 'ユーザーの操作に応じたイベントの処理方法と、フォーム要素の扱い方を学びます。', duration: '55分', order: 4, status: 'published', exercises: [] },
    { id: 'react-5', title: 'Hooks入門：useStateとuseEffect', description: '関数コンポーネントでStateやライフサイクルを扱うための基本的なHooksを学びます。', duration: '70分', order: 5, status: 'published', exercises: [] },
    { id: 'react-6', title: 'Hooks応用：useContextとuseReducer', description: 'コンポーネント間のデータ受け渡しや、複雑な状態管理のためのHooksを学びます。', duration: '65分', order: 6, status: 'published', exercises: [] },
    { id: 'react-7', title: 'React Routerによるルーティング', description: '複数のページを持つアプリケーションを作成するためのReact Routerの基本を学びます。', duration: '50分', order: 7, status: 'published', exercises: [] },
  ],
  nextjs: [
    { id: 'next-1', title: 'Next.js入門とプロジェクト作成', description: 'Next.jsの概要を理解し、最初のプロジェクトを作成します。', duration: '30分', order: 1, status: 'published', exercises: [] },
    { id: 'next-2', title: 'ファイルベースルーティングとページ作成', description: 'Next.jsの基本的なルーティングシステムと、新しいページの作成方法を学びます。', duration: '40分', order: 2, status: 'published', exercises: [] },
    { id: 'next-3', title: '静的サイト生成 (SSG) とサーバーサイドレンダリング (SSR)', description: '事前ビルドとリクエストごとのレンダリング、それぞれの特徴と使い方を学びます。', duration: '60分', order: 3, status: 'published', exercises: [] },
    { id: 'next-4', title: 'API Routesの作成', description: 'Next.jsアプリケーション内にAPIエンドポイントを作成する方法を学びます。', duration: '45分', order: 4, status: 'published', exercises: [] },
    { id: 'next-5', title: 'コンポーネントとレイアウト', description: '共通のレイアウトを作成し、アプリケーション全体で再利用する方法を学びます。', duration: '50分', order: 5, status: 'published', exercises: [] },
    { id: 'next-6', title: '画像の最適化とフォント', description: 'Next.jsに組み込まれた画像最適化機能と、Webフォントの利用方法を学びます。', duration: '35分', order: 6, status: 'published', exercises: [] },
  ],
  go: [
    { id: 'go-1', title: 'Go言語の基本', description: 'Goのインストール、ワークスペースの設定、基本的な構文（変数、型、演算子）を学びます。', duration: '40分', order: 1, status: 'published', exercises: [] },
    { id: 'go-2', title: '制御構造', description: 'if, for, switchなどの制御構造と、関数の定義と呼び出しを学びます。', duration: '50分', order: 2, status: 'published', exercises: [] },
    { id: 'go-3', title: '複合型：配列、スライス、マップ', description: 'Goの強力なデータ構造である配列、スライス、マップの使い方を学びます。', duration: '60分', order: 3, status: 'published', exercises: [] },
    { id: 'go-4', title: '構造体とインターフェース', description: '独自のデータ型を定義する構造体と、Goのポリモーフィズムを実現するインターフェースを学びます。', duration: '70分', order: 4, status: 'published', exercises: [] },
    { id: 'go-5', title: 'GoroutineとChannelによる並行処理', description: 'Goの最大の特徴であるGoroutineとChannelを使った軽量な並行処理プログラミングを学びます。', duration: '80分', order: 5, status: 'published', exercises: [] },
    { id: 'go-6', title: 'エラーハンドリング', description: 'Go言語におけるエラー処理の考え方と実践的な実装方法を学びます。', duration: '45分', order: 6, status: 'published', exercises: [] },
  ],
  django: [
    { id: 'django-1', title: 'Djangoのセットアップとプロジェクトの開始', description: 'Djangoのインストールと、新しいプロジェクトとアプリケーションの作成方法を学びます。', duration: '35分', order: 1, status: 'published', exercises: [] },
    { id: 'django-2', title: 'モデルとデータベース', description: 'Django ORMを使ってデータベースモデルを定義し、マイグレーションを実行する方法を学びます。', duration: '60分', order: 2, status: 'published', exercises: [] },
    { id: 'django-3', title: 'ビューとURL', description: 'リクエストを処理するビューを作成し、URLと結びつける方法を学びます。', duration: '55分', order: 3, status: 'published', exercises: [] },
    { id: 'django-4', title: 'テンプレートシステム', description: '動的なHTMLを生成するためのDjangoテンプレート言語の基本を学びます。', duration: '60分', order: 4, status: 'published', exercises: [] },
    { id: 'django-5', title: 'フォームの処理', description: 'ユーザーからの入力を受け取るためのフォーム作成とバリデーションを学びます。', duration: '50分', order: 5, status: 'published', exercises: [] },
    { id: 'django-6', title: '管理サイトの活用', description: 'Djangoが自動生成する強力な管理サイトのカスタマイズ方法を学びます。', duration: '45分', order: 6, status: 'published', exercises: [] },
  ],
  rails: [
    { id: 'rails-1', title: 'Railsの環境構築と最初のアプリケーション', description: 'RubyとRailsをインストールし、最初のRailsアプリケーションを作成します。', duration: '40分', order: 1, status: 'published', exercises: [] },
    { id: 'rails-2', title: 'MVCアーキテクチャ：ルーティング、コントローラ、ビュー', description: 'Railsの基本であるMVCアーキテクチャの各要素の役割と連携を学びます。', duration: '60分', order: 2, status: 'published', exercises: [] },
    { id: 'rails-3', title: 'Active Recordによるデータベース操作', description: 'モデルとマイグレーションを作成し、データベースとのやり取りを行う方法を学びます。', duration: '65分', order: 3, status: 'published', exercises: [] },
    { id: 'rails-4', title: 'Scaffoldingによる高速開発', description: '基本的なCRUD機能を自動生成するScaffoldingの仕組みと使い方を学びます。', duration: '50分', order: 4, status: 'published', exercises: [] },
    { id: 'rails-5', title: 'アセットパイプライン', description: 'CSSやJavaScriptなどのアセットを効率的に管理するアセットパイプラインについて学びます。', duration: '45分', order: 5, status: 'published', exercises: [] },
    { id: 'rails-6', title: '関連付け（アソシエーション）', description: 'モデル間のリレーションシップ（1対多、多対多など）を定義する方法を学びます。', duration: '55分', order: 6, status: 'published', exercises: [] },
  ]
};

import { supabaseAdmin } from './supabase';

export async function getProgrammingChapters(languageId: string) {
  console.log(`Fetching chapters for: ${languageId}`);
  
  // まずSupabaseから取得を試みる
  const { data, error } = await supabaseAdmin
    .from('programming_chapters')
    .select('*')
    .eq('language_id', languageId)
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching chapters from Supabase:', error);
    // エラーの場合はダミーデータを返す
    // @ts-ignore
    const chapters = dummyChapters[languageId] || [];
    return Promise.resolve(chapters);
  }

  if (data && data.length > 0) {
    return data.map(chapter => ({
      id: chapter.id,
      languageId: chapter.language_id,
      title: chapter.title,
      description: chapter.description,
      videoUrl: chapter.video_url,
      thumbnailUrl: chapter.thumbnail_url,
      duration: chapter.duration,
      order: chapter.order,
      status: chapter.status,
      exercises: chapter.exercises || [],
      createdAt: chapter.created_at,
      updatedAt: chapter.updated_at,
    }));
  }

  // Supabaseにデータがない場合はダミーデータを返す
  // @ts-ignore
  const chapters = dummyChapters[languageId] || [];
  return Promise.resolve(chapters);
}

export async function createProgrammingChapter(chapter: {
  languageId: string;
  title: string;
  description: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration: string;
  order: number;
  status?: 'draft' | 'published';
  exercises?: any[];
}) {
  const id = `${chapter.languageId}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const now = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from('programming_chapters')
    .insert({
      id,
      language_id: chapter.languageId,
      title: chapter.title,
      description: chapter.description,
      video_url: chapter.videoUrl || '',
      thumbnail_url: chapter.thumbnailUrl || '',
      duration: chapter.duration,
      order: chapter.order,
      status: chapter.status || 'draft',
      exercises: chapter.exercises || [],
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating programming chapter:', error);
    throw error;
  }

  return {
    id: data.id,
    languageId: data.language_id,
    title: data.title,
    description: data.description,
    videoUrl: data.video_url,
    thumbnailUrl: data.thumbnail_url,
    duration: data.duration,
    order: data.order,
    status: data.status,
    exercises: data.exercises || [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}
