import { supabaseAdmin } from './supabase';

// 会社情報の型定義
export interface Company {
  id?: string;
  company_name: string;
  parent_industry: string;
  industry: string;
  business_tags: string[];
  original_tags: string[];
  region: string;
  prefecture: string;
  notes?: string;
  strengths: string[];
  challenges: string[];
  source_url?: string;
  extracted_at: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCompanyInput {
  company_name: string;
  parent_industry: string;
  industry: string;
  business_tags: string[];
  original_tags: string[];
  region: string;
  prefecture: string;
  notes?: string;
  strengths: string[];
  challenges: string[];
  source_url?: string;
  extracted_at?: string;
}

/**
 * 会社情報を作成
 */
export async function createCompany(data: CreateCompanyInput): Promise<Company> {
  const id = Math.random().toString(36).substring(2, 15);
  const now = new Date().toISOString();

  const insertData: any = {
    id,
    company_name: data.company_name,
    parent_industry: data.parent_industry,
    industry: data.industry,
    business_tags: data.business_tags || [],
    original_tags: data.original_tags || [],
    region: data.region,
    prefecture: data.prefecture,
    notes: data.notes || null,
    strengths: data.strengths || [],
    challenges: data.challenges || [],
    source_url: data.source_url || null,
    extracted_at: data.extracted_at || now,
    created_at: now,
    updated_at: now,
  };

  const { data: result, error } = await supabaseAdmin!
    .from('companies2')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('Error creating company:', error);
    throw error;
  }

  return mapCompanyFromDB(result);
}

/**
 * 会社情報を取得（全件）
 */
export async function getCompanies(): Promise<Company[]> {
  const { data, error } = await supabaseAdmin!
    .from('companies2')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }

  return (data || []).map(mapCompanyFromDB);
}

/**
 * 会社情報を取得（ID指定）
 */
export async function getCompany(id: string): Promise<Company | undefined> {
  const { data, error } = await supabaseAdmin!
    .from('companies2')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return undefined;
    console.error('Error fetching company:', error);
    throw error;
  }

  return data ? mapCompanyFromDB(data) : undefined;
}

/**
 * 会社情報を更新
 */
export async function updateCompany(
  id: string,
  data: Partial<CreateCompanyInput>
): Promise<Company | undefined> {
  const updateData: any = {
    updated_at: new Date().toISOString(),
  };

  if (data.company_name !== undefined) updateData.company_name = data.company_name;
  if (data.parent_industry !== undefined) updateData.parent_industry = data.parent_industry;
  if (data.industry !== undefined) updateData.industry = data.industry;
  if (data.business_tags !== undefined) updateData.business_tags = data.business_tags;
  if (data.original_tags !== undefined) updateData.original_tags = data.original_tags;
  if (data.region !== undefined) updateData.region = data.region;
  if (data.prefecture !== undefined) updateData.prefecture = data.prefecture;
  if (data.notes !== undefined) updateData.notes = data.notes;
  if (data.strengths !== undefined) updateData.strengths = data.strengths;
  if (data.challenges !== undefined) updateData.challenges = data.challenges;
  if (data.source_url !== undefined) updateData.source_url = data.source_url;
  if (data.extracted_at !== undefined) updateData.extracted_at = data.extracted_at;

  const { data: result, error } = await supabaseAdmin!
    .from('companies2')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return undefined;
    console.error('Error updating company:', error);
    throw error;
  }

  return result ? mapCompanyFromDB(result) : undefined;
}

/**
 * 会社情報を削除
 */
export async function deleteCompany(id: string): Promise<void> {
  const { error } = await supabaseAdmin!
    .from('companies2')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting company:', error);
    throw error;
  }
}

/**
 * DB形式からアプリ形式へマッピング
 */
function mapCompanyFromDB(data: any): Company {
  return {
    id: data.id,
    company_name: data.company_name,
    parent_industry: data.parent_industry,
    industry: data.industry,
    business_tags: Array.isArray(data.business_tags) ? data.business_tags : [],
    original_tags: Array.isArray(data.original_tags) ? data.original_tags : [],
    region: data.region,
    prefecture: data.prefecture,
    notes: data.notes || null,
    strengths: Array.isArray(data.strengths) ? data.strengths : [],
    challenges: Array.isArray(data.challenges) ? data.challenges : [],
    source_url: data.source_url || null,
    extracted_at: data.extracted_at,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}


