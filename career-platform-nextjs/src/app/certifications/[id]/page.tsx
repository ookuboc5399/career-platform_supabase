import { getCertification } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    id: string;
  };
}

export default async function CertificationPage({ params }: Props) {
  const resolvedParams = await Promise.resolve(params);
  let certification;
  try {
    certification = await getCertification(resolvedParams.id);
  } catch (error) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link
                href="/"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                <svg
                  className="w-3 h-3 mr-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
                ホーム
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 text-gray-400 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <Link
                  href="/certifications"
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
                >
                  資格・検定
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 text-gray-400 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                  {certification.name}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-64 md:h-full">
              <Image
                src={certification.imageUrl}
                alt={certification.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-4">
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

              <h1 className="text-3xl font-bold mb-4">{certification.name}</h1>
              <p className="text-gray-600 mb-6">{certification.description}</p>

              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-gray-600 w-32">学習時間目安:</span>
                  <span>{certification.estimatedStudyTime}</span>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {certification.questions && certification.questions.length > 0 && (
                  <Link
                    href={`/certifications/${certification.id}/questions`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    問題を解く
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                )}
                {certification.chapters && certification.chapters.length > 0 && (
                  <Link
                    href={`/certifications/${certification.id}/chapters/1`}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    学習を開始
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
