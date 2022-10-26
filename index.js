// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { token, clientId, guildId } = require('./config.json');
const { xrpl } = require('xrpl');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const ping = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};

const beep = {
    data: new SlashCommandBuilder()
        .setName('beep')
        .setDescription('Replies with Boop!'),
    async execute(interaction) {
        await interaction.reply('Boop!');
    },
};

const xrpl = {
    data: new SlashCommandBuilder()
        .setName('xrpl-token')
        .setDescription('Gets current ASK and BID using ticker')
        .addStringOption((option) =>
            option
                .setName("ticker")
                .setDescription("Common ticker of crypto.")
                .setRequired(true)
        ),
    async execute(interaction) {
        async function getAskBid() {
              const xrplClient = new xrpl.Client('wss://xrplcluster.com');  
              await xrplClient.connect();
              const reqAsk = {
                  "command": "book_offers",
                  "taker_gets": {
                  "currency": "434C554200000000000000000000000000000000",
                  "issuer": "r9pAKbAMx3wpMAS9XvvDzLYppokfKWTSq4"
                  },
                  "taker_pays": {
                  "currency": "XRP"
                  },
                  "limit": 1
              }
  
              const reqBid = {
                  "command": "book_offers",
                  "taker_gets": {
                      "currency": "XRP"
                  },
                  "taker_pays": {
                  "currency": "434C554200000000000000000000000000000000",
                  "issuer": "r9pAKbAMx3wpMAS9XvvDzLYppokfKWTSq4"
                  },
                  "limit": 1
              }
  
              const responseAsk = await xrplClient.request(reqAsk);
              const responseBid = await xrplClient.request(reqBid);
              var ask = responseAsk.result.offers;
              var bid = responseBid.result.offers;
              xrpl.Ask = parseFloat(ask[0].quality / 1000000).toFixed(2);
              xrpl.Bid = parseFloat((1 / (bid[0].quality * 1000000))).toFixed(2);
              console.log(xrpl.Ask);
              console.log(xrpl.Bid);
              await interaction.reply(`The current ASK is ${xrpl.Ask} and the current BID is ${xrpl.Bid}.`);
          
              xrplClient.disconnect();
      }
    }
  };

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
    const command = [ping, beep, xrpl-token];
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

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'beep') {
		await interaction.reply('Boop!');
	} else if (commandName === 'xrpl-token') {
        await interaction.reply('589!');
    }
});

// Log in to Discord with your client's token
client.login(token);
