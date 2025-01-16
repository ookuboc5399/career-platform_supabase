import express, { Request, Response } from 'express';
import { BlogPost } from '../types';

type BlogResponse = Response<BlogPost[] | BlogPost | { error: string }>;
interface BlogParams {
  id: string;
}
type BlogRequest = Request<BlogParams>;

const router = express.Router();

import pool from '../config/database';

const getAllPostsFromDb = async () => {
  const result = await pool.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
  return result.rows;
};

const getPostByIdFromDb = async (id: number) => {
  const result = await pool.query('SELECT * FROM blog_posts WHERE id = $1', [id]);
  return result.rows[0];
};

const getAllPosts = async (req: BlogRequest, res: BlogResponse) => {
  try {
    const posts = await getAllPostsFromDb();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPostById = async (req: BlogRequest, res: BlogResponse) => {
  try {
    const postId = parseInt(req.params.id || '');
    if (isNaN(postId)) {
      res.status(400).json({ error: 'Invalid ID format' });
      return;
    }
    
    const post = await getPostByIdFromDb(postId);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

router.get('/', getAllPosts);
router.get('/:id', getPostById);

export default router;
