const Discord = require('discord.js')

module.exports = {
name: "run",
aliases: ['correr', 'run'],
cooldown: 3,
guildOnly: false,
async execute(client, message, args) {
    
    var list = [
                'https://media1.tenor.com/images/db41d2a91102a4e24df9aa98fe7f97b6/tenor.gif?itemid=15082392',
                'https://media1.tenor.com/images/3b3911b649cc6bb52ccee6e90ab298a4/tenor.gif?itemid=13574320',
                'https://media1.tenor.com/images/09df4960aba7f70404c575433d7f452b/tenor.gif?itemid=14969380',
                'https://media.tenor.com/images/3f990cd09249463acab7332358f0aca7/tenor.gif',
                'https://media1.tenor.com/images/d68fc7f91d9d2cb23a68b7b44d2cdb5c/tenor.gif?itemid=18815468',
                'https://media1.tenor.com/images/f108acb2af325bea12b8102a81aa8cc2/tenor.gif?itemid=11506742'

    ];  
  
                var rand = list[Math.floor(Math.random() * list.length)];
    
    let avatar = message.author.displayAvatarURL({format: 'png'});
      const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('CORRE, CORRE, ZUUUUM ')
            .setDescription(`${message.author} está correndo!`)
            .setImage(rand)
            .setTimestamp()
            .setFooter('And i ran, i ran so far away | Made with 💖 by WinG4merBR')
            .setAuthor(message.author.tag, avatar);
      await message.channel.send(embed);
    }

      }