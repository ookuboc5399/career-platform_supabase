import express, { Request, Response, Router } from 'express';
import {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  CreateCompanyInput
} from '../lib/companies-db';

const router = express.Router();

// 全会社情報を取得
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const companies = await getCompanies();
    res.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// 特定の会社情報を取得
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const company = await getCompany(id);
    
    if (!company) {
      res.status(404).json({ error: 'Company not found' });
      return;
    }
    
    res.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

// 会社情報を作成
router.post('/', express.json(), async (req: Request, res: Response): Promise<void> => {
  try {
    const data: CreateCompanyInput = req.body;
    
    // 必須フィールドのバリデーション
    if (!data.company_name || !data.parent_industry || !data.industry || !data.region || !data.prefecture) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const company = await createCompany(data);
    res.status(201).json(company);
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Failed to create company' });
  }
});

// 会社情報を更新
router.put('/:id', express.json(), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data: Partial<CreateCompanyInput> = req.body;

    const company = await updateCompany(id, data);
    if (!company) {
      res.status(404).json({ error: 'Company not found' });
      return;
    }

    res.json(company);
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ error: 'Failed to update company' });
  }
});

// 会社情報を削除
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await deleteCompany(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ error: 'Failed to delete company' });
  }
});

export default router;


