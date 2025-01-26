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
                <span className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                  {certification.mainCategory}
                </span>
                <span className="px-2 py-1 rounded text-sm bg-green-100 text-green-800">
                  {certification.category}
                </span>
                <span className="px-2 py-1 rounded text-sm bg-yellow-100 text-yellow-800">
                  {certification.subCategory}
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

              <div className="mt-8 flex space-x-4">
                <Link
                  href={`/certifications/${certification.id}/questions`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  総合問題を解く
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
                <Link
                  href="#chapters"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  チャプター一覧へ
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {certification.chapters && certification.chapters.length > 0 && (
          <div id="chapters" className="mt-12">
            <h2 className="text-2xl font-bold mb-6">チャプター一覧</h2>
            <div className="space-y-4">
              {certification.chapters.map((chapter, index) => (
                <Link
                  key={chapter.id}
                  href={`/certifications/${certification.id}/chapters/${chapter.id}`}
                >
                  <div className="bg-white rounded-lg shadow-sm border p-6 hover:border-blue-500 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          Chapter {index + 1}: {chapter.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{chapter.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {chapter.duration}
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            {chapter.questions?.length || 0}問
                          </div>
                        </div>
                      </div>
                      <div className="inline-flex items-center text-blue-600">
                        <span className="mr-2">学習する</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
