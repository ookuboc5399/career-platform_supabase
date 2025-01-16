import express from 'express';
import { Service } from '../types';
import pool from '../config/database';

const router = express.Router();

const getAllServices = async () => {
  const result = await pool.query('SELECT * FROM services ORDER BY created_at DESC');
  return result.rows;
};

const getServicesByType = async (type: string) => {
  const result = await pool.query('SELECT * FROM services WHERE service_type = $1', [type]);
  return result.rows;
};

router.get('/', async (req, res) => {
  try {
    const services = await getAllServices();
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const services = await getServicesByType(type);
    res.json(services);
  } catch (error) {
    console.error('Error fetching services by type:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
