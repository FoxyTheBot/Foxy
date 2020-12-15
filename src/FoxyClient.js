// Caso alguma informação esteja errada por favor faça um issue ou uma pull request indicando onde eu errei ;w;


const Discord = require('discord.js');  // Torna as váriaveis do discord.js ultilizáveis
const client = new Discord.Client(); // Faz as conexões direto com o cliente (no caso o bot)
const { prefix, token } = require("./config.json"); // Lê o prefixo e o token localizado no arquivo config.json
const Enmap = require('enmap') // Faz o mapeamento dos comandos e eventos
const fs = require('fs'); // Faz a leitura dos comandos
const express = require('express');
const app = express();

app.get('/', function(req, res) {
  res.sendStatus(200);
});

const listener = app.listen(process.env.PORT, function() {
  console.log('Port: ' + listener.address().port); // Mostra em que porta o bot está conectado. Exemplo: Porta 8080
});
client.commands = new Enmap();
const cmd = require('./resposta.json');
client.on("message", message => { // Faz a execução dos eventos de mensagens do arquivo resposta.json
  if (message.author.bot) return false;

 
});
client.on("message", (message) => {
  if ( message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>` ) message.channel.send(`Olá, ${message.author}! Meu prefixo é ${prefix}`)
}) // Faz o bot responder menção
client.on("message", (Message) => {
  if ( Message.guild.id != "768267522670723094" ) return;
                    // O usuário fala tal coisa e o bot da um cargo para ele
  if ( Message.content.toLowerCase().startsWith("f!notificar") || Message.content.toLowerCase().startsWith("f!notify") ) {
    if ( !Message.member.roles.cache.has("768275121290870814") ) Message.member.roles.add("768275121290870814"), Message.channel.send("Agora você vai receber todas as minhas novidades <:meow_blush:768292358458179595>")
    else Message.member.roles.remove("768275121290870814"), Message.channel.send("Agora você não vai mais receber minhas novidades <:sad_cat_thumbs_up:768291053765525525>")
}
})
client.on('message', msg => {
    if (msg.author.bot) {
        return;
    }
    responseObject = cmd; // impede que bots usem comandos
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
      `💻 Use f!commands para ver minha lista de comandos`, // Lista de status do bot
      `😍 Tornando seu servidor extraordinário ᕕ(ᐛ)ᕗ`,
      `🐦 Me siga no Twitter @FoxyDiscordBot`,
      `💖 Use f!donate para me ajudar a ficar online!`,
        `🦊 What Does The Fox Say?`,
        `🎅 Feliz natal a todos! ❤`

  ],

  i = 0;
  setInterval(() => client.user.setActivity(`${activities[i++ %
  activities.length]}`,{
    type: "WATCHING" // O tipo de status
      // para colocar stream use type: "STREAMING",
      //                         url: "link"
  }), 5000); // tempo de mudança do status
    
  console.log(`Sessão Iniciada \nLogado com ${client.guilds.cache.size} guilds desde a inicialização.`) // Mensagem para quando o bot estiver pronto para ser ultilizado
  })
fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => { // Leitor de comandos (Caso algum comando com erro seja encontrado o bot não será ligado e será indicado onde está o erro!
    if (!file.endsWith(".js")) return;

    let props = require(`./commands/${file}`);

    let commandName = file.split(".")[0];
    console.log(` ${prefix}${commandName} está operando corretamente.`); // Mostra que o comando está funcionando normalmente assim seguindo com a inicialização do bot
    
    client.commands.set(commandName, props);
  });
});
client.on("message", (Message) => {
  if ( Message.channel.id != "779760356889198613" ) return;
  if ( Message.content.startsWith(">") ) return; // Faz o bot reagir em um canal específico a não ser que a mensagem tenha um ">"

  Message.react("❤")
})
client.on("message", (Message) => {
  if ( Message.channel.id != "784227380108722236" ) return;
  if ( Message.content.startsWith(">") ) return;

  Message.react("<:sad_cat_thumbs_up:768291053765525525>")
})
client.on("message", (Message) => {
  if ( Message.channel.id != "784229832740700160" ) return;
  if ( Message.content.startsWith(">") ) return;

  Message.react("<:meowbughunter:776249240463736834>")
  Message.react("🤔")
})
client.on("message", async message => {
    
  if (message.author.bot) return;   // Faz o bot não retornar comandos na DM
  if (message.channel.dm === "dm") return;
  
let messageArray = message.content.split(" ");
let cmd = messageArray[0];
let args = messageArray.slice(1);

if (!message.content.startsWith(prefix)) return; // exige que os comandos só podem ser usado com o prefixo, para evitar conflitos entre o bot e as conversas
let commandfile = client.commands.get(cmd.slice(prefix.length));
if (commandfile) commandfile.run(client, message, args);
});

client.login(token);
// Conecta o bot ao cliente

