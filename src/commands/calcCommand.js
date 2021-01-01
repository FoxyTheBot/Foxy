const math = require('mathjs');

const Discord = require('discord.js');

module.exports = {
    name: "calc",
    description: "Get the answer to a math problem",


    async run (client, message, args){

        if(!args[0]) return message.channel.send('Por favor digite algo!');

        let resp;

        try {
            resp = math.evaluate(args.join(" "))
        } catch (e) {
            return message.channel.send('Por favor digite um número válido!')
        }

        const embed = new Discord.MessageEmbed()
            .setColor(0x808080)
            .setTitle('Calculadora')
            .addField('Questão', `\`\`\`css\n${args.join(' ')}\`\`\``)
            .addField('Resposta', `\`\`\`css\n${resp}\`\`\``)

        message.channel.send(embed);

    }
}

module.exports.help = { 
    name: 'calc',
    aliases: ["calculadora", "calc"]
  }