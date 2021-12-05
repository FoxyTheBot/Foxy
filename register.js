const RegisterCommands = require("./src/structures/registerCommands");
const FoxyClient = require("./src/FoxyClient");
const client = new FoxyClient({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"] });
const { token } = require("./config.json");
global.dir = __dirname;
const commands = new RegisterCommands(client, "772554697298673677",  token);

commands.register();