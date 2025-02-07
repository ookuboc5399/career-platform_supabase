import { CosmosClient, Container } from '@azure/cosmos';

if (!process.env.COSMOS_DB_ENDPOINT || !process.env.COSMOS_DB_KEY) {
  throw new Error('Cosmos DB credentials are not configured');
}

const client = new CosmosClient({
  endpoint: process.env.COSMOS_DB_ENDPOINT,
  key: process.env.COSMOS_DB_KEY,
});

let database: any;
export let universitiesContainer: Container;
export let programmingContainer: Container;
export let programmingChaptersContainer: Container;
export let programmingProgressContainer: Container;
export let certificationsContainer: Container;
export let certificationChaptersContainer: Container;
export let certificationProgressContainer: Container;
export let certificationQuestionsContainer: Container;
export let certificationQuestionsProgressContainer: Container;
export let englishNewsContainer: Container;
export let englishMoviesContainer: Container;
export let englishBusinessContainer: Container;
export let settingsContainer: Container;

// データベースとコンテナの初期化
export async function initializeDatabase() {
  try {
    const { database: db } = await client.databases.createIfNotExists({
      id: 'career-platform'
    });
    database = db;

    // コンテナの初期化
    const containers = await Promise.all([
      db.containers.createIfNotExists({
        id: 'universities',
        partitionKey: '/id'
      }),
      db.containers.createIfNotExists({
        id: 'programming',
        partitionKey: '/type'
      }),
      db.containers.createIfNotExists({
        id: 'programming-chapters',
        partitionKey: '/languageId'
      }),
      db.containers.createIfNotExists({
        id: 'programming-progress',
        partitionKey: '/partitionKey'
      }),
      db.containers.createIfNotExists({
        id: 'certifications',
        partitionKey: '/id'
      }),
      db.containers.createIfNotExists({
        id: 'certification-chapters',
        partitionKey: '/certificationId'
      }),
      db.containers.createIfNotExists({
        id: 'certification-progress',
        partitionKey: '/partitionKey'
      }),
      db.containers.createIfNotExists({
        id: 'certification-questions',
        partitionKey: '/certificationId'
      }),
      db.containers.createIfNotExists({
        id: 'certification-questions-progress',
        partitionKey: '/certificationId'
      }),
      db.containers.createIfNotExists({
        id: 'english-news',
        partitionKey: '/id'
      }),
      db.containers.createIfNotExists({
        id: 'english-movies',
        partitionKey: '/id'
      }),
      db.containers.createIfNotExists({
        id: 'english-business',
        partitionKey: '/id'
      }),
      db.containers.createIfNotExists({
        id: 'settings',
        partitionKey: '/id'
      })
    ]);

    // コンテナの参照を設定
    universitiesContainer = containers[0].container;
    programmingContainer = containers[1].container;
    programmingChaptersContainer = containers[2].container;
    programmingProgressContainer = containers[3].container;
    certificationsContainer = containers[4].container;
    certificationChaptersContainer = containers[5].container;
    certificationProgressContainer = containers[6].container;
    certificationQuestionsContainer = containers[7].container;
    certificationQuestionsProgressContainer = containers[8].container;
    englishNewsContainer = containers[9].container;
    englishMoviesContainer = containers[10].container;
    englishBusinessContainer = containers[11].container;
    settingsContainer = containers[12].container;
  } catch (error) {
    throw error;
  }
}

// 資格関連の関数
export async function getCertificationChapters(certificationId: string) {
  if (!certificationChaptersContainer) await initializeDatabase();
  const { resources } = await certificationChaptersContainer.items
    .query({
      query: 'SELECT * FROM c WHERE c.certificationId = @certificationId',
      parameters: [{ name: '@certificationId', value: certificationId }],
    })
    .fetchAll();
  return resources;
}

export async function createCertificationChapter(data: any) {
  if (!certificationChaptersContainer) await initializeDatabase();
  const { resource } = await certificationChaptersContainer.items.create(data);
  return resource;
}

export async function getCertificationChapter(chapterId: string, certificationId: string) {
  if (!certificationChaptersContainer) await initializeDatabase();
  const { resources } = await certificationChaptersContainer.items
    .query({
      query: 'SELECT * FROM c WHERE c.id = @chapterId AND c.certificationId = @certificationId',
      parameters: [
        { name: '@chapterId', value: chapterId },
        { name: '@certificationId', value: certificationId }
      ],
    })
    .fetchAll();
  return resources[0];
}

export async function createCertificationQuestionProgress(data: any) {
  if (!certificationQuestionsProgressContainer) await initializeDatabase();
  const { resource } = await certificationQuestionsProgressContainer.items.create(data);
  return resource;
}

export async function getCertificationQuestionProgress(userId: string, certificationId: string) {
  if (!certificationQuestionsProgressContainer) await initializeDatabase();
  const { resources } = await certificationQuestionsProgressContainer.items
    .query({
      query: 'SELECT * FROM c WHERE c.userId = @userId AND c.certificationId = @certificationId',
      parameters: [
        { name: '@userId', value: userId },
        { name: '@certificationId', value: certificationId },
      ],
    })
    .fetchAll();
  return resources[0];
}

