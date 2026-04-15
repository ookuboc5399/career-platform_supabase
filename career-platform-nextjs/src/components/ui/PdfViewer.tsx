'use client';

import { useState, useEffect } from 'react';

interface PdfViewerProps {
  url: string;
  title: string;
  height?: number;
  linkClassName?: string;
  linkLabel?: string;
}

const isSupabaseStorageUrl = (url: string) =>
  url.includes('supabase.co') && url.includes('/storage/');

export default function PdfViewer({
  url,
  title,
  height = 600,
  linkClassName = 'inline-flex items-center gap-2 mt-2 text-sm text-red-600 hover:text-red-800',
  linkLabel = 'PDFを別タブで開く',
}: PdfViewerProps) {
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!url) {
      setDisplayUrl(null);
      setIsLoading(false);
      return;
    }

    const loadPdf = async () => {
      if (!isSupabaseStorageUrl(url)) {
        setDisplayUrl(url);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/storage/video?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'PDFの読み込みに失敗しました');
        }
        if (!data.url) {
          throw new Error('URLの取得に失敗しました');
        }

        setDisplayUrl(data.url);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError(err instanceof Error ? err.message : 'PDFの読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadPdf();
  }, [url]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center border rounded-lg bg-gray-100" style={{ height }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center border rounded-lg bg-gray-100 p-4" style={{ height }}>
        <div className="text-red-500 text-center mb-2">PDFの読み込みに失敗しました</div>
        <div className="text-sm text-gray-600 text-center break-all">{error}</div>
      </div>
    );
  }

  if (!displayUrl) return null;

  return (
    <>
      <div className="border rounded-lg overflow-hidden shadow">
        <iframe
          src={displayUrl}
          className="w-full"
          style={{ height: `${height}px` }}
          title={title}
        />
      </div>
      <a
        href={displayUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        {linkLabel}
      </a>
    </>
  );
}
