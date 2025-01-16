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
export let programmingChaptersContainer: Container;
export let programmingProgressContainer: Container;
export let certificationsContainer: Container;
export let certificationChaptersContainer: Container;
export let certificationProgressContainer: Container;

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
        id: 'programming-chapters',
        partitionKey: '/id'
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
      })
    ]);

    // コンテナの参照を設定
    universitiesContainer = containers[0].container;
    programmingChaptersContainer = containers[1].container;
    programmingProgressContainer = containers[2].container;
    certificationsContainer = containers[3].container;
    certificationChaptersContainer = containers[4].container;
    certificationProgressContainer = containers[5].container;

    console.log('Database and containers initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// 型定義
export interface University {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  websiteUrl: string;
  type: 'university' | 'program';
  location: 'japan' | 'overseas';
  programType?: 'mba' | 'data-science';
  _rid?: string;
  _self?: string;
  _etag?: string;
  _attachments?: string;
  _ts?: number;
}

export interface CreateUniversityInput {
  title: string;
  description: string;
  imageUrl: string;
  websiteUrl: string;
  type: 'university' | 'program';
  location: 'japan' | 'overseas';
  programType?: 'mba' | 'data-science';
}

export interface UpdateUniversityInput extends Partial<CreateUniversityInput> {}

export interface ProgrammingChapter {
  id: string;
  languageId: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  order: number;
  exercises: {
    id: string;
    title: string;
    description: string;
    testCases: {
      input: string;
      expectedOutput: string;
    }[];
  }[];
  _rid?: string;
  _self?: string;
  _etag?: string;
  _attachments?: string;
  _ts?: number;
}

export interface ProgrammingProgress {
  id: string;
  partitionKey: string;
  userId: string;
  languageId: string;
  chapterId: string;
  videoCompleted: boolean;
  exercisesCompleted: string[];
  lastAccessedAt: string;
  _rid?: string;
  _self?: string;
  _etag?: string;
  _attachments?: string;
  _ts?: number;
}

export interface Certification {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: 'finance' | 'it' | 'business';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  price: number;
  _rid?: string;
  _self?: string;
  _etag?: string;
  _attachments?: string;
  _ts?: number;
}

export interface CreateCertificationInput {
  title: string;
  description: string;
  imageUrl: string;
  category: 'finance' | 'it' | 'business';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  price: number;
}

export interface UpdateCertificationInput extends Partial<CreateCertificationInput> {}

export interface CertificationChapter {
  id: string;
  certificationId: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  order: number;
  questions: {
    id: string;
    text: string;
    imageUrl?: string;
    choices: {
      id: string;
      text: string;
    }[];
    correctChoiceId: string;
    explanation: string;
  }[];
  _rid?: string;
  _self?: string;
  _etag?: string;
  _attachments?: string;
  _ts?: number;
}

export interface CertificationProgress {
  id: string;
  partitionKey: string;
  userId: string;
  certificationId: string;
  chapterId: string;
  videoCompleted: boolean;
  completedQuestions: string[];
  lastAccessedAt: string;
  _rid?: string;
  _self?: string;
  _etag?: string;
  _attachments?: string;
  _ts?: number;
}

// データベース操作関数
export async function getUniversities() {
  if (!universitiesContainer) await initializeDatabase();
  const { resources } = await universitiesContainer.items
    .query('SELECT * FROM c')
    .fetchAll();
  return resources as University[];
}

export async function getUniversity(id: string) {
  if (!universitiesContainer) await initializeDatabase();
  const { resource } = await universitiesContainer.item(id, id).read();
  return resource as University | undefined;
}

export async function createUniversity(data: CreateUniversityInput) {
  if (!universitiesContainer) await initializeDatabase();
  const id = Math.random().toString(36).substring(2, 15);
  const { resource } = await universitiesContainer.items.create({ ...data, id });
  return resource as University;
}

export async function updateUniversity(id: string, data: UpdateUniversityInput) {
  if (!universitiesContainer) await initializeDatabase();
  const { resource: existingUniversity } = await universitiesContainer.item(id, id).read();
  if (!existingUniversity) return undefined;

  const { resource } = await universitiesContainer.item(id, id).replace({
    ...existingUniversity,
    ...data,
  });
  return resource as University;
}

export async function deleteUniversity(id: string) {
  if (!universitiesContainer) await initializeDatabase();
  await universitiesContainer.item(id, id).delete();
}

// プログラミング学習関連の操作関数
export async function getProgrammingChapter(id: string) {
  if (!programmingChaptersContainer) await initializeDatabase();
  const { resource } = await programmingChaptersContainer.item(id, id).read();
  return resource as ProgrammingChapter | undefined;
}

export async function getProgrammingProgress(userId: string, languageId: string, chapterId: string) {
  if (!programmingProgressContainer) await initializeDatabase();
  const id = `${userId}-${languageId}-${chapterId}`;
  const partitionKey = `${userId}-${languageId}`;
  const { resource } = await programmingProgressContainer.item(id, partitionKey).read();
  return resource as ProgrammingProgress | undefined;
}

export async function updateProgrammingProgress(userId: string, languageId: string, chapterId: string, data: Partial<ProgrammingProgress>) {
  if (!programmingProgressContainer) await initializeDatabase();
  const id = `${userId}-${languageId}-${chapterId}`;
  const partitionKey = `${userId}-${languageId}`;
  const { resource: existingProgress } = await programmingProgressContainer.item(id, partitionKey).read();

  if (existingProgress) {
    const { resource } = await programmingProgressContainer.item(id, partitionKey).replace({
      ...existingProgress,
      ...data,
      lastAccessedAt: new Date().toISOString(),
    });
    return resource as ProgrammingProgress;
  } else {
    const { resource } = await programmingProgressContainer.items.create({
      id,
      partitionKey,
      userId,
      languageId,
      chapterId,
      videoCompleted: false,
      exercisesCompleted: [],
      lastAccessedAt: new Date().toISOString(),
      ...data,
    });
    return resource as ProgrammingProgress;
  }
}

// 資格マスタの操作関数
export async function getCertifications() {
  if (!certificationsContainer) await initializeDatabase();
  const { resources } = await certificationsContainer.items
    .query('SELECT * FROM c')
    .fetchAll();
  return resources as Certification[];
}

export async function getCertification(id: string) {
  if (!certificationsContainer) await initializeDatabase();
  const { resource } = await certificationsContainer.item(id, id).read();
  return resource as Certification | undefined;
}

export async function createCertification(data: CreateCertificationInput) {
  if (!certificationsContainer) await initializeDatabase();
  const id = Math.random().toString(36).substring(2, 15);
  const { resource } = await certificationsContainer.items.create({ ...data, id });
  return resource as Certification;
}

export async function updateCertification(id: string, data: UpdateCertificationInput) {
  if (!certificationsContainer) await initializeDatabase();
  const { resource: existingCertification } = await certificationsContainer.item(id, id).read();
  if (!existingCertification) return undefined;

  const { resource } = await certificationsContainer.item(id, id).replace({
    ...existingCertification,
    ...data,
  });
  return resource as Certification;
}

export async function deleteCertification(id: string) {
  if (!certificationsContainer) await initializeDatabase();
  await certificationsContainer.item(id, id).delete();
}

// チャプター関連の操作関数
export async function getCertificationChapters(certificationId: string) {
  if (!certificationChaptersContainer) await initializeDatabase();
  const { resources } = await certificationChaptersContainer.items
    .query({
      query: 'SELECT * FROM c WHERE c.certificationId = @certificationId ORDER BY c.order',
      parameters: [{ name: '@certificationId', value: certificationId }]
    })
    .fetchAll();
  return resources as CertificationChapter[];
}

export async function getCertificationChapter(id: string) {
  if (!certificationChaptersContainer) await initializeDatabase();
  const { resource } = await certificationChaptersContainer.item(id, id).read();
  return resource as CertificationChapter | undefined;
}

export async function createCertificationChapter(data: Omit<CertificationChapter, 'id' | '_rid' | '_self' | '_etag' | '_attachments' | '_ts'>) {
  if (!certificationChaptersContainer) await initializeDatabase();
  const id = Math.random().toString(36).substring(2, 15);
  const { resource } = await certificationChaptersContainer.items.create({ ...data, id });
  return resource as CertificationChapter;
}

// 進捗関連の操作関数
export async function getCertificationProgress(userId: string, certificationId: string, chapterId: string) {
  if (!certificationProgressContainer) await initializeDatabase();
  const id = `${userId}-${certificationId}-${chapterId}`;
  const partitionKey = `${userId}-${certificationId}`;
  const { resource } = await certificationProgressContainer.item(id, partitionKey).read();
  return resource as CertificationProgress | undefined;
}

export async function updateCertificationProgress(userId: string, certificationId: string, chapterId: string, data: Partial<CertificationProgress>) {
  if (!certificationProgressContainer) await initializeDatabase();
  const id = `${userId}-${certificationId}-${chapterId}`;
  const partitionKey = `${userId}-${certificationId}`;
  const { resource: existingProgress } = await certificationProgressContainer.item(id, partitionKey).read();

  if (existingProgress) {
    const { resource } = await certificationProgressContainer.item(id, partitionKey).replace({
      ...existingProgress,
      ...data,
      lastAccessedAt: new Date().toISOString(),
    });
    return resource as CertificationProgress;
  } else {
    const { resource } = await certificationProgressContainer.items.create({
      id,
      partitionKey,
      userId,
      certificationId,
      chapterId,
      videoCompleted: false,
      completedQuestions: [],
      lastAccessedAt: new Date().toISOString(),
      ...data,
    });
    return resource as CertificationProgress;
  }
}

// アプリケーション起動時にデータベースを初期化
initializeDatabase().catch(console.error);
