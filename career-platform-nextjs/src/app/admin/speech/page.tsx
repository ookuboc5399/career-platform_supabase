"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function SpeechPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [googleDocsUrl, setGoogleDocsUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [engine, setEngine] = useState<'azure-en' | 'azure-ja' | 'voicevox-zundamon' | 'voicevox-aoyama'>('voicevox-zundamon');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setGoogleDocsUrl(''); // ファイルが選択されたらGoogleドキュメントのURLをクリア
      setError(null);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoogleDocsUrl(e.target.value);
    setSelectedFile(null); // URLが入力されたらファイル選択をクリア
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !googleDocsUrl) return;

    setIsGenerating(true);
    setError(null);
    try {
      let text: string;

      if (selectedFile) {
        // ファイルからテキストを読み込む
        text = await selectedFile.text();
      } else {
        // Googleドキュメントからテキストを取得
        const response = await fetch('/api/speech/google-docs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: googleDocsUrl }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to get document text');
        }
        text = data.text;
      }

      console.log('Generating speech with text:', text.substring(0, 100) + '...');
      
      // APIを呼び出して音声を生成
      let endpoint;
      let requestBody: any = { text };

      switch (engine) {
        case 'azure-ja':
          endpoint = '/api/speech/generate-ja';
          break;
        case 'azure-en':
          endpoint = '/api/speech/generate';
          break;
        case 'voicevox-zundamon':
          endpoint = '/api/speech/generate-voicevox';
          requestBody.speaker = 'ZUNDAMON';
          break;
        case 'voicevox-aoyama':
          endpoint = '/api/speech/generate-voicevox';
          requestBody.speaker = 'AOYAMA';
          break;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate speech');
      }

      setAudioUrl(data.audioUrl);
    } catch (error) {
      console.error('Error generating speech:', error);
      setError(error instanceof Error ? error.message : '音声の生成に失敗しました');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push('/admin')}
            variant="outline"
            className="mb-4"
          >
            ← 戻る
          </Button>
          <h1 className="text-2xl font-bold">音声生成</h1>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              音声エンジン選択
            </label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="voicevox-zundamon"
                  checked={engine === 'voicevox-zundamon'}
                  onChange={(e) => setEngine(e.target.value as 'voicevox-zundamon')}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">VOICEVOX（ずんだもん）</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="voicevox-aoyama"
                  checked={engine === 'voicevox-aoyama'}
                  onChange={(e) => setEngine(e.target.value as 'voicevox-aoyama')}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">VOICEVOX（青山龍生）</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="azure-ja"
                  checked={engine === 'azure-ja'}
                  onChange={(e) => setEngine(e.target.value as 'azure-ja')}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Azure（日本語）</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="azure-en"
                  checked={engine === 'azure-en'}
                  onChange={(e) => setEngine(e.target.value as 'azure-en')}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Azure（英語）</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              テキストファイル（.txt）
            </label>
            <input
              type="file"
              accept=".txt"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          <div className="text-center text-gray-500 text-sm">または</div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GoogleドキュメントのURL
            </label>
            <input
              type="url"
              value={googleDocsUrl}
              onChange={handleUrlChange}
              placeholder="https://docs.google.com/document/d/..."
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={(!selectedFile && !googleDocsUrl) || isGenerating}
            className="w-full"
          >
            {isGenerating ? '生成中...' : '音声を生成'}
          </Button>
        </form>

        {audioUrl && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">生成された音声</h2>
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/wav" />
              お使いのブラウザは音声の再生に対応していません。
            </audio>
            <a
              href={audioUrl}
              download
              className="mt-4 inline-block text-blue-600 hover:text-blue-800"
            >
              音声ファイルをダウンロード
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
