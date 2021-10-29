const { Client, Collection } = require('discord.js');
const fs = require('fs');

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

client.emotes = require('./utils/emotes.json');
client.config = require('../config.json');
client.commands = new Collection();

const commandFolders = fs.readdirSync("./src/commands");
const eventFiles = fs.readdirSync('./src/events').filter((file) => file.endsWith('.js'));

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.data.name, command);
    }
}

for (const eventFile of eventFiles) {
    const event = require(`./events/${eventFile}`);
    const eventBind = eventFile.split(".")[0];
    console.log(`[EVENTS] - Evento: ${eventFile}; Bind: ${eventBind}`);
    client.on(eventBind, event.bind(null, client));
}

client.login(client.config.token);
