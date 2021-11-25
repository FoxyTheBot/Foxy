const FoxyClient = require("./src/FoxyClient");
const client = new FoxyClient({ intents: ["GUILDS", "GUILD_MESSAGES"]});
const { token } = require("./config.json");
global.dir = __dirname

client.loadCommands();
client.loadEvents();
client.login(token);

process.on("unhandledRejection", async (reason, p) => { 
   console.log("Houve uma rejeição não capturada:\n" + reason);
}); 