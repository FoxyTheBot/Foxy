const db = require('quick.db')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "mine",
    aliases: ['mine', 'minerar'],
    guildOnly: true,
    cooldown: 5,
    clientPerms: ['ATTACH_FILES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS', 'READ_MESSAGE_HISTORY'],

    async run(client, message, args) {
        const ms = require('parse-ms')
        const timeout = 3600000;
        const iron = Math.floor(Math.random() * 5);
        const diamond = Math.floor(Math.random() * 5);
        const emerald = Math.floor(Math.random() * 5);
        const coal = Math.floor(Math.random() * 5);

        const status1 = db.fetch(`coal_${message.author.id}`)
        const status2 = db.fetch(`iron_${message.author.id}`)
        const status3 = db.fetch(`diamond_${message.author.id}`)
        const status4 = db.fetch(`emerald_${message.author.id}`)

        if (message.content.includes("status")) {
            const status = new MessageEmbed()
                .setColor('GREEN')
                .setTitle("<:Minecraft:804858374780878868> | Status de Mineração")
                .addFields(
                    { name: "<:Carvao:816844940642484235> Carvões", value: status1 },
                    { name: "<:iron:816844359684718623> Ferros", value: status2 },
                    { name: "<:esmeralda:816844349706600450> Esmeraldas", value: status3 },
                    { name: "<:diamond:816844342743531541> Diamantes", value: status4 }
                )
            return message.foxyReply(status)
        }
        const mine = await db.fetch(`mine_${message.author.id}`);
        if (mine !== null && timeout - (Date.now() - mine) > 0) {
            const time = ms(timeout - (Date.now() - mine));

            message.foxyReply(`:x: **|** Você minerou e está cansado tente novamente em **${time.hours}h ${time.minutes}m ${time.seconds}s**`);
        } else {

            switch (args[0]) {

                case "madeira":
                    db.add(`coal_${message.author.id}`, coal)
                    message.foxyReply(`<:Minecraft:804858374780878868> **|** Você minerou e conseguiu ${coal} Carvões`)
                    db.set(`mine_${message.author.id}`, Date.now());
                    break

                case "pedra":
                    db.add(`coal_${message.author.id}`, coal)
                    db.add(`iron_${message.author.id}`, iron)
                    message.foxyReply(`<:Minecraft:804858374780878868> **|** Você minerou e conseguiu ${coal} Carvões, ${iron} Ferros`)
                    db.set(`mine_${message.author.id}`, Date.now());

                    break

                case "ferro":
                    db.add(`coal_${message.author.id}`, coal)
                    db.add(`iron_${message.author.id}`, iron)
                    db.add(`diamond_${message.author.id}`, diamond)
                    db.add(`emerald_${message.author.id}`, emerald)
                    message.foxyReply(`<:Minecraft:804858374780878868> **|** Você minerou e conseguiu ${coal} Carvões, ${iron} Ferros, ${emerald} Esmeraldas, ${diamond} Diamantes`)
                    db.set(`mine_${message.author.id}`, Date.now());

                    break

                default:
                    const mine = new MessageEmbed()
                        .setColor('GREEN')
                        .setTitle("<:Minecraft:804858374780878868> | Mineração")
                        .addFields(
                            { name: "<:wooden:816843984512221196> **|** `f!mine madeira`", value: "**Minérios:** <:Carvao:816844940642484235> Carvão" },
                            { name: "<:stone:816843972835278858> **|** `f!mine pedra`", value: "**Minérios:** <:Carvao:816844940642484235> Carvão, <:iron:816844359684718623> Ferro" },
                            { name: "<:Iron_Pickaxe_JE3_BE2:816843963213545474> **|** `f!mine ferro`", value: "**Minérios**: <:Carvao:816844940642484235> Carvão, <:iron:816844359684718623> Ferro, <:esmeralda:816844349706600450> Esmeralda, <:diamond:816844342743531541> Diamante" }
                        )
                    message.foxyReply(mine)

            }
        }
    }

}