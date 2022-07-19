import { GatewayIntentBits } from 'discord.js'
import FoxyClient from './src/FoxyClient';
import { token } from './config.json';
const client = new FoxyClient({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions] });

client.startFoxy({
    commands: __dirname + "/src/commands",
    events: __dirname + "/src/events",
    locales: __dirname + "/src/locales",
    token: token,
});

process.on("unhandledRejection", async (err: Error) => {
    console.error(err.message);
});
