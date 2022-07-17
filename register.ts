import { GatewayIntentBits } from 'discord.js'
import RegisterCommands from "./src/structures/RegisterCommands";
import FoxyClient from "./src/FoxyClient";
import { token, clientId } from "./config.json";

const client = new FoxyClient({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions] });
const commands = new RegisterCommands(client, clientId, token);
commands.register(__dirname + "/src/commands");