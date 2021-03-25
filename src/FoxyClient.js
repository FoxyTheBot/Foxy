const fs = require('fs');
const { Client, Collection, WebhookClient } = require('discord.js');
const Intents = require('./utils/IntentsManager');

const client = new Client({
  ws: {
    intents: Intents(),
  },
});

client.commands = new Collection();
client.emotes = require('./structures/emotes.json')
client.colors = require('./structures/color.json')
client.config = require('./config/config.json')

client.logsWebhook = new WebhookClient(client.config.logs.id, client.config.logs.token);
client.reportWebhook = new WebhookClient(client.config.report.id, client.config.report.token);
client.suggestWebhook = new WebhookClient(client.config.suggest.id, client.config.suggest.token);

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
