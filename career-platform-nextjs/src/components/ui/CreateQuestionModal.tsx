"use client";

import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { createQuestion, uploadFile } from '@/lib/api';

interface Props {
  certificationId: string;
  category: string;
  isOpen: boolean;
  onClose: () => void;
}

interface SubOption {
  text: string;
  image: File | null;
  imagePreview: string | null;
}

interface Option {
  text: string;
  image: File | null;
  imagePreview: string | null;
  subOptions: SubOption[];
}

type CategoryMap = {
  [key: string]: string[];
};

export default function CreateQuestionModal({ certificationId, category, isOpen, onClose }: Props) {
  const [questionNumber, setQuestionNumber] = useState<string>('');
  const [question, setQuestion] = useState('');
  const [questionImage, setQuestionImage] = useState<File | null>(null);
  const [questionImagePreview, setQuestionImagePreview] = useState<string | null>(null);
  const [questionType, setQuestionType] = useState<'normal' | 'truefalse' | 'programming'>('normal');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [options, setOptions] = useState<Option[]>([
    { text: '', image: null, imagePreview: null, subOptions: [] },
    { text: '', image: null, imagePreview: null, subOptions: [] },
    { text: '', image: null, imagePreview: null, subOptions: [] },
    { text: '', image: null, imagePreview: null, subOptions: [] }
  ]);

  const addOption = () => {
    setOptions([...options, { text: '', image: null, imagePreview: null, subOptions: [] }]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return; // 最低2つの選択肢は維持
    const newOptions = options.filter((_, i) => i !== index);
    setCorrectAnswers(correctAnswers.filter(i => i !== index).map(i => i > index ? i - 1 : i));
    setOptions(newOptions);
  };
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [explanation, setExplanation] = useState('');
  const [explanationImage, setExplanationImage] = useState<File | null>(null);
  const [explanationImagePreview, setExplanationImagePreview] = useState<string | null>(null);
  const [year, setYear] = useState('');
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');

  const getAvailableYears = useCallback((): string[] => {
    const defaultYears = [
      'H21年春', 'H21年秋', 'H22年春', 'H22年秋',
      'H23年春', 'H23年秋', 'H24年春', 'H24年秋',
      'H25年春', 'H25年秋', 'H26年春', 'H26年秋',
      'H27年春', 'H27年秋', 'H28年春', 'H28年秋',
      'H29年春', 'H29年秋', 'H30年春', 'H30年秋',
      'H31年春', 'R1年秋', 'R2年春', 'R2年秋',
      'R3年春', 'R3年秋', 'R4年春', 'R4年秋',
      'R5年春', 'R5年秋', 'R5年予想', 'R6年', 'R6年予想'
    ];

    switch (certificationId) {
      case '7': // ITパスポート
      case '9': // 基本情報
      case '10': // 情報セキュリティマネジメント
      case '11': // 応用情報
        return defaultYears;
      case 'e29446b8-60d1-4336-a057-0d0b2269895c': // AWS
        return ['2024年', '2023年', '2022年', '2021年', '2020年'];
      case '12': // 宅建士
        return [
          'H21年', 'H22年', 'H23年', 'H24年', 'H25年',
          'H26年', 'H27年', 'H28年', 'H29年', 'H30年',
          'H31年', 'R1年', 'R2年10月', 'R2年12月', 'R3年10月','R3年12月',  'R4年',
          'R5年', 'R5年予想', 'R6年', 'R6年予想'
        ];
      case '14': // Python
        return ['2024年', '2023年', '2022年', '2021年', '2020年'];
      default:
        return defaultYears;
    }
  }, [certificationId]);

  const getAvailableCategories = useCallback((): CategoryMap => {
    switch (category) {
      case 'finance':
        return {
          '企業と法務': ['企業活動', '法務'],
          '経営戦略': ['経営戦略マネジメント', '技術戦略マネジメント', 'ビジネスインダストリ']
        };
      case 'it':
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
          case '8': // 証券外務員
            return {
              '株式会社法概論': ['基礎理論'],
              '財務分析と企業分析': ['基礎理論'],
              '株式業務': ['基礎理論'],
              '取引所定款': ['基礎理論'],
              '協会定款': ['基礎理論'],
              '金融商品取引法': ['基礎理論'],
              '付随業務': ['基礎理論'],
              '債権業務': ['基礎理論'],
              '証券税制': ['基礎理論'],
              '経済・金融・財政の常識': ['基礎理論'],
              '証券市場の基礎知識': ['基礎理論'],
              'セールス業務': ['基礎理論'],
              '信用取引': ['基礎理論'],
              '先物取引': ['基礎理論'],
              'オプション取引': ['基礎理論'],
              '特定店頭デリバティブ取引': ['基礎理論'],
            };
          case '9': // 基本情報
            return {
              '科目A': ['基礎理論'],
              '科目B': ['基礎理論']
            };
          case '10': // 情報セキュリティマネジメント
            return {
              '科目A': ['基礎理論'],
              '科目B': ['基礎理論']
            };
          case '11': // 応用情報
            return {
              'テクノロジ': ['基礎理論', 'コンピュータシステム', 'データベース'],
              'マネジメント': ['プロジェクトマネジメント', 'サービスマネジメント'],
              'ストラテジ': ['システム戦略', 'システム企画', '経営戦略']
            };
            case '12': // 宅建士
            return {
              '過去問': ['基礎'],
              '宅建業法': ['免許', '宅地建物取引士', '営業保証金', '保証協会'],
              '権利関係': ['制限行為能力者', '意思表示', '代理'],
              '法令上の制限': [' 都市計画法', '建築基準法'],
              '税': ['不動産に関する税金', '不動産鑑定評価基準'],
            };
            case '13': // LPIC
            return {
              '過去問': ['基礎'],
              'システムアーキテクチャ': ['ハードウェア設定の決定と設定', 'システムの起動', 'ランレベル/ブートターゲットの変更',],
              'Linuxのインストールとパッケージ管理': ['ハードディスクのレイアウト設計', 'ブートマネージャのインストール', '共有ライブラリの管理'],
              '法令上の制限': [' 都市計画法', '建築基準法'],
              '税': ['不動産に関する税金', '不動産鑑定評価基準'],
            };
          case '14': // Python
            return {
              '基礎': ['基礎','リスト', '関数', 'モジュール','ライブラリ']
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
      case 'business':
        return { '経営管理': ['経営戦略', 'ビジネスモデル'], 'マーケティング': ['市場分析', '広告戦略'] };
      case 'language':
        return { '英語': ['TOEIC', 'TOEFL'], '日本語': ['JLPT N1', 'JLPT N2'] };
      case 'medical':
        return { '医学': ['基礎医学', '臨床医学'], '福祉': ['介護', 'リハビリ'] };
      case 'construction':
        return { '建築設計': ['CAD', '耐震設計'], '土木工学': ['道路設計', '橋梁工学'] , '過去問': ['基礎']};
      case 'education':
        return { '教育学': ['教育心理学', '指導法'], '資格試験': ['教員免許', '保育士試験'] };
      case 'legal':
        return { '法律': ['民法', '刑法'], '行政': ['行政法', '地方自治'] };
      case 'other':
        return { 'その他': ['未分類', '特別トピック'] };
      default:
        return {};
    }
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

  const handleSubOptionImageChange = (optionIndex: number, subIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newOptions = [...options];
        newOptions[optionIndex].subOptions[subIndex] = {
          ...newOptions[optionIndex].subOptions[subIndex],
          image: file,
          imagePreview: reader.result as string
        };
        setOptions(newOptions);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setQuestionNumber('');
    setQuestion('');
    setQuestionImage(null);
    setQuestionImagePreview(null);
    setQuestionType('normal');
    setCodeSnippet('');
    setOptions([
      { text: '', image: null, imagePreview: null, subOptions: [] },
      { text: '', image: null, imagePreview: null, subOptions: [] },
      { text: '', image: null, imagePreview: null, subOptions: [] },
      { text: '', image: null, imagePreview: null, subOptions: [] }
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
      const subOptionImageUrls: { [key: number]: string[] } = {};

      if (questionImage) {
        questionImageUrl = await uploadFile(questionImage, 'certification-image');
      }

      // 選択肢の画像をアップロード
      for (const [index, option] of options.entries()) {
        if (option.image) {
          console.log('Uploading option image:', option.image.name);
          const url = await uploadFile(option.image, 'question-option-image');
          optionImageUrls.push(url);
        } else {
          optionImageUrls.push('');
        }

        // サブ選択肢の画像をアップロード
        subOptionImageUrls[index] = [];
        for (const subOption of option.subOptions) {
          if (subOption.image) {
            console.log('Uploading sub-option image:', subOption.image.name);
            const url = await uploadFile(subOption.image, 'question-option-image');
            subOptionImageUrls[index].push(url);
          } else {
            subOptionImageUrls[index].push('');
          }
        }
      }

      if (explanationImage) {
        explanationImageUrl = await uploadFile(explanationImage, 'certification-image');
      }

      // 問題を作成
      await createQuestion(certificationId, {
        questionNumber: questionNumber ? Number(questionNumber) : undefined,
        question,
        questionImage: questionImageUrl,
        questionType,
        codeSnippet: questionType === 'programming' ? codeSnippet : undefined,
        options: options.map((opt, index) => ({
          text: opt.text,
          imageUrl: optionImageUrls[index],
          subOptions: opt.subOptions.map((subOpt, subIndex) => ({
            text: subOpt.text,
            imageUrl: subOptionImageUrls[index][subIndex]
          }))
        })),
        correctAnswers,
        explanation,
        explanationImage: explanationImageUrl,
        year,
        category: subCategory,
        mainCategory,
      });

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
            {/* 問題番号（任意） */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-2">
                問題番号（任意）
              </label>
              <input
                type="number"
                min={1}
                value={questionNumber}
                onChange={(e) => setQuestionNumber(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="例: 15（問15として保存）"
              />
              <p className="mt-1 text-sm text-gray-500">未入力の場合は番号なしで保存されます。</p>
            </div>
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
                  const newType = e.target.value as 'normal' | 'truefalse' | 'programming';
                  setQuestionType(newType);
                  if (newType === 'truefalse') {
                    setOptions([
                      { text: '◯', image: null, imagePreview: null, subOptions: [] },
                      { text: '×', image: null, imagePreview: null, subOptions: [] },
                      { text: '', image: null, imagePreview: null, subOptions: [] },
                      { text: '', image: null, imagePreview: null, subOptions: [] }
                    ]);
                  } else {
                    setOptions([
                      { text: '', image: null, imagePreview: null, subOptions: [] },
                      { text: '', image: null, imagePreview: null, subOptions: [] },
                      { text: '', image: null, imagePreview: null, subOptions: [] },
                      { text: '', image: null, imagePreview: null, subOptions: [] }
                    ]);
                  }
                  setCorrectAnswers([]);
                  if (newType === 'programming') {
                    setCodeSnippet('');
                  } else {
                    setCodeSnippet('');
                  }
                }}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="normal">通常問題</option>
                <option value="truefalse">◯×問題</option>
                <option value="programming">プログラミング問題</option>
              </select>
            </div>

            {/* プログラミングコード */}
            {questionType === 'programming' && (
              <div>
                <label className="block text-base font-medium text-gray-900 mb-2">
                  プログラミングコード
                </label>
                <textarea
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  rows={8}
                  placeholder="ここにコードを入力してください"
                  required={questionType === 'programming'}
                />
              </div>
            )}

            {/* 選択肢 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-base font-medium text-gray-900">
                  選択肢（空白可）
                </label>
                {!questionType.startsWith('truefalse') && (
                  <button
                    type="button"
                    onClick={addOption}
                    className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    選択肢を追加
                  </button>
                )}
              </div>
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
                    <div className="flex-1 flex items-center gap-2">
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
                      {!questionType.startsWith('truefalse') && options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="text-red-500 hover:text-red-600 flex-shrink-0"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                      {/* サブ選択肢 */}
                      {!questionType.startsWith('truefalse') && (
                        <div className="mt-2 ml-4 space-y-2">
                          {option.subOptions.map((subOption, subIndex) => (
                            <div key={subIndex} className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">
                                {String.fromCharCode(97 + subIndex)}.
                              </span>
                              <input
                                type="text"
                                value={subOption.text}
                                onChange={(e) => {
                                  const newOptions = [...options];
                                  newOptions[index].subOptions[subIndex] = {
                                    ...newOptions[index].subOptions[subIndex],
                                    text: e.target.value
                                  };
                                  setOptions(newOptions);
                                }}
                                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder={`サブ選択肢 ${String.fromCharCode(97 + subIndex)}`}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newOptions = [...options];
                                  newOptions[index].subOptions = newOptions[index].subOptions.filter(
                                    (_, i) => i !== subIndex
                                  );
                                  setOptions(newOptions);
                                }}
                                className="text-red-500 hover:text-red-600"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const newOptions = [...options];
                              newOptions[index].subOptions.push({
                                text: '',
                                image: null,
                                imagePreview: null
                              });
                              setOptions(newOptions);
                            }}
                            className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            サブ選択肢を追加
                          </button>
                        </div>
                      )}
                    </div>
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
                {getAvailableYears().map(y => (
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
