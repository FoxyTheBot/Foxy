const Discord = require('discord.js')

exports.run = async (client, message, args) => {
    message.delete().catch(O_o => {});
    var list = [
        'https://i.pinimg.com/originals/32/d4/f0/32d4f0642ebb373e3eb072b2b91e6064.gif',
        'https://media1.tenor.com/images/503bb007a3c84b569153dcfaaf9df46a/tenor.gif?itemid=17382412',
        'https://media.tenor.com/images/6a4646c94c80270fe3a4da3d47e7b614/tenor.gif'
    ];

    var rand = list[Math.floor(Math.random() * list.length)];
    let user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) {
        return message.reply('Lembre-se de mencionar um usuário válido para beijar!')
}

const embed = new Discord.MessageEmbed()
.setColor('RED')
.setDescription(`${message.author} beijou o rosto de ${user}`)
.setImage(rand)
.setTimestamp()
.setFooter('Made With 💖 by WinG4merBR')
await message.channel.send(embed)
}