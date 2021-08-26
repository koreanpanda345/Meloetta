import { MeloettaClient } from '../MeloettaClient';

export default async function (client: MeloettaClient, sections: string[]) {
  client.emit('updateUser', sections);
}
