const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require("./json/config.json");
const Enmap = require('enmap')
const fs = require('fs');
const express = require('express');
const app = express();
const user = require('./schema/user');
app.get('/', function(req, res) {
  res.sendStatus(200);
});

client.commands = new Enmap();
const cmd = require('./json/resposta.json');
client.on("message", message => {
  if (message.author.bot) return false;

 
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'stats') {
        const promises = [
            client.shard.fetchClientValues('guilds.cache.size'),
            client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)'),
        ];

        return Promise.all(promises)
            .then(results => {
                const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
                const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
                return message.channel.send(`Server count: ${totalGuilds}\nMember count: ${totalMembers}`);
            })
            .catch(console.error);
    }
});
client.on('rateLimit', (info) => {
  console.log(`[RATELIMIT] Rate limit hit ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout: 'Unknown timeout '}`)
})
client.on('message', Message => {
  if ( Message.channel.type == "dm" ||  Message.guild.id != "768267522670723094" ) return;

  if ( Message.content.toLowerCase().startsWith("f!notificar") || Message.content.toLowerCase().startsWith("f!notify") ) {
      if ( !Message.member.roles.cache.has("768275121290870814") ) Message.member.roles.add("768275121290870814"), Message.channel.send("Agora você vai receber todas as minhas novidades <:meow_blush:768292358458179595>")
      else Message.member.roles.remove("768275121290870814"), Message.channel.send("Agora você não vai mais receber minhas novidades <:sad_cat_thumbs_up:768291053765525525>")
  }
})
client.on("guildCreate", async guild => {
  const webhookClient = new Discord.WebhookClient("WEBHOOK-ID", "WEBHOOK-TOKEN");
    const embed = new Discord.MessageEmbed()
        .setTitle('Logs de entrada e saída')
        .setDescription(`<:MeowPuffyMelt:776252845493977088> Fui adicionada no servidor: ${guild.name} / ${guild.id}`)
    webhookClient.send( {
        username: `Logs`,
        avatarURL: 'https://cdn.discordapp.com/attachments/766414535396425739/789255465125150732/sad.jpeg',
        embeds: [embed],
    });
  })
client.on("guildDelete", async guild => {
const webhookClient = new Discord.WebhookClient("WEBHOOK-ID", "WEBHOOK-TOKEN");
  const embed = new Discord.MessageEmbed()
      .setTitle('Logs de entrada e saída')
      .setDescription(`<:sad_cat_thumbs_up:768291053765525525> Fui removida do servidor: ${guild.name} / ${guild.id}`)
  webhookClient.send( {
      username: `Logs`,
      avatarURL: 'https://cdn.discordapp.com/attachments/766414535396425739/789255465125150732/sad.jpeg',
      embeds: [embed],
  });
})
client.on('message', msg => {
    if (msg.author.bot) {
        return;
    }
    responseObject = cmd;
    if(responseObject[msg.content]){
        msg.channel.send(responseObject[msg.content]);
    }
});

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
client.on("message", async message => {
  if (message.webhookID) return;
  if (message.author.bot) return;
  if (message.channel.dm === "dm") return;
    user.findOne({ userid: message.author.id }, function(erro, dados) { 
      if(dados) {
        if(dados.userid == message.author.id) return;
        if(erro) return console.log(erro);
        new user({
          userBanned: 'not'
        })
        dados.save().catch((err) => { 
          console.log(err)
        })
      } else { 
        new user({
          userid: message.author.id,
          username: message.author.username,
          userBanned: 'not'
        }).save().catch((err) => { 
          console.log(err)
        })
      }
    })

  user.findOne({ userid: message.author.id }, function(erro, dados) { 
    if(dados) { 
      if(erro) return console.log(erro);

    
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    
    if (!message.content.startsWith(prefix)) return;
    if(message.content.startsWith(prefix)) { 
      if(dados.userBanned == 'banned') { 
        let banned = new Discord.MessageEmbed()
        .setColor('RED')
        .setTitle('<:DiscordBan:790934280481931286> Você foi banido(a) <:DiscordBan:790934280481931286>')
        .setDescription('Você foi banido(a) de usar a Foxy em qualquer servidor no Discord! \n Caso seu ban foi injusto (o que eu acho muito difícil) você pode solicitar seu unban no meu [servidor de suporte](https://discord.gg/kFZzmpD) \n **Leia os termos em** [Termos de uso](https://foxywebsite.ml/tos.html)')
        .setFooter('Se você foi banido(a) do meu servidor de suporte ai já não é problema meu. ;-;')
        return message.author.send(banned).catch((err) => { 
          message.channel.send(banned)
        })
      }
    }
    let commandfile = client.commands.get(cmd.slice(prefix.length));
    if (commandfile) commandfile.run(client, message, args);
    }
  })

});
client.login(token);