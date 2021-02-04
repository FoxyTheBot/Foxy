const Discord = require('discord.js')
module.exports = {
    name: "profile",
    aliases: ['profile', 'perfil'],
    cooldown: 5,
    guildOnly: true,

    async execute(client, message, args) {
        const db = require("quick.db");
        let user =  message.mentions.users.first() || message.author;

  let money = await db.fetch(`coins_${user.id}`)
  if (money === null) money = 0;
    
  let aboutme = await db.fetch(`aboutme_${user.id}`)
  if(aboutme == null) aboutme = "Foxy é minha amiga, você pode alterar isso usando f!aboutme";

  let rep = await db.fetch(`rep_${user.id}`)
  if(rep == null) rep = 0;
  let avatar = user.avatarURL({ dynamic: true, format: "png"})
let married = await db.fetch(`marry_${user.id}`)

  let moneyEmbed = new Discord.MessageEmbed()
  .setColor('ff0000')
      .setDescription(`:star: **Sobre:** ${user}`)
  .setThumbnail(avatar)
  .addFields(
      {name: ":computer: ID", value: `${user.id}`},
      { name: ":coin: FoxCoins", value: `${money}`},
      {name: ":bookmark: Sobre mim:", value: `${aboutme}`},
      {name: ":heart: Reputações:", value: `**${rep}** Reputações`},
  )
  message.channel.send(moneyEmbed)
    }
}