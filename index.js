// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { token, clientId, guildId } = require('./config.json');
const axios = require('axios');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

let currentXRP = '0';

const xrplTokens = [
    { currency: 'BANANA', issuer: 'r3KSyXmYTYd6wd6ZwtrbEhQMjnJW3xpK4j'},
    { currency: 'CLUB', issuer: 'r9pAKbAMx3wpMAS9XvvDzLYppokfKWTSq4'},
    { currency: 'PHX', issuer: 'rfEJ1ksD22TsCy8hdKoJuC6Xfc33VCKPUs'},
    { currency: 'XBAE', issuer: 'rGc7CTU22AbPg8drYWTYsdGVk6nfssSPBK'}
  ]

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

const xrplToken = {
    data: new SlashCommandBuilder()
        .setName('xrpl-token')
        .setDescription('Last trade in USD')
        .addStringOption((option) =>
            option
                .setName("ticker")
                .setDescription("Common ticker of XRPL Token to lookup i.e. CLUB.")
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.reply('589!');
    },
};

async function getXRP() {
    await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ripple`).then(res => {
               if (res.data && res.data[0].current_price) {
                //console.log("XRP is: " + res.data[0].current_price);
                currentXRP = res.data[0].current_price.toFixed(4) || 0
                //console.log("Inside function: " + currentXRP);
            } else {
                console.log("Error loading coin data")
            }
            return;
        })
}

async function getPrices() {
    await getXRP();
    console.log("XRP Price: " + currentXRP);
    await axios.get(`https://api.onthedex.live/public/v1/ticker/CLUB.r9pAKbAMx3wpMAS9XvvDzLYppokfKWTSq4:XRP`).then(res => {
        //console.log(res.data);
        //console.log(res.data.pairs[0].last);
        const inXRP = res.data.pairs[0].last;
        const inUSD = (inXRP * currentXRP).toFixed(4);
        console.log(inUSD);
    })
};

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
    const command = [ping, beep, xrplToken];
    //console.log(command);

    const commandData = command.map((command) => command.data.toJSON());
    //console.log(commandData);

    //getPrices();

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
        //await interaction.reply('589!');
        getPrices();
        await interaction.reply("Current price: " + inUSD);
	}
});

// Log in to Discord with your client's token
client.login(token);
