import * as ws from 'ws';
import { stringify } from 'querystring';
import axios from 'axios';
import { MeloettaClient } from '../MeloettaClient';
import { MeloettaSettings } from '../../types';
import ready from '../actions/ready';
import message from '../actions/message';
import { Battle } from '../models/Battle';

/**
 * This is where the heart of the package lies.
 */
export class WebSocketManager {
  private _ws: ws;
  /**
   *
   * @param _client - We need the client to push data to the correct events.
   * @param _settings - The settings for the client.
   */
  constructor(private _client: MeloettaClient, private _settings: MeloettaSettings) {
    this._ws = new ws(`ws://${this._settings.ip}:${this._settings.port}/showdown/websocket`);
  }
  /**
   * Connects the client to the showdown servers.
   */
  public async connect() {
    this._ws
      .on('open', (_: WebSocket) => {
        this._client.emit('connected');
        this._ws.on('message', async (data) => {
          await this.processCommand(data.toString());
        });
      })
      .on('error', (err) => {
        this._client.emit('error', err);
      })
      .on('close', (code, reason) => {
        this._client.emit('disconnected', code, reason);
      });
  }
  /**
   *
   * @param nonce - The nonce that we need to login
   * @returns returns a json structure of the client's info.
   */
  private async login(nonce: string) {
    const url = `https://play.pokemonshowdown.com/~~${this._settings.server}/action.php`;
    const data = stringify({
      act: 'login',
      name: this._settings.credentials.username.replace(/ +/g, '').toLowerCase(),
      pass: this._settings.credentials.password,
      challstr: nonce,
    });

    const response = await axios.post(url, data);

    let json;

    try {
      json = JSON.parse((response.data as string).substring(1));
    } catch (error) {
      throw error;
    }

    return json;
  }
  /**
   * This is used to use showdown's commands.
   * @param command - the command name
   * @param data - the data to be sent.
   */
  public async sendCommand(command: string, data: string[]) {
    const cmd = `|/${command} ${data.join(', ')}`;
    this._ws.send(cmd, (error) => {
      if (error) throw error;
    });
  }

  /**
   * Allows the client to join a battle, and get battle events from it.
   * @param battleId - the battle's id that the client wants to join.
   * @param listener - the callback of the battle.
   */
  public async joinBattle(battleId: string, listener: (battle: Battle) => void) {
    const cmd = `|/join ${battleId}`;

    this._ws.send(cmd, (error) => {
      if (error) throw error;
      const battle = new Battle(battleId);
      listener(battle);
      this._ws.on('message', (rawdata) => {
        const data = rawdata.toString();
        const lines = data.split('\n');
        for (const line of lines) {
          if (line.startsWith('|')) {
            const sections = line.split('|');
            sections.shift();
            const command = sections.shift();

            battle.addLine(command as string, sections);
          }
        }
      });
    });
  }
  /**
   * process all of the data/commands from showdown's websocket.
   * @param data - the data from the websocket
   */
  private async processCommand(data: string) {
    const sections = data.split('|');
    sections.shift();
    const topic = sections.shift()?.toLowerCase()!;
    switch (topic) {
      case 'challstr':
        const nonce = sections.join('|');

        const client = await this.login(nonce);

        const { assertion, actionsuccess, curuser } = client;
        if (!actionsuccess) {
          throw new Error(
            `Could not connect to server ${this._settings.server} with username: ${this._settings.credentials.username}`,
          );
        } else if (assertion) {
          this._ws.send(`|/trn ${this._settings.credentials.username},0,${assertion}|`, (error) => {
            if (error) throw error;
          });

          await ready(this._client, client);
        }
        break;
      case 'pm':
        message(this._client, sections);
        break;

      default:
        try {
          const { default: module } = await import(`./../actions/${topic}.ts`);

          await module(this._client, sections);
        } catch (error) {
          // throw error;
        }

        break;
    }
  }
  /**
   * disconnects the client from the showdown server.
   */
  public async disconnect() {
    this._ws.close(1000, `Disconnected from server ${this._settings.server}`);
  }
}
