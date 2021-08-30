import { EventEmitter } from 'events';
import { MeloettaSettings } from '../types';
import { MeloettaClientUser } from './MeloettaClientUser';
import { WebSocketManager } from './ws/WebSocketManager';
import { Message } from './models/Message';

export interface ShowdownEvents {
  ready: () => void;
  connected: () => void;
  disconnected: (code: number, reason: string) => void;
  error: (err: Error) => void;
  noinit: (sections: string[]) => void;
  init: (sections: string[]) => void;
  updateUser: (sections: string[]) => void;
  message: (message: Message) => void;
  updatechallenges: (sections: string[]) => void;
  updatesearch: (sections: string[]) => void;
}

export interface MeloettaClient {
  on<Event extends keyof ShowdownEvents>(event: Event, listener: ShowdownEvents[Event]): this;
  off<Event extends keyof ShowdownEvents>(event: Event, listener: ShowdownEvents[Event]): this;
  emit<Event extends keyof ShowdownEvents>(event: Event, ...args: Parameters<ShowdownEvents[Event]>): boolean;
  ws: WebSocketManager;
  user: MeloettaClientUser;
}
/**
 * This is the main class of the package.
 * This is what will be called when developer uses this package.
 */
export class MeloettaClient extends EventEmitter {
  /**
   *
   * @param settings settings for the client. This is required.
   */
  constructor(settings: MeloettaSettings) {
    super();
    this.ws = new WebSocketManager(this, settings);
  }

  public async disconnect() {
    try {
      await this.ws.disconnect();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Connects the client the showdown server.
   */
  public async connect() {
    try {
      await this.ws.connect();
    } catch (error) {
      throw error;
    }
  }
}
