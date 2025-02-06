import { NextRequest, NextResponse } from 'next/server';
import { getEnglishMoviesContainer } from '@/lib/cosmos-db';
import { processYouTubeContent } from '@/lib/azure-movie-processor';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const movieId = params.id;
  try {
    const data = await request.json();
    const container = await getEnglishMoviesContainer();

    // 既存のデータを取得
    try {
      const { resource } = await container.item(movieId, movieId).read();
      if (!resource) {
        return NextResponse.json(
          { error: 'Movie not found' },
          { status: 404 }
        );
      }

      // データを更新
      const updatedMovie = {
        ...resource,
        ...data,
        id: movieId, // IDは変更不可
      };

      // 動画URLが変更された場合は再処理を開始
      if (data.videoUrl && data.videoUrl !== resource.videoUrl) {
        try {
          // YouTube URLの場合は GPT-4 で処理
          if (data.videoUrl.includes('youtube.com') || data.videoUrl.includes('youtu.be')) {
            console.log('Processing with GPT-4...');
            const generatedContent = await processYouTubeContent(
              data.videoUrl,
              updatedMovie.originalTitle,
              updatedMovie.originalDescription,
              updatedMovie.duration
            );

            // 生成されたコンテンツを更新データに追加
            updatedMovie.title = generatedContent.title;
            updatedMovie.description = generatedContent.description;
            updatedMovie.level = generatedContent.level;
            updatedMovie.tags = generatedContent.tags;
            updatedMovie.subtitles = generatedContent.subtitles;
            updatedMovie.vocabulary = generatedContent.vocabulary;
            updatedMovie.processed = true;
            updatedMovie.error = null;
            updatedMovie.lastProcessingTime = new Date().toISOString();
            updatedMovie.lastProcessingStage = 'completed';

            console.log('Content generated successfully:', {
              title: generatedContent.title,
              level: generatedContent.level,
              subtitlesCount: generatedContent.subtitles.length,
              vocabularyCount: generatedContent.vocabulary.length
            });
          }
        } catch (error: any) {
          console.error('Error processing YouTube content:', error);
          updatedMovie.processed = false;
          updatedMovie.error = error instanceof Error ? error.message : 'Failed to process content';
          updatedMovie.lastProcessingTime = new Date().toISOString();
          updatedMovie.lastProcessingStage = 'failed';
        }
      }

      // データベースに保存
      await container.item(movieId, movieId).replace(updatedMovie);
      return NextResponse.json(updatedMovie);

    } catch (error) {
      console.error('Error details:', error);
      if (error instanceof Error && error.message.includes('Entity with the specified id does not exist')) {
        return NextResponse.json(
          { error: 'Movie not found' },
          { status: 404 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Error updating movie:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        context: {
          movieId
        }
      });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update movie' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const movieId = params.id;
  try {
    const container = await getEnglishMoviesContainer();
    try {
      await container.item(movieId, movieId).delete();
      return NextResponse.json({ success: true });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Entity with the specified id does not exist')) {
        return NextResponse.json(
          { error: 'Movie not found' },
          { status: 404 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Error deleting movie:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        context: {
          movieId
        }
      });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete movie' },
      { status: 500 }
    );
  }
}
