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

async function generateLearningElements(content: string) {
  try {
    const prompt = `Analyze this news article and provide:
    1. 5 important vocabulary words with their definitions and example sentences
    2. 3 key grammar points used in the text with explanations
    3. 2 useful expressions or idioms from the text with their meanings

    News content:
    ${content}`;

    const response = await axios.post(
      `${process.env.AZURE_OPENAI_GPT4_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_GPT4_DEPLOYMENT_NAME}/chat/completions?api-version=${process.env.AZURE_OPENAI_GPT4_API_VERSION}`,
      {
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          'api-key': process.env.AZURE_OPENAI_GPT4_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    const analysis = response.data.choices[0].message?.content || '';
    const sections = analysis.split(/\d+\./);

    return {
      vocabulary: sections[1]?.split('\n').filter(Boolean).map((line: string) => {
        const [word, ...rest] = line.split(':');
        const [definition, example] = rest.join(':').split('Example:');
        return {
          word: word.trim(),
          definition: definition?.trim() || '',
          example: example?.trim() || '',
        };
      }) || [],
      grammar: sections[2]?.split('\n').filter(Boolean).map((line: string) => {
        const [point, explanation] = line.split(':');
        return {
          point: point.trim(),
          explanation: explanation?.trim() || '',
        };
      }) || [],
      expressions: sections[3]?.split('\n').filter(Boolean).map((line: string) => {
        const [phrase, meaning] = line.split(':');
        return {
          phrase: phrase.trim(),
          meaning: meaning?.trim() || '',
        };
      }) || [],
    };
  } catch (error) {
    console.error('Error generating learning elements:', error);
    return {
      vocabulary: [],
      grammar: [],
      expressions: [],
    };
  }
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
