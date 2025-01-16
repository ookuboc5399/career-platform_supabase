import express from 'express';
import { Testimonial } from '../types';
import pool from '../config/database';

const router = express.Router();

const getAllTestimonials = async () => {
  const result = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC');
  return result.rows;
};

const getTestimonialsByType = async (type: string) => {
  const result = await pool.query('SELECT * FROM testimonials WHERE service_type = $1', [type]);
  return result.rows;
};

router.get('/', async (req, res) => {
  try {
    const testimonials = await getAllTestimonials();
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const testimonials = await getTestimonialsByType(type);
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials by type:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
