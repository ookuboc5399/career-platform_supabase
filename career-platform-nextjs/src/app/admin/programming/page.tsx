'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CreateLanguageModal from '@/components/ui/CreateLanguageModal';
import { ProgrammingLanguage } from '@/lib/cosmos-db';

export default function ProgrammingAdminPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [languages, setLanguages] = useState<ProgrammingLanguage[]>([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      const response = await fetch('/api/programming/languages');
      if (response.ok) {
        const data = await response.json();
        setLanguages(data);
      }
    };
    fetchLanguages();
  }, []);

  const handleSaveLanguage = async (data: Omit<ProgrammingLanguage, 'createdAt' | 'updatedAt'>) => {
    const response = await fetch('/api/programming/languages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const newLanguage = await response.json();
      setLanguages([...languages, newLanguage]);
      setIsAddModalOpen(false);
    }
  };

  const languageItems = languages.filter(lang => lang.type === 'language');
  const frameworkItems = languages.filter(lang => lang.type === 'framework');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">プログラミング学習コンテンツ管理</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          新規コンテンツ追加
        </button>
      </div>

      <div className="space-y-12">
        <div>
          <h2 className="text-xl font-semibold mb-4">プログラミング言語</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {languageItems.map((lang) => (
              <Link
                key={lang.id}
                href={`/admin/programming/${lang.id}/chapters`}
                className="block bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6"
              >
                <h3 className="text-lg font-semibold mb-2">{lang.title}</h3>
                <p className="text-gray-600 mb-4">{lang.description}</p>
                <div className="text-blue-600 font-medium">
                  チャプター管理 →
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">フレームワーク</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {frameworkItems.map((lang) => (
              <Link
                key={lang.id}
                href={`/admin/programming/${lang.id}/chapters`}
                className="block bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6"
              >
                <h3 className="text-lg font-semibold mb-2">{lang.title}</h3>
                <p className="text-gray-600 mb-4">{lang.description}</p>
                <div className="text-blue-600 font-medium">
                  チャプター管理 →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <CreateLanguageModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveLanguage}
      />
    </div>
  );
}
