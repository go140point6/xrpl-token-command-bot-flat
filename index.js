// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { token, clientId, guildId } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const wen = {
    data: new SlashCommandBuilder()
        .setName('wen')
        .setDescription('Countdown timer to xls-20 on the XRPL!'),
    async execute(interaction) {
        await interaction.reply('589!');
    },
};

const deadline = 'Oct 31 2022 08:41:41 UTC';
var remDays;
var remHours;
var remMinutes;
var remSeconds;

console.log(deadline);

function getTimeRemaining(endtime) {
  const total = Date.parse(endtime) - Date.parse(new Date());
  const seconds = Math.floor( (total/1000) % 60 );
  const minutes = Math.floor( (total/1000/60) % 60 );
  const hours = Math.floor( (total/(1000*60*60)) % 24 );
  const days = Math.floor( total/(1000*60*60*24) );

  return {
    total,
    days,
    hours,
    minutes,
    seconds
  };
}


console.log(getTimeRemaining(deadline).total);
console.log(getTimeRemaining(deadline).days);
console.log(getTimeRemaining(deadline).hours);
console.log(getTimeRemaining(deadline).minutes);
console.log(getTimeRemaining(deadline).seconds);


// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
    const command = [wen];
    //console.log(command);

    const commandData = command.map((command) => command.data.toJSON());
    //console.log(commandData);

    const rest = new REST({ version: '10' }).setToken(token);
    
    rest.put(
        Routes.applicationGuildCommands(
            clientId, 
            guildId
        ), 
        { body: commandData }
        ).then(data => console.log(`Successfully registered ${data.length} application commands.`))
	    .catch(console.error);
    }); 

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'wen') {
		//await interaction.reply('589!');
        getTimeRemaining(endtime)
        await interaction.reply({ content: `XLS-20 in ${(getTimeRemaining(deadline).days)} days, ${(getTimeRemaining(deadline).hours)} hours, ${(getTimeRemaining(deadline).minutes)} minutes, and ${(getTimeRemaining(deadline).seconds)} seconds!`});
    }
});

// Log in to Discord with your client's token
client.login(token);
