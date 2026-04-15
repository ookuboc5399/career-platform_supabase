/** Supabase Storage の object key にそのまま使う想定のファイル名（`{timestamp}-{name}` の name 部分） */
const UPLOAD_BASENAME_PATTERN = /^[a-zA-Z0-9._-]+$/;

export const STORAGE_UPLOAD_FILENAME_HINT =
  'ファイル名は英数字・ハイフン(-)・アンダースコア(_)・ドット(.)のみにしてください。全角記号・スペース・日本語などは使えません。名前を変更してから再度アップロードしてください。';

export function isStorageUploadFileNameAllowed(fileName: string): boolean {
  if (!fileName || fileName !== fileName.trim()) return false;
  if (fileName.includes('/') || fileName.includes('\\') || fileName.includes('..')) return false;
  return UPLOAD_BASENAME_PATTERN.test(fileName);
}
