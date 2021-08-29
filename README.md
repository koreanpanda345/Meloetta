# Meloetta

<img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpre00.deviantart.net%2Fbd65%2Fth%2Fpre%2Fi%2F2016%2F052%2F8%2F8%2Fshiny_meloetta_by_kol98-d9sm6dx.png&f=1&nofb=1" alt="Meloetta Image" style="height: 500px">

# Introduction

Meloetta is a npm package to connect to Pokemon Showdown and interact with the server. What makes this package different from the other packages, is how everything is handled. In Meloetta, we have every action, and socket message sent by showdown into events. This makes it easier for developers to pick and chose what they want to get. The structure of this package is identical to Discord.js.

# Features Added
| Feature | Added In | When was Added |
|---|---|---|
| Battle Tracking Feature | [X] | 8/27/2021 |
| Message Feature | [X] | 8/27/2021 |
| Teambuilding Feature | [] | --/--/---- |
| Battling Feature | [] | --/--/---- |

# Future Updates
- [] More documentations added to help developers use this package.

# Change Log
## 1.0.1
- Fixed Message.author. Should be return the author now, instead of the contet.
- add Message.sendTo. This will allow you to send a message to a specific user/room.
- add Battle.toLog, and Battle.toJson. These are formatting options used to output the full battle log that smogon sent to the client.
## 1.0.0
- Package was released.
# Installation

## Npm

```bash
> npm install -s meloetta
```

## Yarn

```bash
> yarn add meloetta
```

# Quick Setup

Javascript

```js
const { MeloettaClient } = require('meloetta');

const client = new MeloettaClient({
  server: 'showdown',
  ip: 'sim.smogon.com',
  port: 8000,
  credentials: {
    username: 'YOUR_CLIENT_USERNAME',
    password: 'YOUR_CLIENT_PASSWORD',
  },
});

client
  .on('ready', () => {
    console.log(`${client.user.username} is ready`);
  })
  .on('message', (message) => {
    if (message.content.trim() === '+ping') {
      message.send('Pong!');
    }
  });

client.connect();
```

Typescript

```ts
import { MeloettaClient } from 'meloetta';

const client = new MeloettaClient({
  server: 'showdown',
  ip: 'sim.smogon.com',
  port: 8000,
  credentials: {
    username: 'CLIENT_USERNAME',
    password: 'CLIENT_PASSWORD',
  },
});

client
  .on('ready', () => {
    console.log('Client is ready');
  })
  .on('message', (message) => {
    if (message.content.trim() === '+ping') {
      message.send('Pong!');
    }
  });

client.connect();
```

# Battle Tracking

As mentioned before, Meloetta handles everything by pushing everything into their own events. This allows Meloetta to provide a developer the neccesary information that they want, and ignore the information the developer doesn't want.

```ts
client.ws.joinBattle('SHOWDOWN_BATTLE_ID', (battle) => {
  battle.on('player', (player, username, avater, rating) => {
    console.log(`Player ${player}`);
  });
});
```
