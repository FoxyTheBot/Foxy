import FoxyClient from './src/FoxyClient';
import { token } from './config.json';
const client = new FoxyClient({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"] });

client.startFoxy({
    commands: __dirname + "/src/commands",
    events: __dirname + "/src/events",
    locales: __dirname + "/src/locales",
    token: token,
});

process.on("unhandledRejection", async (reason, p) => {
    console.error(reason);
});