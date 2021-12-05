const RegisterCommands = require("./src/structures/RegisterCommands");
const FoxyClient = require("./src/FoxyClient");
const client = new FoxyClient({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"] });
const { token } = require("./config.json");
const commands = new RegisterCommands(client, "772554697298673677",  token);
global.dir = __dirname;

commands.register();