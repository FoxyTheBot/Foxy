const Discord = require('discord.js')

module.exports = {
name: "bite",
aliases: ['bite', 'morder'],
cooldown: 3,
guildOnly: true,

async execute(client, message, args) {
    
    var list = [
        'https://media1.tenor.com/images/f3f503705c36781b7f63c6d60c95a9d2/tenor.gif?itemid=17570122',
        'https://media1.tenor.com/images/6b42070f19e228d7a4ed76d4b35672cd/tenor.gif?itemid=9051585',
        'https://media1.tenor.com/images/83271613ed73fd70f6c513995d7d6cfa/tenor.gif?itemid=4915753',
        'https://i.pinimg.com/originals/4e/18/f4/4e18f45784b6b74598c56db4c8d10b4f.gif'


    ];

var rand = list[Math.floor(Math.random() * list.length)];
let user = message.mentions.users.first() || client.users.cache.get(args[0]);
if (!user) {
    return message.reply('Lembre-se de mencionar um usuário válido para morder!');
}

const embed = new Discord.MessageEmbed()
    .setColor('RED')
    .setDescription(`${message.author} mordeu ${user}`)
    .setImage(rand)
    .setTimestamp()
    .setFooter("Made With 💖 by WinG4merBR")
    await message.channel.send(embed);
}

}