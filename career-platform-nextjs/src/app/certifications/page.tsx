import { Certification } from '@/types/api';
import { getCertifications } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

export default async function CertificationsPage() {
  const certifications = await getCertifications();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">資格・検定</h1>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-8 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold mb-2">ランダム問題演習</h2>
              <p className="text-gray-600">全ての資格の問題をランダムに解いて実力を試そう！</p>
            </div>
            <Link
              href="/certifications/practice"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              問題を解く
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((certification) => (
            <Link
              key={certification.id}
              href={`/certifications/${certification.id}`}
              className="block"
            >
              <div className="bg-white rounded-lg shadow-sm border hover:border-blue-500 transition-colors">
                <div className="relative h-48">
                  <Image
                    src={certification.imageUrl}
                    alt={certification.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{certification.name}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {certification.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        certification.category === 'finance'
                          ? 'bg-green-100 text-green-800'
                          : certification.category === 'it'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {certification.category === 'finance'
                          ? '金融'
                          : certification.category === 'it'
                          ? 'IT'
                          : 'ビジネス'}
                      </span>
                      <span className={`px-2 py-1 rounded text-sm ${
                        certification.difficulty === 'beginner'
                          ? 'bg-green-100 text-green-800'
                          : certification.difficulty === 'intermediate'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {certification.difficulty === 'beginner'
                          ? '初級'
                          : certification.difficulty === 'intermediate'
                          ? '中級'
                          : '上級'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {certification.estimatedStudyTime}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
