import { WebSocketClient } from './websocket-client';

export interface RealtimeClientOptions {
  endpoint: string;
  apiKey: string;
}

export interface SessionOptions {
  model: string;
  temperature?: number;
  systemMessage?: string;
  voice?: string;
  inputAudioFormat?: string;
  outputAudioFormat?: string;
  onMessage?: (data: any) => void;
}

export interface Session {
  sendAudio: (audioData: number[]) => Promise<void>;
  send: (data: any) => Promise<void>;
  close: () => Promise<void>;
}

export class RealtimeClient {
  private endpoint: string;
  private apiKey: string;

  constructor(options: RealtimeClientOptions) {
    if (!options?.endpoint) {
      throw new Error('Endpoint is required');
    }
    if (!options?.apiKey) {
      throw new Error('API key is required');
    }

    this.endpoint = options.endpoint;
    this.apiKey = options.apiKey;
  }

  async createSession(options: SessionOptions): Promise<Session> {
    if (!options?.model) {
      throw new Error('Model is required');
    }

    console.log('Creating realtime session with options:', {
      ...options,
      apiKey: '[HIDDEN]',
      endpoint: this.endpoint,
      model: options.model
    });

    // Construct WebSocket endpoint for realtime API
    const wsEndpoint = `${this.endpoint}/openai/realtime?api-version=2024-10-01-preview&deployment=${options.model}`;
    console.log('WebSocket endpoint:', wsEndpoint);

    let resolveSessionConfig!: () => void;
    let rejectSessionConfig!: (error: Error) => void;
    const sessionConfigPromise = new Promise<void>((resolve, reject) => {
      resolveSessionConfig = resolve;
      rejectSessionConfig = reject;
    });

    const ws = new WebSocketClient({
      endpoint: wsEndpoint,
      apiKey: this.apiKey,
      onOpen: async () => {
        console.log('Session WebSocket connection opened');
        try {
          // Send session configuration
          const config = {
            type: 'session.update',
            session: {
              instructions: options.systemMessage || '',
              temperature: options.temperature || 0.7,
            },
          };
          console.log('Sending session configuration:', config);
          await ws.send(config);
          console.log('Session configuration sent successfully');
        } catch (error) {
          console.error('Error sending session config:', {
            error,
            endpoint: wsEndpoint,
            model: options.model
          });
          const errorMessage = `Failed to send session configuration: ${error instanceof Error ? error.message : String(error)}`;
          options.onMessage?.({
            type: 'error',
            message: errorMessage,
          });
          if (rejectSessionConfig) rejectSessionConfig(new Error(errorMessage));
          ws.close();
        }
      },
      onError: (error) => {
        console.error('Session WebSocket error:', {
          error,
          endpoint: wsEndpoint,
          model: options.model
        });
        options.onMessage?.({
          type: 'error',
          message: error.message,
        });
        if (rejectSessionConfig) rejectSessionConfig(error);
      },
      onClose: (event) => {
        console.log('WebSocket connection closed', {
          code: event.code,
          reason: event.reason || 'No reason provided',
          wasClean: event.wasClean,
          endpoint: wsEndpoint,
          model: options.model
        });
        options.onMessage?.({
          type: 'error',
          message: `WebSocket connection closed: ${event.reason || 'No reason provided'} (code: ${event.code})`,
        });
        if (rejectSessionConfig) rejectSessionConfig(new Error(`WebSocket connection closed: ${event.reason || 'No reason provided'} (code: ${event.code})`));
      },
      onMessage: (data) => {
        console.log('Received session message:', {
          data,
          endpoint: wsEndpoint,
          model: options.model
        });
        if (!options.onMessage) return;

        try {
          if (data.type === 'auth_success') {
            console.log('Authentication successful');
            if (resolveSessionConfig) resolveSessionConfig();
          } else if (data.type === 'transcript') {
            options.onMessage({
              type: 'transcript_delta',
              text: data.text,
            });
          } else if (data.type === 'transcript_complete') {
            options.onMessage({
              type: 'transcript_completed',
            });
          } else if (data.type === 'response') {
            options.onMessage({
              type: 'response_delta',
              text: data.text,
            });
          } else if (data.type === 'response_complete') {
            options.onMessage({
              type: 'response_completed',
            });
          } else if (data.type === 'error') {
            const errorMessage = data.message || data.error?.message || 'Unknown server error';
            console.error('Server error:', {
              message: errorMessage,
              data,
              endpoint: wsEndpoint,
              model: options.model
            });
            options.onMessage({
              type: 'error',
              message: errorMessage,
            });
            if (rejectSessionConfig) rejectSessionConfig(new Error(`Server error: ${errorMessage}`));
          }
        } catch (error) {
          console.error('Error handling message:', {
            error,
            data,
            endpoint: wsEndpoint,
            model: options.model
          });
          options.onMessage({
            type: 'error',
            message: 'Failed to process server response',
          });
          if (rejectSessionConfig) rejectSessionConfig(error as Error);
        }
      },
    });

    try {
      // Wait for the connection to be established
      await ws.connect();
      console.log('WebSocket connection established');

      // Wait for session configuration to be sent and acknowledged
      await sessionConfigPromise;
      console.log('Session configuration acknowledged');
    } catch (error) {
      console.error('Error establishing session:', {
        error,
        endpoint: wsEndpoint,
        model: options.model
      });
      ws.close();
      throw error;
    }

    return {
      sendAudio: async (audioData: number[]) => {
        if (!ws.isConnected()) {
          throw new Error('WebSocket connection is not established');
        }

        try {
          // Convert Int16Array to base64 string
          const base64 = btoa(String.fromCharCode(...audioData));
          
          // Send audio data
          await ws.send({
            type: 'input_audio_buffer.append',
            audio: base64,
          });
        } catch (error) {
          console.error('Error sending audio data:', {
            error,
            endpoint: wsEndpoint,
            model: options.model
          });
          throw new Error(`Failed to send audio data: ${error instanceof Error ? error.message : String(error)}`);
        }
      },
      send: async (data: any) => {
        if (!ws.isConnected()) {
          throw new Error('WebSocket connection is not established');
        }

        try {
          await ws.send(data);
        } catch (error) {
          console.error('Error sending data:', {
            error,
            endpoint: wsEndpoint,
            model: options.model
          });
          throw new Error(`Failed to send data: ${error instanceof Error ? error.message : String(error)}`);
        }
      },
      close: async () => {
        console.log('Closing session');
        try {
          if (ws.isConnected()) {
            await ws.send({ type: 'stop' });
          }
        } catch (error) {
          console.error('Error sending stop message:', {
            error,
            endpoint: wsEndpoint,
            model: options.model
          });
        } finally {
          ws.close();
        }
      },
    };
  }
}

export const createRealtimeClient = (options: RealtimeClientOptions) => {
  return new RealtimeClient(options);
};
