'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CreateCertificationModal } from '@/components/ui/CreateCertificationModal';

interface Certification {
  id: string;
  name: string;
  description: string;
  category: string;
}

const categories = [
  { id: 'it', name: 'IT・情報処理', icon: '💻' },
  { id: 'finance', name: '金融・証券', icon: '💹' },
  { id: 'business', name: 'ビジネス・経営', icon: '📊' },
  { id: 'language', name: '語学', icon: '🗣️' },
  { id: 'medical', name: '医療・福祉', icon: '🏥' },
  { id: 'construction', name: '建築・土木', icon: '🏗️' },
  { id: 'education', name: '教育', icon: '📚' },
  { id: 'legal', name: '法律・行政', icon: '⚖️' },
  { id: 'other', name: 'その他', icon: '📋' },
];

export default function CertificationsPage() {
  const router = useRouter();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      setIsLoading(true);
      // TODO: APIから資格情報を取得
      const mockData = [
        {
          id: '1',
          name: '基本情報技術者試験',
          description: 'IT業界の登竜門となる国家資格です。',
          category: 'it'
        },
        {
          id: '2',
          name: '一種外務員・二種外務員',
          description: '金融商品取引業者において業務を行うために必要な資格です。',
          category: 'finance'
        },
      ];
      setCertifications(mockData);
    } catch (error) {
      console.error('Failed to fetch certifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleSave = async (data: { name: string; description: string; category: string }) => {
    try {
      // TODO: APIで資格を作成
      console.log('Creating certification:', data);
      await fetchCertifications();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create certification:', error);
    }
  };

  const handleManageChapters = (id: string) => {
    router.push(`/admin/certifications/${id}/chapters`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('この資格を削除してもよろしいですか？')) {
      try {
        // TODO: APIで資格を削除
        await fetchCertifications();
      } catch (error) {
        console.error('Failed to delete certification:', error);
      }
    }
  };

  const filteredCertifications = selectedCategory
    ? certifications.filter(cert => cert.category === selectedCategory)
    : certifications;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">資格・検定管理</h1>
        <Button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700"
        >
          新規作成
        </Button>
      </div>

      <div className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id === selectedCategory ? '' : category.id)}
              className={`p-4 border rounded-lg hover:bg-blue-50 transition-colors ${
                category.id === selectedCategory ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="text-4xl mb-2 text-center">{category.icon}</div>
              <p className="text-sm text-center">{category.name}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCertifications.map((certification) => (
          <div
            key={certification.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden relative"
          >
            <div className="absolute top-4 right-4">
              <div className="text-2xl">
                {categories.find(cat => cat.id === certification.category)?.icon}
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">{certification.name}</h2>
                <p className="text-gray-600">{certification.description}</p>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  onClick={() => handleManageChapters(certification.id)}
                  variant="outline"
                >
                  チャプター管理
                </Button>
                <Button
                  onClick={() => handleDelete(certification.id)}
                  variant="destructive"
                >
                  削除
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CreateCertificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
