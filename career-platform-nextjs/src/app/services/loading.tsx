import React from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">サービス一覧</h1>
      <LoadingSpinner />
    </div>
  );
}
