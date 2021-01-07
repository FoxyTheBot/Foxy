const Discord = require('discord.js')
exports.run = (client, message, args) => {

     if(message.author.id != "708493555768885338") return message.channel.send(`<:Error:718944903886930013> | ${message.author} Você não tem permissão para fazer isso! <:meow_thumbsup:768292477555572736>`)
  const clean = text => {
      if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
      else
          return text;
    }
  
  try {
      const code = args.join(" ");
      let evaled = eval(code);
 
      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);
    const resultado = new Discord.MessageEmbed()
    .setColor('RED')
    .setTitle('<:DiscordDeveloper:731945244983034033> Comando executado com sucesso!')
    .setDescription(`\ \ \`\`\`xl\n${clean(evaled)}\n\`\`\``)

      message.channel.send(resultado);
    } catch (err) {
      const erro = new Discord.MessageEmbed()
      .setColor('BLUE')
      .setTitle('<:BSOD:777579371870683147> Ocorreu um erro durante a execução!')
      .setDescription(`\ \ \`\`\`xl\n${clean(err)}\n\`\`\``)
      message.channel.send(erro);
  }
}; 