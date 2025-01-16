import React from 'react';
import { Service } from '@/types';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h3 className="text-xl font-semibold mb-4">{service.name}</h3>
      <p className="text-gray-600 mb-4">{service.description}</p>
      <ul className="space-y-2 mb-6">
        {service.features.map((feature: string, index: number) => (
          <li key={index} className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <p className="text-xl font-bold mb-4">¥{service.price.toLocaleString()} / 回</p>
      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">
        詳細を見る
      </button>
    </div>
  );
}
