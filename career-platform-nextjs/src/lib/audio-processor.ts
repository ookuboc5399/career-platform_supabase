/// <reference path="../types/audio-worklet.d.ts" />

class AudioProcessor extends AudioWorkletProcessor {
  protected sampleRate: number;
  protected bufferSize: number;
  protected buffer: Float32Array;
  protected bufferIndex: number;

  constructor() {
    super();
    this.sampleRate = 16000; // Azure OpenAIのリアルタイム音声認識は16kHzを使用
    this.bufferSize = this.sampleRate / 10; // 100msのバッファ
    this.buffer = new Float32Array(this.bufferSize);
    this.bufferIndex = 0;

    this.port.onmessage = this.handleMessage.bind(this);
    console.log('AudioProcessor initialized');
  }

  protected handleMessage(event: MessageEvent) {
    if (event.data.type === 'init') {
      console.log('AudioProcessor received init message');
    }
  }

  process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>) {
    const input = inputs[0];
    const output = outputs[0];

    if (input.length > 0) {
      const inputChannel = input[0];
      
      // Process audio data
      if (output.length > 0) {
        const outputChannel = output[0];
        for (let i = 0; i < inputChannel.length; i++) {
          outputChannel[i] = inputChannel[i];
          
          // Add sample to buffer
          this.buffer[this.bufferIndex++] = inputChannel[i];
          
          // When buffer is full, send it to main thread
          if (this.bufferIndex >= this.bufferSize) {
            this.port.postMessage({
              type: 'audioData',
              data: this.buffer.slice()
            });
            this.bufferIndex = 0;
          }
        }
      }
    }

    return true;
  }
}

// Register the processor
registerProcessor('audio-processor', AudioProcessor);
