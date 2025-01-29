import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

export async function textToSpeech(text: string): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.AZURE_SPEECH_KEY!,
      process.env.AZURE_SPEECH_REGION!
    );
    speechConfig.speechSynthesisVoiceName = 'en-US-JennyNeural';

    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

    const ssml = `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
        <voice name="en-US-JennyNeural">
          ${text}
        </voice>
      </speak>
    `;

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
