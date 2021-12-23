const { Client, Collection, WebhookClient, Intents } = require('discord.js');
const DatabaseConnection = require("./structures/databaseConnection");
const fs = require('fs');

const client = new Client({
  ws: {
    intents: Intents.NON_PRIVILEGED,
  },
});

require('./structures/inlineReply');

client.commands = new Collection();
client.emotes = require('./json/emotes.json');
client.colors = require('./json/color.json');
client.config = require('../config.json');
client.logsWebhook = new WebhookClient(client.config.logs.id, client.config.logs.token);
client.guildWebhook = new WebhookClient(client.config.guilds.id, client.config.guilds.token);
client.db = new DatabaseConnection(client.config.uri, { useNewUrlParser: true, useUnifiedTopology: true, writeConcern: "majority" }, client);

const commandFolders = fs.readdirSync('./src/commands');
const eventFiles = fs.readdirSync('./src/events').filter((file) => file.endsWith('.js'));

for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  }
}

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  const eventBind = file.split('.')[0];
  console.info(`\x1b[37m\x1b[44mINFO\x1b[0m: Loading event: ${file}; Bind: ${eventBind}`);
  client.on(eventBind, event.bind(null, client));
}

client.login(client.config.token);