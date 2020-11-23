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
client.on("message", message => {
  if (message.author.bot) return false;

  if (message.content.includes("@here") || message.content.includes("@everyone")) return false;

  if (message.mentions.has(client.user.id)) {
      message.channel.send(`Olá, ${message.author} eu sou a Foxy! Meu prefixo é f!`);
  };
});
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
`❓ Use f!help para obter ajuda`,
      `📷 Avatar por: Bis❄#0001`,
      `😍 Espalhando alegria em ${client.guilds.cache.size} servidores`,
      `😎 Eu sou open-source https://github.com/BotFoxy ＼(^o^)／`,
      `💻 Use f!commands para ver minha lista de comandos`,
      `😍 Tornando seu servidor extraordinário ᕕ(ᐛ)ᕗ`,
      `🐦 Me siga no Twitter @FoxyDiscordBot`,
      `💖 Use f!donate para me ajudar a ficar online!`,
<<<<<<< HEAD
        `🦊 What Does The Fox Say?`
=======
      `What Does The Fox Say?`
>>>>>>> fa1949703b749456bfd65b341678577697547e6d

  ],

  i = 0;
  setInterval(() => client.user.setActivity(`${activities[i++ %
  activities.length]}`,{
    type: "WATCHING"
  }), 5000);
    
  console.log(`Sessão Iniciada como ${client.user.tag} \nLogado com ${client.guilds.cache.size} guilds desde a inicialização.`)
  })
<<<<<<< HEAD
fs.readdir("./src/commands/", (err, files) => {
=======
fs.readdir("./commands/", (err, files) => {
>>>>>>> fa1949703b749456bfd65b341678577697547e6d
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;

    let props = require(`./commands/${file}`);

    let commandName = file.split(".")[0];
    console.log(` f!${commandName} está funcionando.`);
    
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
