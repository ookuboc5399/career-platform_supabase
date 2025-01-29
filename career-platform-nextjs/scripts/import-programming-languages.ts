const { createProgrammingLanguage } = require('../src/lib/cosmos-db');

const initialLanguages = [
  {
    id: 'python',
    title: 'Python入門',
    description: 'Pythonプログラミングの基礎から応用までを学ぶコース',
    type: 'language' as const,
  },
  {
    id: 'javascript',
    title: 'JavaScript入門',
    description: 'Web開発に必要なJavaScriptの基礎を学ぶコース',
    type: 'language' as const,
  },
  {
    id: 'go',
    title: 'Go入門',
    description: '高性能で効率的なバックエンド開発のためのGo言語を基礎から学びます。',
    type: 'language' as const,
  },
  {
    id: 'react',
    title: 'React入門',
    description: 'モダンなWebフロントエンド開発のためのReactフレームワーク',
    type: 'framework' as const,
  },
];

async function importLanguages() {
  try {
    for (const language of initialLanguages) {
      await createProgrammingLanguage(language);
      console.log(`Imported ${language.title}`);
    }
    console.log('All languages imported successfully');
  } catch (error) {
    console.error('Error importing languages:', error);
  }
}

importLanguages();
