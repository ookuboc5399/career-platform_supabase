export interface WebSocketClientOptions {
  endpoint: string;
  apiKey: string;
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (error: Error) => void;
  onMessage?: (data: any) => void;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private endpoint: string;
  private apiKey: string;
  private onOpen?: () => void;
  private onClose?: (event: CloseEvent) => void;
  private onError?: (error: Error) => void;
  public onMessage?: (data: any) => void;
  private connectionPromise: Promise<void> | null = null;

  constructor(options: WebSocketClientOptions) {
    this.endpoint = options.endpoint;
    this.apiKey = options.apiKey;
    this.onOpen = options.onOpen;
    this.onClose = options.onClose;
    this.onError = options.onError;
    this.onMessage = options.onMessage;
  }

  connect(): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        console.log('Connecting to WebSocket server...', {
          endpoint: this.endpoint,
          readyState: this.ws?.readyState
        });

        // Add api-key as a query parameter
        const url = new URL(this.endpoint);
        url.searchParams.append('api-key', this.apiKey);
        
        console.log('WebSocket URL:', url.toString());
        this.ws = new WebSocket(url.toString());

        this.ws.onopen = () => {
          console.log('WebSocket connection established', {
            readyState: this.ws?.readyState
          });
          this.onOpen?.();
          resolve();
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket connection closed', {
            code: event.code,
            reason: event.reason || 'No reason provided',
            wasClean: event.wasClean,
            readyState: this.ws?.readyState
          });
          this.ws = null;
          this.connectionPromise = null;
          this.onClose?.(event);
        };

        this.ws.onerror = (event) => {
          const error = new Error('WebSocket connection error');
          console.error('WebSocket error:', {
            error,
            event,
            readyState: this.ws?.readyState
          });
          this.onError?.(error);
          reject(error);
        };

        this.ws.onmessage = (event) => {
          try {
            let data;
            if (typeof event.data === 'string') {
              try {
                data = JSON.parse(event.data);
                console.log('Received message:', {
                  data,
                  readyState: this.ws?.readyState
                });
              } catch {
                console.log('Received non-JSON message:', {
                  data: event.data,
                  readyState: this.ws?.readyState
                });
                data = event.data;
              }
            } else if (event.data instanceof Blob) {
              console.log('Received binary data:', {
                data: event.data,
                readyState: this.ws?.readyState
              });
              return;
            }

            this.onMessage?.(data);
          } catch (error) {
            console.error('Error parsing message:', {
              error,
              readyState: this.ws?.readyState
            });
            this.onError?.(error as Error);
          }
        };
      } catch (error) {
        console.error('Error creating WebSocket:', {
          error,
          readyState: this.ws?.readyState
        });
        this.connectionPromise = null;
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  async send(data: any): Promise<void> {
    try {
      // Always wait for connection to be established
      await this.connect();

      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        throw new Error(`WebSocket connection is not established (readyState: ${this.ws?.readyState})`);
      }

      const message = typeof data === 'string' ? data : JSON.stringify(data);
      console.log('Sending message:', {
        message,
        readyState: this.ws.readyState
      });
      this.ws.send(message);
    } catch (error) {
      console.error('Error sending message:', {
        error,
        readyState: this.ws?.readyState
      });
      throw error;
    }
  }

  close() {
    if (this.ws) {
      console.log('Closing WebSocket connection', {
        readyState: this.ws.readyState
      });
      this.ws.close();
      this.ws = null;
      this.connectionPromise = null;
    }
  }

  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}
