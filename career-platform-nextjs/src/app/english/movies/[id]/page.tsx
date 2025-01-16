interface MovieDetailPageProps {
  params: {
    id: string;
  };
}

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
  // 実際のアプリケーションではAPIから取得
  const movieData = {
    title: "インセプション",
    description: "クリストファー・ノーラン監督による傑作SF映画。ビジネスシーンや科学的な表現が豊富に登場します。",
    level: "中級",
    duration: "2時間 28分",
    scenes: [
      {
        time: "0:15:30",
        title: "ビジネスミーティング",
        dialogue: {
          english: "We need to go deeper into the subconscious.",
          japanese: "より深い潜在意識に入る必要がある。",
          explanation: "ビジネスの文脈でよく使用される「go deeper into」（より深く掘り下げる）という表現を学びます。"
        },
        keyPhrases: [
          {
            phrase: "go deeper into",
            meaning: "より深く掘り下げる",
            examples: [
              "Let's go deeper into the market analysis.",
              "We need to go deeper into this issue."
            ]
          },
          {
            phrase: "subconscious",
            meaning: "潜在意識",
            examples: [
              "The subconscious mind is powerful.",
              "It affects your subconscious behavior."
            ]
          }
        ]
      },
      {
        time: "0:45:20",
        title: "チーム戦略会議",
        dialogue: {
          english: "We need a kick to synchronize with the inner ear.",
          japanese: "内耳と同期するためのキックが必要だ。",
          explanation: "科学的な文脈での「synchronize with」（同期する）という表現を学びます。"
        },
        keyPhrases: [
          {
            phrase: "synchronize with",
            meaning: "〜と同期する",
            examples: [
              "Please synchronize with the server.",
              "The devices need to synchronize with each other."
            ]
          }
        ]
      }
    ],
    vocabulary: [
      {
        category: "ビジネス用語",
        words: [
          { word: "inception", meaning: "開始、着手", usage: "The inception of this project was last year." },
          { word: "extraction", meaning: "抽出", usage: "Data extraction is an important process." }
        ]
      },
      {
        category: "科学用語",
        words: [
          { word: "subconscious", meaning: "潜在意識", usage: "The subconscious mind influences our decisions." },
          { word: "projection", meaning: "投影", usage: "This is a projection of your fears." }
        ]
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">{movieData.title}</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <p className="text-gray-300 text-lg mb-4">{movieData.description}</p>
          <div className="flex gap-4">
            <span className="px-3 py-1 bg-blue-500 rounded text-white">
              難易度: {movieData.level}
            </span>
            <span className="px-3 py-1 bg-gray-600 rounded text-white">
              {movieData.duration}
            </span>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-white mb-6">
            学習シーン
          </h2>
          {movieData.scenes.map((scene, index) => (
            <div
              key={scene.time}
              className="bg-gray-800 rounded-lg overflow-hidden"
            >
              <div className="bg-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">
                    {scene.title}
                  </h3>
                  <span className="text-gray-400">{scene.time}</span>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  <p className="text-lg text-blue-400">{scene.dialogue.english}</p>
                  <p className="text-gray-300">{scene.dialogue.japanese}</p>
                  <p className="text-sm text-gray-400">{scene.dialogue.explanation}</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-white">
                    重要フレーズ
                  </h4>
                  {scene.keyPhrases.map((phrase) => (
                    <div
                      key={phrase.phrase}
                      className="bg-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-400 font-medium">
                          {phrase.phrase}
                        </span>
                        <span className="text-gray-300">
                          {phrase.meaning}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {phrase.examples.map((example) => (
                          <p key={example} className="text-sm text-gray-400">
                            例: {example}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-white mb-6">
            重要語彙
          </h2>
          <div className="space-y-6">
            {movieData.vocabulary.map((category) => (
              <div key={category.category}>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {category.category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.words.map((word) => (
                    <div
                      key={word.word}
                      className="bg-gray-800 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-400 font-medium">
                          {word.word}
                        </span>
                        <span className="text-gray-300">
                          {word.meaning}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        例: {word.usage}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
