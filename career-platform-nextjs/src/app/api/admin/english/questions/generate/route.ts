import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { uploadFile, CONTAINERS } from '@/lib/storage';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fileId, type } = body;

    if (!fileId || !type) {
      return NextResponse.json(
        { error: 'fileId and type are required' },
        { status: 400 }
      );
    }

    const { google } = await import('googleapis');
    const { OAuth2Client } = await import('google-auth-library');
    const path = await import('path');
    const fs = await import('fs/promises');

    const credentialsPath = path.join(process.cwd(), 'roadtoentrepreneur-6b8b51ad767a.json');
    const credentials = JSON.parse(await fs.readFile(credentialsPath, 'utf8'));

    const auth = new OAuth2Client({
      clientId: credentials.client_id,
      clientSecret: credentials.client_secret,
      redirectUri: credentials.redirect_uris[0],
    });
    auth.setCredentials({ refresh_token: credentials.refresh_token });

    const drive = google.drive({ version: 'v3', auth });
    const { data: { files } } = await drive.files.list({
      q: `'${fileId}' in parents and mimeType contains 'image/'`,
      fields: 'files(id, name)',
      orderBy: 'name',
    });

    if (!files?.length) {
      return NextResponse.json({ error: 'No image files found' }, { status: 404 });
    }

    const allQuestions: Array<{ id: string; type: string; content: unknown; createdAt: string }> = [];

    for (const file of files) {
      if (!file.id) continue;

      const response = await drive.files.get(
        { fileId: file.id, alt: 'media' },
        { responseType: 'arraybuffer' }
      );
      const imageBuffer = Buffer.from(response.data as ArrayBuffer);
      const fileName = `${Date.now()}-${file.id}.png`;

      const imageUrl = await uploadFile(
        CONTAINERS.ENGLISH_NEWS_IMAGES,
        imageBuffer,
        fileName,
        'image/png'
      );

      const questions = await extractQuestionsFromImage(imageUrl);

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const id = `question-${Date.now()}-${file.id}-${i}`;
        const question = {
          id,
          type,
          category: null,
          level: null,
          difficulty: null,
          content: {
            ...(typeof q === 'object' && q !== null ? q : {}),
            imageUrl,
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data: created, error } = await supabaseAdmin!
          .from('english_questions')
          .insert(question)
          .select()
          .single();

        if (error) throw error;
        allQuestions.push({
          id: created.id,
          type: created.type,
          content: created.content,
          createdAt: created.created_at,
        });
      }
    }

    return NextResponse.json(allQuestions);
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate questions' },
      { status: 500 }
    );
  }
}

async function extractQuestionsFromImage(_imageUrl: string): Promise<unknown[]> {
  return [];
}
