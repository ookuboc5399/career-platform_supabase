'use client';

import { useState } from 'react';
import { Button } from './button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { RichTextEditor } from './RichTextEditor';

interface CreateQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    question: string;
    options: string[];
    correctAnswers: number[];
    explanation: string;
    explanationImages: string[];
    explanationTable?: {
      headers: string[];
      rows: string[][];
    };
    year: string;
    category: string;
  }) => void;
}

export function CreateQuestionModal({ isOpen, onClose, onSave }: CreateQuestionModalProps) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [explanation, setExplanation] = useState('');
  const [explanationImages, setExplanationImages] = useState<string[]>([]);
  const [tableHeaders, setTableHeaders] = useState<string[]>(['']);
  const [tableRows, setTableRows] = useState<string[][]>([['']]);
  const [hasTable, setHasTable] = useState(false);
  const [year, setYear] = useState('');
  const [category, setCategory] = useState('');

  const years = [
    'H21年春', 'H21年秋', 'H22年春', 'H22年秋', 'H23年春', 'H23年秋', 'H24年春', 'H24年秋',
    'H25年春', 'H25年秋', 'H26年春', 'H26年秋', 'H27年春', 'H27年秋', 'H28年春', 'H28年秋',
    'H29年春', 'H29年秋', 'H30年春', 'H30年秋', 'H31年春', 'R1年秋', 'R2年春', 'R3年春',
    'R4年春'
  ];

  type MainCategory = 
    | '企業と法務'
    | '経営戦略'
    | 'システム戦略'
    | '開発技術'
    | 'プロジェクトマネジメント'
    | 'サービスマネジメント'
    | '基礎理論'
    | 'コンピュータシステム';

  const categories: Record<MainCategory, string[]> = {
    '企業と法務': ['企業活動', '法務'],
    '経営戦略': ['経営戦略マネジメント', '技術戦略マネジメント', 'ビジネスインダストリ'],
    'システム戦略': ['システム戦略', 'システム企画'],
    '開発技術': ['システム開発技術', 'ソフトウェア開発管理技術'],
    'プロジェクトマネジメント': ['プロジェクトマネジメント'],
    'サービスマネジメント': ['サービスマネジメント', 'システム監査'],
    '基礎理論': ['基礎理論', 'アルゴリズムとプログラミング'],
    'コンピュータシステム': ['コンピュータ構成要素', 'システム構成要素', 'ソフトウェア', 'ハードウェア']
  };

  const [mainCategory, setMainCategory] = useState<MainCategory | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      question,
      options: options.filter(opt => opt.trim() !== ''),
      correctAnswers,
      explanation,
      explanationImages,
      year,
      category,
      ...(hasTable && {
        explanationTable: {
          headers: tableHeaders.filter(h => h.trim() !== ''),
          rows: tableRows.filter(row => row.some(cell => cell.trim() !== '')),
        },
      }),
    };

    onSave(data);
    resetForm();
  };

  const resetForm = () => {
    setQuestion('');
    setOptions(['', '', '', '']);
    setCorrectAnswers([]);
    setExplanation('');
    setExplanationImages([]);
    setTableHeaders(['']);
    setTableRows([['']]);
    setHasTable(false);
    setYear('');
    setCategory('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
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
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-50">
        <DialogHeader>
          <DialogTitle>新規問題作成</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
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
                {years.map((y) => (
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
                    setMainCategory(e.target.value as MainCategory);
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
                value={question}
                onChange={setQuestion}
                placeholder="問題文を入力してください"
              />
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
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder="選択肢の内容を入力してください"
                      className="w-full p-2 border rounded bg-white"
                    />
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
            <Button type="button" variant="outline" onClick={handleClose}>
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
