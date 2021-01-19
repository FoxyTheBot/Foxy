const Discord = require('discord.js')
module.exports = {
name: "eval",
aliases: ['eval', 'evaluate', 'e'],
guildOnly: false,
async execute(client, message, args) {

     if(message.author.id != "708493555768885338") return message.channel.send(`<:Error:718944903886930013> | ${message.author} Você não tem permissão para fazer isso! <:meow_thumbsup:768292477555572736>`)
  const clean = text => {
      if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
      else
          return text;
    }
  
    try {
      const util = require("util")
      const code = args.join(" ");
      let evaled = eval(code);
			evaled = util.inspect(evaled, { depth: 1 })
			evaled = evaled.replace(new RegExp(`Error`, "g"), undefined)

      if (evaled.length > 1800) evaled = `${evaled.slice(0, 1800)}...`
      const sucess = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('<:DiscordDeveloper:731945244983034033> Comando executado com sucesso!')
      .setDescription(`Entrada: \ \ \`\`\`js\n${code}\n\`\`\` \n Saída: \ \ \`\`\`xl\n${clean(evaled)}\n\`\`\``)
  
			message.channel.send(sucess)
		} catch (err) {
			const errorMessage = err.stack.length > 1800 ? `${err.stack.slice(0, 1800)}...` : err.stack
      const code = args.join(" ");
      const embed = new Discord.MessageEmbed()
			embed.setColor('RED')
			embed.setTitle(`<:BSOD:777579371870683147> Ocorreu um erro durante a execução!`)
			embed.setDescription(`Entrada: \ \ \`\`\`js\n${code}\n\`\`\` \n Saída: \`\`\`js\n${errorMessage}\`\`\``)

			message.channel.send(embed)
		}

}
}