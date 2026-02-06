import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const languageId = searchParams.get('languageId');
    const chapterId = searchParams.get('chapterId');
    const status = searchParams.get('status');

    let query = supabaseAdmin
      .from('programming_practice_exercises')
      .select('*')
      .order('order', { ascending: true });

    if (languageId) {
      query = query.eq('language_id', languageId);
    }

    if (chapterId) {
      query = query.eq('chapter_id', chapterId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // スネークケースからキャメルケースに変換
    const formattedExercises = (data || []).map(exercise => ({
      id: exercise.id,
      languageId: exercise.language_id,
      chapterId: exercise.chapter_id || undefined,
      type: exercise.type,
      title: exercise.title,
      description: exercise.description,
      descriptionJapanese: exercise.description_japanese || undefined,
      explanation: exercise.explanation || undefined,
      testCases: exercise.test_cases || undefined,
      choices: exercise.choices || undefined,
      correctAnswer: exercise.correct_answer 
        ? (Array.isArray(exercise.correct_answer) ? exercise.correct_answer : [exercise.correct_answer])
        : undefined,
      difficulty: exercise.difficulty || 'medium',
      order: exercise.order || 0,
      status: exercise.status || 'draft',
      createdAt: exercise.created_at,
      updatedAt: exercise.updated_at,
    }));

    return NextResponse.json(formattedExercises);
  } catch (error) {
    console.error('Error fetching practice exercises:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch practice exercises' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      languageId,
      chapterId,
      type,
      title,
      description,
      descriptionJapanese,
      explanation,
      testCases,
      choices,
      correctAnswer,
      difficulty,
      order,
      status,
    } = body;

    if (!languageId || !type || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const id = `practice-${languageId}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('programming_practice_exercises')
      .insert({
        id,
        language_id: languageId,
        chapter_id: chapterId || null,
        type,
        title: title || null,
        description,
        description_japanese: descriptionJapanese || null,
        explanation: explanation || null,
        test_cases: testCases || null,
        choices: choices || null,
        correct_answer: correctAnswer 
          ? (Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer])
          : null,
        difficulty: difficulty || 'medium',
        order: order || 0,
        status: status || 'draft',
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // スネークケースからキャメルケースに変換
    const formattedExercise = {
      id: data.id,
      languageId: data.language_id,
      chapterId: data.chapter_id || undefined,
      type: data.type,
      title: data.title,
      description: data.description,
      descriptionJapanese: data.description_japanese || undefined,
      explanation: data.explanation || undefined,
      testCases: data.test_cases || undefined,
      choices: data.choices || undefined,
      correctAnswer: data.correct_answer 
        ? (Array.isArray(data.correct_answer) ? data.correct_answer : [data.correct_answer])
        : undefined,
      difficulty: data.difficulty || 'medium',
      order: data.order || 0,
      status: data.status || 'draft',
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return NextResponse.json(formattedExercise, { status: 201 });
  } catch (error) {
    console.error('Error creating practice exercise:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create practice exercise' },
      { status: 500 }
    );
  }
}

