import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/universities
export async function GET() {
  try {
    console.log('Fetching universities from Supabase...');
    const { data, error } = await supabaseAdmin!
      .from('universities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching universities:', error);
      return NextResponse.json(
        { error: 'Failed to fetch universities' },
        { status: 500 }
      );
    }

    // スネークケースからキャメルケースに変換
    // フロントエンドの型定義に合わせて name と website を追加
    const universities = (data || []).map(item => ({
      id: item.id,
      title: item.title,
      name: item.title, // フロントエンドが name を期待しているので title をコピー
      description: item.description,
      imageUrl: item.image_url,
      websiteUrl: item.website_url,
      website: item.website_url, // フロントエンドが website を期待しているので website_url をコピー
      type: item.type,
      location: item.location,
      programType: item.program_type,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));

    console.log('Universities fetched successfully:', universities);
    return NextResponse.json({ universities });
  } catch (error) {
    console.error('Error fetching universities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch universities' },
      { status: 500 }
    );
  }
}

// POST /api/universities
export async function POST(request: Request) {
  try {
    console.log('Creating new university...');
    const data = await request.json();
    const id = Math.random().toString(36).substring(2, 15);
    const now = new Date().toISOString();
    
    const { data: result, error } = await supabaseAdmin!
      .from('universities')
      .insert({
        id,
        title: data.title,
        description: data.description,
        image_url: data.imageUrl,
        website_url: data.websiteUrl,
        type: data.type,
        location: data.location,
        program_type: data.programType,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating university:', error);
      return NextResponse.json(
        { error: 'Failed to create university' },
        { status: 500 }
      );
    }

    // スネークケースからキャメルケースに変換
    const university = {
      id: result.id,
      title: result.title,
      description: result.description,
      imageUrl: result.image_url,
      websiteUrl: result.website_url,
      type: result.type,
      location: result.location,
      programType: result.program_type,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };

    console.log('University created successfully:', university);
    return NextResponse.json(university);
  } catch (error) {
    console.error('Error creating university:', error);
    return NextResponse.json(
      { error: 'Failed to create university' },
      { status: 500 }
    );
  }
}
