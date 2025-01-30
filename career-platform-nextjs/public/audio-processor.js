class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 2048;
    this.buffer = new Float32Array(this.bufferSize);
    this.bufferIndex = 0;
    this.sampleRate = 16000;
    this.isRecording = true;

    this.port.onmessage = (event) => {
      if (event.data.type === 'stop') {
        this.isRecording = false;
        this.flushBuffer();
      }
    };
  }

  flushBuffer() {
    if (this.bufferIndex > 0) {
      try {
        const pcmData = new Int16Array(this.bufferIndex);
        for (let j = 0; j < this.bufferIndex; j++) {
          const s = Math.max(-1, Math.min(1, this.buffer[j]));
          pcmData[j] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        this.port.postMessage({
          type: 'audioData',
          data: pcmData,
          isFinal: true
        });

        this.buffer = new Float32Array(this.bufferSize);
        this.bufferIndex = 0;
      } catch (error) {
        console.error('Error flushing buffer:', error);
      }
    }
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const channel = input[0];

    if (!channel || !this.isRecording) return true;

    for (let i = 0; i < channel.length; i++) {
      this.buffer[this.bufferIndex++] = channel[i];

      if (this.bufferIndex === this.bufferSize) {
        try {
          const pcmData = new Int16Array(this.bufferSize);
          for (let j = 0; j < this.bufferSize; j++) {
            const s = Math.max(-1, Math.min(1, this.buffer[j]));
            pcmData[j] = s < 0 ? s * 0x8000 : s * 0x7FFF;
          }

          this.port.postMessage({
            type: 'audioData',
            data: pcmData,
            isFinal: false
          });

          this.buffer = new Float32Array(this.bufferSize);
          this.bufferIndex = 0;
        } catch (error) {
          console.error('Error processing audio data:', error);
        }
      }
    }

    return true;
  }
}

registerProcessor('audio-processor', AudioProcessor);
