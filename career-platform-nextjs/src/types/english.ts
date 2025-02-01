export interface Subtitle {
  startTime: number; // 開始時間（秒）
  endTime: number;   // 終了時間（秒）
  text: string;      // 字幕テキスト
  translation: string; // 日本語訳
}

export interface VocabularyItem {
  word: string;      // 英単語
  meaning: string;   // 日本語の意味
  context: string;   // 文中での使用例
  timestamp: number; // 動画内での出現時間（秒）
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  transcript: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  subtitles: Subtitle[];
  vocabulary: Vocabulary[];
  processed: boolean;
  isPublished: boolean;
  createdAt: string;
  error?: string | null;
  lastProcessingTime?: string;
  lastProcessingStage?: 'pending' | 'youtube_processing' | 'content_processing' | 'completed' | 'failed';
  // YouTube 関連の情報
  originalTitle?: string;
  originalDescription?: string;
  duration?: number;
  thumbnailUrl?: string;
}

export interface Vocabulary {
  word: string;
  partOfSpeech: string;
  translation: string;
  example: string;
  timestamp: number;
}

export interface Hint {
  type: 'grammar' | 'vocabulary' | 'expression';
  title: string;
  description: string;
  examples: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  hints: Hint[];
}

export type GrammarCategory = 'all' | 'tense' | 'subjunctive' | 'relative' | 'modal' | 'passive';

export interface EnglishProgress {
  id: string;
  userId: string;
  type: 'grammar' | 'vocabulary' | 'writing';
  category?: GrammarCategory;
  questions: {
    questionId: string;
    selectedAnswer: number;
    isCorrect: boolean;
  }[];
  score: number;
  totalQuestions: number;
  createdAt: string;
}

export interface QuestionContent {
  question: string;
  options: string[];
  correctAnswers: number[];
  explanation: string;
}

export interface Question {
  id: string;
  type: 'grammar' | 'vocabulary' | 'writing';
  category?: GrammarCategory;
  imageUrl?: string;
  content: QuestionContent;
  createdAt: string;
}

export interface ConversationTopic {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  systemPrompt: string;
  tasks: Task[];
}

export const CONVERSATION_TOPICS: ConversationTopic[] = [
  {
    id: 'self-introduction',
    title: '自己紹介',
    description: '基本的な自己紹介から、趣味や将来の目標まで、英語で自分自身について話す練習をしましょう。',
    imageUrl: '/images/english/self-intro.svg',
    systemPrompt: `You are a friendly English conversation partner. Help the user practice self-introduction in English.
    - Listen to their self-introduction and provide natural responses
    - Give feedback on their grammar and pronunciation
    - Suggest better expressions when appropriate
    - Keep the conversation flowing naturally
    - Use simple and clear English
    - Be encouraging and supportive`,
    tasks: [
      {
        id: 'basic-intro',
        title: '基本的な自己紹介',
        description: '名前、年齢、出身地など、基本的な情報を英語で伝えましょう。',
        requirements: [
          '名前と年齢を伝える',
          '出身地について話す',
          '現在の居住地について話す',
          '職業または学校について話す'
        ],
        hints: [
          {
            type: 'grammar',
            title: '自己紹介の基本フレーズ',
            description: '自己紹介でよく使う表現を覚えましょう。',
            examples: [
              'My name is...',
              'I\'m ... years old',
              'I\'m from...',
              'I live in...',
              'I work as...'
            ]
          },
          {
            type: 'vocabulary',
            title: '職業の表現',
            description: '職業を表す一般的な表現です。',
            examples: [
              'I work as a software engineer',
              'I\'m a student',
              'I work for [company name]',
              'I\'m studying [subject] at university'
            ]
          }
        ]
      },
      {
        id: 'hobbies',
        title: '趣味と興味',
        description: '自分の趣味や興味について詳しく話しましょう。',
        requirements: [
          '主な趣味について説明する',
          'その趣味を始めたきっかけを話す',
          'どのくらいの頻度で趣味を楽しんでいるか話す',
          'なぜその趣味が好きなのか理由を説明する'
        ],
        hints: [
          {
            type: 'expression',
            title: '趣味を説明する表現',
            description: '趣味について話すときによく使う表現です。',
            examples: [
              'I enjoy...',
              'In my free time, I like to...',
              'I\'ve been [hobby] for [time period]',
              'I got into [hobby] because...'
            ]
          },
          {
            type: 'vocabulary',
            title: '頻度を表す表現',
            description: '活動の頻度を表現する方法です。',
            examples: [
              'I do this every day/week',
              'I usually...',
              'Once/Twice a week',
              'A few times a month'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'daily-life',
    title: '日常生活',
    description: '毎日の生活やルーティンについて英語で話す練習をしましょう。',
    imageUrl: '/images/english/daily-life.svg',
    systemPrompt: `You are a friendly English conversation partner. Help the user practice talking about their daily life in English.
    - Listen to their description of daily activities
    - Ask follow-up questions to keep the conversation going
    - Provide feedback on grammar and vocabulary
    - Share your own experiences to make the conversation more natural
    - Use simple and clear English
    - Be encouraging and supportive`,
    tasks: [
      {
        id: 'morning-routine',
        title: '朝のルーティン',
        description: '朝起きてから仕事や学校に行くまでの日課について話しましょう。',
        requirements: [
          '起床時間について話す',
          '朝食の習慣について説明する',
          '通勤・通学の方法を説明する',
          '朝の準備について話す'
        ],
        hints: [
          {
            type: 'grammar',
            title: '日課を説明する表現',
            description: '日常的な行動を説明する際の表現です。',
            examples: [
              'I usually wake up at...',
              'First, I..., then I...',
              'After that, I...',
              'It takes me [time] to...'
            ]
          },
          {
            type: 'vocabulary',
            title: '時間に関する表現',
            description: '時間や順序を表す表現です。',
            examples: [
              'Early in the morning',
              'Around [time]',
              'Before/After [activity]',
              'On my way to...'
            ]
          }
        ]
      }
    ]
  }
];
