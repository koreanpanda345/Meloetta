require('dotenv').config();
const {MeloettaClient} = require('./lib/index');

const client = new MeloettaClient({
	server: 'showdown',
	ip: 'sim.smogon.com',
	port: 8000,
	credentials: {
		username: process.env.USER,
		password: process.env.PASS
	}
});

client.on('ready', () => {
	console.log(`${client.user.username} is ready`);
});


client.connect();
