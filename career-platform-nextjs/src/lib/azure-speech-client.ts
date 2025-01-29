import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';

export function createSpeechConfig() {
  if (typeof window === 'undefined') {
    throw new Error('Speech SDK can only be initialized in the browser');
  }

  const speechKey = process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY;
  const speechRegion = process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION;

  console.log('Speech SDK Configuration:', {
    key: speechKey ? '***' : 'missing',
    region: speechRegion,
  });

  if (!speechKey || !speechRegion) {
    throw new Error('Speech SDK configuration is missing');
  }

  const speechConfig = speechsdk.SpeechConfig.fromSubscription(speechKey, speechRegion);
  speechConfig.speechRecognitionLanguage = 'en-US';
  speechConfig.speechSynthesisLanguage = 'en-US';

  return speechConfig;
}

export function createSpeechRecognizer(speechConfig: speechsdk.SpeechConfig) {
  console.log('Creating speech recognizer...');
  const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
  const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);

  // デバッグ用のイベントハンドラを追加
  recognizer.recognizing = (s, e) => {
    console.log('Recognizing:', e.result.text);
  };

  recognizer.recognized = (s, e) => {
    if (e.result.reason === speechsdk.ResultReason.RecognizedSpeech) {
      console.log('Recognized:', e.result.text);
    } else {
      console.log('Recognition failed:', e.result.reason);
    }
  };

  recognizer.canceled = (s, e) => {
    console.log('Recognition canceled:', {
      reason: e.reason,
      errorDetails: e.errorDetails,
    });
  };

  recognizer.sessionStarted = (s, e) => {
    console.log('Recognition session started:', e);
  };

  recognizer.sessionStopped = (s, e) => {
    console.log('Recognition session stopped:', e);
  };

  return recognizer;
}

export function createSpeechSynthesizer(speechConfig: speechsdk.SpeechConfig) {
  console.log('Creating speech synthesizer...');
  return new speechsdk.SpeechSynthesizer(speechConfig);
}

export async function synthesizeSpeech(synthesizer: speechsdk.SpeechSynthesizer, text: string) {
  console.log('Synthesizing speech:', text);
  return new Promise<speechsdk.SpeechSynthesisResult>((resolve, reject) => {
    synthesizer.speakTextAsync(
      text,
      result => {
        console.log('Speech synthesis result:', {
          reason: result.reason,
        });
        resolve(result);
      },
      error => {
        console.error('Speech synthesis error:', error);
        reject(error);
      }
    );
  });
}
