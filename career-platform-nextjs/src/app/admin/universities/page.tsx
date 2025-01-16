'use client';

import { useState, useEffect } from 'react';
import { getUniversities, createUniversity, updateUniversity, deleteUniversity } from '@/lib/api';
import { University, CreateUniversityInput, UpdateUniversityInput } from '@/lib/cosmos-db';
import { uploadImage } from '@/lib/storage';

export default function UniversitiesAdminPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<CreateUniversityInput>({
    title: '',
    description: '',
    imageUrl: '',
    websiteUrl: '',
    type: 'university',
    location: 'japan',
  });

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const data = await getUniversities();
      setUniversities(data);
    } catch (error) {
      console.error('Failed to fetch universities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = formData.imageUrl;
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      await createUniversity({
        ...formData,
        imageUrl,
      });

      // リセット
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        websiteUrl: '',
        type: 'university',
        location: 'japan',
      });
      setSelectedFile(null);
      
      // 再読み込み
      fetchUniversities();
    } catch (error) {
      console.error('Failed to create university:', error);
    }
  };

  const handleUpdate = async (id: string, data: UpdateUniversityInput) => {
    try {
      await updateUniversity(id, data);
      fetchUniversities();
    } catch (error) {
      console.error('Failed to update university:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('本当に削除しますか？')) return;
    try {
      await deleteUniversity(id);
      fetchUniversities();
    } catch (error) {
      console.error('Failed to delete university:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">大学・プログラム管理</h1>

      {/* 新規作成フォーム */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">新規作成</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">タイトル</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">説明</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">画像</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="mt-1 block w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Webサイト</label>
            <input
              type="url"
              value={formData.websiteUrl}
              onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">種別</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'university' | 'program' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="university">大学</option>
              <option value="program">プログラム</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">場所</label>
            <select
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value as 'japan' | 'overseas' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="japan">日本</option>
              <option value="overseas">海外</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">プログラム種別</label>
            <select
              value={formData.programType || ''}
              onChange={(e) => setFormData({ ...formData, programType: e.target.value as 'mba' | 'data-science' | undefined })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">なし</option>
              <option value="mba">MBA</option>
              <option value="data-science">データサイエンス</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            作成
          </button>
        </form>
      </div>

      {/* 一覧 */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                タイトル
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                種別
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                場所
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                プログラム種別
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {universities.map((university) => (
              <tr key={university.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {university.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {university.type === 'university' ? '大学' : 'プログラム'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {university.location === 'japan' ? '日本' : '海外'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {university.programType === 'mba' ? 'MBA' :
                   university.programType === 'data-science' ? 'データサイエンス' : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(university.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
