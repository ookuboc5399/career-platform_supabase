import React from 'react';
import { getBlogPosts } from '@/lib/api';
import { BlogPost } from '@/types';
import { ErrorMessage } from '@/components/ErrorMessage';

export default async function BlogPage() {
  try {
    const posts: BlogPost[] = await getBlogPosts();
  
  
  // Find the featured post (assuming it's the most recent)
  const featuredPost = posts[0];
  const recentPosts = posts.slice(1);

    if (!posts || posts.length === 0) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center mb-12">ブログ</h1>
          <ErrorMessage message="記事が見つかりません。" />
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">ブログ</h1>

      {/* Featured Post */}
      {featuredPost && (
        <div className="mb-16">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                  注目記事
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-4">{featuredPost.title}</h2>
              <p className="text-gray-600 mb-4">{featuredPost.content}</p>
              <div className="flex items-center text-sm text-gray-500">
                <span>{featuredPost.author}</span>
                <span className="mx-2">•</span>
                <span>{new Date(featuredPost.createdAt).toLocaleDateString('ja-JP')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recentPosts.map((post: BlogPost) => (
          <div key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="mb-4">
                {post.tags && post.tags.map((tag: string) => (
                  <span key={tag} className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full mr-2">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
              <p className="text-gray-600 mb-4">{post.content}</p>
              <div className="flex items-center text-sm text-gray-500">
                <span>{post.author}</span>
                <span className="mx-2">•</span>
                <span>{new Date(post.createdAt).toLocaleDateString('ja-JP')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-8">カテゴリー</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-50">
            就職活動
          </button>
          <button className="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-50">
            転職支援
          </button>
          <button className="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-50">
            スキルアップ
          </button>
          <button className="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-50">
            キャリア相談
          </button>
        </div>
      </div>
    </div>
    );
  } catch (error) {
    console.error('Blog page error:', error);
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">ブログ</h1>
        <ErrorMessage message="エラーが発生しました。後ほど再度お試しください。" />
      </div>
    );
  }
}
