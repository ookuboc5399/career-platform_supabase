import { CosmosClient, Container, Database } from '@azure/cosmos';

const endpoint = process.env.COSMOS_DB_ENDPOINT || '';
const key = process.env.COSMOS_DB_KEY || '';

let client: CosmosClient | null = null;
let database: Database | null = null;

function getClient(): CosmosClient {
  if (!client) {
    if (!endpoint || !key) {
      throw new Error('Cosmos DB credentials are not configured (COSMOS_DB_ENDPOINT, COSMOS_DB_KEY)');
    }
    client = new CosmosClient({ endpoint, key });
  }
  return client;
}

function getDatabase(): Database {
  if (!database) {
    database = getClient().database('career-platform');
  }
  return database;
}

/**
 * コンテナ名を指定して Cosmos DB コンテナを取得
 */
export function getContainer(containerName: string): Container {
  const db = getDatabase();
  return db.container(containerName);
}

/**
 * English News 用コンテナを取得
 */
export function getEnglishNewsContainer(): Container {
  return getContainer('english-news');
}
