'use client';

import { useState, useEffect, use } from 'react';
import { Certification, CertificationChapter, CertificationQuestion } from '@/types/api';
import { getCertification, updateCertification, uploadFile } from '@/lib/api';
import Link from 'next/link';

interface Props {
  params: {
    id: string;
  };
}

export default function AdminCertificationChaptersPage({ params }: Props) {
  const [certification, setCertification] = useState<Certification | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<CertificationChapter, 'id' | 'certificationId' | 'createdAt' | 'updatedAt'>>({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    duration: '',
    order: 1,
    status: 'draft',
    content: '',
    questions: [],
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const resolvedParams = use(Promise.resolve(params));
  const certificationId = resolvedParams.id;

  useEffect(() => {
    fetchCertification();
  }, []);

  const fetchCertification = async () => {
    try {
      const data = await getCertification(certificationId);
      setCertification(data);
    } catch (error) {
      setError('Failed to fetch certification');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certification) return;

    try {
      // ファイルのアップロード
      let videoUrl = formData.videoUrl;
      let thumbnailUrl = formData.thumbnailUrl;

      if (videoFile) {
        videoUrl = await uploadFile(videoFile, 'video');
      }
      if (thumbnailFile) {
        thumbnailUrl = await uploadFile(thumbnailFile, 'image');
      }

      const response = await fetch(`/api/certifications/${certificationId}/chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          videoUrl,
          thumbnailUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create chapter');
      }
      await fetchCertification();
      setIsModalOpen(false);
      setFormData({
        title: '',
        description: '',
        videoUrl: '',
        thumbnailUrl: '',
        duration: '',
        order: (certification.chapters?.length || 0) + 1,
        status: 'draft',
        content: '',
        questions: [],
      });
      setVideoFile(null);
      setThumbnailFile(null);
    } catch (error) {
      setError('Failed to create chapter');
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!certification || !window.confirm('本当に削除しますか？')) return;

    try {
      const response = await fetch(
        `/api/certifications/${certificationId}/chapters/${chapterId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete chapter');
      }
      await fetchCertification();
    } catch (error) {
      setError('Failed to delete chapter');
    }
  };

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          id: crypto.randomUUID(),
          question: '',
          type: 'text',
          choices: [
            { id: '1', text: '', type: 'text' },
            { id: '2', text: '', type: 'text' },
            { id: '3', text: '', type: 'text' },
            { id: '4', text: '', type: 'text' },
          ],
          correctAnswer: 0,
          explanation: '',
          explanationType: 'text',
        },
      ],
    });
  };

  if (error) {
    return <div className="text-red-500 text-center text-lg font-medium p-4">{error}</div>;
  }

  if (isLoading || !certification) {
    return <div className="text-center text-lg font-medium p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-lg">
          <div>
            <Link
              href="/admin/certifications"
              className="text-blue-600 hover:text-blue-800 mb-4 inline-block font-medium"
            >
              ← 資格・検定一覧に戻る
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{certification.name} - チャプター管理</h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md"
          >
            チャプターを追加
          </button>
        </div>

        <div className="space-y-8">
          {certification.chapters?.map((chapter) => (
            <div
              key={chapter.id}
              className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-8 hover:border-blue-500 transition-colors duration-200"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Chapter {chapter.order}: {chapter.title}</h3>
                  <p className="text-gray-600 text-lg">{chapter.description}</p>
                </div>
                <button
                  onClick={() => handleDeleteChapter(chapter.id)}
                  className="text-red-600 hover:text-red-800 px-4 py-2 rounded hover:bg-red-50 transition-colors duration-200 font-medium"
                >
                  削除
                </button>
              </div>

              <div className="mt-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">問題一覧</h4>
                <div className="space-y-6">
                  {chapter.questions.map((question, index) => (
                    <div key={question.id} className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
                      <h5 className="text-lg font-bold text-gray-900 mb-3">問題 {index + 1}</h5>
                      <p className="text-gray-800">{question.question}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">チャプターの追加</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    タイトル
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    説明
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    動画
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) =>
                      setVideoFile(e.target.files ? e.target.files[0] : null)
                    }
                    className="block w-full text-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    サムネイル
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setThumbnailFile(e.target.files ? e.target.files[0] : null)
                    }
                    className="block w-full text-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    動画の長さ
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
                    placeholder="例: 10:30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    順番
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) })
                    }
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    コンテンツ
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
                    rows={5}
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-lg font-medium text-gray-900">
                      問題
                    </label>
                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 font-medium"
                    >
                      + 問題を追加
                    </button>
                  </div>
                  <div className="space-y-8">
                    {formData.questions.map((question, questionIndex) => (
                      <div key={question.id} className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
                        <h4 className="text-lg font-bold text-gray-900 mb-4">問題 {questionIndex + 1}</h4>
                        <div className="space-y-6">
                          <div>
                            <div className="flex items-center space-x-4 mb-4">
                              <label className="block text-sm font-medium text-gray-700">
                                問題文
                              </label>
                              <select
                                value={question.type || 'text'}
                                onChange={(e) => {
                                  const newQuestions = [...formData.questions];
                                  newQuestions[questionIndex].type = e.target.value as 'text' | 'image';
                                  setFormData({ ...formData, questions: newQuestions });
                                }}
                                className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              >
                                <option value="text">テキスト</option>
                                <option value="image">画像</option>
                              </select>
                            </div>
                            {question.type === 'image' ? (
                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    const imageUrl = await uploadFile(e.target.files[0], 'image');
                                    const newQuestions = [...formData.questions];
                                    newQuestions[questionIndex].imageUrl = imageUrl;
                                    setFormData({ ...formData, questions: newQuestions });
                                  }
                                }}
                                className="block w-full text-lg"
                                required
                              />
                            ) : (
                              <textarea
                                value={question.question}
                                onChange={(e) => {
                                  const newQuestions = [...formData.questions];
                                  newQuestions[questionIndex].question = e.target.value;
                                  setFormData({ ...formData, questions: newQuestions });
                                }}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
                                rows={2}
                                required
                              />
                            )}
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-4">
                              <label className="block text-sm font-medium text-gray-700">
                                選択肢
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  const newQuestions = [...formData.questions];
                                  newQuestions[questionIndex].choices.push({
                                    id: crypto.randomUUID(),
                                    text: '',
                                    type: 'text',
                                  });
                                  setFormData({ ...formData, questions: newQuestions });
                                }}
                                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 font-medium"
                              >
                                + 選択肢を追加
                              </button>
                            </div>
                            <div className="space-y-4">
                              {question.choices.map((choice, choiceIndex) => (
                                <div key={choice.id} className="flex items-start space-x-4 bg-white p-4 rounded-lg border border-gray-200">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-4 mb-4">
                                      <select
                                        value={choice.type}
                                        onChange={(e) => {
                                          const newQuestions = [...formData.questions];
                                          newQuestions[questionIndex].choices[choiceIndex].type = e.target.value as 'text' | 'image';
                                          setFormData({ ...formData, questions: newQuestions });
                                        }}
                                        className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                      >
                                        <option value="text">テキスト</option>
                                        <option value="image">画像</option>
                                      </select>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newQuestions = [...formData.questions];
                                          newQuestions[questionIndex].choices.splice(choiceIndex, 1);
                                          setFormData({ ...formData, questions: newQuestions });
                                        }}
                                        className="text-red-600 hover:text-red-800 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors duration-200 font-medium"
                                      >
                                        削除
                                      </button>
                                    </div>
                                    {choice.type === 'text' ? (
                                      <input
                                        type="text"
                                        value={choice.text}
                                        onChange={(e) => {
                                          const newQuestions = [...formData.questions];
                                          newQuestions[questionIndex].choices[choiceIndex].text = e.target.value;
                                          setFormData({ ...formData, questions: newQuestions });
                                        }}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
                                        placeholder={`選択肢 ${choiceIndex + 1}`}
                                        required
                                      />
                                    ) : (
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                          if (e.target.files && e.target.files[0]) {
                                            const imageUrl = await uploadFile(e.target.files[0], 'image');
                                            const newQuestions = [...formData.questions];
                                            newQuestions[questionIndex].choices[choiceIndex].imageUrl = imageUrl;
                                            setFormData({ ...formData, questions: newQuestions });
                                          }
                                        }}
                                        className="block w-full text-lg"
                                        required
                                      />
                                    )}
                                  </div>
                                  <input
                                    type="radio"
                                    name={`correctAnswer-${questionIndex}`}
                                    checked={question.correctAnswer === choiceIndex}
                                    onChange={() => {
                                      const newQuestions = [...formData.questions];
                                      newQuestions[questionIndex].correctAnswer = choiceIndex;
                                      setFormData({ ...formData, questions: newQuestions });
                                    }}
                                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 mt-2"
                                    required
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center space-x-4 mb-4">
                              <label className="block text-sm font-medium text-gray-700">
                                解説
                              </label>
                              <select
                                value={question.explanationType || 'text'}
                                onChange={(e) => {
                                  const newQuestions = [...formData.questions];
                                  newQuestions[questionIndex].explanationType = e.target.value as 'text' | 'image';
                                  setFormData({ ...formData, questions: newQuestions });
                                }}
                                className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              >
                                <option value="text">テキスト</option>
                                <option value="image">画像</option>
                              </select>
                            </div>
                            {question.explanationType === 'image' ? (
                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    const imageUrl = await uploadFile(e.target.files[0], 'image');
                                    const newQuestions = [...formData.questions];
                                    newQuestions[questionIndex].explanationImageUrl = imageUrl;
                                    setFormData({ ...formData, questions: newQuestions });
                                  }
                                }}
                                className="block w-full text-lg"
                                required
                              />
                            ) : (
                              <textarea
                                value={question.explanation}
                                onChange={(e) => {
                                  const newQuestions = [...formData.questions];
                                  newQuestions[questionIndex].explanation = e.target.value;
                                  setFormData({ ...formData, questions: newQuestions });
                                }}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
                                rows={3}
                                required
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 border-2 border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 border-2 border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                  >
                    追加
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
