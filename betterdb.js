// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { token, clientId, guildId } = require('./config.json');
const axios = require('axios');
const Database = require('better-sqlite3');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const db = new Database('./data/tokens.db', { verbose: console.log });

var inUSD = 0;
var currency;

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
                .setDescription("Common ticker (currency) of XRPL Token to lookup i.e. CLUB.")
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

async function getXRPToken() {
    await getXRP();
};

function getRows(ticker) {
    const row = db.prepare('SELECT currency, issuer FROM tokens WHERE currency = ?').get(ticker);
    console.log(row.currency, row.issuer);
};

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
    const command = [ping, beep, xrplToken];
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
        await getXRPToken();
        const ticker = (interaction.options.getString("ticker", true)).toUpperCase();
        
        getRows();    
    }
});

// Log in to Discord with your client's token
client.login(token);
