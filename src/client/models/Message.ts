import { MeloettaClient } from "../MeloettaClient";
import { WebSocketManager } from "../ws/WebSocketManager";


export class Message {
	constructor(
		private _data: MessageData		
	) {}

	public get content() { return this._data.content; }
	public get author() { return this._data.content; }
	public get target() { return this._data.to; }
	public get room() { return this._data.room; }
	
	public async send(content: string) {
		await this._data.client.ws.sendCommand('msg', [this._data.to,content]);
	}
}

type MessageData = {
	content: string;
	by: string;
	to: string;
	room?: string;
	client: MeloettaClient;
};