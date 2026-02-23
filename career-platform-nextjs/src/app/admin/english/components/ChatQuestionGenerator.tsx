'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Question, QuestionContent } from '@/types/english';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatQuestionGenerator() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<'grammar' | 'vocabulary' | 'writing'>('grammar');
  const [generatedQuestions, setGeneratedQuestions] = useState<QuestionContent[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/english/questions/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          type: selectedType,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate questions');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      if (data.questions) {
        setGeneratedQuestions(data.questions);
        setShowPreview(true);
      }
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveQuestions = async () => {
    try {
      const questions = generatedQuestions.map((q): Question => ({
        id: `question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: selectedType,
        imageUrl: '',
        content: q,
        createdAt: new Date().toISOString(),
      }));

      const response = await fetch('/api/admin/english/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questions),
      });

      if (!response.ok) throw new Error('Failed to save questions');

      setGeneratedQuestions([]);
      setShowPreview(false);
      setMessages([]);
      setInput('');
    } catch (error) {
      console.error('Error saving questions:', error);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">AIで問題を生成</h2>
      <div className="space-y-4">
        <div>
          <Label>問題タイプ</Label>
          <Select
            value={selectedType}
            onValueChange={(value: string) => setSelectedType(value as 'grammar' | 'vocabulary' | 'writing')}
          >
            <SelectTrigger>
              <SelectValue placeholder="タイプを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grammar">文法</SelectItem>
              <SelectItem value="vocabulary">単語</SelectItem>
              <SelectItem value="writing">英作文</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="h-[400px] overflow-y-auto border rounded-lg p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-100 ml-8'
                  : 'bg-gray-100 mr-8'
              }`}
            >
              {message.content}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="問題を生成する指示を入力..."
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? '生成中...' : '送信'}
          </Button>
        </div>

        {showPreview && generatedQuestions.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">生成された問題</h3>
            <div className="space-y-6">
              {generatedQuestions.map((question, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <p className="font-medium mb-4">{question.question}</p>
                  <div className="space-y-2 mb-4">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-3 rounded-md ${
                          question.correctAnswers.includes(optionIndex + 1)
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-gray-50'
                        }`}
                      >
                        <span className="font-semibold mr-2">{optionIndex + 1}.</span>
                        {option}
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{question.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={handleSaveQuestions}>
                問題を保存
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
