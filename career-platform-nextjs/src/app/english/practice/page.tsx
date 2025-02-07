import { getEnglishContent, updateEnglishProgress } from '@/lib/api';
import { EnglishContent } from '@/types/api';
import PracticeContent from './components/PracticeContent';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default async function PracticePage() {
  try {
    // サーバーサイドでデータを取得
    const data = await getEnglishContent();
    const practiceContents = data.filter((content: EnglishContent) => content.type === 'practice');
    
    // 初期進捗情報を取得（ユーザーIDは仮で'user1'を使用）
    const initialProgress = practiceContents.length > 0
      ? await updateEnglishProgress('user1', practiceContents[0].id, {})
      : null;

    if (!data || data.length === 0) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">総合問題演習</h1>
            <p className="text-gray-600">コンテンツを読み込めませんでした。</p>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">総合問題演習</h1>
          <Suspense fallback={
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-1/3 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-48 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          }>
            <PracticeContent
              initialContents={practiceContents}
              initialProgress={initialProgress}
            />
          </Suspense>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading practice content:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">総合問題演習</h1>
          <p className="text-gray-600">エラーが発生しました。後ほど再度お試しください。</p>
        </div>
      </div>
    );
  }
}
