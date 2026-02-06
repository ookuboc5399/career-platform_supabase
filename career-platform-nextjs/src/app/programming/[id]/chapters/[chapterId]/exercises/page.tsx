'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProgrammingChapter } from '@/types/api';
import Editor from '@monaco-editor/react';
import DOMPurify from 'dompurify';

export default function ExercisesPage() {
  const params = useParams();
  const [chapter, setChapter] = useState<ProgrammingChapter | null>(null);
  const [nextChapter, setNextChapter] = useState<ProgrammingChapter | null>(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCodeCorrect, setIsCodeCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 現在のチャプターを取得
        const response = await fetch(`/api/programming/chapters/${params.chapterId}?languageId=${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch chapter');
        const data = await response.json();
        setChapter(data);
        if (data.exercises?.[0]) {
          const firstExercise = data.exercises[0];
          if ((firstExercise.type || 'code') === 'code') {
            setCode('# コードを入力してください\n');
          }
        }

        // 次のチャプターを取得
        const chaptersResponse = await fetch(`/api/programming/chapters?languageId=${params.id}`);
        if (chaptersResponse.ok) {
          const chapters = await chaptersResponse.json();
          const currentIndex = chapters.findIndex((c: ProgrammingChapter) => c.id === params.chapterId);
          if (currentIndex !== -1 && currentIndex < chapters.length - 1) {
            setNextChapter(chapters[currentIndex + 1]);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [params.chapterId, params.id]);

  const runCode = async () => {
    if (!chapter?.exercises?.[currentExercise]) return;
    const exercise = chapter.exercises[currentExercise];
    
    if ((exercise.type || 'code') === 'multiple-choice') {
      // 4択問題の場合
      setShowResult(true);
      return;
    }
    
    // コード入力形式の場合
    setIsRunning(true);
    try {
      const response = await fetch('/api/code/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language: 'python',
          testCases: exercise.testCases || []
        }),
      });
      const data = await response.json();
      // 実行結果から実際の出力のみを抽出
      const outputLines = data.output.split('\n');
      const actualOutputs = outputLines
        .filter((line: string) => line.includes('実際の出力:'))
        .map((line: string) => line.split('実際の出力:')[1].trim())
        .join('\n');
      setOutput(actualOutputs || '実行エラーが発生しました');
      
      // テストケースが全て正しいかチェック
      const testResults = outputLines.filter((line: string) => line.includes('テスト結果:'));
      const allPassed = testResults.every((line: string) => line.includes('✓') || line.includes('PASS'));
      setIsCodeCorrect(allPassed && testResults.length === (exercise.testCases?.length || 0));
    } catch (error) {
      console.error('Error running code:', error);
      setOutput('実行エラーが発生しました');
    } finally {
      setIsRunning(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers(prev => {
      if (prev.includes(answerIndex)) {
        return prev.filter(idx => idx !== answerIndex);
      } else {
        return [...prev, answerIndex];
      }
    });
    setShowResult(false);
  };

  if (!chapter || !chapter.exercises?.[currentExercise]) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const exercise = chapter.exercises[currentExercise];
  const exerciseType = exercise.type || 'code';
  const isMultipleChoice = exerciseType === 'multiple-choice';

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">演習問題: {exercise.title}</h1>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-2">問題</h2>
          <p className="text-gray-700 mb-4">{exercise.description}</p>
          {!isMultipleChoice && exercise.testCases && exercise.testCases.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">期待される出力:</h3>
              {exercise.testCases.map((testCase, index) => (
                <div key={index} className="text-sm text-gray-600">
                  入力: {testCase.input}<br />
                  期待される出力: {testCase.expectedOutput}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isMultipleChoice ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">選択肢</h2>
          <div className="space-y-3">
            {exercise.choices?.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                  selectedAnswers.includes(index)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                    selectedAnswers.includes(index)
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-400'
                  }`}>
                    {selectedAnswers.includes(index) && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="font-medium">{String.fromCharCode(65 + index)}. {choice}</span>
                </div>
              </button>
            ))}
          </div>
          {showResult && selectedAnswers.length > 0 && (() => {
            const correctAnswers = Array.isArray(exercise.correctAnswer) 
              ? exercise.correctAnswer 
              : (exercise.correctAnswer !== undefined ? [exercise.correctAnswer] : []);
            const isCorrect = correctAnswers.length === selectedAnswers.length && 
              correctAnswers.every(ans => selectedAnswers.includes(ans)) &&
              selectedAnswers.every(ans => correctAnswers.includes(ans));
            return (
              <div className={`mt-6 p-4 rounded-lg ${
                isCorrect
                  ? 'bg-green-100 border-2 border-green-500'
                  : 'bg-red-100 border-2 border-red-500'
              }`}>
                <p className={`font-semibold mb-2 ${
                  isCorrect ? 'text-green-800' : 'text-red-800'
                }`}>
                  {isCorrect
                    ? '✓ 正解です！'
                    : `✗ 不正解です。正解は ${correctAnswers.map(ans => String.fromCharCode(65 + ans)).join(', ')} です。`}
                </p>
                {exercise.explanation && (
                  <div className={`mt-3 p-3 rounded ${
                    isCorrect
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <p className="text-sm font-medium mb-1 text-gray-700">解説:</p>
                    {renderExplanation(exercise.explanation || '')}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">コードエディタ</h2>
            </div>
            <div className="h-[500px]">
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

          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">実行結果</h2>
            </div>
            <div className="p-4">
              <div className="bg-gray-900 text-white p-4 rounded-lg h-[400px] font-mono overflow-auto mb-4">
                {output || '実行結果がここに表示されます'}
              </div>
              {isCodeCorrect !== null && exercise.explanation && (
                <div className={`p-4 rounded-lg border-2 ${
                  isCodeCorrect
                    ? 'bg-green-100 border-green-500'
                    : 'bg-yellow-100 border-yellow-500'
                }`}>
                  <p className="text-sm font-medium mb-1 text-gray-700">解説:</p>
                  {renderExplanation(exercise.explanation || '')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-between items-center">
        <Link
          href={`/programming/${params.id}/chapters/${params.chapterId}`}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          動画に戻る
        </Link>
        <div className="space-x-4">
          {isMultipleChoice ? (
            <button
              onClick={runCode}
              disabled={selectedAnswers.length === 0}
              className={`px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                selectedAnswer === null ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              回答を確認
            </button>
          ) : (
            <button
              onClick={runCode}
              disabled={isRunning}
              className={`px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                isRunning ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isRunning ? '実行中...' : 'コードを実行'}
            </button>
          )}
          {currentExercise < (chapter?.exercises?.length || 0) - 1 ? (
            <button
              onClick={() => {
                setCurrentExercise(currentExercise + 1);
                const nextExercise = chapter?.exercises?.[currentExercise + 1];
                if ((nextExercise?.type || 'code') === 'code') {
                  setCode('# コードを入力してください\n');
                }
                setOutput('');
                setSelectedAnswer(null);
                setShowResult(false);
                setIsCodeCorrect(null);
              }}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              次の問題へ
            </button>
          ) : nextChapter && (
            <Link
              href={`/programming/${params.id}/chapters/${nextChapter.id}`}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 inline-flex items-center"
            >
              次のチャプターへ
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
