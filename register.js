const FoxyClient = require("./src/FoxyClient");
const client = new FoxyClient({ intents: ["GUILDS", "GUILD_MESSAGES"]});
global.dir = __dirname

client.registerCommands();