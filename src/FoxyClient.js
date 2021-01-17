const Discord = require('discord.js');
const client = new Discord.Client();
const { token, ctoken, canary } = require("./json/config.json");
const Enmap = require('enmap')
const fs = require('fs');

client.commands = new Enmap();


fs.readdir("./src/commands/", (err, files) => {
  if (err) return console.error(err); 
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);

    let commandName = file.split(".")[0];
    client.commands.set(commandName, props);
  });

});
fs.readdir("./src/events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        console.log(`[EVENT] - Loaded Successfully ${eventName}`);
        client.on(eventName, event.bind(null, client));
    });
    
});

if (canary) return client.login(ctoken)
client.login(token);