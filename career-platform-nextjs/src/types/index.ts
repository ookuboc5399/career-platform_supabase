export interface Service {
  id: number;
  name: string;
  description: string;
  service_type: 'student' | 'professional';
  price: number;
  features: string[];
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company?: string;
  content: string;
  image?: string;
  rating: number;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}
