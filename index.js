// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { token, clientId, guildId } = require('./config.json');
const axios = require('axios');
const Database = require('better-sqlite3');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const db = new Database('./data/tokens.db');

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
            //return;
        }).catch(err => {
            console.log("An error with the Coin Gecko api call: ", err.response.status, err.response.statusText);
    });
};

async function getXRPToken() {
    await getXRP();
};

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.one(Events.ClientReady, c => {
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

    getXRPToken()
    setInterval(getXRPToken, Math.max(1, 5 || 1) * 60 * 1000);

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'xrpl-token') {
	//	await interaction.reply('Pong!');
	//} else if (commandName === 'beep') {
	//	await interaction.reply('Boop!');
    //} else if (commandName === 'xrpl-token') {
        await interaction.deferReply();
        //await getXRPToken();
        //console.log(currentXRP);

        const ticker = (interaction.options.getString("ticker", true)).toUpperCase();
        
        //const stmt = db.prepare("SELECT * FROM tokens");
        //var results = stmt.all();
        //console.log(results);

        //const stmt2 = db.prepare("SELECT * FROM tokens WHERE currency = ?");
        //var results2 = stmt2.all("USD");
        //console.log(results2);

        //const stmt3 = db.prepare("SELECT * FROM tokens");
        //var results3 = stmt3.all().map(item => {
        //    return Object.values(item).join();
        //});
        //console.log(results3);

        //const stmt4 = db.prepare('SELECT currency, issuer FROM tokens WHERE currency = ? COLLATE NOCASE');
        //var results4 = stmt4.all(ticker);
        //console.log(results4);  

        const stmt5 = db.prepare('SELECT currency, issuer FROM tokens WHERE currency = ? COLLATE NOCASE');
        var results5 = stmt5.all(ticker);
        //var results5 = stmt5.all(ticker).map(item => {
        //    return Object.values(item).join();
        //});
        //let arrayCheck = Array.isArray(results5);
        //console.log("That is an array: " + arrayCheck);
        console.log("Number in array for " + ticker + " is " + results5.length);
        //console.log(results5);
        //console.log(results5[0].currency);
        //results5.forEach(element => console.log(element));
        //results5.forEach(element => console.log(element.currency));
        //results5.forEach(element => console.log(element.issuer))

        if (Array.isArray(results5) && results5.length == 1) {
            //console.log("Array exists and has exactly 1 item");
            let currency = results5[0].currency;
            let issuer = results5[0].issuer;
            await axios.get(`https://api.onthedex.live/public/v1/ticker/${currency}.${issuer}:XRP`).then(res => {
                if(res.data && res.data.pairs[0].last) {
                    const inXRP = res.data.pairs[0].last;
                    inUSD = (inXRP * currentXRP).toFixed(6);
                    interaction.editReply({ content: `Current price of ${ticker} is USD ${inUSD}` });
                }
            }).catch(err => {
                interaction.editReply({ content: `Some error with api call, please try again or ping an admin.`});
            });
        } else if (Array.isArray(results5) && results5.length > 1) {
            interaction.editReply({ content: `Found more than one ${ticker} in database and the meatbag didn't program me for that yet.` });
        } else {
            interaction.editReply({ content: `Sorry, the meatbag didn't program me for ${ticker}, please ask him to update the database.` });
        }
    }
});

// Log in to Discord with your client's token
client.login(token);
