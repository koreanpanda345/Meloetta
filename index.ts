import {config} from 'dotenv';
import { detailed } from 'yargs-parser';
config();

import {MeloettaClient} from './src';

const client = new MeloettaClient({
	server: 'showdown',
	ip: 'sim.smogon.com',
	port: 8000,
	credentials: {
		username: process.env.USER as string,
		password: process.env.PASS as string
	},
});

client.on('ready', () => {
	console.log('Client is ready');
	client.ws.joinBattle('battle-gen8nationaldex-1405237960', (battle) => {
		battle.on('player', (player, username, avatar, rating) => {
			console.log(`Player ${player}: ${username}`);
			battle.leaveBattle(client);
		}).on('poke', (details, item) => {
			console.log(`Pokemon (${details.player}) -> ${details.pokemon}`);
		}).on('faint', (details) => {
			console.log(`Pokemon ${details.pokemon} fainted`);
		}).on('switchAndDrag', (details, hp) => {
			console.log(`Side ${details.player} switched to ${details.pokemon} in position ${details.position}`);
		}).on('replace', (details, hp) => {
			console.log(`Side ${details.player} replaced to ${details.pokemon} in position ${details.position}`);
		}).on('win', (user) => {
			console.log(`${user} won`);
		});
	});
});


client.connect();