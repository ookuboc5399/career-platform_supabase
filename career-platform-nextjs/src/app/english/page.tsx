import Link from 'next/link';
import Image from 'next/image';
import { Card } from "@/components/ui/card";

const features = [
  {
    id: 'conversation',
    title: 'AIと英会話練習',
    description: 'AIを活用したリアルタイムの英会話練習ができます。自然な会話を通じて、スピーキングとリスニングのスキルを向上させましょう。',
    imageUrl: '/images/english/self-intro.svg',
    href: '/english/conversation'
  },
  {
    id: 'news',
    title: '今日のニュースで学ぶ',
    description: '最新のニュースを題材に、リーディングとリスニングの練習ができます。時事的な表現や語彙を学びながら、英語力を磨きましょう。',
    imageUrl: '/images/english/daily-life.svg',
    href: '/english/news'
  },
  {
    id: 'movies',
    title: '映画で学ぶ',
    description: '人気の映画シーンを使って、実践的な英語を学びましょう。字幕とスクリプトを活用して、ネイティブの表現を身につけることができます。',
    imageUrl: '/images/english/hobbies.svg',
    href: '/english/movies'
  },
  {
    id: 'question',
    title: '問題演習',
    description: '文法、単語、英作文の問題を通じて、基礎から応用まで総合的に英語力を強化します。AIによる添削で効果的に学習できます。',
    imageUrl: '/images/english/study.svg',
    href: '/english/question'
  }
];

export default function EnglishPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">英語学習</h1>
          <p className="text-xl text-gray-300">
            AIと映画、ニュースを活用して、実践的な英語力を身につけましょう
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <Link key={feature.id} href={feature.href} className="block">
              <Card className="h-full p-6 bg-gray-800 hover:bg-gray-700 transition-colors border-gray-700 hover:border-gray-600" style={{ backgroundColor: 'rgba(55, 65, 81, 1)' }}>
                <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden">
                  <Image
                    src={feature.imageUrl}
                    alt={feature.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold mb-4">{feature.title}</h2>
                <p className="text-gray-300">{feature.description}</p>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6">学習の特徴</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">実践的な学習</h3>
              <p className="text-gray-300">
                実際のニュースや映画を使用して、生きた英語を学ぶことができます。
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">AIとの会話練習</h3>
              <p className="text-gray-300">
                最新のAI技術を活用して、いつでも英会話の練習ができます。
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-2">継続的な成長</h3>
              <p className="text-gray-300">
                学習の進捗を記録し、着実にスキルアップを図ることができます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
