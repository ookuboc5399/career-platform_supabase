declare class AudioWorkletProcessor {
  readonly port: MessagePort;
  constructor();
  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>
  ): boolean;
}

declare function registerProcessor(
  name: string,
  processorCtor: new () => AudioWorkletProcessor
): void;

interface AudioWorkletGlobalScope {
  registerProcessor: typeof registerProcessor;
  currentFrame: number;
  currentTime: number;
  sampleRate: number;
  AudioWorkletProcessor: typeof AudioWorkletProcessor;
}

declare const globalThis: AudioWorkletGlobalScope;
