<<<<<<< HEAD
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
  console.log('Port: ' + listener.address().port);
});
client.commands = new Enmap();
const cmd = require('./resposta.json');

client.on('message', msg => {
    if (msg.author.bot) {
        return;
    }
    responseObject = cmd;
    if(responseObject[msg.content]){
        msg.channel.send(responseObject[msg.content]);
    }
});
client.on("ready", () => {
    let activities = [
      `f!help para ajuda`,
      `💻 Made by WinGamer `,
      `📷 Icon por: Bis❄#0001`,
      `😍 ${client.guilds.cache.size} Servidores`,
      `${client.channels.cache.size} Canais`, 
      `Com ${client.users.cache.size} membros 💖`,
      `😎 Sou open source https://github.com/WinG4mer/FoxyBot`,
      `Encontrou falhas? Reporte para o suporte usando f!report`,
      `Cause this is thriller`,
      `Thriller Night`,
      `You're fighting for your life`,
      `inside a killer thriller`,
      `Tonight, Yeah!`,
      `Michael Jackson - Thriller`,
      `🎃 Happy Halloween!`


  ],

  i = 0;
  setInterval(() => client.user.setActivity(`${activities[i++ %
  activities.length]}`,{
    type: "PLAYING"
  }), 4000); //WATCHING, LISTENING, PLAYING, STREAMING
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

client.on("message", async message => {
    
  if (message.author.bot) return;
  if (message.channel.dm === "dm") return;
  
let messageArray = message.content.split(" ");
let cmd = messageArray[0];
let args = messageArray.slice(1);

if (!message.content.startsWith(prefix)) return;
let commandfile = client.commands.get(cmd.slice(prefix.length));
if (commandfile) commandfile.run(client, message, args);
});

client.login(token);
=======
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
  console.log('Port: ' + listener.address().port);
});
client.commands = new Enmap();
const cmd = require('./resposta.json');

client.on('message', msg => {
    if (msg.author.bot) {
        return;
    }
    responseObject = cmd;
    if(responseObject[msg.content]){
        msg.channel.send(responseObject[msg.content]);
    }
});
client.on("ready", () => {
    let activities = [
      `f!help para ajuda`,
      `💻 Made by WinGamer `,
      `📷 Fanart por: Bis❄#0001`,
      `😍 ${client.guilds.cache.size} Servidores`,
      `${client.channels.cache.size} Canais`, 
      `Com ${client.users.cache.size} membros 💖`,
      `😎 Sou open source https://github.com/WinG4mer/FoxyBot`,
      `Encontrou falhas? Reporte para o suporte usando f!report`


  ],

  i = 0;
  setInterval(() => client.user.setActivity(`${activities[i++ %
  activities.length]}`,{
    type: "LISTENING"
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

client.on("message", async message => {
    
  if (message.author.bot) return;
  if (message.channel.dm === "dm") return;
  
let messageArray = message.content.split(" ");
let cmd = messageArray[0];
let args = messageArray.slice(1);

if (!message.content.startsWith(prefix)) return;
let commandfile = client.commands.get(cmd.slice(prefix.length));
if (commandfile) commandfile.run(client, message, args);
});

client.login(token);
>>>>>>> 4849578b0c5c2f2bc00528e9d14395b0384702c6
