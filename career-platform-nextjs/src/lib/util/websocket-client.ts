// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ConnectionSettings } from "./interfaces";
import {
  WebSocket,
  ErrorEvent,
  CloseEvent,
  MessageEvent,
  sendMessage,
  getWebsocket,
} from "./websocket";

type ResolveFn<T> = (value: IteratorResult<T>) => void;
type RejectFn<E> = (reason: E) => void;

export type ValidatorResult<T> =
  | { success: true; message: T }
  | { success: false; error: Error };

export const validationSuccess = <T>(message: T): ValidatorResult<T> => ({
  success: true,
  message,
});
export const validationError = <T>(error: Error): ValidatorResult<T> => ({
  success: false,
  error,
});
const isValidatorSuccess = <T>(
  result: ValidatorResult<T>,
): result is { success: true; message: T } => result.success;

export type ValidateProtocolMessage<T> = (
  message: MessageEvent,
) => ValidatorResult<T>;
export type SerializeMessage<T> = (
  message: T,
) => string | ArrayBufferLike | ArrayBufferView;

export interface MessageProtocolHandler<U, D> {
  validate: ValidateProtocolMessage<D>;
  serialize: SerializeMessage<U>;
}

export class WebSocketClient<U, D> implements AsyncIterable<D> {
  private socket!: WebSocket;
  private connectedPromise: Promise<void>;
  private closedPromise: Promise<void> | undefined = undefined;
  private error: Error | undefined;
  private messageQueue: D[] = [];
  private validate: ValidateProtocolMessage<D>;
  private serialize: SerializeMessage<U>;

  private receiverQueue: [ResolveFn<D>, RejectFn<Error>][] = [];
  private done: boolean = false;

  constructor(
    settings: ConnectionSettings,
    handler: MessageProtocolHandler<U, D>,
  ) {
    this.validate = handler.validate;
    this.serialize = handler.serialize;
    this.connectedPromise = new Promise((resolve, reject) => {
      getWebsocket(settings).then(socket => {
        this.socket = socket;
        this.socket.onopen = () => {
          this.socket.onmessage = this.getMessageHandler();
          this.closedPromise = new Promise((resolve) => {
            this.socket.onclose = this.getClosedHandler(resolve);
          });
          this.socket.onerror = this.handleError;
          resolve();
        };
        this.socket.onerror = (event: ErrorEvent) => {
          this.error = event.error;
          reject(event);
        };
      }).catch(reject);
    });
  }

  private handleError(event: ErrorEvent) {
    this.error = event.error;
    while (this.receiverQueue.length > 0) {
      const [_, reject] = this.receiverQueue.shift()!;
      reject(event.error);
    }
  }

  private getClosedHandler(
    closeResolve: (_: void) => void,
  ): (_: CloseEvent) => void {
    return (_: CloseEvent) => {
      this.done = true;
      while (this.receiverQueue.length > 0) {
        const [resolve, reject] = this.receiverQueue.shift()!;
        if (this.error) {
          reject(this.error);
        } else {
          resolve({ value: undefined, done: true });
        }
      }
      closeResolve();
    };
  }

  private getMessageHandler(): (event: MessageEvent) => void {
    const self = this;
    return (event: MessageEvent) => {
      const result = self.validate(event);
      if (isValidatorSuccess(result)) {
        const { message } = result;
        if (self.receiverQueue.length > 0) {
          const [resolve, _] = self.receiverQueue.shift()!;
          resolve({ value: message, done: false });
        } else {
          self.messageQueue.push(message);
        }
      } else {
        self.error = result.error;
        self.socket.close(1000, "Unexpected message received");
      }
    };
  }

  async *[Symbol.asyncIterator](): AsyncIterator<D> {
    while (!this.done) {
      if (this.error) {
        throw this.error;
      } else if (this.messageQueue.length > 0) {
        yield this.messageQueue.shift()!;
      } else {
        const result = await new Promise<IteratorResult<D>>((resolve, reject) => {
          this.receiverQueue.push([resolve, reject]);
        });
        if (result.done) {
          break;
        }
        yield result.value;
      }
    }
  }

  async send(message: U): Promise<void> {
    await this.connectedPromise;
    if (this.error) {
      throw this.error;
    }
    const serialized = this.serialize(message);
    return sendMessage(this.socket, serialized);
  }

  async close(): Promise<void> {
    await this.connectedPromise;
    if (this.done) {
      return;
    }
    this.socket.close();
    await this.closedPromise;
  }
}
