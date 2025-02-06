'use client';

import { useState } from 'react';
import { Button } from './button';
import Image from 'next/image';

export default function ImageToTextConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);
    try {
      console.log('Uploading file:', selectedFile.name);
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing JSON:', e);
        throw new Error('サーバーからの応答が不正です');
      }

      if (!response.ok) {
        const errorMessage = data.error || '不明なエラー';
        if (errorMessage.includes('No text was found')) {
          throw new Error('画像からテキストを検出できませんでした。別の画像を試してください。');
        } else if (errorMessage.includes('timed out')) {
          throw new Error('処理がタイムアウトしました。時間をおいて再度お試しください。');
        } else if (errorMessage.includes('Invalid response')) {
          throw new Error('OCRサービスからの応答が不正です。時間をおいて再度お試しください。');
        } else {
          throw new Error(`テキスト抽出に失敗しました: ${errorMessage}`);
        }
      }

      if (!data.text) {
        throw new Error('テキストを抽出できませんでした。別の画像を試してください。');
      }

      setExtractedText(data.text);
    } catch (error) {
      console.error('Error extracting text:', error);
      setError(error instanceof Error ? error.message : '不明なエラーが発生しました。時間をおいて再度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold">画像からテキストを抽出</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            画像を選択
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        {imagePreview && (
          <div className="mt-4">
            <Image
              src={imagePreview}
              alt="選択された画像"
              width={400}
              height={300}
              className="rounded-lg"
            />
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!selectedFile || isLoading}
          className="w-full"
        >
          {isLoading ? 'テキストを抽出中...' : 'テキストを抽出'}
        </Button>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-semibold text-red-700 mb-2">エラー:</h3>
            <div className="text-red-600">
              {error}
            </div>
          </div>
        )}

        {extractedText && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">抽出されたテキスト:</h3>
            <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
              {extractedText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
