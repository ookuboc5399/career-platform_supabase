export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  serviceType: 'student' | 'professional';
  features: string[];
}

export interface Testimonial {
  id: number;
  clientName: string;
  clientTitle?: string;
  content: string;
  imageUrl?: string;
  serviceType: 'student' | 'professional';
  createdAt: Date;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  serviceType?: 'student' | 'professional';
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}
