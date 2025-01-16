'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Certification, CreateCertificationDto } from '@/types/api';
import {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
} from '@/lib/api';

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateCertificationDto>({
    name: '',
    description: '',
    image: undefined,
    category: 'it',
    difficulty: 'beginner',
    estimatedStudyTime: '30時間',
  });

  useEffect(() => {
    fetchCertifications();
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setError(null);
    setSubmitStatus(null);
  };

  const fetchCertifications = async () => {
    try {
      const data = await getCertifications();
      setCertifications(data);
    } catch (error) {
      setError('Failed to fetch certifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    setSubmitStatus(null);

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('difficulty', formData.difficulty);
    formDataToSend.append('estimatedStudyTime', formData.estimatedStudyTime);

    try {
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      } else {
        setSubmitStatus('画像を生成中...');
        
        // 画像がない場合、説明文を使ってDALL-E 3で生成
        console.log('Generating image with prompt:', formData.description);
        const generateResponse = await fetch('/api/images/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: formData.description }),
        });

        if (!generateResponse.ok) {
          const errorData = await generateResponse.json();
          throw new Error(errorData.details || errorData.message || 'Failed to generate image');
        }

        const data = await generateResponse.json();
        console.log('Generated image URL:', data.url);
        
        if (!data.url) {
          throw new Error('No image URL received from image generation API');
        }

        setSubmitStatus('生成された画像をダウンロード中...');
        const imageResponse = await fetch(data.url);
        if (!imageResponse.ok) {
          throw new Error('Failed to download generated image');
        }

        const blob = await imageResponse.blob();
        const file = new File([blob], 'generated-image.png', { type: 'image/png' });
        formDataToSend.append('image', file);
      }

      setSubmitStatus('資格・検定を作成中...');
      await createCertification(formDataToSend);
      await fetchCertifications();
      handleModalClose();
      setFormData({
        name: '',
        description: '',
        image: undefined,
        category: 'it',
        difficulty: 'beginner',
        estimatedStudyTime: '30時間',
      });
    } catch (error) {
      console.error('Error in form submission:', error);
      setError(error instanceof Error ? error.message : 'Failed to create certification');
    } finally {
      setIsSubmitting(false);
      setSubmitStatus(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('本当に削除しますか？')) {
      try {
        await deleteCertification(id);
        await fetchCertifications();
      } catch (error) {
        setError('Failed to delete certification');
      }
    }
  };

  if (error && !isModalOpen) {
    return <div className="text-red-500">{error}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">資格・検定管理</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          新規作成
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((certification) => (
          <div
            key={certification.id}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <h2 className="text-xl font-semibold mb-2">{certification.name}</h2>
            <p className="text-gray-600 mb-4">{certification.description}</p>
            <div className="flex justify-end space-x-2">
              <Link
                href={`/admin/certifications/${certification.id}/chapters`}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                チャプター管理
              </Link>
              <button
                onClick={() => handleDelete(certification.id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-6">新規資格・検定の作成</h2>
            {submitStatus && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-600">{submitStatus}</p>
              </div>
            )}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  名称
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  説明
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  rows={3}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  画像（任意）
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      image: e.target.files ? e.target.files[0] : undefined,
                    })
                  }
                  className="mt-1 block w-full"
                  disabled={isSubmitting}
                />
                <p className="mt-1 text-sm text-gray-500">
                  画像を選択しない場合、AIが説明文を基に自動的に生成します
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  カテゴリ
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as 'finance' | 'it' | 'business',
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  disabled={isSubmitting}
                >
                  <option value="finance">金融</option>
                  <option value="it">IT</option>
                  <option value="business">ビジネス</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  難易度
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      difficulty: e.target.value as
                        | 'beginner'
                        | 'intermediate'
                        | 'advanced',
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  disabled={isSubmitting}
                >
                  <option value="beginner">初級</option>
                  <option value="intermediate">中級</option>
                  <option value="advanced">上級</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  学習時間目安
                </label>
                <input
                  type="text"
                  value={formData.estimatedStudyTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimatedStudyTime: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '作成中...' : '作成'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
