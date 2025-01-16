import * as XLSX from 'xlsx';
import { generateSpeechFromText, uploadToVideoIndexer } from './azure-services';

interface ContentRow {
  japaneseText: string;
  englishText: string;
  videoUrl?: string;
}

export async function processSpreadsheet(file: File): Promise<{
  success: ContentRow[];
  errors: { row: number; error: string }[];
}> {
  const result = {
    success: [] as ContentRow[],
    errors: [] as { row: number; error: string }[],
  };

  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(worksheet) as ContentRow[];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        // Validate row data
        if (!row.japaneseText || !row.englishText) {
          throw new Error('Missing required text fields');
        }

        // Process video if URL is provided
        let videoId: string | undefined;
        if (row.videoUrl) {
          try {
            const videoResponse = await fetch(row.videoUrl);
            const videoBlob = await videoResponse.blob();
            const videoFile = new File([videoBlob], `video_${i}.mp4`, {
              type: 'video/mp4',
            });
            videoId = await uploadToVideoIndexer(
              videoFile,
              `batch_video_${Date.now()}_${i}`
            );
          } catch (error) {
            console.error('Error processing video:', error);
            throw new Error('Failed to process video URL');
          }
        }

        // Generate audio from English text
        const audioBlob = await generateSpeechFromText(row.englishText);

        // Add to successful results
        result.success.push({
          japaneseText: row.japaneseText,
          englishText: row.englishText,
          videoUrl: videoId ? `video-${videoId}` : undefined,
        });
      } catch (error) {
        result.errors.push({
          row: i + 2, // Add 2 to account for 1-based indexing and header row
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  } catch (error) {
    console.error('Error processing spreadsheet:', error);
    throw new Error('Failed to process spreadsheet');
  }

  return result;
}

export function generateExcelTemplate(): Blob {
  const worksheet = XLSX.utils.json_to_sheet([
    {
      japaneseText: '日本語テキストをここに入力',
      englishText: 'Enter English text here',
      videoUrl: 'https://example.com/video.mp4 (optional)',
    },
  ]);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Content');

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  return new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}
