'use client';

import { useState, useEffect } from 'react';
import { Certification, CertificationQuestion } from '@/types/api';
import { getCertification, updateCertification } from '@/lib/api';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface QuestionFormData {
  question: string;
  choices: { id: string; text: string }[];
  correctAnswer: number;
  explanation: string;
}

export default function CertificationQuestionsPage() {
  const params = useParams();
  const certificationId = params?.id as string;

  const [certification, setCertification] = useState<Certification | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<QuestionFormData>({
    question: '',
    choices: Array.from({ length: 4 }, (_, i) => ({ id: String(i + 1), text: '' })),
    correctAnswer: 0,
    explanation: '',
  });

  useEffect(() => {
    if (!certificationId) {
      setError('Invalid certification ID');
      return;
    }
    fetchCertification(certificationId);
  }, [certificationId]);

  const fetchCertification = async (id: string) => {
    setIsLoading(true);
    try {
      const data = await getCertification(id);
      if (!data) {
        setError('Certification not found');
        return;
      }
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
      const newQuestion: CertificationQuestion = {
        id: crypto.randomUUID(),
        certificationId,
        questionNumber: (certification.questions?.length ?? 0) + 1,
        question: formData.question,
        questionImage: null,
        questionType: 'normal',
        options: formData.choices.map(c => ({ ...c, imageUrl: null })),
        correctAnswers: [formData.correctAnswer],
        explanation: formData.explanation,
        explanationImages: [],
        year: '',
        category: '',
        mainCategory: '',
        createdAt: new Date().toISOString(),
      };

      const updatedCertification = {
        ...certification,
        questions: [...(certification.questions || []), newQuestion],
      };

      await updateCertification(certificationId, updatedCertification);
      await fetchCertification(certificationId);
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      setError('Failed to create question');
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!certification || !window.confirm('本当に削除しますか？')) return;

    try {
      const updatedCertification = {
        ...certification,
        questions: certification.questions?.filter(q => q.id !== questionId) || [],
      };

      await updateCertification(certificationId, updatedCertification);
      await fetchCertification(certificationId);
    } catch (error) {
      setError('Failed to delete question');
    }
  };

  const resetForm = () => {
    setFormData({
      question: '',
      choices: Array.from({ length: 4 }, (_, i) => ({ id: String(i + 1), text: '' })),
      correctAnswer: 0,
      explanation: '',
    });
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (isLoading || !certification) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/admin/certifications" className="text-blue-600 hover:text-blue-800 mb-2 inline-block">
              ← 資格・検定一覧に戻る
            </Link>
            <h1 className="text-2xl font-bold">{certification.name} - 問題管理</h1>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            問題を追加
          </button>
        </div>

        <div className="space-y-6">
          {certification.questions?.map((question, index) => (
            <div key={question.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">問題 {index + 1}</h3>
                <button onClick={() => handleDeleteQuestion(question.id)} className="text-red-600 hover:text-red-800">
                  削除
                </button>
              </div>
              <p className="mb-4">{question.question}</p>
              <div className="space-y-2 mb-4">
                {question.choices.map((choice, choiceIndex) => (
                  <div key={choice.id} className={`p-3 rounded-lg border ${choiceIndex === question.correctAnswer ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                    {choice.text}
                    {choiceIndex === question.correctAnswer && <span className="ml-2 text-green-600 text-sm">✓ 正解</span>}
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">解説</h4>
                <p className="text-gray-600">{question.explanation}</p>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
              <h2 className="text-2xl font-bold mb-6">問題の追加</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">問題文</label>
                  <textarea value={formData.question} onChange={(e) => setFormData({ ...formData, question: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" rows={3} required />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">選択肢</label>
                  {formData.choices.map((choice, index) => (
                    <div key={choice.id} className="flex items-center space-x-2">
                      <input type="text" value={choice.text} onChange={(e) => {
                        const newChoices = [...formData.choices];
                        newChoices[index].text = e.target.value;
                        setFormData({ ...formData, choices: newChoices });
                      }} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder={`選択肢 ${index + 1}`} required />
                    </div>
                  ))}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}