'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card } from "@/components/ui/card";

interface WritingTask {
  id: string;
  title: string;
  description: string;
  category: string;
  wordLimit: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  examples: string[];
}

interface Feedback {
  correctedText: string;
  suggestions: {
    type: 'grammar' | 'vocabulary' | 'style';
    message: string;
    suggestion: string;
  }[];
  score: number;
}

export default function WritingDetailPage() {
  const params = useParams();
  const taskId = params?.id as string;
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // サンプルタスクデータ
  const task: WritingTask = {
    id: '1',
    title: '自己紹介文を書く',
    description: '自分の経歴、趣味、将来の目標などについて英語で紹介文を書きましょう。以下の要素を含めてください：\n\n- 名前と年齢\n- 出身地\n- 職業または学校\n- 趣味や興味\n- 将来の目標',
    category: '自己紹介',
    wordLimit: 150,
    difficulty: 'beginner',
    estimatedTime: 20,
    examples: [
      'Hi, I'm John Smith. I'm 25 years old and I'm from New York...',
      'Hello everyone! My name is Sarah Johnson, and I'd like to introduce myself...',
    ],
  };

  // サンプルフィードバック生成（実際にはAI APIを使用）
  const generateFeedback = async (text: string): Promise<Feedback> => {
    // 実際のプロジェクトではAzure OpenAI APIを使用
    return {
      correctedText: text.replace('I am student', 'I am a student'),
      suggestions: [
        {
          type: 'grammar',
          message: '冠詞が抜けています',
          suggestion: '"student" の前に "a" を追加してください。',
        },
        {
          type: 'vocabulary',
          message: 'より適切な表現があります',
          suggestion: '"very good" の代わりに "excellent" や "outstanding" を使うとより洗練された表現になります。',
        },
      ],
      score: 85,
    };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await generateFeedback(text);
      setFeedback(result);
    } catch (error) {
      console.error('Error generating feedback:', error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">英作文</h1>
        <Link
          href="/english/question/writing"
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
          ← 課題一覧に戻る
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* タスク説明 */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">{task.title}</h2>
          <div className="flex items-center gap-4 mb-4">
            <span className={`text-sm px-3 py-1 rounded-full ${
              task.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
              task.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {task.difficulty === 'beginner' ? '初級' :
               task.difficulty === 'intermediate' ? '中級' : '上級'}
            </span>
            <span className="text-gray-500">
              制限: {task.wordLimit}語
            </span>
            <span className="text-gray-500">
              目安時間: {task.estimatedTime}分
            </span>
          </div>
          <p className="text-gray-700 whitespace-pre-line mb-6">{task.description}</p>
          
          {/* 例文 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">例文:</h3>
            <div className="space-y-2">
              {task.examples.map((example, index) => (
                <p key={index} className="text-gray-600">{example}</p>
              ))}
            </div>
          </div>
        </Card>

        {/* 入力エリア */}
        <Card className="p-6 mb-8">
          <div className="mb-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="ここに英文を入力してください..."
              className="w-full h-48 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>{text.split(/\s+/).filter(Boolean).length} / {task.wordLimit} 語</span>
              <span>{text.length} 文字</span>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || text.length === 0}
            className={`w-full py-3 rounded-lg ${
              isSubmitting || text.length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isSubmitting ? '添削中...' : '添削する'}
          </button>
        </Card>

        {/* フィードバック */}
        {feedback && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">フィードバック</h2>
            
            {/* スコア */}
            <div className="flex items-center gap-4 mb-6">
              <div className="text-3xl font-bold text-blue-600">
                {feedback.score}点
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${feedback.score}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* 修正テキスト */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">修正後のテキスト:</h3>
              <p className="p-4 bg-gray-50 rounded-lg text-gray-700">
                {feedback.correctedText}
              </p>
            </div>

            {/* 提案 */}
            <div>
              <h3 className="font-semibold mb-2">改善のポイント:</h3>
              <div className="space-y-4">
                {feedback.suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      suggestion.type === 'grammar'
                        ? 'bg-red-50'
                        : suggestion.type === 'vocabulary'
                        ? 'bg-blue-50'
                        : 'bg-yellow-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-sm px-2 py-1 rounded ${
                        suggestion.type === 'grammar'
                          ? 'bg-red-100 text-red-800'
                          : suggestion.type === 'vocabulary'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {suggestion.type === 'grammar' ? '文法' :
                         suggestion.type === 'vocabulary' ? '語彙' : '文体'}
                      </span>
                      <p className="font-medium">{suggestion.message}</p>
                    </div>
                    <p className="text-gray-600">{suggestion.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
