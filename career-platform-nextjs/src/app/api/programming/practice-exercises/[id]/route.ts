import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('programming_practice_exercises')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Practice exercise not found' },
        { status: 404 }
      );
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

    return NextResponse.json(formattedExercise);
  } catch (error) {
    console.error('Error fetching practice exercise:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch practice exercise' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const now = new Date().toISOString();

    const updateData: any = {
      updated_at: now,
    };

    if (languageId !== undefined) updateData.language_id = languageId;
    if (chapterId !== undefined) updateData.chapter_id = chapterId || null;
    if (type !== undefined) updateData.type = type;
    if (title !== undefined) updateData.title = title || null;
    if (description !== undefined) updateData.description = description;
    if (descriptionJapanese !== undefined) updateData.description_japanese = descriptionJapanese || null;
    if (explanation !== undefined) updateData.explanation = explanation || null;
    if (testCases !== undefined) updateData.test_cases = testCases || null;
    if (choices !== undefined) updateData.choices = choices || null;
    if (correctAnswer !== undefined) {
      updateData.correct_answer = correctAnswer 
        ? (Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer])
        : null;
    }
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (order !== undefined) updateData.order = order;
    if (status !== undefined) updateData.status = status;

    const { data, error } = await supabaseAdmin
      .from('programming_practice_exercises')
      .update(updateData)
      .eq('id', params.id)
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

    return NextResponse.json(formattedExercise);
  } catch (error) {
    console.error('Error updating practice exercise:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update practice exercise' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabaseAdmin
      .from('programming_practice_exercises')
      .delete()
      .eq('id', params.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting practice exercise:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete practice exercise' },
      { status: 500 }
    );
  }
}

