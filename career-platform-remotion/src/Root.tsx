import React from 'react';
import { Composition } from 'remotion';
import { ChapterVideo, ChapterVideoProps } from './ChapterVideo';

const FPS = 30;
const TITLE_DURATION_S = 4;
const POINT_DURATION_S = 9;
const OUTRO_DURATION_S = 3;

function calcDuration(points: string[]): number {
  return FPS * (TITLE_DURATION_S + points.length * POINT_DURATION_S + OUTRO_DURATION_S);
}

const defaultProps: ChapterVideoProps = {
  title: 'チャプタータイトル',
  description: 'チャプターの説明',
  points: [
    'ポイント1: 基本的な概念の理解',
    'ポイント2: 実践的な使い方',
    'ポイント3: 応用テクニック',
  ],
  languageName: 'プログラミング学習',
};

export const Root: React.FC = () => {
  return (
    <Composition
      id="ChapterVideo"
      component={ChapterVideo}
      durationInFrames={calcDuration(defaultProps.points)}
      fps={FPS}
      width={1280}
      height={720}
      defaultProps={defaultProps}
      calculateMetadata={({ props }) => ({
        durationInFrames: calcDuration(props.points),
      })}
    />
  );
};
