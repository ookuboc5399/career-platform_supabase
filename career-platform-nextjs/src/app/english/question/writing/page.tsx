'use client';

import { Card } from "@/components/ui/card";
import Link from 'next/link';
import { WritingCategory } from '@/types/english';

interface Category {
  id: WritingCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const categories: Category[] = [
  {
    id: 'ai',
    name: 'AI問題',
    description: 'AIに関する英作文問題を解いて、最新技術の表現を学びます。',
    icon: '🤖',
    color: 'bg-blue-100 hover:bg-blue-200',
  },
  {
    id: 'book',
    name: '書籍問題',
    description: '書籍に関する英作文問題を通じて、文学的な表現を学びます。',
    icon: '📚',
    color: 'bg-yellow-100 hover:bg-yellow-200',
  },
  {
    id: 'school',
    name: '学校問題',
    description: '学校生活に関する英作文問題で、教育に関する表現を学びます。',
    icon: '🏫',
    color: 'bg-green-100 hover:bg-green-200',
  },
];

export default function WritingPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">英作文問題</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={`/english/question/writing/${category.id}`}>
            <Card className={`p-6 cursor-pointer transition-all ${category.color}`}>
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">{category.icon}</span>
                <h2 className="text-xl font-bold">{category.name}</h2>
              </div>
              <p className="text-gray-600">{category.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
