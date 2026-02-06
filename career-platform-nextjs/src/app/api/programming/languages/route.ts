import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: languages, error } = await supabaseAdmin
      .from('programming_languages')
      .select('*')
      .in('type', ['language', 'framework', 'ai-platform', 'data-warehouse', 'others', 'saas', 'cloud', 'network'])
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    // スネークケースからキャメルケースに変換
    const formattedLanguages = (languages || []).map(lang => ({
      id: lang.id,
      title: lang.title,
      description: lang.description,
      type: lang.type,
      createdAt: lang.created_at,
      updatedAt: lang.updated_at,
    }));

    return NextResponse.json(formattedLanguages);
  } catch (error) {
    console.error('Error fetching languages:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch languages' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const now = new Date().toISOString();

    const { data: createdLanguage, error } = await supabaseAdmin
      .from('programming_languages')
      .insert({
        id: data.id,
        title: data.title,
        description: data.description,
        type: data.type,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // スネークケースからキャメルケースに変換
    const formattedLanguage = {
      id: createdLanguage.id,
      title: createdLanguage.title,
      description: createdLanguage.description,
      type: createdLanguage.type,
      createdAt: createdLanguage.created_at,
      updatedAt: createdLanguage.updated_at,
    };

    return NextResponse.json(formattedLanguage);
  } catch (error) {
    console.error('Error creating language:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create language' },
      { status: 500 }
    );
  }
}
