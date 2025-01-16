import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import multer from 'multer';
import { uploadFile, CONTAINERS } from '../lib/storage';
import { Certification } from '../types/api';

const router = express.Router();
const upload = multer();

// モックデータストア（開発用）
const certifications: Certification[] = [];

// Get all certifications
const getAllCertifications: RequestHandler = (_req, res) => {
  void res.json(certifications);
};

// Get certification by ID
const getCertificationById: RequestHandler = (req, res) => {
  const certification = certifications.find(c => c.id === req.params.id);
  if (!certification) {
    void res.status(404).json({ error: 'Certification not found' });
    return;
  }
  void res.json(certification);
};

// Create new certification
const createCertification: RequestHandler = (req, res, next) => {
  const { name, description, category, difficulty, estimatedStudyTime } = req.body;

  // バリデーション
  if (!name || !description || !category || !difficulty || !estimatedStudyTime) {
    void res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  // 画像ファイルがある場合はアップロード
  const uploadPromise = req.file
    ? uploadFile(
        CONTAINERS.CERTIFICATION_IMAGES,
        Buffer.from(req.file.buffer),
        req.file.originalname,
        req.file.mimetype
      )
    : Promise.resolve('');

  void uploadPromise
    .then((imageUrl: string) => {
      const newCertification: Certification = {
        id: (certifications.length + 1).toString(),
        name,
        description,
        imageUrl,
        category: category as 'finance' | 'it' | 'business',
        difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
        estimatedStudyTime,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        chapters: []
      };

      certifications.push(newCertification);
      void res.status(201).json(newCertification);
    })
    .catch((error: unknown) => {
      console.error('Error creating certification:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      void res.status(500).json({ error: 'Failed to create certification', details: errorMessage });
      next(error);
    });
};

router.get('/', getAllCertifications);
router.get('/:id', getCertificationById);
router.post('/', upload.single('image'), createCertification);

export default router;
