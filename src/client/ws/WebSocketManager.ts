import * as ws from 'ws';
import { stringify } from 'querystring';
import axios from 'axios';
import { MeloettaClient } from '../MeloettaClient';
import { MeloettaSettings } from '../../types';
import { MeloettaClientUser } from '../MeloettaClientUser';
import ready from '../actions/ready';
import message from '../actions/message';
import { Battle } from '../models/Battle';

export class WebSocketManager {
  private _ws: ws;

  constructor(private _client: MeloettaClient, private _settings: MeloettaSettings) {
    this._ws = new ws(`ws://${this._settings.ip}:${this._settings.port}/showdown/websocket`);
  }

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

  public async sendCommand(command: string, data: string[]) {
    let cmd = `|/${command} ${data.join(', ')}`;
    this._ws.send(cmd, (error) => {
      if (error) throw error;
    });
  }

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
          //throw error;
        }

        break;
    }
  }

  public async disconnect() {
    this._ws.close(1000, `Disconnected from server ${this._settings.server}`);
  }
}
