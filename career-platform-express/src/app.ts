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
app.use(cors());  // 開発中は全てのオリジンを許可

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
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

export default app;
