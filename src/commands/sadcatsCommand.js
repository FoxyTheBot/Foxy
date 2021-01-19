const Discord = require('discord.js');
module.exports = {
name: "sadcats",
aliases: ['sadcat', 'sadcats'],
cooldown: 3,
guildOnly: false,
async execute(client, message, args) {
var list = [
 'https://cdn.discordapp.com/attachments/791449801735667713/791449875417530388/1.png',
 'https://cdn.discordapp.com/attachments/791449801735667713/791449876918829056/2.jpeg',
 'https://cdn.discordapp.com/attachments/791449801735667713/791449876827078686/3d938cdf28260ce4e51b7456f042a690.jpg',
 'https://cdn.discordapp.com/attachments/791449801735667713/791449877233401886/0f3def58645358627649a116992c0881.png',
 'https://cdn.discordapp.com/attachments/791449801735667713/791449882329350144/5ae3c7f1fb21a7f1201796e0471e74d1.png',
 'https://cdn.discordapp.com/attachments/791449801735667713/791449882879459348/46c6dbfb1544cc47e9ceb261078e6b80.jpg',
 'https://cdn.discordapp.com/attachments/791449801735667713/791449884783542272/172717144-288-k179008.jpeg',
 'https://cdn.discordapp.com/attachments/791449801735667713/791449885382541362/411b0a6bd163dabc015161915e57bcb8.jpeg',
 'https://cdn.discordapp.com/attachments/791449801735667713/791449887416778752/a3509a322887c2e75b5c6118fd759c97.jpeg',
 'https://cdn.discordapp.com/attachments/791449801735667713/791449890580463636/ah1l5-jb6.jpg',
 'https://cdn.discordapp.com/attachments/791449801735667713/791449919999311872/bain_do_gato.jpg',
 'https://cdn.discordapp.com/attachments/791449801735667713/791449919436226580/b188d119b26c88d9a255026f3d81508a.png',
 'https://cdn.discordapp.com/attachments/791449801735667713/791449920837386260/c606c6fb97130f565f5df383a81585fc.jpeg',
 'https://cdn.discordapp.com/attachments/791449801735667713/791449921886617710/b7694e0fd1f339b6c961e82704ab3aff.png',
 'https://cdn.discordapp.com/attachments/791449801735667713/791449929880043530/cataaaaah.jpg',
 'https://cdn.discordapp.com/attachments/791449801735667713/791449934855143434/EK4qwZwXsAAtphn.jpg',
 'https://cdn.discordapp.com/attachments/791449801735667713/791449934268334090/15frnp38dv251.png',
 'https://cdn.discordapp.com/attachments/791449801735667713/791449937194778624/ec2cb0fcc2e3b8f998bcaa4c5da16e97.png',
 'https://cdn.discordapp.com/attachments/791449801735667713/791449967356149770/f3e7a6a2646d2f1b9627605be3f2cc17.png',
 'https://cdn.discordapp.com/attachments/791449801735667713/791449970351144990/fat_cat.jpg',
 'https://cdn.discordapp.com/attachments/791449801735667713/791449975719854080/hqdefault.jpeg',
 'https://cdn.discordapp.com/attachments/791449801735667713/791449979155775528/katzen52_blogspot.jpg',
 'https://cdn.discordapp.com/attachments/791449801735667713/791450006448111716/qvcLghN.jpeg',
 'https://cdn.discordapp.com/attachments/791449801735667713/791450008678563910/owo.jpg',
 'https://cdn.discordapp.com/attachments/791449801735667713/791450013946740756/sad_coke.jpg',
 'https://cdn.discordapp.com/attachments/791449801735667713/791450020603625482/sad_party.jpg',
 'https://cdn.discordapp.com/attachments/791449801735667713/791450023941898250/sad_sings.jpg',
 'https://cdn.discordapp.com/attachments/791449801735667713/791450063196913664/sadcat3.jpg',
 'https://cdn.discordapp.com/attachments/791449801735667713/791450069873590282/SHwuwVRFUAAVTds-1600x900-noPad.jpg',
 'https://cdn.discordapp.com/attachments/791449801735667713/791450113649410078/tenor.gif'

];

var rand = list[Math.floor(Math.random() * list.length)];

let avatar = message.author.displayAvatarURL({format: 'png'});
  const embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setTitle('O Mais Triste dos Tristes')
        .setImage(rand)
        .setTimestamp()
  await message.channel.send(`${message.author}`, embed);
}

}