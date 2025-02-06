'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CreateCertificationModal } from '@/components/ui/CreateCertificationModal';
import { EditCertificationModal } from '@/components/ui/EditCertificationModal';
import { updateCertification } from '@/lib/api';

interface Certification {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedStudyTime: string;
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState<Certification | null>(null);

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/certifications');
      if (!response.ok) {
        throw new Error('Failed to fetch certifications');
      }
      const data = await response.json();
      setCertifications(data);
    } catch (error) {
      console.error('Failed to fetch certifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleEdit = (certification: Certification) => {
    setSelectedCertification(certification);
    setIsEditModalOpen(true);
  };

  const handleCreateSave = async (data: {
    name: string;
    description: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedStudyTime: string;
  }) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('difficulty', data.difficulty);
      formData.append('estimatedStudyTime', data.estimatedStudyTime);

      const response = await fetch('/api/certifications', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create certification');
      }

      await fetchCertifications();
      setIsCreateModalOpen(false);
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
        const response = await fetch(`/api/certifications/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete certification');
        }

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCertifications.map((certification) => (
          <div
            key={certification.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden relative h-[320px] flex flex-col"
          >
            <div className="absolute top-4 right-4">
              <div className="text-2xl">
                {categories.find(cat => cat.id === certification.category)?.icon}
              </div>
            </div>
            <div className="p-6 flex-1">
              <div>
                <h2 className="text-xl font-bold mb-2 line-clamp-1">{certification.name}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2 h-12">{certification.description}</p>
                <div className="flex items-center space-x-2 mb-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    certification.difficulty === 'beginner'
                      ? 'bg-green-100 text-green-800'
                      : certification.difficulty === 'intermediate'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {certification.difficulty === 'beginner'
                      ? '初級'
                      : certification.difficulty === 'intermediate'
                      ? '中級'
                      : '上級'}
                  </span>
                  <span className="text-sm text-gray-500">
                    学習時間: {certification.estimatedStudyTime}
                  </span>
                </div>
              </div>
              <div className="mt-auto">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => handleEdit(certification)}
                    variant="outline"
                    className="text-blue-600 border-blue-600"
                  >
                    編集
                  </Button>
                  <Button
                    onClick={() => handleDelete(certification.id)}
                    variant="destructive"
                    className="w-full"
                  >
                    削除
                  </Button>
                  <Button
                    onClick={() => handleManageChapters(certification.id)}
                    variant="outline"
                    className="col-span-2"
                  >
                    チャプター管理
                  </Button>
                  <Button
                    onClick={() => router.push(`/admin/certifications/${certification.id}/questions`)}
                    variant="outline"
                    className="col-span-2"
                  >
                    総合問題管理
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CreateCertificationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateSave}
      />

      {selectedCertification && (
        <EditCertificationModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={async (data) => {
            try {
              const response = await fetch(`/api/certifications/${selectedCertification.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to update certification: ${JSON.stringify(errorData)}`);
              }
              await fetchCertifications();
              setIsEditModalOpen(false);
            } catch (error) {
              console.error('Failed to update certification:', error);
            }
          }}
          initialData={{
            name: selectedCertification.name,
            description: selectedCertification.description,
            category: selectedCertification.category,
            difficulty: selectedCertification.difficulty,
            estimatedStudyTime: selectedCertification.estimatedStudyTime,
          }}
        />
      )}
    </div>
  );
}
