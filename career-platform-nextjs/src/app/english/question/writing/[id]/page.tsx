import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Writing Question',
  description: 'Practice your English writing skills',
};

interface WritingQuestion {
  id: string;
  title: string;
  description: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  examples: string[];
}

export default function WritingQuestionPage({ params }: { params: { id: string } }) {
  const question: WritingQuestion = {
    id: params.id,
    title: 'Self Introduction',
    description: `Write a self-introduction in English. Include:
    - Your name and age
    - Where you're from
    - Your occupation or studies
    - Your hobbies or interests
    - Your goals or aspirations`,
    topic: 'Personal',
    difficulty: 'beginner',
    estimatedTime: 20,
    examples: [
      "Hi, I am John Smith. I am 25 years old and I am from New York...",
      "Hello everyone! My name is Sarah Johnson, and I would like to introduce myself...",
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{question.title}</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Instructions</h2>
        <p className="whitespace-pre-line mb-4">{question.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Difficulty: {question.difficulty}</span>
          <span>•</span>
          <span>Estimated time: {question.estimatedTime} minutes</span>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Example Answers</h2>
        <div className="space-y-4">
          {question.examples.map((example, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">{example}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
