import { config } from 'dotenv';
config();
import { MeloettaClient } from './src/client/MeloettaClient';
import { Battle } from './src/client/models/Battle';

const client = new MeloettaClient({
  server: 'showdown',
  ip: 'sim.smogon.com',
  port: 8000,
  credentials: {
    username: process.env.USER!,
    password: process.env.PASS!,
  },
});

client
  .on('ready', () => {
    console.log(`${client.user.username} is ready.`);
	// Replay Test: https://replay.pokemonshowdown.com/gen8randombattle-1404504177
    client.ws.joinBattle('battle-gen8randombattle-1404504177', (battle) => {
      battle.on('player', (player, username, avatar, rating) => {
		console.log(player, username, avatar, rating);
	  }).on('poke', (details, item) => {
		  console.log(details, item);
	  }).on('switchAndDrag', (details, hp) => {
		  console.log(details, hp);
	  }).on('-damage', (details, hp) => {
		  console.log(details, hp);
	  }).on('faint', (details) => {
		  console.log(`${details.pokemon} has fainted`);
	  }).on('move', (attacker,target, move) => {
		  console.log(attacker, target, move);
	  }).on('turn', (turn) => {
		  console.log(`Turn ${turn}`);
	  }).on('-weather', (weather) => {
		  console.log(`Weather ${weather}`);
	  }).on('-sidestart', (side, condition) => {
		console.log(`Side: ${side} start ${condition}`);
	  }).on('-status', (details, status) => {
		  console.log(`Status: ${status}`, details);
	  }).on('-curestatus', (details, status) => {
		  console.log(`Cured Status: ${status}`, details);
	  }).on('-enditem', (details, item, effect)=> {
		  console.log(details, item, effect);
	  }).on('win', (user) => {
		  console.log(`${user} won`);
	  })
    });
  })
  .on('message', (message) => {
    console.log(message);
    if (message.content.toLowerCase().startsWith('+')) {
      const args = message.content.slice('+'.length).split(/ +/g);

      const commandName = args.shift()?.toLowerCase() as string;
      console.log(message);
      switch (commandName) {
        case 'ping':
          message.send('Pong!');
          break;
      }
    }
  });

client.connect();
