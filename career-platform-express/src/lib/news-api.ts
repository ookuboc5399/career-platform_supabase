import axios from 'axios';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_ENDPOINT = 'https://newsapi.org/v2';

export interface NewsContent {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  category: string;
  level: string;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  sourceUrl?: string;
  sourceName?: string;
  vocabulary?: Array<{
    word: string;
    definition: string;
    example: string;
  }>;
  grammar?: Array<{
    point: string;
    explanation: string;
  }>;
  expressions?: Array<{
    phrase: string;
    meaning: string;
  }>;
}

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

async function generateLearningElements(_content: string) {
  return {
    vocabulary: [],
    grammar: [],
    expressions: [],
  };
}

export async function fetchEnglishNews() {
  try {
    const response = await axios.get<NewsAPIResponse>(`${NEWS_API_ENDPOINT}/top-headlines`, {
      params: {
        language: 'en',
        country: 'us',
        pageSize: 5,
        apiKey: NEWS_API_KEY,
      },
    });

    if (response.status !== 200) {
      throw new Error('Failed to fetch news from NewsAPI');
    }

    const articles = await Promise.all(response.data.articles.map(async article => {
      const learningElements = await generateLearningElements(article.content || article.description || '');
      return {
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
      publishedAt: article.publishedAt,
      sourceUrl: article.url,
      sourceName: article.source.name,
      vocabulary: learningElements.vocabulary,
      grammar: learningElements.grammar,
      expressions: learningElements.expressions,
    };
    }));

    return articles;
  } catch (error) {
    console.error('Error fetching news from NewsAPI:', error);
    throw error;
  }
}
