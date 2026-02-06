import axios from 'axios';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_ENDPOINT = 'https://newsapi.org/v2';

export interface NewsAPIArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
}

export interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsAPIArticle[];
}

export async function fetchEnglishNews() {
  try {
    const response = await axios.get<NewsAPIResponse>(`${NEWS_API_ENDPOINT}/top-headlines`, {
      params: {
        language: 'en',
        pageSize: 10,
        apiKey: NEWS_API_KEY,
      },
    });

    if (response.status !== 200) {
      throw new Error('Failed to fetch news from NewsAPI');
    }

    return response.data.articles.map(article => ({
      id: `newsapi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: article.title,
      description: article.description || '',
      content: article.content || '',
      imageUrl: article.urlToImage || '/images/news-placeholder.jpg',
      category: 'world',
      level: 'intermediate',
      tags: ['external', 'newsapi'],
      isPublished: true,
      createdAt: article.publishedAt,
      updatedAt: article.publishedAt,
      sourceUrl: article.url,
      sourceName: article.source.name,
    }));
  } catch (error) {
    console.error('Error fetching news from NewsAPI:', error);
    return [];
  }
}
