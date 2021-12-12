const RegisterCommands = require("./src/structures/RegisterCommands");
const FoxyClient = require("./src/FoxyClient");
const client = new FoxyClient({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"] });
const { token, clientId } = require("./config.json");
const commands = new RegisterCommands(client, clientId,  token);
global.dir = __dirname;

commands.register();