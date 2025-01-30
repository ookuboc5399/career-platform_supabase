'use client';

import Link from 'next/link';
import { Card } from "@/components/ui/card";

const sections = [
  {
    id: 'grammar',
    title: '文法学習',
    description: '基礎から応用まで、体系的に英文法を学びます。時制、仮定法、関係詞など、重要な文法項目を網羅的に学習できます。',
    href: '/english/question/grammar',
    color: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
    icon: '📚'
  },
  {
    id: 'vocabulary',
    title: '単語学習',
    description: 'TOEIC頻出単語から実践的な表現まで、効率的に語彙力を強化します。フラッシュカード形式で楽しく学習できます。',
    href: '/english/question/vocabulary',
    color: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
    icon: '📝'
  },
  {
    id: 'writing',
    title: '英作文',
    description: '実践的な英作文を通じて、ライティングスキルを向上させます。AIによる添削で、より自然な英語表現を身につけられます。',
    href: '/english/question/writing',
    color: 'bg-purple-100',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-200',
    icon: '✍️'
  }
];

export default function QuestionPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">問題演習</h1>
        <Link
          href="/english"
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
          ← 英語学習トップに戻る
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sections.map((section) => (
          <Link key={section.id} href={section.href}>
            <Card className={`h-full p-6 cursor-pointer hover:shadow-lg transition-all border-2 ${section.borderColor} ${section.color}`}>
              <div className="text-4xl mb-4">{section.icon}</div>
              <h2 className={`text-2xl font-bold mb-4 ${section.textColor}`}>
                {section.title}
              </h2>
              <p className="text-gray-600">{section.description}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">最近の学習履歴</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">基本的な時制の問題</p>
                  <p className="text-sm text-gray-500">文法学習</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">2024/1/30</p>
                  <p className="text-green-600">正解率: 85%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">TOEIC頻出単語 Part 1</p>
                  <p className="text-sm text-gray-500">単語学習</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">2024/1/29</p>
                  <p className="text-green-600">正解率: 92%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">自己紹介文を書く</p>
                  <p className="text-sm text-gray-500">英作文</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">2024/1/28</p>
                  <p className="text-blue-600">添削済み</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">学習進捗</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">文法学習</h3>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    進捗
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    30%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div className="w-[30%] shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">単語学習</h3>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                    進捗
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-green-600">
                    45%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                <div className="w-[45%] shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">英作文</h3>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
                    進捗
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-purple-600">
                    20%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
                <div className="w-[20%] shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
