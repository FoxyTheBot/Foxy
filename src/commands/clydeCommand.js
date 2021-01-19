const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

module.exports = {
name: "clyde",
aliases: ['clyde', 'clydebot'],
cooldown: 3,
guildOnly: false,
async execute(client, message, args) {   
   const text = args.join(" ");
        
    if (!text) return message.reply(`${message.author} por favor digite um texto.`);

    const data = await fetch(
      `https://nekobot.xyz/api/imagegen?type=clyde&text=${text}`
    ).then((res) => res.json());

    const embed = new MessageEmbed()
      .setTitle("Clyde")
      .setImage(data.message)
      .setFooter(`Enviado por ${message.author.username}`)
      .setColor("BLUE")
      

    message.channel.send(embed);
  },
}
