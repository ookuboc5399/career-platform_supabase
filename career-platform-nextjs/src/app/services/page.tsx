import React from 'react';
import { getServices } from '@/lib/api';
import { Service } from '@/types';
import { ServiceCard } from '@/components/ServiceCard';
import { ErrorMessage } from '@/components/ErrorMessage';

export const dynamic = 'force-dynamic';


export default async function ServicesPage() {
  try {
    const services: Service[] = await getServices();
    if (!services || services.length === 0) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center mb-12">サービス一覧</h1>
          <ErrorMessage message="現在サービスの情報を取得できません。後ほど再度お試しください。" />
        </div>
      );
    }
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">サービス一覧</h1>

      {/* Student Services */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-8">学生向けサービス</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services
            .filter((service: Service) => service.service_type === 'student')
            .map((service: Service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
        </div>
      </div>

      {/* Professional Services */}
      <div>
        <h2 className="text-2xl font-semibold mb-8">社会人向けサービス</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services
            .filter((service: Service) => service.service_type === 'professional')
            .map((service: Service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
        </div>
      </div>
    </div>
  );
  } catch (error) {
    console.error('Services page error:', error);
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">サービス一覧</h1>
        <ErrorMessage message="エラーが発生しました。後ほど再度お試しください。" />
      </div>
    );
  }
}
