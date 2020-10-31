const Discord = require('discord.js')

exports.run = async (client, message) => {
    const sayMessage = args.join(' ');
    var list = [
        'https://cdn.dicionariopopular.com/imagens/laranjo-meme-cke.jpg',
      'https://pm1.narvii.com/6420/80aa1cfec79408ec760a4e5b10fde33ef1d615d0_00.jpg'
    ];
    
    var rand = list[Math.floor(Math.random() * list.length)];
    let laranjo = new Discord.MessageEmbed()
    .setColor('ORANGE')
    .setTitle(sayMessage)
    .setImage(rand)
    await message.channel.send(laranjo)
}