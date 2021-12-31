const FoxyClient = require("./src/FoxyClient");
const client = new FoxyClient({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"] });
const { token } = require("./config.json");

client.loadCommands(__dirname + "/src/commands/");
client.loadEvents(__dirname + "/src/events");
client.login(token);

process.on("unhandledRejection", async (reason, p) => {
   console.log("Houve uma rejeição não capturada:\n" + reason);
});