// プログラミング言語関連の型定義
export interface ProgrammingLanguage {
  id: string;
  title: string;
  description: string;
  type: 'language' | 'framework' | 'ai-platform';
  createdAt: string;
  updatedAt: string;
}

export interface ProgrammingChapter {
  id: string;
  languageId: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  order: number;
  status: 'draft' | 'published';
  exercises: {
    id: string;
    title: string;
    description: string;
    testCases: {
      input: string;
      expectedOutput: string;
    }[];
  }[];
  createdAt: string;
  updatedAt: string;
}

// プログラミング言語関連の操作関数
export async function getProgrammingLanguages() {
  if (!programmingContainer) await initializeDatabase();
  const { resources } = await programmingContainer.items
    .query({
      query: 'SELECT * FROM c WHERE c.type IN ("language", "framework", "ai-platform")',
    })
    .fetchAll();
  return resources as ProgrammingLanguage[];
}

export async function createProgrammingLanguage(data: Omit<ProgrammingLanguage, 'createdAt' | 'updatedAt'>) {
  if (!programmingContainer) await initializeDatabase();
  const now = new Date().toISOString();
  const language = {
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  const { resource } = await programmingContainer.items.create(language);
  return resource as ProgrammingLanguage;
}

// 初期データをインポートするためのユーティリティ関数
export async function importInitialProgrammingLanguages() {
  if (!programmingContainer) await initializeDatabase();
  
  const initialLanguages: Omit<ProgrammingLanguage, 'createdAt' | 'updatedAt'>[] = [
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
      id: 'react',
      title: 'React入門',
      description: 'モダンなWebフロントエンド開発のためのReactフレームワーク',
      type: 'framework' as const,
    },
  ];

  for (const language of initialLanguages) {
    try {
      await createProgrammingLanguage(language);
    } catch (error) {
      console.error(`Error importing ${language.id}:`, error);
    }
  }
}

// プログラミングチャプター関連の操作関数
export async function getProgrammingChapters(languageId: string) {
  if (!programmingChaptersContainer) await initializeDatabase();
  const { resources } = await programmingChaptersContainer.items
    .query({
      query: 'SELECT * FROM c WHERE c.languageId = @languageId',
      parameters: [{ name: '@languageId', value: languageId }],
    })
    .fetchAll();
  return resources as ProgrammingChapter[];
}

export async function getProgrammingChapter(id: string, languageId: string) {
  if (!programmingChaptersContainer) await initializeDatabase();
  const { resource } = await programmingChaptersContainer.item(id, languageId).read();
  return resource as ProgrammingChapter;
}

export async function createProgrammingChapter(data: Omit<ProgrammingChapter, 'id' | 'createdAt' | 'updatedAt'>) {
  if (!programmingChaptersContainer) await initializeDatabase();
  const now = new Date().toISOString();
  const id = `${data.languageId}-${Date.now()}`;
  const chapter = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };
  const { resource } = await programmingChaptersContainer.items.create(chapter);
  return resource as ProgrammingChapter;
}

export async function updateProgrammingChapter(id: string, languageId: string, data: Partial<ProgrammingChapter>) {
  if (!programmingChaptersContainer) await initializeDatabase();
  const { resource: existingChapter } = await programmingChaptersContainer.item(id, languageId).read();
  if (!existingChapter) return null;

  const updatedChapter = {
    ...existingChapter,
    ...data,
    updatedAt: new Date().toISOString(),
  };
  const { resource } = await programmingChaptersContainer.item(id, languageId).replace(updatedChapter);
  return resource as ProgrammingChapter;
}

export async function deleteProgrammingChapter(id: string, languageId: string) {
  if (!programmingChaptersContainer) await initializeDatabase();
  await programmingChaptersContainer.item(id, languageId).delete();
}

export async function updateProgrammingChaptersOrder(languageId: string, chapters: { id: string; order: number }[]) {
  if (!programmingChaptersContainer) await initializeDatabase();
  
  const updates = chapters.map(async ({ id, order }) => {
    const { resource } = await programmingChaptersContainer.item(id, languageId).read();
    if (!resource) return;

    return programmingChaptersContainer.item(id, languageId).replace({
      ...resource,
      order,
      updatedAt: new Date().toISOString(),
    });
  });

  await Promise.all(updates);
}

// 英語学習関連の関数
export async function getEnglishNewsContainer() {
  if (!englishNewsContainer) await initializeDatabase();
  return englishNewsContainer;
}

export async function getEnglishMoviesContainer() {
  if (!englishMoviesContainer) await initializeDatabase();
  return englishMoviesContainer;
}

export async function getEnglishBusinessContainer() {
  if (!englishBusinessContainer) await initializeDatabase();
  return englishBusinessContainer;
}

// 設定関連の関数
export async function getSettingsContainer() {
  if (!settingsContainer) await initializeDatabase();
  return settingsContainer;
}
