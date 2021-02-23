module.exports = {
    name: "background",
    aliases: ['background'],
    cooldown: 5,
    guildOnly: false,

    async execute(client, message, args) {
        const db = require('quick.db')
        const ms = require("parse-ms");

        const { MessageEmbed } = require("discord.js")

        let user = message.author;
        let arg = args.join(" ")
        let timeout = 3600000;
        let background2 = await db.fetch(`background_${user.id}`)
        let money = await db.fetch(`coins_${user.id}`)


        switch(args[0]) {


            case "reset":
                if (background2 == null) return message.channel.send("Você não tem nenhum background para redefinir!")
                if (background2 == 'default_background.png') return message.channel.send("Você não tem nenhum background para redefinir!")


                let time = await db.fetch(`time_${user.id}`);
                if (time !== null && timeout - (Date.now() - time) > 0) {
                    let times = ms(timeout - (Date.now() - time));
                    message.channel.send(`Você não pode redefinir seu background! Tente novamente em **${times.hours}h ${times.minutes}m ${times.seconds}s**`)

                } else {
                    db.add(`coins_${user.id}`, 9000)
                    message.channel.send("Desculpe pela incoveniência, eu redefini seu background para o padrão! Você recebeu 9000 FoxCoins de compensação")
                    db.set(`background_${user.id}`, "default_background.png")
                    db.set(`time_${user.id}`, Date.now())


                }

                break

            case "buy windows xp":
                    if (money < 1000) return message.channel.send("Você não tem coins o suficiente para este background")

                    message.channel.send("Você comprou o background **Windows XP** Ele já foi setado no seu perfil!")
                    db.subtract(`coins_${user.id}`, 3000)
                    return db.set(`background_${user.id}`, 'windows_xp.png')
                break


            case "buy red dead":
                    if (money < 5000) return message.channel.send("Você não tem coins o suficiente para este background")
                    message.channel.send("Você comprou o background **Read Dead Redemption** Ele já foi setado no seu perfil!")
                    db.subtract(`coins_${user.id}`, 5000)
                    return db.set(`background_${user.id}`, "red_dead.png")

                break

            case "buy gta":
                    if (money < 9000) return message.channel.send("Você não tem coins o suficiente para este background")
                    message.channel.send("Você comprou o background **Grand Theft Auto: San Andreas** Ele já foi setado no seu perfil!")
                    db.subtract(`coins_${user.id}`, 9000)
                    return db.set(`background_${user.id}`, "gta_san.png")

                break

            case "buy fnaf":
                    if (money < 9000) return message.channel.send("Você não tem coins o suficiente para este background")
                    message.channel.send("Você comprou o background **Five Nights at Freddy's** Ele já foi setado no seu perfil!")
                    db.subtract(`coins_${user.id}`, 9000)
                    return db.set(`background_${user.id}`, "fnaf_background.png")

                break

            case "buy foxy":
                    if (money < 5000) return message.channel.send("Você não tem coins o suficiente para este background")
                    message.channel.send("Você comprou o background **Foxy Vlogger** Ele já foi setado no seu perfil!")
                    db.subtract(`coins_${user.id}`, 5000)
                    return db.set(`background_${user.id}`, "foxy_vlogs.png")

                break

            case "buy lori":

                    if (money < 10000) return message.channel.send("Você não tem coins o suficiente para este background")
                    message.channel.send("Você comprou o background **Loritta e Foxy** Ele já foi setado no seu perfil!")
                    db.subtract(`coins_${user.id}`, 10000)
                    return db.set(`background_${user.id}`, "foxy_e_lori.png")
            break

            default:
                let noargs = new MessageEmbed()

                    .setColor('RED')
                    .setTitle('Lojinha de Background :D')
                    .setDescription('(Raro) **Foxy Vlogger** - 5000 FoxCoins - **Código:** foxy \n (Raro) **FNaF** - 9000 FoxCoins - **Código:** fnaf \n(Raro) **Red Dead** - 7000 FoxCoins - **Código:** red dead \n(Lendário) **GTA San Andreas** - 9000 FoxCoins - **Código:** gta \n(Lendário) **Windows XP** - 5000 FoxCoins - **Código:** windows xp \n(Lendário) **Foxy e Lori** - 10000 - **Código:** lori \n\n Use f!background reset para redefinir')
                    .setFooter("Exemplo: f!background buy gta | Os nomes dos backgrounds são usados em letra minúscula!")
                message.channel.send(noargs)
        }
    }
}