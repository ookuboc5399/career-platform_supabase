import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import multer from 'multer';
import { uploadFile, BUCKETS } from '../lib/supabase-storage';
import { getCertifications, getCertification, createCertification as createCertificationInDb, updateCertification as updateCertificationInDb, getCertificationChapters, createCertificationChapter, getCertificationChapter } from '../lib/supabase-db';
import { supabaseAdmin } from '../lib/supabase';
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
          BUCKETS.CERTIFICATION_IMAGES,
          Buffer.from(req.file.buffer),
          req.file.originalname,
          req.file.mimetype
        )
      : '';

    const newCertification = await createCertificationInDb({
      name,
      description,
      imageUrl,
      mainCategory: '',
      category: category as 'finance' | 'it' | 'business',
      difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
      estimatedStudyTime,
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

// Get specific chapter
const getChapterById: RequestHandler = async (req, res) => {
  try {
    const chapterId = req.params.chapterId;
    const certificationId = req.query.certificationId as string;

    if (!certificationId) {
      void res.status(400).json({ error: 'Certification ID is required' });
      return;
    }

    const chapter = await getCertificationChapter(chapterId);
    
    if (!chapter || chapter.certificationId !== certificationId) {
      void res.status(404).json({ error: 'Chapter not found' });
      return;
    }

    void res.json(chapter);
  } catch (error) {
    console.error('Error fetching chapter:', error);
    void res.status(500).json({ error: 'Failed to fetch chapter' });
  }
};

// Create new chapter
const createChapter: RequestHandler = async (req, res) => {
  try {
    console.log('\n=== Create Chapter Request ===');
    console.log('Request body:', req.body);
    console.log('Files:', req.files);

    const certificationId = req.params.id;
    const { title, description, order, status, duration, content, questions } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // バリデーション
    if (!title || !description || order === undefined || !status) {
      console.error('Validation error: Missing required fields');
      void res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // 動画とサムネイルをアップロード（任意）
    let videoUrl = '';
    let thumbnailUrl = '';

    if (files?.video?.[0]) {
      const videoFile = files.video[0];
      videoUrl = await uploadFile(
        BUCKETS.CERTIFICATION_VIDEOS,
        Buffer.from(videoFile.buffer),
        videoFile.originalname,
        videoFile.mimetype
      );
    }

    if (files?.thumbnail?.[0]) {
      const thumbnailFile = files.thumbnail[0];
      thumbnailUrl = await uploadFile(
        BUCKETS.CERTIFICATION_THUMBNAILS,
        Buffer.from(thumbnailFile.buffer),
        thumbnailFile.originalname,
        thumbnailFile.mimetype
      );
    }

    const newChapter = await createCertificationChapter({
      certificationId,
      title,
      description,
      videoUrl,
      thumbnailUrl,
      duration,
      order: parseInt(order),
      status: status as 'draft' | 'published',
      content: content || '',
      questions: questions || [],
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
    const chapterId = req.params.chapterId;
    const certificationId = req.params.id;

    console.log('\n=== Update Chapter Request ===');
    console.log('Chapter ID:', chapterId);
    console.log('Certification ID:', certificationId);
    console.log('Request body:', req.body);

    const existingChapter = await getCertificationChapter(chapterId);
    if (!existingChapter || existingChapter.certificationId !== certificationId) {
      void res.status(404).json({ error: 'Chapter not found' });
      return;
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // キャメルケースをスネークケースに変換
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.videoUrl !== undefined) updateData.video_url = req.body.videoUrl;
    if (req.body.thumbnailUrl !== undefined) updateData.thumbnail_url = req.body.thumbnailUrl;
    if (req.body.duration !== undefined) updateData.duration = req.body.duration;
    if (req.body.order !== undefined) updateData.order = req.body.order;
    if (req.body.status !== undefined) updateData.status = req.body.status;
    if (req.body.content !== undefined) updateData.content = req.body.content;
    if (req.body.questions !== undefined) updateData.questions = req.body.questions;

    const { data: updated, error } = await supabaseAdmin!
      .from('certification_chapters')
      .update(updateData)
      .eq('id', chapterId)
      .eq('certification_id', certificationId)
      .select()
      .single();

    if (error || !updated) {
      throw error || new Error('Failed to update chapter');
    }

    // スネークケースからキャメルケースに変換
    const formattedChapter = {
      id: updated.id,
      certificationId: updated.certification_id,
      title: updated.title,
      description: updated.description,
      videoUrl: updated.video_url,
      thumbnailUrl: updated.thumbnail_url,
      duration: updated.duration,
      order: updated.order,
      status: updated.status,
      content: updated.content,
      questions: updated.questions || [],
      createdAt: updated.created_at,
      updatedAt: updated.updated_at,
    };

    void res.json(formattedChapter);
  } catch (error) {
    console.error('Error updating chapter:', error);
    void res.status(500).json({ error: 'Failed to update chapter' });
  }
};

// Delete chapter
const deleteChapter: RequestHandler = async (req, res) => {
  try {
    const chapterId = req.params.chapterId;
    const certificationId = req.params.id;

    const { error } = await supabaseAdmin!
      .from('certification_chapters')
      .delete()
      .eq('id', chapterId)
      .eq('certification_id', certificationId);

    if (error) {
      throw error;
    }

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
router.get('/chapters/:chapterId', getChapterById);
router.post('/:id/chapters', express.json(), upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), createChapter);
router.put('/:id/chapters/:chapterId', express.json(), updateChapter);
router.delete('/:id/chapters/:chapterId', deleteChapter);

export default router;
