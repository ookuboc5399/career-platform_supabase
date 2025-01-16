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
  console.log('Fetching all certifications:', certifications);
  void res.json(certifications);
};

// Get certification by ID
const getCertificationById: RequestHandler = (req, res) => {
  console.log('Fetching certification by ID:', req.params.id);
  const certification = certifications.find(c => c.id === req.params.id);
  if (!certification) {
    console.log('Certification not found:', req.params.id);
    void res.status(404).json({ error: 'Certification not found' });
    return;
  }
  void res.json(certification);
};

// Create new certification
const createCertification: RequestHandler = (req, res, next) => {
  console.log('\n=== Create Certification Request ===');
  console.log('Request body:', req.body);
  console.log('File:', req.file);

  const { name, description, category, difficulty, estimatedStudyTime } = req.body;

  // バリデーション
  if (!name || !description || !category || !difficulty || !estimatedStudyTime) {
    console.error('Validation error: Missing required fields');
    console.log('Received fields:', { name, description, category, difficulty, estimatedStudyTime });
    void res.status(400).json({ 
      error: 'Missing required fields',
      details: {
        name: !name ? 'missing' : 'ok',
        description: !description ? 'missing' : 'ok',
        category: !category ? 'missing' : 'ok',
        difficulty: !difficulty ? 'missing' : 'ok',
        estimatedStudyTime: !estimatedStudyTime ? 'missing' : 'ok'
      }
    });
    return;
  }

  // 画像ファイルがある場合はアップロード
  console.log('\n=== Processing Image Upload ===');
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
      console.log('Image upload successful:', imageUrl);

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

      console.log('\n=== New Certification Created ===');
      console.log(JSON.stringify(newCertification, null, 2));

      certifications.push(newCertification);
      void res.status(201).json(newCertification);
    })
    .catch((error: unknown) => {
      console.error('\n=== Error Creating Certification ===');
      console.error('Error details:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      void res.status(500).json({ 
        error: 'Failed to create certification', 
        details: errorMessage,
        requestBody: req.body,
        fileInfo: req.file ? {
          filename: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size
        } : 'No file uploaded'
      });
      next(error);
    });
};

router.get('/', getAllCertifications);
router.get('/:id', getCertificationById);
router.post('/', upload.single('image'), createCertification);

export default router;
