'use client';

import ImageToTextConverter from '@/components/ui/ImageToTextConverter';

export default function OcrPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">テキスト抽出</h1>
      <div className="max-w-3xl mx-auto">
        <ImageToTextConverter />
      </div>
    </div>
  );
}
