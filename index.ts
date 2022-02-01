import FoxyClient from './src/FoxyClient';
import { token } from './config.json';
const client = new FoxyClient({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"] });

client.loadCommands(__dirname + "/src/commands");
client.loadEvents(__dirname + "/src/events");
client.loadLocales(__dirname + "/src/locales");
client.login(token);

process.on("unhandledRejection", async (reason, p) => {
    console.error(reason);
 });