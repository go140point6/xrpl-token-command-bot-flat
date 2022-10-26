// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, REST, Routes } = require('discord.js');
const { token, clientId } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [ping, beep];

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(data => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'beep') {
		await interaction.reply('Boop!');
	}
});

// Log in to Discord with your client's token
client.login(token);
