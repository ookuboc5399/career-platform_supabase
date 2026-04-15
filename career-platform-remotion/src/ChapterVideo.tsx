import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export interface ChapterVideoProps {
  title: string;
  description: string;
  points: string[];
  audioFile?: string;
  bgImageFile?: string;
  languageName?: string;
}

const TITLE_DURATION_S = 4;
const POINT_DURATION_S = 9;
const OUTRO_DURATION_S = 3;

// ====== Title Scene ======
const TitleScene: React.FC<{ title: string; languageName?: string }> = ({
  title,
  languageName,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, fps * 0.6], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const y = spring({ frame, fps, from: 60, to: 0, config: { stiffness: 80, damping: 18 } });
  const lineWidth = interpolate(frame, [fps * 0.5, fps * 1.5], [0, 120], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 80,
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${y}px)`,
          textAlign: 'center',
          maxWidth: 900,
        }}
      >
        {languageName && (
          <div
            style={{
              fontSize: 22,
              color: 'rgba(255,255,255,0.75)',
              marginBottom: 20,
              letterSpacing: 4,
              textTransform: 'uppercase',
            }}
          >
            {languageName}
          </div>
        )}
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: 'white',
            lineHeight: 1.3,
            marginBottom: 32,
            textShadow: '0 4px 24px rgba(0,0,0,0.3)',
          }}
        >
          {title}
        </div>
        <div
          style={{
            height: 5,
            width: lineWidth,
            background: 'rgba(255,255,255,0.8)',
            borderRadius: 3,
            margin: '0 auto',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ====== Point Scene ======
const PointScene: React.FC<{
  point: string;
  index: number;
  total: number;
  bgImageFile?: string;
}> = ({ point, index, total, bgImageFile }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, fps * 0.4], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const x = spring({ frame, fps, from: -80, to: 0, config: { stiffness: 90, damping: 22 } });

  const barColors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
  const barColor = barColors[index % barColors.length];

  return (
    <AbsoluteFill>
      {bgImageFile && (
        <Img
          src={staticFile(bgImageFile)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.12,
          }}
        />
      )}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 100px',
        }}
      >
        <div style={{ opacity, transform: `translateX(${x}px)`, maxWidth: 900 }}>
          <div
            style={{
              color: barColor,
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 20,
              letterSpacing: 2,
            }}
          >
            POINT {index + 1} / {total}
          </div>
          <div
            style={{
              fontSize: 38,
              color: 'white',
              lineHeight: 1.65,
              fontWeight: 600,
              borderLeft: `5px solid ${barColor}`,
              paddingLeft: 36,
            }}
          >
            {point}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ====== Outro Scene ======
const OutroScene: React.FC<{ title: string }> = ({ title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const scale = spring({ frame, fps, from: 0.8, to: 1, config: { stiffness: 80, damping: 18 } });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 80,
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 24, color: '#818cf8', marginBottom: 16 }}>まとめ</div>
        <div style={{ fontSize: 42, fontWeight: 700, color: 'white' }}>{title}</div>
        <div
          style={{
            marginTop: 32,
            fontSize: 18,
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          学習お疲れ様でした
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ====== Main Composition ======
export const ChapterVideo: React.FC<ChapterVideoProps> = ({
  title,
  description,
  points,
  audioFile,
  bgImageFile,
  languageName,
}) => {
  const { fps } = useVideoConfig();

  const titleDuration = fps * TITLE_DURATION_S;
  const pointDuration = fps * POINT_DURATION_S;
  const outroDuration = fps * OUTRO_DURATION_S;

  return (
    <AbsoluteFill style={{ background: '#0f172a', fontFamily: '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif' }}>
      {audioFile && <Audio src={staticFile(audioFile)} />}

      {/* Title */}
      <Sequence from={0} durationInFrames={titleDuration}>
        <TitleScene title={title} languageName={languageName} />
      </Sequence>

      {/* Points */}
      {points.map((point, i) => (
        <Sequence
          key={i}
          from={titleDuration + i * pointDuration}
          durationInFrames={pointDuration}
        >
          <PointScene
            point={point}
            index={i}
            total={points.length}
            bgImageFile={bgImageFile}
          />
        </Sequence>
      ))}

      {/* Outro */}
      <Sequence
        from={titleDuration + points.length * pointDuration}
        durationInFrames={outroDuration}
      >
        <OutroScene title={title} />
      </Sequence>
    </AbsoluteFill>
  );
};
