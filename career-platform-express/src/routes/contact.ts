import express from 'express';
import { ContactForm } from '../types';
import pool from '../config/database';

const router = express.Router();

const createContactMessage = async (name: string, email: string, message: string) => {
  const result = await pool.query(
    'INSERT INTO contact_messages (name, email, message, created_at, status) VALUES ($1, $2, $3, NOW(), $4) RETURNING *',
    [name, email, message, 'pending']
  );
  return result.rows[0];
};

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Name, email, and message are required' });
      return;
    }
    const contactMessage = await createContactMessage(name, email, message);
    res.status(201).json({
      message: 'お問い合わせを受け付けました。担当者より連絡させていただきます。',
      data: contactMessage
    });
  } catch (error) {
    console.error('Error creating contact message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
