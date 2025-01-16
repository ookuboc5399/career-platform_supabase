import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import careerRouter from './routes/career';
import englishRouter from './routes/english';
import programmingRouter from './routes/programming';
import certificationsRouter from './routes/certifications';
import uploadRouter from './routes/upload';
import imagesRouter from './routes/images';

const app = express();

// CORS設定
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// ミドルウェア
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ルーター
app.use('/api/career', careerRouter);
app.use('/api/english', englishRouter);
app.use('/api/programming', programmingRouter);
app.use('/api/certifications', certificationsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/images', imagesRouter);

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
