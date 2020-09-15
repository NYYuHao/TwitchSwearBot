const tmi = require('tmi.js');
const fileRead = require('./fileRead.js');

// Configurations
const opts = {
	connection: {
        	secure: true,
		reconnect: true,
	},
	identity: {
        	username: 'SwearBot123',
		password: 'q2ze3tfj5nnpu4h2wmaov99yaank96'
	},
	channels: [
		'SwearBot123'
	]
};


const client = new tmi.client(opts);


// Register event handlers
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);


// Connect to Twitch
client.connect();


// Whenever a message comes in
function onMessageHandler(channel, user, message, self) {
	// Ignore messages sent by bot or without !
        if (self || !message.startsWith('!')) {return;}

	const commandName = message.split(" ")[0];
	// Execute command
	switch (commandName) {
		case '!swear':
			swearJar(channel, message);
			break;
		default:
                        client.say(channel, fileRead.getCommandOutput(channel, message))
			break;
	}
}

// Increment total number of swears
function swearJar(channel, message) {
	swears = fileRead.addSwear(channel, message)
	client.say(channel, `Streamer has sworn ${swears} times... :(`);
	console.log(`Swear function executed successfully`);
}


// Whenever bot connects to Twitch Chat
function onConnectedHandler(addr, port) {
	console.log(`Connected to ${addr}:${port}`);
}
