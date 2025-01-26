import { NextRequest, NextResponse } from 'next/server';
import type { Certification, MainCategory } from '@/types/api';
import { uploadFile, CONTAINERS } from '@/lib/storage';
import { CosmosClient } from '@azure/cosmos';

const client = new CosmosClient({
  endpoint: process.env.COSMOS_DB_ENDPOINT || '',
  key: process.env.COSMOS_DB_KEY || ''
});
const database = client.database('career-platform');
const container = database.container('certifications');

// 資格カテゴリー定義
const categories = {
  '企業と法務': ['企業活動', '法務'],
  '経営戦略': ['経営戦略マネジメント', '技術戦略マネジメント', 'ビジネスインダストリ'],
  'システム戦略': ['システム戦略', 'システム企画'],
  '開発技術': ['システム開発技術', 'ソフトウェア開発管理技術'],
  'プロジェクトマネジメント': ['プロジェクトマネジメント'],
  'サービスマネジメント': ['サービスマネジメント', 'システム監査'],
  '基礎理論': ['基礎理論', 'アルゴリズムとプログラミング'],
  'コンピュータシステム': ['コンピュータ構成要素', 'システム構成要素', 'ソフトウェア', 'ハードウェア']
};

// 開発用のサンプルデータ
export const mockCertifications: (Certification & { type: string })[] = [
  {
    id: '1',
    type: 'certification',
    name: '基本情報技術者試験',
    description: 'IT業界の登竜門となる国家資格です。',
    imageUrl: 'https://example.com/images/fe.jpg',
    difficulty: 'intermediate',
    mainCategory: '基礎理論' as MainCategory,
    category: 'アルゴリズムとプログラミング',
    subCategory: 'アルゴリズムとプログラミング',
    estimatedStudyTime: '150時間',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    chapters: [
      {
        id: '1',
        certificationId: '1',
        title: 'アルゴリズムの基礎',
        description: 'アルゴリズムの基本概念と代表的なアルゴリズムについて学びます',
        videoUrl: 'https://example.com/videos/algorithm-basics.mp4',
        thumbnailUrl: 'https://example.com/thumbnails/algorithm.jpg',
        duration: '45:00',
        order: 1,
        status: 'published',
        content: 'アルゴリズムとは、問題を解決するための手順や方法を定式化したものです。',
        questions: [
          {
            id: '1',
            question: 'バブルソートの時間計算量は？',
            choices: [
              { id: '1', text: 'O(n^2)' },
              { id: '2', text: 'O(n log n)' },
              { id: '3', text: 'O(n)' },
              { id: '4', text: 'O(1)' }
            ],
            correctAnswer: 0,
            explanation: 'バブルソートは2重ループを使用するため、時間計算量はO(n^2)となります。'
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        certificationId: '1',
        title: 'データ構造',
        description: '配列、リスト、木構造など、基本的なデータ構造について学びます',
        videoUrl: 'https://example.com/videos/data-structures.mp4',
        thumbnailUrl: 'https://example.com/thumbnails/data-structures.jpg',
        duration: '40:00',
        order: 2,
        status: 'published',
        content: 'データ構造は、データを効率的に格納し、アクセスするための仕組みです。',
        questions: [
          {
            id: '2',
            question: 'スタックの特徴として正しいものは？',
            choices: [
              { id: '1', text: 'LIFO (Last In First Out)' },
              { id: '2', text: 'FIFO (First In First Out)' },
              { id: '3', text: 'ランダムアクセス' },
              { id: '4', text: '双方向アクセス' }
            ],
            correctAnswer: 0,
            explanation: 'スタックは後入れ先出し(LIFO)の特徴を持つデータ構造です。'
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  }
];

export async function GET() {
  try {
    const { resources: certifications } = await container.items
      .query({
        query: "SELECT * FROM c WHERE c.type = 'certification'"
      })
      .fetchAll();


    return NextResponse.json(certifications);
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certifications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const difficulty = formData.get('difficulty') as 'beginner' | 'intermediate' | 'advanced';
    const estimatedStudyTime = formData.get('estimatedStudyTime') as string;
    const imageFile = formData.get('image') as File | null;

    // バリデーション
    if (!name || !description || !category || !difficulty || !estimatedStudyTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // デフォルトのアイコン画像を使用
    const imageUrl = `/images/${category}.svg`;

    // CosmosDBに保存
    // 既存の資格を取得して、次のIDを生成
    const { resources: existingCertifications } = await container.items
      .query({
        query: "SELECT * FROM c WHERE c.type = 'certification'"
      })
      .fetchAll();

    const nextId = (existingCertifications.length + 1).toString();

    const newCertification: Certification & { type: string } = {
      id: nextId,
      type: 'certification', // ドキュメントタイプを指定
      name,
      description,
      imageUrl,
      category,
      difficulty,
      estimatedStudyTime,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      chapters: []
    };

    const { resource: createdCertification } = await container.items.create(newCertification);
    return NextResponse.json(createdCertification);
  } catch (error) {
    console.error('Error creating certification:', error);
    return NextResponse.json(
      { error: 'Failed to create certification' },
      { status: 500 }
    );
  }
}
