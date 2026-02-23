'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from './button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { RichTextEditor } from './RichTextEditor';
import Image from 'next/image';

interface Option {
  text: string;
  imageUrl: string | null;
}

interface Question {
  id: string;
  certificationId: string;
  questionNumber: number;
  question: string;
  questionImage: string | null;
  options: Option[];
  correctAnswers: number[];
  explanation: string;
  explanationImages: string[];
  explanationTable?: {
    headers: string[];
    rows: string[][];
  };
  year: string;
  category: string;
  mainCategory: string;
}

type CategoryMap = {
  [key: string]: string[];
};

interface EditQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Question) => void;
  question: Question;
}

export function EditQuestionModal({ isOpen, onClose, onSave, question }: EditQuestionModalProps) {
  const [questionNumber, setQuestionNumber] = useState<number | ''>(question.questionNumber || '');
  const [questionText, setQuestionText] = useState(question.question);
  const [questionImage, setQuestionImage] = useState<string | null>(question.questionImage);
  const [options, setOptions] = useState<Option[]>(
    Array.isArray(question.options) 
      ? question.options.map(opt => 
          typeof opt === 'string' 
            ? { text: opt, imageUrl: null }
            : opt
        )
      : []
  );
  const [correctAnswers, setCorrectAnswers] = useState<number[]>(question.correctAnswers);
  const [explanation, setExplanation] = useState(question.explanation);
  const [explanationImages, setExplanationImages] = useState<string[]>(question.explanationImages);
  const [tableHeaders, setTableHeaders] = useState<string[]>(
    question.explanationTable?.headers || ['']
  );
  const [tableRows, setTableRows] = useState<string[][]>(
    question.explanationTable?.rows || [['']]
  );
  const [hasTable, setHasTable] = useState(!!question.explanationTable);
  const [year, setYear] = useState(question.year || '');
  const [category, setCategory] = useState(question.category || '');

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

    switch (question.certificationId) {
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
  }, [question.certificationId]);

  const getAvailableCategories = (): CategoryMap => {
    if (question.certificationId === '7') { // ITパスポート
      return {
        'ストラテジ系': ['企業と法務', '経営戦略', 'システム戦略'],
        'マネジメント系': ['開発技術', 'プロジェクトマネジメント', 'サービスマネジメント'],
        'テクノロジ系': ['基礎理論', 'コンピュータシステム', '技術要素']
      };
    } else if (question.certificationId === 'e29446b8-60d1-4336-a057-0d0b2269895c') { // AWS
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
    } else if (question.certificationId === '9') { // 基本情報
      return {
        '科目A': ['基礎理論'],
        '科目B': ['基礎理論']
      };
    } else if (question.certificationId === '10') { // 情報セキュリティマネジメント
      return {
        '科目A': ['基礎理論'],
        '科目B': ['基礎理論']
      };
    }else if (question.certificationId === '11') { // 応用情報
        return {
          'テクノロジ': ['基礎理論', 'コンピュータシステム', 'データベース'],
          'マネジメント': ['プロジェクトマネジメント', 'サービスマネジメント'],
          'ストラテジ': ['システム戦略', 'システム企画', '経営戦略']
        };
      }else if (question.certificationId === '12') { // 宅建士
        return {
          '過去問': ['基礎'],
              '宅建業法': ['免許', '宅地建物取引士', '営業保証金', '保証協会'],
              '権利関係': ['制限行為能力者', '意思表示', '代理'],
              '法令上の制限': [' 都市計画法', '建築基準法'],
              '税': ['不動産に関する税金', '不動産鑑定評価基準'],
        };
    } else if (question.certificationId === '14') { // Python3
      return {
        '基礎': ['基礎','リスト', '関数', 'モジュール','ライブラリ'],
      };
    } else {
      return {
        'システム戦略': ['システム戦略', 'システム企画'],
        '開発技術': ['システム開発技術', 'ソフトウェア開発管理技術'],
        'プロジェクトマネジメント': ['プロジェクトマネジメント'],
        'サービスマネジメント': ['サービスマネジメント', 'システム監査'],
        '基礎理論': ['基礎理論', 'アルゴリズムとプログラミング'],
        'コンピュータシステム': ['コンピュータ構成要素', 'システム構成要素', 'ソフトウェア', 'ハードウェア']
      };
    }
  };

  const [categories] = useState<CategoryMap>(getAvailableCategories());
  const [mainCategory, setMainCategory] = useState<string>(
    Object.keys(categories).find(key => 
      categories[key].includes(question.category)
    ) || ''
  );

  useEffect(() => {
    setQuestionNumber(question.questionNumber || '');
    setQuestionText(question.question);
    setQuestionImage(question.questionImage);
    setOptions(
      Array.isArray(question.options)
        ? question.options.map(opt =>
            typeof opt === 'string'
              ? { text: opt, imageUrl: null }
              : opt
          )
        : []
    );
    setCorrectAnswers(question.correctAnswers);
    setExplanation(question.explanation);
    setExplanationImages(question.explanationImages);
    setTableHeaders(question.explanationTable?.headers || ['']);
    setTableRows(question.explanationTable?.rows || [['']]);
    setHasTable(!!question.explanationTable);
    setYear(question.year || '');
    setCategory(question.category || '');
  }, [question]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ...question,
      questionNumber: typeof questionNumber === 'number' ? questionNumber : undefined,
      question: questionText,
      questionImage,
      options: options.filter(opt => opt.text.trim() !== ''),
      correctAnswers,
      explanation,
      explanationImages,
      year,
      category,
      mainCategory,
      certificationId: question.certificationId,
      ...(hasTable && {
        explanationTable: {
          headers: tableHeaders.filter(h => h.trim() !== ''),
          rows: tableRows.filter(row => row.some(cell => cell.trim() !== '')),
        },
      }),
    };

    onSave(data);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], text: value };
    setOptions(newOptions);
  };

  const handleOptionImageChange = async (index: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'question-option-image');
    try {
      console.log('Uploading option image:', file.name);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Upload error response:', errorData);
        throw new Error(`Failed to upload option image: ${errorData.error || 'Unknown error'}`);
      }
      if (!response.ok) throw new Error('Failed to upload image');
      const data = await response.json();
      const newOptions = [...options];
      newOptions[index] = { ...newOptions[index], imageUrl: data.url };
      setOptions(newOptions);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('画像のアップロードに失敗しました');
    }
  };

  const toggleCorrectAnswer = (index: number) => {
    setCorrectAnswers(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const addTableRow = () => {
    setTableRows(prev => [...prev, Array(tableHeaders.length).fill('')]);
  };

  const addTableColumn = () => {
    setTableHeaders(prev => [...prev, '']);
    setTableRows(prev => prev.map(row => [...row, '']));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-50">
        <DialogHeader>
          <DialogTitle>問題の編集</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">問題番号（任意）</label>
            <input
              type="number"
              min={1}
              value={questionNumber}
              onChange={(e) => {
                const val = e.target.value;
                setQuestionNumber(val === '' ? '' : Number(val));
              }}
              className="w-full p-2 border rounded"
              placeholder="例: 15（問15として保存）"
            />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                出題年度
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">選択してください</option>
                {getAvailableYears().map((y: string) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  メインカテゴリー
                </label>
                <select
                  value={mainCategory}
                  onChange={(e) => {
                    setMainCategory(e.target.value);
                    setCategory(''); // サブカテゴリーをリセット
                  }}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">選択してください</option>
                  {Object.keys(categories).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  サブカテゴリー
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                  disabled={!mainCategory}
                >
                  <option value="">選択してください</option>
                  {mainCategory && categories[mainCategory].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <label className="block text-lg font-medium mb-3 text-gray-900">
              問題文
            </label>
            <div className="min-h-[200px]">
              <RichTextEditor
                value={questionText}
                onChange={setQuestionText}
                placeholder="問題文を入力してください"
              />
            </div>
            {/* 問題画像 */}
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                問題画像（任意）
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('type', 'certification-image');
                    try {
                      console.log('Uploading question image:', file.name);
                      const response = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData,
                      });
                      if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Upload error response:', errorData);
                        throw new Error(`Failed to upload question image: ${errorData.error || 'Unknown error'}`);
                      }
                      if (!response.ok) throw new Error('Failed to upload image');
                      const data = await response.json();
                      setQuestionImage(data.url);
                    } catch (error) {
                      console.error('Error uploading image:', error);
                      alert('画像のアップロードに失敗しました');
                    }
                  }
                }}
                className="w-full"
              />
              {questionImage && (
                <div className="mt-2">
                  <Image
                    src={questionImage}
                    alt="問題画像"
                    width={200}
                    height={200}
                    className="rounded-md"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <label className="block text-lg font-medium mb-3 text-gray-900">
              選択肢
            </label>
            <div className="space-y-4">
              {options.map((option, index) => (
                <div key={index} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
                  <div className="pt-1">
                    <input
                      type="checkbox"
                      checked={correctAnswers.includes(index)}
                      onChange={() => toggleCorrectAnswer(index)}
                      className="w-5 h-5"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      選択肢 {index + 1}
                    </div>
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder="選択肢の内容を入力してください"
                      className="w-full p-2 border rounded bg-white"
                    />
                    {/* 選択肢の画像 */}
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleOptionImageChange(index, file);
                          }
                        }}
                        className="w-full"
                      />
                      {option.imageUrl && (
                        <div className="mt-2">
                          <Image
                            src={option.imageUrl}
                            alt={`選択肢${index + 1}の画像`}
                            width={200}
                            height={200}
                            className="rounded-md"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <label className="block text-lg font-medium mb-3 text-gray-900">
              解説
            </label>
            <div className="min-h-[150px]">
              <RichTextEditor
                value={explanation}
                onChange={setExplanation}
                placeholder="解説を入力してください"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={hasTable}
                onChange={(e) => setHasTable(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">解説用の表を追加</span>
            </label>

            {hasTable && (
              <div className="border rounded p-4 space-y-4">
                <div className="flex gap-2 overflow-x-auto">
                  {tableHeaders.map((header, colIndex) => (
                    <input
                      key={colIndex}
                      type="text"
                      value={header}
                      onChange={(e) => {
                        const newHeaders = [...tableHeaders];
                        newHeaders[colIndex] = e.target.value;
                        setTableHeaders(newHeaders);
                      }}
                      placeholder={`列${colIndex + 1}`}
                      className="p-2 border rounded min-w-[150px]"
                    />
                  ))}
                </div>

                <div className="space-y-2">
                  {tableRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-2 overflow-x-auto">
                      {row.map((cell, colIndex) => (
                        <input
                          key={colIndex}
                          type="text"
                          value={cell}
                          onChange={(e) => {
                            const newRows = [...tableRows];
                            newRows[rowIndex][colIndex] = e.target.value;
                            setTableRows(newRows);
                          }}
                          placeholder={`セル${rowIndex + 1}-${colIndex + 1}`}
                          className="p-2 border rounded min-w-[150px]"
                        />
                      ))}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={addTableColumn}
                    variant="outline"
                  >
                    列を追加
                  </Button>
                  <Button
                    type="button"
                    onClick={addTableRow}
                    variant="outline"
                  >
                    行を追加
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit">
              保存
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
