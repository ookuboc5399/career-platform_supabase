import React from 'react';
import { ContactForm } from '@/components/ContactForm';
import { FAQ } from '@/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getFaqs() {
  const res = await fetch('http://localhost:3000/faq', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch FAQs');
  }
  return res.json();
}

export default async function ContactPage() {
  const faqs = await getFaqs();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">お問い合わせ</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <ContactForm />
        </div>

        {/* FAQ and Contact Info */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>よくある質問</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {faqs.map((faq: FAQ, index: number) => (
                  <AccordionItem key={faq.id} value={`item-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>お問い合わせ先</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">電話番号</h3>
                <p className="text-gray-600">03-XXXX-XXXX</p>
                <p className="text-sm text-gray-500">（平日 9:00-18:00）</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">メールアドレス</h3>
                <p className="text-gray-600">info@career-platform.example.com</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">所在地</h3>
                <p className="text-gray-600">
                  〒XXX-XXXX<br />
                  東京都XX区XX町X-X-X
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
