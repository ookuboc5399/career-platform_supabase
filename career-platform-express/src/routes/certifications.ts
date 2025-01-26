import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import multer from 'multer';
import { uploadFile, CONTAINERS } from '../lib/storage';
import { getCertifications, getCertification, createCertification as createCertificationInDb, updateCertification as updateCertificationInDb, getCertificationChapters, createCertificationChapter, certificationChaptersContainer, initializeDatabase } from '../lib/cosmos-db';
import { Certification, CertificationChapter } from '../types/api';

const router = express.Router();
const upload = multer();

// Get all certifications
const getAllCertifications: RequestHandler = async (_req, res) => {
  try {
    console.log('Fetching all certifications');
    const certifications = await getCertifications();
    void res.json(certifications);
  } catch (error) {
    console.error('Error fetching certifications:', error);
    void res.status(500).json({ error: 'Failed to fetch certifications' });
  }
};

// Get certification by ID
const getCertificationById: RequestHandler = async (req, res) => {
  try {
    console.log('Fetching certification by ID:', req.params.id);
    const certification = await getCertification(req.params.id);
    
    if (!certification) {
      console.log('Certification not found:', req.params.id);
      void res.status(404).json({ error: 'Certification not found' });
      return;
    }
    
    void res.json(certification);
  } catch (error) {
    console.error('Error fetching certification:', error);
    void res.status(500).json({ error: 'Failed to fetch certification' });
  }
};

// Create new certification
const createCertification: RequestHandler = async (req, res, next) => {
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

  try {
    // 画像ファイルがある場合はアップロード
    const imageUrl = req.file
      ? await uploadFile(
          CONTAINERS.CERTIFICATION_IMAGES,
          Buffer.from(req.file.buffer),
          req.file.originalname,
          req.file.mimetype
        )
      : '';

    const newCertification = await createCertificationInDb({
      name,
      description,
      imageUrl,
      category: category as 'finance' | 'it' | 'business',
      difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
      estimatedStudyTime,
      mainCategory: '',
      subCategory: '',
    });

    void res.status(201).json(newCertification);
  } catch (error) {
    console.error('Error creating certification:', error);
    next(error);
  }
};

// Get chapters by certification ID
const getChaptersByCertificationId: RequestHandler = async (req, res) => {
  try {
    console.log('Fetching chapters for certification:', req.params.id);
    const chapters = await getCertificationChapters(req.params.id);
    void res.json(chapters);
  } catch (error) {
    console.error('Error fetching chapters:', error);
    void res.status(500).json({ error: 'Failed to fetch chapters' });
  }
};

// Create new chapter
const createChapter: RequestHandler = async (req, res) => {
  try {
    console.log('\n=== Create Chapter Request ===');
    console.log('Request body:', req.body);
    console.log('Files:', req.files);

    const certificationId = req.params.id;
    const { title, description, order, status, duration } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // バリデーション
    if (!title || !description || !files.video || !files.thumbnail || order === undefined || !status) {
      console.error('Validation error: Missing required fields');
      void res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // 動画とサムネイルをアップロード
    const videoFile = files.video[0];
    const thumbnailFile = files.thumbnail[0];

    const videoUrl = await uploadFile(
      CONTAINERS.CERTIFICATION_VIDEOS,
      Buffer.from(videoFile.buffer),
      videoFile.originalname,
      videoFile.mimetype
    );

    const thumbnailUrl = await uploadFile(
      CONTAINERS.CERTIFICATION_THUMBNAILS,
      Buffer.from(thumbnailFile.buffer),
      thumbnailFile.originalname,
      thumbnailFile.mimetype
    );

    const newChapter = await createCertificationChapter({
      certificationId,
      title,
      description,
      videoUrl,
      thumbnailUrl,
      duration,
      order: parseInt(order),
      status: status as 'draft' | 'published',
      content: '',
      questions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    void res.status(201).json(newChapter);
  } catch (error) {
    console.error('Error creating chapter:', error);
    void res.status(500).json({ error: 'Failed to create chapter' });
  }
};

// Update chapter
const updateChapter: RequestHandler = async (req, res) => {
  try {
    if (!certificationChaptersContainer) await initializeDatabase();
    const chapterId = req.params.chapterId;
    const certificationId = req.params.id;

    const { resource: existingChapter } = await certificationChaptersContainer.item(chapterId, certificationId).read();
    if (!existingChapter) {
      void res.status(404).json({ error: 'Chapter not found' });
      return;
    }

    const updatedChapter = {
      ...existingChapter,
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    const { resource } = await certificationChaptersContainer.item(chapterId, certificationId).replace(updatedChapter);
    void res.json(resource);
  } catch (error) {
    console.error('Error updating chapter:', error);
    void res.status(500).json({ error: 'Failed to update chapter' });
  }
};

// Delete chapter
const deleteChapter: RequestHandler = async (req, res) => {
  try {
    if (!certificationChaptersContainer) await initializeDatabase();
    const chapterId = req.params.chapterId;
    const certificationId = req.params.id;

    await certificationChaptersContainer.item(chapterId, certificationId).delete();
    void res.status(204).send();
  } catch (error) {
    console.error('Error deleting chapter:', error);
    void res.status(500).json({ error: 'Failed to delete chapter' });
  }
};

// Update certification
const updateCertification: RequestHandler = async (req, res) => {
  try {
    console.log('Updating certification with ID:', req.params.id);
    const certificationId = req.params.id;
    const updatedCertification = await updateCertificationInDb(certificationId, req.body);

    if (!updatedCertification) {
      void res.status(404).json({ error: 'Certification not found' });
      return;
    }

    void res.json(updatedCertification);
  } catch (error) {
    console.error('Error updating certification:', error);
    void res.status(500).json({ error: 'Failed to update certification' });
  }
};

router.get('/', getAllCertifications);
router.get('/:id', getCertificationById);
router.post('/', upload.single('image'), createCertification);
router.put('/:id', express.json(), updateCertification);

// チャプター関連のルート
router.get('/:id/chapters', getChaptersByCertificationId);
router.post('/:id/chapters', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), createChapter);
router.put('/:id/chapters/:chapterId', updateChapter);
router.delete('/:id/chapters/:chapterId', deleteChapter);

export default router;
