import type { Certification, MainCategory } from '@/types/api';

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
