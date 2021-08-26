import { EventEmitter } from 'events';
import { MeloettaSettings } from '../types';
import { MeloettaClientUser } from './MeloettaClientUser';
import { WebSocketManager } from './ws/WebSocketManager';
import { Message } from './models/Message';
import { Battle } from './models/Battle';

export interface ShowdownEvents {
  ready: () => void;
  connected: () => void;
  disconnected: (code: number, reason: string) => void;
  error: (err: Error) => void;
  noinit: (sections: string[]) => void;
  init: (sections: string[]) => void;
  updateUser: (sections: string[]) => void;
  message: (message: Message) => void;
}

export interface MeloettaClient {
  on<Event extends keyof ShowdownEvents>(event: Event, listener: ShowdownEvents[Event]): this;
  off<Event extends keyof ShowdownEvents>(event: Event, listener: ShowdownEvents[Event]): this;
  emit<Event extends keyof ShowdownEvents>(event: Event, ...args: Parameters<ShowdownEvents[Event]>): boolean;
  ws: WebSocketManager;
  user: MeloettaClientUser;
}

export class MeloettaClient extends EventEmitter {
  constructor(settings: MeloettaSettings) {
    super();
    this.ws = new WebSocketManager(this, settings);
  }

  public async joinBattle(battleId: string) {}

  public async connect() {
    try {
      await this.ws.connect();
    } catch (error) {
      throw error;
    }
  }
}
