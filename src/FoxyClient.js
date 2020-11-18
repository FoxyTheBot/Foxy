const Discord = require('discord.js'); // Ajuda a criar aplicações para o Discord usando JavaScript
const client = new Discord.Client();  // Conecta o código a Aplicação do Discord
const { prefix, token } = require("./config.json"); // Faz login no bot usando o Token, e Lê o prefixo
const Enmap = require('enmap') // Faz a leitura dos diretórios do bot
const fs = require('fs'); // Ajuda na leitura e execução dos arquivos
const express = require('express');
const app = express(); // Identifica a porta da rede em que o bot foi logado

app.get('/', function(req, res) {
  res.sendStatus(200); // Lê a porta de rede
});

const listener = app.listen(process.env.PORT, function() {
  console.log('Port: ' + listener.address().port); // Mostra a porta de rede onde o bot está conectado
});
client.commands = new Enmap();
const cmd = require('./resposta.json'); // Leitura das mensagens automáticas

client.on('message', msg => {
    if (msg.author.bot) {
        return;
    }
    responseObject = cmd;
    if(responseObject[msg.content]){
        msg.channel.send(responseObject[msg.content]);  // Envia a mensagem automática para o servidor exemplo "Te amo Foxy"
    }
});
client.on("ready", () => {
    let activities = [  // Preparação de exibição do status da aplicação
`Meu prefixo é ${prefix}`,
      `❓ Use f!help para obter ajuda`,
      `📷 Avatar por: Bis❄#0001`,
      `😍 Espalhando alegria em ${client.guilds.cache.size} servidores`,
      `😎 Eu sou open-source https://github.com/BotFoxy ＼(^o^)／`,                   
      `💻 Use f!commands para ver minha lista de comandos`,
      `😍 Tornando seu servidor extraordinário ᕕ(ᐛ)ᕗ`,
      `🐦 Me siga no Twitter @FoxyDiscordBot`,
      `💖 Use f!donate para me ajudar a ficar online!`

  ],

  i = 0;
  setInterval(() => client.user.setActivity(`${activities[i++ %
  activities.length]}`,{
    type: "WATCHING"  // Tipo de status
  }), 5000); //WATCHING, LISTENING, PLAYING, STREAMING
  console.log(`Sessão Iniciada. \nLogado com ${client.guilds.cache.size} guilds desde a inicialização.`) // Mostrado quando a sessão do bot foi iniciada sem erros
  })
fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err); // Faz a leitura dos diretórios
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
                // configurando o tipo de arquivo para o fs ler (no nosso caso os arquivos são .js)
    let props = require(`./commands/${file}`);

    let commandName = file.split(".")[0]; // Indica que o arquivo está funcionando
    console.log(` f!${commandName} está funcionando.`);
    
    client.commands.set(commandName, props);
  });
});
client.on("message", async message => {
    
  if (message.author.bot) return;     // Não retornar comandos em DM
  if (message.channel.dm === "dm") return;
  
let messageArray = message.content.split(" ");
let cmd = messageArray[0];
let args = messageArray.slice(1);

if (!message.content.startsWith(prefix)) return;
let commandfile = client.commands.get(cmd.slice(prefix.length));  // Faz a aplicação responder apenas com o prefixo
if (commandfile) commandfile.run(client, message, args);
});

client.login(token);
 // Conecta o bot no Discord usando o Token