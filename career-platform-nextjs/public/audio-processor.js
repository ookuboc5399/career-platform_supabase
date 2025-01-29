class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 4096;
    this.buffer = new Float32Array(this.bufferSize);
    this.bufferIndex = 0;
    this.sampleRate = 16000; // Required sample rate for Azure OpenAI
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const channel = input[0];

    if (!channel) return true;

    // Add samples to buffer
    for (let i = 0; i < channel.length; i++) {
      this.buffer[this.bufferIndex++] = channel[i];

      // When buffer is full, send it to main thread
      if (this.bufferIndex === this.bufferSize) {
        try {
          // Convert Float32Array to Int16Array for PCM16 format
          const pcmData = new Int16Array(this.bufferSize);
          for (let j = 0; j < this.bufferSize; j++) {
            // Clamp values to [-1, 1]
            const s = Math.max(-1, Math.min(1, this.buffer[j]));
            // Convert to 16-bit PCM
            pcmData[j] = s < 0 ? s * 0x8000 : s * 0x7FFF;
          }

          // Send the PCM data to the main thread
          this.port.postMessage({
            type: 'audioData',
            data: pcmData
          });

          // Reset buffer
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
