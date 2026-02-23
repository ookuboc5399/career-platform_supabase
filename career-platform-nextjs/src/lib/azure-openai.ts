export async function generateNewsContent() {
  throw new Error('Azure OpenAI はスタブ化されています。ニュース生成機能は後で OpenAI API 等に置換予定です。');
}

export async function extractTranscript(_audioBuffer: Buffer): Promise<string> {
  throw new Error('Azure OpenAI はスタブ化されています。');
}

export async function extractVocabulary(_text: string, _timestamp: number) {
  throw new Error('Azure OpenAI はスタブ化されています。');
}

export async function translateToJapanese(_text: string): Promise<string> {
  throw new Error('Azure OpenAI はスタブ化されています。');
}

export async function generateSubtitles(_transcript: string) {
  throw new Error('Azure OpenAI はスタブ化されています。');
}
