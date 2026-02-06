'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

interface Category {
  id: 'general' | 'business' | 'academic';
  name: string;
  description: string;
  icon: string;
  color: string;
}

const categories: Category[] = [
  {
    id: 'general',
    name: '一般',
    description: '日常生活や一般的なトピックに関する長文を読んで、基本的な読解力を養います。',
    icon: '📖',
    color: 'bg-blue-100 hover:bg-blue-200',
  },
  {
    id: 'business',
    name: 'ビジネス',
    description: 'ビジネスに関する長文を読んで、実務で使える読解力を身につけます。',
    icon: '💼',
    color: 'bg-green-100 hover:bg-green-200',
  },
  {
    id: 'academic',
    name: '学術',
    description: '学術的な文章を読んで、高度な読解力と専門的な表現を学びます。',
    icon: '🎓',
    color: 'bg-purple-100 hover:bg-purple-200',
  },
];

export default function ReadingPage() {
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">長文読解問題</h1>
      <div className="">

        {/* メインコンテンツ */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/english/question/reading/${category.id}`}>
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
    </div>
  );
}
