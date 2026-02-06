import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

export async function textToSpeechJa(text: string): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY!,
      process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION!
    );
    speechConfig.speechSynthesisVoiceName = 'ja-JP-NanamiNeural';

    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

    const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ja-JP"><voice name="ja-JP-NanamiNeural"><prosody rate="1" pitch="0">${text}</prosody></voice></speak>`;

    synthesizer.speakSsmlAsync(
      ssml,
      (result) => {
        if (result.errorDetails) {
          reject(new Error(result.errorDetails));
        }
        const { audioData } = result;
        synthesizer.close();
        resolve(audioData);
      },
      (error) => {
        synthesizer.close();
        reject(error);
      }
    );
  });
}
