const math = require('mathjs');

const Discord = require('discord.js');

module.exports = {
    name: "calc",
    aliases: ['calc', 'calcular', 'calculadora'],
    cooldown: 1,
    guildOnly: false,
 async execute(client, message, args) {

        if(!args[0]) return message.channel.send('Por favor digite algo!');

        let resp;

        try {
            resp = math.evaluate(args.join(" "))
        } catch (e) {
            return message.channel.send('Por favor digite um número válido!')
        }
        let error = new Discord.MessageEmbed()
        .setColor('0079d8')
        .setTitle(':(')
        .setDescription('\n\n Your PC ran a problem and need to restart. We\'re just collecting some error info, and then we\'ll restart for you.')
        .setImage('https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Bsodwindows10.png/1200px-Bsodwindows10.png ')
        if(args == 'NaN') return message.channel.send(error)
        const embed = new Discord.MessageEmbed()
            .setColor(0x808080)
            .setTitle('Calculadora')
            .addField('Questão', `\`\`\`css\n${args.join(' ')}\`\`\``)
            .addField('Resposta', `\`\`\`css\n${resp}\`\`\``)

        message.channel.send(embed);

    }
}