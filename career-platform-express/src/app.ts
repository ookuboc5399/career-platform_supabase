import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import careerRouter from './routes/career';
import englishRouter from './routes/english';
import programmingRouter from './routes/programming';
import certificationsRouter from './routes/certifications';
import uploadRouter from './routes/upload';
import imagesRouter from './routes/images';
import universitiesRouter from './routes/universities';
import googleVisionRouter from './routes/google-vision';
import questionsRouter from './routes/questions';
import newsRouter from './routes/news';
import companiesRouter from './routes/companies';

const app = express();

// CORS設定
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://localhost:3003'], // Next.jsのデフォルトポートとカスタムポートに対応
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

app.use(cors(corsOptions));

// ミドルウェア
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// リクエストロギング
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Request Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request Body:', req.body);
  }

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
  });

  next();
});

// ルーター
app.use('/api/career', careerRouter);
app.use('/api/english', englishRouter);
app.use('/api/programming', programmingRouter);
app.use('/api/certifications', certificationsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/images', imagesRouter);
app.use('/api/universities', universitiesRouter);
app.use('/api/google-vision', googleVisionRouter);
app.use('/api/certifications/:id/questions', questionsRouter);
app.use('/api/english/news', newsRouter);
app.use('/api/companies', companiesRouter);

// エラーハンドリング
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error details:', err);
  console.error('Stack trace:', err.stack);
  res.status(500).json({ 
    error: 'Something broke!',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;
