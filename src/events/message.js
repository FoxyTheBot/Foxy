module.exports = async(client, message) => {
    const user = require('../schema/user')
    const{ prefix } = require('../json/config.json')
    if ( message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>` ) message.channel.send(`Olá ${message.author} eu sou a Foxy! Meu prefixo é ${prefix}, use f!help para obter ajuda.`)
    const cmd = require('../json/resposta.json');
    if (message.author.bot) {
        return;
    }
    responseObject = cmd;
    if(responseObject[message.content]){
        message.channel.send(responseObject[message.content]);
    }
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

}