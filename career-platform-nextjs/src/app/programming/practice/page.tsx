'use client';

import { useState, useEffect } from 'react';
import { ProgrammingLanguage, Exercise, ProgrammingChapter } from '@/types/api';
import Link from 'next/link';
import Editor from '@monaco-editor/react';
import DOMPurify from 'dompurify';

interface ExerciseWithContext extends Exercise {
  languageTitle: string;
  chapterTitle: string;
}

const typeLabels: Record<string, string> = {
  'language': 'プログラミング言語',
  'framework': 'フレームワーク',
  'ai-platform': 'AIプラットフォーム',
  'data-warehouse': 'データウェアハウス',
  'cloud': 'クラウド',
  'network': 'ネットワーク',
  'saas': 'SaaS',
  'others': 'その他',
};

export default function ProgrammingPracticePage() {
  const [languages, setLanguages] = useState<ProgrammingLanguage[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>('');
  const [chapters, setChapters] = useState<ProgrammingChapter[]>([]);
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [allExercises, setAllExercises] = useState<ExerciseWithContext[]>([]);
  const [currentExercise, setCurrentExercise] = useState<ExerciseWithContext | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExerciseStarted, setIsExerciseStarted] = useState(false);

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    // ジャンルが変更されたら、コース選択をリセット
    if (selectedType) {
      setSelectedLanguageId('');
      setSelectedChapterId('');
      setChapters([]);
      setAllExercises([]);
      setCurrentExercise(null);
    }
  }, [selectedType]);

  // コースが選択されたら、チャプター一覧を取得
  useEffect(() => {
    if (selectedLanguageId) {
      fetchChapters(selectedLanguageId);
    } else {
      setChapters([]);
      setSelectedChapterId('');
    }
  }, [selectedLanguageId]);

  // 自動的に問題を取得しない（ボタンを押したときに取得）
  // useEffect(() => {
  //   if (selectedType && selectedLanguageId && languages.length > 0) {
  //     fetchExercises(selectedType, selectedLanguageId, selectedChapterId || null);
  //   } else if (selectedType && !selectedLanguageId && languages.length > 0) {
  //     // 全てのコースから取得
  //     fetchExercises(selectedType, null, null);
  //   }
  // }, [selectedType, selectedLanguageId, selectedChapterId, languages]);

  const handleStartExercise = () => {
    if (!selectedType) {
      alert('ジャンルを選択してください');
      return;
    }
    
    setIsExerciseStarted(true);
    if (selectedType && selectedLanguageId && languages.length > 0) {
      fetchExercises(selectedType, selectedLanguageId, selectedChapterId || null);
    } else if (selectedType && !selectedLanguageId && languages.length > 0) {
      // 全てのコースから取得
      fetchExercises(selectedType, null, null);
    }
  };

  const fetchLanguages = async () => {
    try {
      const response = await fetch('/api/programming/languages');
      if (!response.ok) throw new Error('Failed to fetch languages');
      const data = await response.json();
      setLanguages(data);
    } catch (error) {
      setError('言語の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChapters = async (languageId: string) => {
    try {
      const response = await fetch(`/api/programming/chapters?languageId=${languageId}`);
      if (response.ok) {
        const data = await response.json();
        setChapters(data);
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  };

  const fetchExercises = async (type: string, languageId: string | null, chapterId: string | null) => {
    try {
      setIsLoading(true);
      setError(null);

      // 選択したタイプの言語を取得
      let filteredLanguages = languages.filter(lang => lang.type === type);
      
      // 特定のコースが選択されている場合、そのコースのみ
      if (languageId) {
        filteredLanguages = filteredLanguages.filter(lang => lang.id === languageId);
      }
      
      if (filteredLanguages.length === 0) {
        setAllExercises([]);
        setCurrentExercise(null);
        setIsLoading(false);
        return;
      }

      // 選択されたチャプターの情報を取得（チャプターが選択されている場合）
      let selectedChapterTitle: string | null = null;
      if (chapterId && languageId) {
        try {
          const chapterResponse = await fetch(`/api/programming/chapters/${chapterId}?languageId=${languageId}`);
          if (chapterResponse.ok) {
            const chapter = await chapterResponse.json();
            selectedChapterTitle = chapter.title;
          }
        } catch (error) {
          console.error('Error fetching selected chapter:', error);
        }
      }

      // 各言語のチャプターを取得して演習問題を集める
      const exercises: ExerciseWithContext[] = [];
      
      for (const language of filteredLanguages) {
        try {
          // チャプター学習用の問題を取得
          const chaptersResponse = await fetch(`/api/programming/chapters?languageId=${language.id}`);
          if (chaptersResponse.ok) {
            const chapters = await chaptersResponse.json();
            
            for (const chapter of chapters) {
              // チャプターが選択されている場合、そのチャプターのみ
              if (chapterId && chapter.id !== chapterId) {
                continue;
              }
              
              if (chapter.exercises && Array.isArray(chapter.exercises)) {
                for (const exercise of chapter.exercises) {
                  exercises.push({
                    ...exercise,
                    languageTitle: language.title,
                    chapterTitle: chapter.title,
                  });
                }
              }
            }
          }

          // 試験対策用の問題を取得
          // チャプターが選択されている場合、そのチャプターの問題のみ取得
          // チャプターが選択されていない場合、チャプターに紐づかない問題（chapterIdがnull）も含める
          let practiceExercisesUrl = `/api/programming/practice-exercises?languageId=${language.id}&status=published`;
          if (chapterId) {
            practiceExercisesUrl += `&chapterId=${chapterId}`;
          }
          
          const practiceExercisesResponse = await fetch(practiceExercisesUrl);
          if (practiceExercisesResponse.ok) {
            const practiceExercises = await practiceExercisesResponse.json();
            
            for (const exercise of practiceExercises) {
              // チャプターが選択されている場合、そのチャプターの問題のみ（APIでフィルタリング済みだが念のため）
              if (chapterId && exercise.chapterId !== chapterId) {
                continue;
              }
              
              // チャプター情報を取得
              let chapterTitle = '試験対策問題';
              if (exercise.chapterId) {
                const chapterResponse = await fetch(
                  `/api/programming/chapters/${exercise.chapterId}?languageId=${language.id}`
                );
                if (chapterResponse.ok) {
                  const chapter = await chapterResponse.json();
                  chapterTitle = chapter.title;
                }
              }
              
              exercises.push({
                ...exercise,
                languageTitle: language.title,
                chapterTitle: chapterTitle,
              });
            }
          }
        } catch (error) {
          console.error(`Error fetching exercises for ${language.id}:`, error);
        }
      }

      // チャプターが選択されている場合、再度フィルタリング（念のため）
      let filteredExercises = exercises;
      if (chapterId && selectedChapterTitle) {
        filteredExercises = exercises.filter(ex => {
          // 試験対策用の問題は、chapterIdで判定
          if (ex.chapterId) {
            return ex.chapterId === chapterId;
          }
          // チャプター学習用の問題は、chapterTitleで判定
          return ex.chapterTitle === selectedChapterTitle;
        });
      }
      
      setAllExercises(filteredExercises);
      
      // ランダムに問題を選択
      if (filteredExercises.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredExercises.length);
        const randomExercise = filteredExercises[randomIndex];
        setCurrentExercise(randomExercise);
        
        // コード入力形式の場合、初期コードを設定
        if ((randomExercise.type || 'code') === 'code') {
          setCode('# コードを入力してください\n');
        }
      } else {
        setCurrentExercise(null);
      }
    } catch (error) {
      setError('演習問題の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // CSV形式のデータをHTMLテーブルに変換
  const convertCsvToHtmlTable = (csvText: string): string | null => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return null; // ヘッダーと少なくとも1行のデータが必要
    
    // 最初の行がヘッダーかどうかチェック（カンマが含まれているか）
    const firstLine = lines[0];
    if (!firstLine.includes(',')) return null;
    
    // CSV形式の可能性が高い
    const rows = lines.map(line => {
      // カンマで分割（引用符内のカンマは考慮しない簡易版）
      const cells: string[] = [];
      let currentCell = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          cells.push(currentCell.trim());
          currentCell = '';
        } else {
          currentCell += char;
        }
      }
      cells.push(currentCell.trim());
      return cells;
    });
    
    if (rows.length < 2) return null;
    
    // HTMLテーブルに変換
    let html = '<table class="border-collapse border border-gray-300 w-full my-4"><thead><tr>';
    
    // ヘッダー行
    rows[0].forEach(cell => {
      html += `<th class="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left">${cell.replace(/"/g, '')}</th>`;
    });
    html += '</tr></thead><tbody>';
    
    // データ行
    for (let i = 1; i < rows.length; i++) {
      html += '<tr>';
      rows[i].forEach(cell => {
        html += `<td class="border border-gray-300 px-4 py-2 bg-white">${cell.replace(/"/g, '')}</td>`;
      });
      html += '</tr>';
    }
    
    html += '</tbody></table>';
    return html;
  };

  // コードブロック（```で囲まれた部分）をHTMLに変換
  const convertCodeBlocks = (text: string): string => {
    // ```で囲まれたコードブロックを検出
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let processedText = text;
    let hasCodeBlocks = false;
    
    processedText = processedText.replace(codeBlockRegex, (match, language, code) => {
      hasCodeBlocks = true;
      // HTMLエスケープ
      const escapedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      
      const langClass = language ? ` class="language-${language}"` : '';
      return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code${langClass}>${escapedCode}</code></pre>`;
    });
    
    // コードブロックが含まれている場合、改行を<br>に変換（コードブロック以外の部分）
    if (hasCodeBlocks) {
      // コードブロック以外の部分の改行を<br>に変換
      const parts = processedText.split(/(<pre[\s\S]*?<\/pre>)/g);
      processedText = parts.map((part, index) => {
        if (part.startsWith('<pre')) {
          return part; // コードブロックはそのまま
        } else {
          return part.replace(/\n/g, '<br>');
        }
      }).join('');
    }
    
    return processedText;
  };

  // 解説がHTMLテーブルを含むかどうかを判定
  const renderExplanation = (explanation: string) => {
    if (!explanation) return null;
    
    // コードブロックを変換
    let processedExplanation = convertCodeBlocks(explanation);
    
    // HTMLテーブルタグが含まれているかチェック
    const hasTable = /<table[\s>]|<tbody|<tr|<td|<th/i.test(processedExplanation);
    
    if (hasTable) {
      // HTMLテーブルの場合はサニタイズしてHTMLとしてレンダリング
      // テーブル内のセルに白背景を追加
      let processedHtml = processedExplanation;
      // <td>タグにbg-whiteクラスを追加（既にclass属性がある場合とない場合の両方に対応）
      processedHtml = processedHtml.replace(/<td([^>]*)>/gi, (match, attrs) => {
        if (attrs.includes('class=')) {
          // 既にclass属性がある場合、bg-whiteを追加
          return match.replace(/class="([^"]*)"/, 'class="$1 bg-white"');
        } else {
          // class属性がない場合、追加
          return `<td class="bg-white"${attrs}>`;
        }
      });
      // <th>タグにも白背景を追加（必要に応じて）
      processedHtml = processedHtml.replace(/<th([^>]*)>/gi, (match, attrs) => {
        if (attrs.includes('class=')) {
          return match.replace(/class="([^"]*)"/, 'class="$1 bg-white"');
        } else {
          return `<th class="bg-white"${attrs}>`;
        }
      });
      
      const sanitizedHtml = DOMPurify.sanitize(processedHtml, {
        ALLOWED_TAGS: ['table', 'tbody', 'thead', 'tr', 'td', 'th', 'p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'code'],
        ALLOWED_ATTR: ['colspan', 'rowspan', 'style', 'class'],
      });
      return (
        <div 
          className="text-sm text-gray-700 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      );
    }
    
    // CSV形式のデータをチェック
    const csvTable = convertCsvToHtmlTable(processedExplanation);
    if (csvTable) {
      const sanitizedHtml = DOMPurify.sanitize(csvTable, {
        ALLOWED_TAGS: ['table', 'tbody', 'thead', 'tr', 'td', 'th', 'pre', 'code'],
        ALLOWED_ATTR: ['class'],
      });
      return (
        <div 
          className="text-sm text-gray-700 prose prose-sm max-w-none overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      );
    }
    
    // コードブロックが含まれているかチェック
    const hasCodeBlocks = /<pre[\s>]|<code/i.test(processedExplanation);
    if (hasCodeBlocks) {
      const sanitizedHtml = DOMPurify.sanitize(processedExplanation, {
        ALLOWED_TAGS: ['pre', 'code', 'p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        ALLOWED_ATTR: ['class'],
      });
      return (
        <div 
          className="text-sm text-gray-700 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      );
    }
    
    // 通常のテキストの場合は従来通り表示
    return (
      <p className="text-sm text-gray-700 whitespace-pre-wrap">{explanation}</p>
    );
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    setSelectedAnswers(prev => {
      if (prev.includes(answerIndex)) {
        return prev.filter(idx => idx !== answerIndex);
      } else {
        return [...prev, answerIndex];
      }
    });
  };

  const handleSubmit = () => {
    if (!currentExercise) return;

    const exerciseType = currentExercise.type || 'code';
    
    if (exerciseType === 'multiple-choice') {
      // 4択問題の場合
      if (selectedAnswers.length === 0) return;
      const correctAnswers = Array.isArray(currentExercise.correctAnswer) 
        ? currentExercise.correctAnswer 
        : (currentExercise.correctAnswer !== undefined ? [currentExercise.correctAnswer] : []);
      const isAnswerCorrect = correctAnswers.length === selectedAnswers.length && 
        correctAnswers.every(ans => selectedAnswers.includes(ans)) &&
        selectedAnswers.every(ans => correctAnswers.includes(ans));
      setIsCorrect(isAnswerCorrect);
      setIsAnswered(true);
    } else {
      // コード入力形式の場合、実行は別のボタンで行う
      return;
    }
  };

  const runCode = async () => {
    if (!currentExercise || (currentExercise.type || 'code') !== 'code') return;
    
    setIsRunning(true);
    try {
      const response = await fetch('/api/code/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language: 'python',
          testCases: currentExercise.testCases || []
        }),
      });
      const data = await response.json();
      const outputLines = data.output.split('\n');
      const actualOutputs = outputLines
        .filter((line: string) => line.includes('実際の出力:'))
        .map((line: string) => line.split('実際の出力:')[1].trim())
        .join('\n');
      setOutput(actualOutputs || '実行エラーが発生しました');
      
      // テストケースが全て正しいかチェック
      const testResults = outputLines.filter((line: string) => line.includes('テスト結果:'));
      const allPassed = testResults.every((line: string) => line.includes('✓') || line.includes('PASS'));
      const isAnswerCorrect = allPassed && testResults.length === (currentExercise.testCases?.length || 0);
      setIsCorrect(isAnswerCorrect);
      setIsAnswered(true);
    } catch (error) {
      console.error('Error running code:', error);
      setOutput('実行エラーが発生しました');
      setIsCorrect(false);
      setIsAnswered(true);
    } finally {
      setIsRunning(false);
    }
  };

  const handleNext = () => {
    if (allExercises.length === 0) return;

    const randomIndex = Math.floor(Math.random() * allExercises.length);
    const randomExercise = allExercises[randomIndex];
    setCurrentExercise(randomExercise);
    
    // リセット
                    setSelectedAnswers([]);
    setIsAnswered(false);
    setIsCorrect(false);
    setOutput('');
    
    // コード入力形式の場合、初期コードを設定
    if ((randomExercise.type || 'code') === 'code') {
      setCode('# コードを入力してください\n');
    }
  };

  const filteredLanguages = selectedType
    ? languages.filter(lang => lang.type === selectedType)
    : [];

  if (isLoading && languages.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error && languages.length === 0) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/programming"
            className="text-blue-600 hover:text-blue-800 mb-2 inline-block"
          >
            ← プログラミング学習一覧に戻る
          </Link>
          <h1 className="text-2xl font-bold">ランダム問題演習</h1>
        </div>

        {/* ジャンルとコース選択 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ジャンル
              </label>
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setSelectedLanguageId('');
                  setSelectedChapterId('');
                  setChapters([]);
                  setCurrentExercise(null);
                  setAllExercises([]);
                    setSelectedAnswers([]);
                  setIsAnswered(false);
                  setIsCorrect(false);
                  setIsExerciseStarted(false);
                  setCode('');
                  setOutput('');
                }}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">ジャンルを選択してください</option>
                <option value="language">プログラミング言語</option>
                <option value="framework">フレームワーク</option>
                <option value="ai-platform">AIプラットフォーム</option>
                <option value="data-warehouse">データウェアハウス</option>
                <option value="cloud">クラウド</option>
                <option value="network">ネットワーク</option>
                <option value="saas">SaaS</option>
                <option value="others">その他</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                コース
              </label>
              <select
                value={selectedLanguageId}
                onChange={(e) => {
                  setSelectedLanguageId(e.target.value);
                  setSelectedChapterId('');
                  setCurrentExercise(null);
                  setAllExercises([]);
                    setSelectedAnswers([]);
                  setIsAnswered(false);
                  setIsCorrect(false);
                  setIsExerciseStarted(false);
                  setCode('');
                  setOutput('');
                }}
                disabled={!selectedType}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">全てのコース</option>
                {filteredLanguages.map((language) => (
                  <option key={language.id} value={language.id}>
                    {language.title}
                  </option>
                ))}
              </select>
            </div>

            {selectedLanguageId && chapters.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  チャプター（任意）
                </label>
                <select
                  value={selectedChapterId}
                  onChange={(e) => {
                    setSelectedChapterId(e.target.value);
                    setCurrentExercise(null);
                    setAllExercises([]);
                    setSelectedAnswers([]);
                    setIsAnswered(false);
                    setIsCorrect(false);
                    setIsExerciseStarted(false);
                    setCode('');
                    setOutput('');
                  }}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">全てのチャプター</option>
                  {chapters.map((chapter) => (
                    <option key={chapter.id} value={chapter.id}>
                      {chapter.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          {/* 問題を解くボタン */}
          <div className="mt-4">
            <button
              onClick={handleStartExercise}
              disabled={!selectedType || isLoading}
              className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
                !selectedType || isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? '読み込み中...' : '問題を解く'}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : !selectedType ? (
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <p className="text-gray-600">ジャンルを選択してください</p>
          </div>
        ) : !isExerciseStarted ? (
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <p className="text-gray-600">「問題を解く」ボタンを押して問題を開始してください</p>
          </div>
        ) : currentExercise ? (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="mb-4">
              <span className="text-sm text-gray-500">
                {currentExercise.languageTitle} / {currentExercise.chapterTitle}
              </span>
            </div>
            <h2 className="text-lg font-semibold mb-2">{currentExercise.title}</h2>
            <p className="text-gray-700 mb-6">{currentExercise.description}</p>

            {(currentExercise.type || 'code') === 'multiple-choice' ? (
              // 4択問題
              <>
                <div className="space-y-3 mb-6">
                  {currentExercise.choices?.map((choice, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-4 text-left rounded-lg border transition-colors ${
                        selectedAnswers.includes(index)
                          ? isAnswered
                            ? (() => {
                                const correctAnswers = Array.isArray(currentExercise.correctAnswer) 
                                  ? currentExercise.correctAnswer 
                                  : (currentExercise.correctAnswer !== undefined ? [currentExercise.correctAnswer] : []);
                                return correctAnswers.includes(index)
                                  ? 'bg-green-100 border-green-500'
                                  : 'bg-red-100 border-red-500';
                              })()
                            : 'bg-blue-100 border-blue-500'
                          : isAnswered && (() => {
                              const correctAnswers = Array.isArray(currentExercise.correctAnswer) 
                                ? currentExercise.correctAnswer 
                                : (currentExercise.correctAnswer !== undefined ? [currentExercise.correctAnswer] : []);
                              return correctAnswers.includes(index);
                            })()
                          ? 'bg-green-100 border-green-500'
                          : 'hover:bg-gray-50 border-gray-200'
                      }`}
                      disabled={isAnswered}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          selectedAnswers.includes(index)
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-400'
                        }`}>
                          {selectedAnswers.includes(index) && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span>{String.fromCharCode(65 + index)}. {choice}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {!isAnswered ? (
                  <button
                    onClick={handleSubmit}
                    disabled={selectedAnswers.length === 0}
                    className={`px-6 py-2 rounded ${
                      selectedAnswers.length === 0
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    回答する
                  </button>
                ) : (
                  <div>
                    <div
                      className={`p-4 rounded-lg mb-4 ${
                        isCorrect ? 'bg-green-100' : 'bg-red-100'
                      }`}
                    >
                      <h3 className="font-bold mb-2">
                        {isCorrect ? '正解！' : (() => {
                          const correctAnswers = Array.isArray(currentExercise.correctAnswer) 
                            ? currentExercise.correctAnswer 
                            : (currentExercise.correctAnswer !== undefined ? [currentExercise.correctAnswer] : []);
                          return `不正解... 正解は ${correctAnswers.map(ans => String.fromCharCode(65 + ans)).join(', ')} です。`;
                        })()}
                      </h3>
                      {currentExercise.explanation && renderExplanation(currentExercise.explanation)}
                    </div>
                    <button
                      onClick={handleNext}
                      className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      次の問題へ
                    </button>
                  </div>
                )}
              </>
            ) : (
              // コード入力形式
              <>
                <div className="mb-4">
                  {currentExercise.testCases && currentExercise.testCases.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">期待される出力:</h3>
                      {currentExercise.testCases.map((testCase, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          入力: {testCase.input}<br />
                          期待される出力: {testCase.expectedOutput}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-900 rounded-lg">
                    <div className="p-4 border-b border-gray-700">
                      <h3 className="text-lg font-semibold text-white">コードエディタ</h3>
                    </div>
                    <div className="h-[400px]">
                      <Editor
                        height="100%"
                        defaultLanguage="python"
                        value={code}
                        onChange={(value: string | undefined) => setCode(value || '')}
                        theme="vs-dark"
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border">
                    <div className="p-4 border-b">
                      <h3 className="text-lg font-semibold">実行結果</h3>
                    </div>
                    <div className="p-4">
                      <div className="bg-gray-900 text-white p-4 rounded-lg h-[400px] font-mono overflow-auto">
                        {output || '実行結果がここに表示されます'}
                      </div>
                    </div>
                  </div>
                </div>

                {!isAnswered ? (
                  <button
                    onClick={runCode}
                    disabled={isRunning}
                    className={`px-6 py-2 rounded ${
                      isRunning
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isRunning ? '実行中...' : 'コードを実行'}
                  </button>
                ) : (
                  <div>
                    <div
                      className={`p-4 rounded-lg mb-4 ${
                        isCorrect ? 'bg-green-100' : 'bg-yellow-100'
                      }`}
                    >
                      <h3 className="font-bold mb-2">
                        {isCorrect ? '正解！' : 'もう一度確認してみましょう'}
                      </h3>
                      {currentExercise.explanation && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700 mb-1">解説:</p>
                          {renderExplanation(currentExercise.explanation)}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleNext}
                      className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      次の問題へ
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : isExerciseStarted && selectedType && allExercises.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <p className="text-gray-600">選択したジャンル・コースに問題が登録されていません。</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

