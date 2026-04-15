-- Add pdf_url column to programming_chapters table
ALTER TABLE programming_chapters ADD COLUMN IF NOT EXISTS pdf_url TEXT;
