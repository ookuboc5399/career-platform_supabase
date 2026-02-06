'use client';

import { ReactNode } from 'react';

interface UnderlinedTextProps {
  text: string;
  underlines?: {
    start: number;
    end: number;
    color?: string;
  }[];
}

export function UnderlinedText({ text, underlines = [] }: UnderlinedTextProps) {
  if (!underlines.length) {
    return <span>{text}</span>;
  }

  // 下線を位置でソート
  const sortedUnderlines = [...underlines].sort((a, b) => a.start - b.start);

  // テキストを分割して下線付きと通常のテキストを作成
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  sortedUnderlines.forEach((underline, index) => {
    // 下線の前のテキスト
    if (underline.start > lastIndex) {
      parts.push(
        <span key={`text-${index}`}>
          {text.slice(lastIndex, underline.start)}
        </span>
      );
    }

    // 下線付きテキスト
    parts.push(
      <span
        key={`underline-${index}`}
        className="relative"
      >
        <span>{text.slice(underline.start, underline.end)}</span>
        <span
          className="absolute bottom-0 left-0 w-full"
          style={{
            borderBottom: `2px solid ${underline.color || '#3b82f6'}`,
          }}
        />
      </span>
    );

    lastIndex = underline.end;
  });

  // 最後の下線以降のテキスト
  if (lastIndex < text.length) {
    parts.push(
      <span key="text-end">
        {text.slice(lastIndex)}
      </span>
    );
  }

  return <>{parts}</>;
}
