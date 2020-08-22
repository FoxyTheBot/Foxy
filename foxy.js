const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require("./config.json");
const Enmap = require('enmap')
const fs = require('fs');
const express = require('express');
const app = express();

app.get('/', function(req, res) {
  res.sendStatus(200);
});

const listener = app.listen(process.env.PORT, function() {
  console.log('Seu projeto está na porta ' + listener.address().port);
});

client.commands = new Enmap();
client.on("ready", () => {
    let activities = [
      `f!help para ajuda`,
      `Made by WinGamer`,
      `Imagem por: Bis❄#1651`,
      `Em ${client.guilds.cache.size} Servidores`,
      `Sou open source😎 https://github.com/WinG4mer/FoxyBot `

  ],

  i = 0;
  setInterval(() => client.user.setActivity(`${activities[i++ %
  activities.length]}`,{
    type: "WATCHING"
  }), 5000); //WATCHING, LISTENING, PLAYING, STREAMING
  console.log(`Bot iniciado com ${client.guilds.cache.size} Servidores e ${client.users.cache.size} Membros`)
  })
fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;

    let props = require(`./commands/${file}`);

    let commandName = file.split(".")[0];
    console.log(`${commandName} carregado com sucesso! ✅`);
    
    client.commands.set(commandName, props);
  });
});
client.on('message', async (msg, message, channel) => {
  
  if (msg.content === 'f!ping') {
  msg.reply('Calculando Latência.').then(m => m.edit(`${msg.author}, Pong! Latência é ${m.createdTimestamp - msg.createdTimestamp}ms. Latência da API é ${Math.round(client.ping)} ms`))
  }                
});
client.on("message", async message => {
    
  if (message.author.bot) return;
  //disable DM
  if (message.channel.dm === "dm") return;
  
//variables to work bot
let messageArray = message.content.split(" ");
let cmd = messageArray[0];
let args = messageArray.slice(1);

if (!message.content.startsWith(prefix)) return;
let commandfile = client.commands.get(cmd.slice(prefix.length));
if (commandfile) commandfile.run(client, message, args);
});

client.login(token);