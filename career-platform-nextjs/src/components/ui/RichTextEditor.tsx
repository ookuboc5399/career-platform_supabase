"use client";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  height = 'h-64',
  placeholder,
}: RichTextEditorProps) {
  return (
    <div className={`${height} mb-12`}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
    </div>
  );
}
