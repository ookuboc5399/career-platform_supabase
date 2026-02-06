'use client';

import { useState, useEffect } from 'react';
import { Button } from './button';
import Image from 'next/image';

interface EditCertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData) => Promise<void>;
  initialData: {
    name: string;
    description: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedStudyTime: string;
    imageUrl?: string;
    image?: {
      data: string;
      contentType: string;
      filename: string;
    };
  };
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

export function EditCertificationModal({ isOpen, onClose, onSave, initialData }: EditCertificationModalProps) {
  const [name, setName] = useState(initialData.name);
  const [description, setDescription] = useState(initialData.description);
  const [category, setCategory] = useState(initialData.category);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>(initialData.difficulty);
  const [estimatedStudyTime, setEstimatedStudyTime] = useState(initialData.estimatedStudyTime);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData.imageUrl || 
    (initialData.image?.data ? `data:${initialData.image.contentType};base64,${initialData.image.data}` : null)
  );

  useEffect(() => {
    setName(initialData.name);
    setDescription(initialData.description);
    setCategory(initialData.category);
    setDifficulty(initialData.difficulty);
    setEstimatedStudyTime(initialData.estimatedStudyTime);
    setPreviewUrl(
      initialData.imageUrl || 
      (initialData.image?.data ? `data:${initialData.image.contentType};base64,${initialData.image.data}` : null)
    );
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください');
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('difficulty', difficulty);
    formData.append('estimatedStudyTime', estimatedStudyTime);
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    await onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-6">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 my-auto">
        <h2 className="text-2xl font-bold mb-6">資格編集</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              カテゴリ
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-3 border rounded-lg hover:bg-blue-50 transition-colors ${
                    category === cat.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="text-2xl mb-2 text-center">{cat.icon}</div>
                  <p className="text-sm text-center">{cat.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              画像
            </label>
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                {previewUrl ? (
                  <div className="relative w-full h-48">
                    <Image
                      src={previewUrl}
                      alt="プレビュー"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">画像が選択されていません</span>
                  </div>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="certification-image-edit"
                />
                <label htmlFor="certification-image-edit">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <span>画像を選択</span>
                  </Button>
                </label>
              </div>
              <p className="text-sm text-gray-500">
                推奨サイズ: 400x200px (アスペクト比 2:1)
              </p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              資格名
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              説明
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              難易度
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="beginner">初級</option>
              <option value="intermediate">中級</option>
              <option value="advanced">上級</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              学習時間目安
            </label>
            <input
              type="text"
              value={estimatedStudyTime}
              onChange={(e) => setEstimatedStudyTime(e.target.value)}
              placeholder="例: 40時間"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
            >
              更新
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
