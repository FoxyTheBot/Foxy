const colors = require('../structures/color')
const { MessageEmbed } = require('discord.js')
const ms = require('parse-ms')
const db = require('quick.db')

module.exports = {
    name: "rob",
    aliases: ['rob', 'roubar'],
    guildOnly: true,
    cooldown: 5,

    async execute(client, message, args) {
        let random = Math.floor((Math.random() * 1000));
        let user = message.mentions.members.first()
        if(!user)  {
        return message.channel.send("Mencione alguém para poder roubar")
        } else {
        let targetuser = await db.fetch(`coins_${user.id}`)
        let author = await db.fetch(`rob_${message.author.id}`)
        let author2 = await db.fetch(`coins_${message.author.id}`)

        if(user == message.author.id) return message.channel.send("Você não pode se roubar!")
        let timeout = 600000;
        if (author !== null && timeout - (Date.now() - author) > 0) {
            let time = ms(timeout - (Date.now() - author));

            let timeEmbed = new MessageEmbed()
                .setColor(colors.default)
                .setDescription(`Aguarde **${time.minutes}m ${time.seconds}s** para usar o comando`);
            await message.channel.send(timeEmbed)
        } else {

            let moneyEmbed = new MessageEmbed()
                .setColor(colors.default)
                .setDescription(`Você precisa de pelo menos 200 coins em sua carteira para roubar alguém`);

            if (author2 < 200) {
                return message.channel.send(moneyEmbed)

            }
            let moneyEmbed2 = new MessageEmbed()
                .setColor(colors.default)
                .setDescription(`${user.user.username} não tem nada que você possa roubar`);
            if (targetuser <= random) 
                return message.channel.send(moneyEmbed2)
        



            let embed = new MessageEmbed()
                .setDescription(`Você roubou ${user} e ganhou ${random} coins`)
                .setColor(colors.default)
            await message.channel.send(embed)

            db.subtract(`coins_${user.id}`, random)
            db.add(`coins_${message.author.id}`, random)
            db.set(`rob_${message.author.id}`, Date.now())

        }
        }
    }
}