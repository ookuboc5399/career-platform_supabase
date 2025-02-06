import { NextRequest, NextResponse } from 'next/server';
import type { Certification } from '@/types/api';
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
