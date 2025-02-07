import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">お問い合わせ</h1>
          <p className="text-xl text-blue-100">
            ご質問やご要望がございましたら、以下のフォームよりお気軽にお問い合わせください。
          </p>
        </div>
      </div>

      {/* フォーム */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
