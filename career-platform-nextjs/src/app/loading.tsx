import React from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
        あなたのキャリアの未来を、共に創る
      </h1>
      <p className="text-xl md:text-2xl text-center mb-8">
        プロフェッショナルのキャリアコーチが、あなたの成長をサポートします
      </p>
      <LoadingSpinner />
    </div>
  );
}
