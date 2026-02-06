-- Add 'cloud' type to programming_languages table CHECK constraint
ALTER TABLE programming_languages
DROP CONSTRAINT IF EXISTS programming_languages_type_check;

ALTER TABLE programming_languages
ADD CONSTRAINT programming_languages_type_check
CHECK (type IN ('language', 'framework', 'ai-platform', 'data-warehouse', 'others', 'saas', 'cloud'));


