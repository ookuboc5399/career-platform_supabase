import axios from 'axios';
import { getSettingsContainer } from './cosmos-db';
import { AzureSettings } from '@/types/english';

export async function getAzureSettings(): Promise<AzureSettings> {
  const container = await getSettingsContainer();
  const { resources } = await container.items
    .query({
      query: 'SELECT * FROM c WHERE c.type = @type',
      parameters: [{ name: '@type', value: 'azure-openai' }]
    })
    .fetchAll();

  if (resources.length === 0) {
    throw new Error('Azure OpenAI settings not found');
  }

  const { apiKey, endpoint, deploymentName, speechKey, speechRegion } = resources[0];
  return { apiKey, endpoint, deploymentName, speechKey, speechRegion };
}

export async function generateNewsContent() {
  try {
    const response = await axios.post('/api/english/news/generate');
    return response.data;
  } catch (error) {
    console.error('Error generating news content:', error);
    throw error;
  }
}
