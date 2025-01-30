import { NextRequest, NextResponse } from 'next/server';
import { getEnglishMoviesContainer } from '@/lib/cosmos-db';
import { processYouTubeContent } from '@/lib/azure-movie-processor';
import { getYouTubeInfo } from '@/lib/youtube-info';

export async function GET() {
  try {
    const container = await getEnglishMoviesContainer();
    const { resources } = await container.items
      .query({
        query: 'SELECT * FROM c ORDER BY c.createdAt DESC',
      })
      .fetchAll();

    return NextResponse.json(resources);
  } catch (error) {
    console.error('Error getting movies:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json(
      { error: 'Failed to get movies' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const movie = await request.json();
    const container = await getEnglishMoviesContainer();

    // 新規作成時はIDを生成
    if (!movie.id) {
      movie.id = crypto.randomUUID();
    }

    // 作成日時を設定
    if (!movie.createdAt) {
      movie.createdAt = new Date().toISOString();
    }

    // 処理状態の初期化
    movie.processed = false;
    movie.error = null;
    movie.lastProcessingTime = new Date().toISOString();
    movie.lastProcessingStage = 'pending';

    // YouTube動画の場合は情報を取得
    if (movie.videoUrl && (movie.videoUrl.includes('youtube.com') || movie.videoUrl.includes('youtu.be'))) {
      try {
        const info = await getYouTubeInfo(movie.videoUrl);
        movie.originalTitle = info.title;
        movie.originalDescription = info.description;
        movie.duration = info.duration;
        movie.thumbnailUrl = info.thumbnailUrl;

        // GPT-4で処理
        console.log('Processing with GPT-4...');
        const generatedContent = await processYouTubeContent(
          movie.videoUrl,
          movie.originalTitle,
          movie.originalDescription,
          movie.duration
        );

        // 生成されたコンテンツを追加
        movie.title = generatedContent.title;
        movie.description = generatedContent.description;
        movie.level = generatedContent.level;
        movie.tags = generatedContent.tags;
        movie.subtitles = generatedContent.subtitles;
        movie.vocabulary = generatedContent.vocabulary;
        movie.processed = true;
        movie.error = null;
        movie.lastProcessingTime = new Date().toISOString();
        movie.lastProcessingStage = 'completed';

        console.log('Content generated successfully:', {
          title: generatedContent.title,
          level: generatedContent.level,
          subtitlesCount: generatedContent.subtitles.length,
          vocabularyCount: generatedContent.vocabulary.length
        });
      } catch (error) {
        console.error('Error processing YouTube content:', error);
        if (error instanceof Error) {
          console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            context: {
              videoUrl: movie.videoUrl
            }
          });
        }
        movie.error = error instanceof Error ? error.message : 'Failed to process content';
        movie.lastProcessingStage = 'failed';
      }
    }

    // 動画情報を保存
    try {
      const { resource } = await container.items.create({
        ...movie,
        id: movie.id,
        partitionKey: movie.id
      });

      return NextResponse.json(resource);
    } catch (error) {
      console.error('Error creating movie:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
          context: {
            movieId: movie.id
          }
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error in POST handler:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create movie' },
      { status: 500 }
    );
  }
}
