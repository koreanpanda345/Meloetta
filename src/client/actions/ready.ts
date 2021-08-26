import { MeloettaClient } from "../MeloettaClient";
import { MeloettaClientUser } from "../MeloettaClientUser";

export default async function(client: MeloettaClient, data: any) {

	client.user = new MeloettaClientUser(data.curuser);
	
	client.emit('ready');
}