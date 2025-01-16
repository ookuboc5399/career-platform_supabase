import React from 'react';
import Image from 'next/image';
import { Testimonial } from '@/types';
import { ErrorMessage } from '@/components/ErrorMessage';

async function getTestimonials(): Promise<Testimonial[]> {
  // TODO: Replace with actual API call when backend is ready
  return [
    {
      id: 1,
      name: "田中 太郎",
      role: "IT企業エンジニア",
      company: "株式会社テクノロジー",
      content: "Career Platformのキャリアコーチングを通じて、理想的な転職を実現できました。コーチの方は私の強みと市場のニーズを的確に分析し、具体的なアドバイスを提供してくださいました。",
      rating: 5
    },
    {
      id: 2,
      name: "山田 花子",
      role: "大学4年生",
      content: "就職活動のサポートのおかげで、第一志望の企業から内定をいただけました。面接対策や企業研究の方法など、実践的なアドバイスが非常に役立ちました。",
      rating: 5
    }
  ];
}

export default async function TestimonialsPage() {
  try {
    const testimonials = await getTestimonials();
    if (!testimonials || testimonials.length === 0) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center mb-12">お客様の声</h1>
          <ErrorMessage message="現在、お客様の声を取得できません。後ほど再度お試しください。" />
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">お客様の声</h1>

        {/* Success Stories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                {testimonial.image ? (
                  <Image
                    src={testimonial.image || '/placeholder.jpg'}
                    alt={testimonial.name}
                    width={64}
                    height={64}
                    className="rounded-full mr-4 object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-full mr-4"></div>
                )}
                <div>
                  <h3 className="text-xl font-semibold">{testimonial.name}</h3>
                  <p className="text-gray-600">{testimonial.role}</p>
                  {testimonial.company && (
                    <p className="text-gray-600">{testimonial.company}</p>
                  )}
                </div>
              </div>
              <div className="mb-4">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={`text-2xl ${
                      index < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-700 mb-4">{testimonial.content}</p>
              <div className="text-sm text-gray-500">
                利用サービス: {testimonial.role.includes('学生') ? '就活支援プログラム' : 'キャリア転換支援'}
              </div>
            </div>
          ))}
        </div>

      {/* Corporate Partnerships */}
      <div>
        <h2 className="text-2xl font-semibold mb-8">企業提携実績</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
            <div className="w-32 h-16 bg-gray-200"></div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
            <div className="w-32 h-16 bg-gray-200"></div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
            <div className="w-32 h-16 bg-gray-200"></div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
            <div className="w-32 h-16 bg-gray-200"></div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
            <div className="text-4xl font-bold mb-2">1,000+</div>
            <div>キャリア相談実績</div>
          </div>
          <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
            <div className="text-4xl font-bold mb-2">95%</div>
            <div>利用者満足度</div>
          </div>
          <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
            <div className="text-4xl font-bold mb-2">50+</div>
            <div>提携企業数</div>
          </div>
        </div>
      </div>
    </div>
  );
  } catch (error) {
    console.error('Testimonials page error:', error);
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">お客様の声</h1>
        <ErrorMessage message="エラーが発生しました。後ほど再度お試しください。" />
      </div>
    );
  }
}
