// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { token, clientId, guildId } = require('./config.json');
const axios = require('axios');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

var inUSD = 0;
var currency;

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

async function getPrices() {
    await getXRP();
    console.log("XRP Price: " + currentXRP);
    /*
    const ticker = (interaction.options.getString("ticker", true));
    let tic = xrplTokens.find(t => t.currency === ticker);
    if (tic !== undefined) {
        console.log(tic.currency);
    } else {
        console.log("meatbag");
    }

    if (tic !== undefined) {
        await axios.get(`https://api.onthedex.live/public/v1/ticker/${tic.currency}.${tic.issuer}:XRP`).then(res => {
            if(res.data && res.data[0].last) {
                //console.log(res.data);
                //console.log(res.data.pairs[0].last);
                const inXRP = res.data.pairs[0].last;
                inUSD = (inXRP * currentXRP).toFixed(4);
                console.log(inUSD);
            }
        }).catch(err => {
            //interaction.reply({ content: `Some error, are you sure ${ticker} is a valid token on the XRPL??`})
        });
    } else {
        //interaction.reply({ content: `Sorry, the meatbag didn't program me for ${ticker}, please ask him to add it.` });
    }
    */
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
        await getPrices();
        const ticker = (interaction.options.getString("ticker", true)).toUpperCase();
        console.log(ticker);
        let tic = xrplTokens.find(t => t.currency === ticker);
        if (tic !== undefined) {
            console.log(tic.currency);
            console.log(tic.issuer);
        } else {
            console.log("meatbag");
        }
        
        if (tic !== undefined) {
            await axios.get(`https://api.onthedex.live/public/v1/ticker/${tic.currency}.${tic.issuer}:XRP`).then(res => {
                if(res.data && res.data[0].last) {
                    //console.log(res.data);
                    //console.log(res.data.pairs[0].last);
                    const inXRP = res.data.pairs[0].last;
                    inUSD = (inXRP * currentXRP).toFixed(4);
                    console.log(inUSD);
                    await interaction.reply({ content: `Current price of ${ticker} is USD ${inUSD}` });
                }
            }).catch(err => {
                interaction.reply({ content: `Some error, are you sure ${ticker} is a valid token on the XRPL??`})
            });
        } else {
            interaction.reply({ content: `Sorry, the meatbag didn't program me for ${ticker}, please ask him to add it.` });
        }
	}
});

// Log in to Discord with your client's token
client.login(token);
