import express, { Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';

const router = express.Router();

// Get chapters for a programming language
router.get('/chapters', async (req: Request, res: Response<any>): Promise<void> => {
  try {
    const languageId = req.query.languageId as string;
    if (!languageId) {
      res.status(400).json({ error: 'Language ID is required' });
      return;
    }

    const { data: chapters, error } = await supabaseAdmin!
      .from('programming_chapters')
      .select('*')
      .eq('language_id', languageId)
      .order('order', { ascending: true });

    if (error) {
      throw error;
    }

    // スネークケースからキャメルケースに変換
    const formattedChapters = (chapters || []).map(ch => ({
      id: ch.id,
      languageId: ch.language_id,
      title: ch.title,
      description: ch.description,
      videoUrl: ch.video_url,
      thumbnailUrl: ch.thumbnail_url,
      duration: ch.duration,
      order: ch.order,
      status: ch.status,
      exercises: ch.exercises || [],
      createdAt: ch.created_at,
      updatedAt: ch.updated_at,
    }));

    res.json(formattedChapters);
    return;
  } catch (error) {
    console.error('Error fetching programming chapters:', error);
    res.status(500).json({ error: 'Failed to fetch programming chapters' });
    return;
  }
});

// Get a specific chapter
router.get('/chapters/:id', async (req: Request, res: Response<any>): Promise<void> => {
  try {
    const { id } = req.params;
    const languageId = req.query.languageId as string;

    if (!languageId) {
      res.status(400).json({ error: 'Language ID is required' });
      return;
    }

    const { data: chapter, error } = await supabaseAdmin!
      .from('programming_chapters')
      .select('*')
      .eq('id', id)
      .eq('language_id', languageId)
      .single();

    if (error || !chapter) {
      res.status(404).json({ error: 'Chapter not found' });
      return;
    }

    // スネークケースからキャメルケースに変換
    const formattedChapter = {
      id: chapter.id,
      languageId: chapter.language_id,
      title: chapter.title,
      description: chapter.description,
      videoUrl: chapter.video_url,
      thumbnailUrl: chapter.thumbnail_url,
      duration: chapter.duration,
      order: chapter.order,
      status: chapter.status,
      exercises: chapter.exercises || [],
      createdAt: chapter.created_at,
      updatedAt: chapter.updated_at,
    };

    res.json(formattedChapter);
    return;
  } catch (error) {
    console.error('Error fetching programming chapter:', error);
    res.status(500).json({ error: 'Failed to fetch programming chapter' });
    return;
  }
});

// Create a new chapter
router.post('/chapters', async (req: Request, res: Response<any>): Promise<void> => {
  try {
    const { languageId, title, description, videoUrl, duration, order, exercises } = req.body;

    if (!languageId || !title || !description || !videoUrl || !duration || order === undefined) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const id = `${languageId}-${Date.now()}`;
    const now = new Date().toISOString();

    const { data: createdChapter, error } = await supabaseAdmin!
      .from('programming_chapters')
      .insert({
        id,
        language_id: languageId,
        title,
        description,
        video_url: videoUrl,
        duration,
        order,
        status: 'draft',
        exercises: exercises || [],
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // スネークケースからキャメルケースに変換
    const formattedChapter = {
      id: createdChapter.id,
      languageId: createdChapter.language_id,
      title: createdChapter.title,
      description: createdChapter.description,
      videoUrl: createdChapter.video_url,
      thumbnailUrl: createdChapter.thumbnail_url,
      duration: createdChapter.duration,
      order: createdChapter.order,
      status: createdChapter.status,
      exercises: createdChapter.exercises || [],
      createdAt: createdChapter.created_at,
      updatedAt: createdChapter.updated_at,
    };

    res.status(201).json(formattedChapter);
    return;
  } catch (error) {
    console.error('Error creating programming chapter:', error);
    res.status(500).json({ error: 'Failed to create programming chapter' });
    return;
  }
});

// Update a chapter
router.put('/chapters/:id', async (req: Request, res: Response<any>): Promise<void> => {
  try {
    const { id } = req.params;
    const languageId = req.query.languageId as string;

    if (!languageId) {
      res.status(400).json({ error: 'Language ID is required' });
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
    if (req.body.exercises !== undefined) updateData.exercises = req.body.exercises;

    const { data: result, error } = await supabaseAdmin!
      .from('programming_chapters')
      .update(updateData)
      .eq('id', id)
      .eq('language_id', languageId)
      .select()
      .single();

    if (error || !result) {
      res.status(404).json({ error: 'Chapter not found' });
      return;
    }

    // スネークケースからキャメルケースに変換
    const formattedChapter = {
      id: result.id,
      languageId: result.language_id,
      title: result.title,
      description: result.description,
      videoUrl: result.video_url,
      thumbnailUrl: result.thumbnail_url,
      duration: result.duration,
      order: result.order,
      status: result.status,
      exercises: result.exercises || [],
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };

    res.json(formattedChapter);
    return;
  } catch (error) {
    console.error('Error updating programming chapter:', error);
    res.status(500).json({ error: 'Failed to update programming chapter' });
    return;
  }
});

// Delete a chapter
router.delete('/chapters/:id', async (req: Request, res: Response<any>): Promise<void> => {
  try {
    const { id } = req.params;
    const languageId = req.query.languageId as string;

    if (!languageId) {
      res.status(400).json({ error: 'Language ID is required' });
      return;
    }

    const { error } = await supabaseAdmin!
      .from('programming_chapters')
      .delete()
      .eq('id', id)
      .eq('language_id', languageId);

    if (error) {
      throw error;
    }

    res.status(204).send();
    return;
  } catch (error) {
    console.error('Error deleting programming chapter:', error);
    res.status(500).json({ error: 'Failed to delete programming chapter' });
    return;
  }
});

export default router;
