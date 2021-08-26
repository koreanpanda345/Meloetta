import { MeloettaClient } from '../MeloettaClient';
import { Message } from './../models/Message';

export default async function (client: MeloettaClient, sections: string[]) {
  const message = new Message({
    to: sections[0],
    by: sections[1],
    content: sections[2],
    client,
    room: undefined,
  });

  client.emit('message', message);
}
