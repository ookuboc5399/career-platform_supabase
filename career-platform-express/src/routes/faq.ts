import express from 'express';
import { FAQ } from '../types';
import pool from '../config/database';

const router = express.Router();

const getAllFaqs = async () => {
  const result = await pool.query('SELECT * FROM faqs ORDER BY created_at DESC');
  return result.rows;
};

const getFaqsByCategory = async (category: string) => {
  const result = await pool.query('SELECT * FROM faqs WHERE category = $1', [category]);
  return result.rows;
};

router.get('/', async (req, res) => {
  try {
    const faqs = await getAllFaqs();
    res.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const faqs = await getFaqsByCategory(category);
    res.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
