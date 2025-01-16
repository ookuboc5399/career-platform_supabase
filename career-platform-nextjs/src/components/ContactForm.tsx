'use client';

import React from 'react';
import { submitContactForm } from '@/lib/api';

export function ContactForm() {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-6">お問い合わせフォーム</h2>
        <form className="space-y-6" onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          try {
            await submitContactForm({
              name: formData.get('name') as string,
              email: formData.get('email') as string,
              subject: formData.get('subject') as string,
              message: formData.get('message') as string,
            });
            alert('お問い合わせを受け付けました。');
            e.currentTarget.reset();
          } catch (error) {
            alert('エラーが発生しました。もう一度お試しください。');
            console.error(error);
          }
        }}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              お名前
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              件名
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              お問い合わせ内容
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          >
            送信する
          </button>
        </form>
      </div>
    </div>
  );
}
