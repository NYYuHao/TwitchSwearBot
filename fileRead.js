const fs = require('fs')

var swearMap;
var commandsMap;
var opts;

// On startup, read from swearData.json and save to swearMap
fs.readFile('./data/swearData.json', 'utf-8', function(err, data) {
	if (err) throw err;
        swearMap = JSON.parse(data);
});
// Read from commands.json and save to commandsMap
fs.readFile('./data/commands.json', 'utf-8', function(err, data) {
	if (err) throw err;
        commandsMap = JSON.parse(data);
});
// Read from opts.json for loading twitch bot options
fs.readFile('./data/opts.json', 'utf-8', function(err, data) {
	if (err) throw err;
	opts = JSON.parse(data);
});


// Increments and returns the total number of swears in data
// If an argument is provided, grabs the first letter and adds to data
// If channel is not in swearMap, initialize
const addSwear = (channel, message) => {
	if (!swearMap.hasOwnProperty(channel)) {
        	swearMap[channel] = {'total': 0, 'charCounts': {}};
	}
	
	// Handle 2nd argument if given, incrementing char count in data
	messageWords = message.split(" ");
	if (messageWords.length > 1) {
        	if (!swearMap[channel]['charCounts'].hasOwnProperty(messageWords[1][0])) {
			swearMap[channel]['charCounts'][messageWords[1][0]] = 0;
		}
		swearMap[channel]['charCounts'][messageWords[1][0]]++;
	}
	
	return ++swearMap[channel]['total'];
};

// Simple command handler that uses commands from commands.json
// Returns the value in commandsMap[channel][message] if defined.
// Otherwise, checks in commandsMap['global'][message].
// Returns empty string if undefined
const getCommandOutput = (channel, message) => {
	if (!commandsMap.hasOwnProperty(channel)) {
        	commandsMap[channel] = {}
	}
	
	messageWords = message.split(" ");
	command = messageWords[0].substring(1);
	if (commandsMap[channel].hasOwnProperty(command))
		return commandsMap[channel][command];
	if (commandsMap['global'].hasOwnProperty(command))
		return commandsMap['global'][command];
	return '';

};

// Returns options provided by opts.json
const getOpts = () => {
	return opts;
}

// Shutdown handler, write to files before shutdown completes
process.stdin.resume();
process.on('SIGINT', function () {
	fs.writeFileSync('./data/swearData.json', JSON.stringify(swearMap));
	fs.writeFileSync('./data/commands.json', JSON.stringify(commandsMap));
	process.exit();
});

exports.addSwear = addSwear;
exports.getCommandOutput = getCommandOutput;
exports.getOpts = getOpts;





