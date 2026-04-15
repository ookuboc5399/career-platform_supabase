-- programming_languages.type に ai / ui-ux / iaas / network を含む CHECK を再定義
-- （既存の環境によって含まれる値が異なるため、フロントで使用するすべての type を列挙）
ALTER TABLE programming_languages
DROP CONSTRAINT IF EXISTS programming_languages_type_check;

ALTER TABLE programming_languages
ADD CONSTRAINT programming_languages_type_check
CHECK (
  type IN (
    'language',
    'framework',
    'ai-platform',
    'data-warehouse',
    'others',
    'saas',
    'cloud',
    'network',
    'iaas',
    'ai',
    'ui-ux'
  )
);
