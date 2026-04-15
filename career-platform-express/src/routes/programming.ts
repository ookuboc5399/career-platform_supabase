import express, { Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';

const router = express.Router();

function formatChapter(ch: any) {
  return {
    id: ch.id,
    languageId: ch.language_id,
    parentId: ch.parent_id || null,
    title: ch.title,
    description: ch.description,
    videoUrl: ch.video_url,
    thumbnailUrl: ch.thumbnail_url,
    duration: ch.duration,
    order: ch.order,
    status: ch.status,
    exercises: ch.exercises || [],
    slideUrl: ch.slide_url || null,
    pdfUrl: ch.pdf_url || null,
    createdAt: ch.created_at,
    updatedAt: ch.updated_at,
  };
}

// Get chapters for a programming language (top-level with subChapters nested)
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

    if (error) throw error;

    const all = (chapters || []).map(formatChapter);
    const topLevel = all.filter(ch => !ch.parentId);
    const subs = all.filter(ch => ch.parentId);

    const nested = topLevel.map(ch => ({
      ...ch,
      subChapters: subs.filter(s => s.parentId === ch.id),
    }));

    res.json(nested);
    return;
  } catch (error) {
    console.error('Error fetching programming chapters:', error);
    res.status(500).json({ error: 'Failed to fetch programming chapters' });
    return;
  }
});

// Get a specific chapter (with subChapters if it's a parent)
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

    const formatted = formatChapter(chapter);

    // サブチャプターを取得
    const { data: subs } = await supabaseAdmin!
      .from('programming_chapters')
      .select('*')
      .eq('parent_id', id)
      .order('order', { ascending: true });

    res.json({
      ...formatted,
      subChapters: (subs || []).map(formatChapter),
    });
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
    const { languageId, title, description, videoUrl, duration, order, exercises, status, parentId } = req.body;

    if (!languageId || !title || !description) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const id = `${languageId}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date().toISOString();

    const { data: createdChapter, error } = await supabaseAdmin!
      .from('programming_chapters')
      .insert({
        id,
        language_id: languageId,
        parent_id: parentId || null,
        title,
        description,
        video_url: videoUrl || '',
        duration: duration || '',
        order: order ?? 1,
        status: status || 'published',
        exercises: exercises || [],
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(formatChapter(createdChapter));
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

    const updateData: any = { updated_at: new Date().toISOString() };

    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.videoUrl !== undefined) updateData.video_url = req.body.videoUrl;
    if (req.body.thumbnailUrl !== undefined) updateData.thumbnail_url = req.body.thumbnailUrl;
    if (req.body.duration !== undefined) updateData.duration = req.body.duration;
    if (req.body.order !== undefined) updateData.order = req.body.order;
    if (req.body.status !== undefined) updateData.status = req.body.status;
    if (req.body.exercises !== undefined) updateData.exercises = req.body.exercises;
    if (req.body.parentId !== undefined) updateData.parent_id = req.body.parentId || null;

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

    res.json(formatChapter(result));
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

    if (error) throw error;

    res.status(204).send();
    return;
  } catch (error) {
    console.error('Error deleting programming chapter:', error);
    res.status(500).json({ error: 'Failed to delete programming chapter' });
    return;
  }
});

// Update chapter order
router.put('/chapters/order', async (req: Request, res: Response<any>): Promise<void> => {
  try {
    const { chapters } = req.body;

    if (!chapters || !Array.isArray(chapters)) {
      res.status(400).json({ error: 'chapters array is required' });
      return;
    }

    const updates = chapters.map(({ id, order }: { id: string; order: number }) =>
      supabaseAdmin!
        .from('programming_chapters')
        .update({ order, updated_at: new Date().toISOString() })
        .eq('id', id)
    );

    await Promise.all(updates);
    res.json({ success: true });
    return;
  } catch (error) {
    console.error('Error updating chapter order:', error);
    res.status(500).json({ error: 'Failed to update chapter order' });
    return;
  }
});

export default router;
