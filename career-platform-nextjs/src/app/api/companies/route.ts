import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/companies - 全会社情報を取得
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin!
      .from('companies2')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching companies:', error);
      return NextResponse.json(
        { error: 'Failed to fetch companies' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

// POST /api/companies - 会社情報を作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      company_name,
      parent_industry,
      industry,
      business_tags,
      original_tags,
      region,
      prefecture,
      notes,
      strengths,
      challenges,
      source_url,
      extracted_at,
    } = body;

    // 必須フィールドのバリデーション
    if (!company_name || !parent_industry || !industry || !region || !prefecture) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const id = Math.random().toString(36).substring(2, 15);
    const now = new Date().toISOString();

    const insertData: any = {
      id,
      company_name,
      parent_industry,
      industry,
      business_tags: Array.isArray(business_tags) ? business_tags : [],
      original_tags: Array.isArray(original_tags) ? original_tags : [],
      region,
      prefecture,
      notes: notes || null,
      strengths: Array.isArray(strengths) ? strengths : [],
      challenges: Array.isArray(challenges) ? challenges : [],
      source_url: source_url || null,
      extracted_at: extracted_at || now,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabaseAdmin!
      .from('companies2')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating company:', error);
      return NextResponse.json(
        { error: 'Failed to create company' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
}


