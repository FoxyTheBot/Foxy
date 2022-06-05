import RegisterCommands from "./src/structures/RegisterCommands";
import FoxyClient from "./src/FoxyClient";
import { token, clientId } from "./config.json";

const client = new FoxyClient({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"] });
const commands = new RegisterCommands(client, clientId, token);
commands.register(__dirname + "/src/commands");