const { MessageEmbed } = require('discord.js')
module.exports = {
    name: "bank",
    aliases: ['banco', 'banks', 'bank'],
    cooldown: 5,
    guildOnly: true,

    async execute(client, message) {
        const db = require('quick.db')
        let user = message.mentions.members.first() || message.author;
        let bal = await db.fetch(`bal_${user.id}`)
        let money = await db.fetch(`coins_${user.id}`)
        if(money === null) money = 0;
        if(bal === null) bal = 0;
            const embed = new MessageEmbed()
            .setColor("f0152d")
            .setTitle(`Saldo de ${user.username}`)
            .setThumbnail("https://cdn.discordapp.com/attachments/776930851753426945/810193222471122964/logo-bradesco-escudo-1024.png")
            .addFields(
                { name: "<:BradescoLogo:810176327993917520> **|** Saldo Bancário", value: `${bal} FoxCoins`},
                { name: "<:Santander:810177139252133938> **|** Conta Corrente", value: `${money} FoxCoins`}
            )
            .setFooter(`Para poder guardar envie para sua conta usando f!deposit <quantia>`)
            message.channel.send(embed)
        
      
        }
      }
 