"use client";

import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface Props {
  certificationId: string;
  category: string;
  isOpen: boolean;
  onClose: () => void;
}

interface Option {
  text: string;
  image: File | null;
  imagePreview: string | null;
}

type CategoryMap = {
  [key: string]: string[];
};

export default function CreateQuestionModal({ certificationId, category, isOpen, onClose }: Props) {
  const [question, setQuestion] = useState('');
  const [questionImage, setQuestionImage] = useState<File | null>(null);
  const [questionImagePreview, setQuestionImagePreview] = useState<string | null>(null);
  const [questionType, setQuestionType] = useState<'normal' | 'truefalse'>('normal');
  const [options, setOptions] = useState<Option[]>([
    { text: '', image: null, imagePreview: null },
    { text: '', image: null, imagePreview: null },
    { text: '', image: null, imagePreview: null },
    { text: '', image: null, imagePreview: null }
  ]);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [explanation, setExplanation] = useState('');
  const [explanationImage, setExplanationImage] = useState<File | null>(null);
  const [explanationImagePreview, setExplanationImagePreview] = useState<string | null>(null);
  const [year, setYear] = useState('');
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');

  const getAvailableCategories = useCallback((): CategoryMap => {
    if (category === 'finance') {
      return {
        '企業と法務': ['企業活動', '法務'],
        '経営戦略': ['経営戦略マネジメント', '技術戦略マネジメント', 'ビジネスインダストリ']
      };
    } else if (category === 'it') {
      // certificationIdに基づいて異なるカテゴリーを返す
      switch (certificationId) {
        case '7': // ITパスポート
          return {
            'ストラテジ系': ['企業と法務', '経営戦略', 'システム戦略'],
            'マネジメント系': ['開発技術', 'プロジェクトマネジメント', 'サービスマネジメント'],
            'テクノロジ系': ['基礎理論', 'コンピュータシステム', '技術要素']
          };
        case 'e29446b8-60d1-4336-a057-0d0b2269895c': // AWS
          return {
            'コンピューティング': ['EC2', 'Lambda', 'ECS', 'FSx', 'Storage Gateway'],
            'AWSクラウドの基本': ['オンプレミスとクラウド', 'AWSの概要'],
            'ストレージ': ['S3', 'EBS', 'EFS'],
            'データベース': ['RDS', 'DynamoDB', 'Aurora'],
            'ネットワーキング': ['VPC', 'Route53', 'CloudFront', 'Direct Connect'],
            'アプリケーション統合': ['SQS', 'SNS'],
            'セキュリティ': ['IAM', 'WAF', 'Shield'],
            '分析': ['Kinesis', 'Glue', 'Athena'],
            '機械学習': ['Comprehend', 'Transcribe', 'Textract']
          };
        case '9': // 応用情報
          return {
            'テクノロジ': ['基礎理論', 'コンピュータシステム', 'データベース'],
            'マネジメント': ['プロジェクトマネジメント', 'サービスマネジメント'],
            'ストラテジ': ['システム戦略', 'システム企画', '経営戦略']
          };
          case '10': // 情報セキュリティマネジメント
          return {
            '科目A': ['基礎理論'],
            '科目B': ['基礎理論']
          };
        default:
          return {
            'システム戦略': ['システム戦略', 'システム企画'],
            '開発技術': ['システム開発技術', 'ソフトウェア開発管理技術'],
            'プロジェクトマネジメント': ['プロジェクトマネジメント'],
            'サービスマネジメント': ['サービスマネジメント', 'システム監査'],
            '基礎理論': ['基礎理論', 'アルゴリズムとプログラミング'],
            'コンピュータシステム': ['コンピュータ構成要素', 'システム構成要素', 'ソフトウェア', 'ハードウェア']
          };
      }
    }
    return {};
  }, [category, certificationId]);

  const [categories, setCategories] = useState<CategoryMap>(getAvailableCategories());

  useEffect(() => {
    setCategories(getAvailableCategories());
    setMainCategory('');
    setSubCategory('');
  }, [category, certificationId, getAvailableCategories]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuestionImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQuestionImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setQuestionImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExplanationImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setExplanationImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setExplanationImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOptionImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newOptions = [...options];
        newOptions[index] = {
          ...newOptions[index],
          image: file,
          imagePreview: reader.result as string
        };
        setOptions(newOptions);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setQuestion('');
    setQuestionImage(null);
    setQuestionImagePreview(null);
    setOptions([
      { text: '', image: null, imagePreview: null },
      { text: '', image: null, imagePreview: null },
      { text: '', image: null, imagePreview: null },
      { text: '', image: null, imagePreview: null }
    ]);
    setCorrectAnswers([]);
    setExplanation('');
    setExplanationImage(null);
    setExplanationImagePreview(null);
    setYear('');
    setMainCategory('');
    setSubCategory('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // 画像をアップロード
      let questionImageUrl = '';
      let explanationImageUrl = '';
      const optionImageUrls: string[] = [];

      if (questionImage) {
        const formData = new FormData();
        formData.append('file', questionImage);
        formData.append('type', 'certification-image');
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (!uploadResponse.ok) throw new Error('Failed to upload question image');
        const uploadData = await uploadResponse.json();
        questionImageUrl = uploadData.url;
      }

      // 選択肢の画像をアップロード
      for (const option of options) {
        if (option.image) {
          console.log('Uploading option image:', option.image.name);
          const formData = new FormData();
          formData.append('file', option.image);
          formData.append('type', 'question-option-image');
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            console.error('Upload error response:', errorData);
            throw new Error(`Failed to upload option image: ${errorData.error || 'Unknown error'}`);
          }
          if (!uploadResponse.ok) throw new Error('Failed to upload option image');
          const uploadData = await uploadResponse.json();
          optionImageUrls.push(uploadData.url);
        } else {
          optionImageUrls.push('');
        }
      }

      if (explanationImage) {
        const formData = new FormData();
        formData.append('file', explanationImage);
        formData.append('type', 'certification-image');
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (!uploadResponse.ok) throw new Error('Failed to upload explanation image');
        const uploadData = await uploadResponse.json();
        explanationImageUrl = uploadData.url;
      }

      // 問題を作成
      const response = await fetch('/api/certifications/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          certificationId,
          question,
          questionImage: questionImageUrl,
          options: options.map((opt, index) => ({
            text: opt.text,
            imageUrl: optionImageUrls[index]
          })),
          correctAnswers,
          explanation,
          explanationImage: explanationImageUrl,
          year,
          category: subCategory,
          mainCategory,
        }),
      });

      if (!response.ok) throw new Error('Failed to create question');

      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating question:', error);
      alert('問題の作成に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white p-8">
          <h2 className="text-3xl font-bold mb-8">新規問題作成</h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 問題文 */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-2">
                問題文
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                required
              />
            </div>

            {/* 問題画像 */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-2">
                問題画像（任意）
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleQuestionImageChange}
                className="w-full"
              />
              {questionImagePreview && (
                <div className="mt-2">
                  <Image
                    src={questionImagePreview}
                    alt="問題画像プレビュー"
                    width={200}
                    height={200}
                    className="rounded-md"
                  />
                </div>
              )}
            </div>

            {/* 問題タイプ */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-2">
                問題タイプ
              </label>
              <select
                value={questionType}
                onChange={(e) => {
                  const newType = e.target.value as 'normal' | 'truefalse';
                  setQuestionType(newType);
                  if (newType === 'truefalse') {
                    setOptions([
                      { text: '◯', image: null, imagePreview: null },
                      { text: '×', image: null, imagePreview: null },
                      { text: '', image: null, imagePreview: null },
                      { text: '', image: null, imagePreview: null }
                    ]);
                    setCorrectAnswers([]);
                  } else {
                    setOptions([
                      { text: '', image: null, imagePreview: null },
                      { text: '', image: null, imagePreview: null },
                      { text: '', image: null, imagePreview: null },
                      { text: '', image: null, imagePreview: null }
                    ]);
                    setCorrectAnswers([]);
                  }
                }}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="normal">通常問題</option>
                <option value="truefalse">◯×問題</option>
              </select>
            </div>

            {/* 選択肢 */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-2">
                選択肢（空白可）
              </label>
              {options.map((option, index) => (
                <div key={index} className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={correctAnswers.includes(index)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCorrectAnswers([...correctAnswers, index]);
                        } else {
                          setCorrectAnswers(correctAnswers.filter(i => i !== index));
                        }
                      }}
                      className="h-4 w-4"
                    />
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => {
                        const newOptions = [...options];
                        newOptions[index] = { ...newOptions[index], text: e.target.value };
                        setOptions(newOptions);
                      }}
                      className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`選択肢${index + 1}`}
                      disabled={questionType === 'truefalse' && index < 2}
                    />
                  </div>
                  {/* 選択肢の画像 */}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleOptionImageChange(index, e)}
                      className="w-full"
                      disabled={questionType === 'truefalse' && index < 2}
                    />
                    {option.imagePreview && (
                      <div className="mt-2">
                        <Image
                          src={option.imagePreview}
                          alt={`選択肢${index + 1}の画像`}
                          width={200}
                          height={200}
                          className="rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 解説 */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-2">
                解説
              </label>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                required
              />
            </div>

            {/* 解説画像 */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-2">
                解説画像（任意）
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleExplanationImageChange}
                className="w-full"
              />
              {explanationImagePreview && (
                <div className="mt-2">
                  <Image
                    src={explanationImagePreview}
                    alt="解説画像プレビュー"
                    width={200}
                    height={200}
                    className="rounded-md"
                  />
                </div>
              )}
            </div>

            {/* 年度 */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-2">
                年度
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">選択してください</option>
                {[
                  'H21年春', 'H21年秋', 'H22年春', 'H22年秋',
                  'H23年春', 'H23年秋', 'H24年春', 'H24年秋',
                  'H25年春', 'H25年秋', 'H26年春', 'H26年秋',
                  'H27年春', 'H27年秋', 'H28年春', 'H28年秋',
                  'H29年春', 'H29年秋', 'H30年春', 'H30年秋',
                  'H31年春', 'R1年秋', 'R2年春', 'R2年秋',
                  'R3年春', 'R3年秋', 'R4年春', 'R4年秋','R5年春', 'R5年秋'
                ].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* メインカテゴリー */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-2">
                メインカテゴリー
              </label>
              <select
                value={mainCategory}
                onChange={(e) => {
                  setMainCategory(e.target.value);
                  setSubCategory('');
                }}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">選択してください</option>
                {Object.keys(categories).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* サブカテゴリー */}
            {mainCategory && (
              <div>
                <label className="block text-base font-medium text-gray-900 mb-2">
                  サブカテゴリー
                </label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">選択してください</option>
                  {categories[mainCategory]?.map(subCat => (
                    <option key={subCat} value={subCat}>{subCat}</option>
                  ))}
                </select>
              </div>
            )}

            {/* ボタン */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                variant="outline"
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? '作成中...' : '作成'}
              </Button>
            </div>
          </form>
      </DialogContent>
    </Dialog>
  );
}
