import CategoryCard from '@/components/ui/CategoryCard';

interface EnglishContent {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  type: 'movie' | 'news' | 'business';
  level?: 'beginner' | 'intermediate' | 'advanced';
}

// 仮のデータ（実際にはAPIから取得）
const mockContents: EnglishContent[] = [
  {
    id: '1',
    title: 'The Social Network',
    description: 'Learn English through the story of Facebook\'s founding',
    imageUrl: '/images/social-network.jpg',
    type: 'movie',
    level: 'intermediate'
  },
  {
    id: '2',
    title: 'BBC World News',
    description: 'Latest international news with English subtitles',
    imageUrl: '/images/bbc-news.jpg',
    type: 'news',
    level: 'advanced'
  },
  {
    id: '3',
    title: 'Business Negotiations',
    description: 'Master the art of business negotiations in English',
    imageUrl: '/images/business.jpg',
    type: 'business',
    level: 'intermediate'
  }
];

export default async function EnglishPage() {
  const contents = mockContents;

  const movieContents = contents.filter((c: EnglishContent) => c.type === 'movie');
  const newsContents = contents.filter((c: EnglishContent) => c.type === 'news');
  const businessContents = contents.filter((c: EnglishContent) => c.type === 'business');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">英語学習</h1>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">映画で学ぶ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {movieContents.map((content: EnglishContent) => (
                <CategoryCard
                  key={content.id}
                  {...content}
                  category="english"
                  href={`/english/movies/${content.id}`}
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">ニュースで学ぶ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsContents.map((content: EnglishContent) => (
                <CategoryCard
                  key={content.id}
                  {...content}
                  category="english"
                  href={`/english/news/${content.id}`}
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">ビジネス英語</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businessContents.map((content: EnglishContent) => (
                <CategoryCard
                  key={content.id}
                  {...content}
                  category="english"
                  href={`/english/business/${content.id}`}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
