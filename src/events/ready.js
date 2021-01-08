const DBL = require("dblapi.js")
const Sentry = require('@sentry/node')
const { prefix } = require('../json/config.json')
module.exports = async (client, config, user) => {

   
            const dbl = new DBL('YOUR-DBL-TOKEN', client)
            dbl.postStats(client.guilds.cache.size, client.shard.ids, client.shard.count)
            dbl.on("error", console.error)
        

        console.log(`[CONNECTION SUCCESSFULLY] - Guilds ${client.guilds.cache.size}`)
        let status = [
            { name: `❓ Se você precisa de ${prefix}help`, type: "WATCHING" },
            { name: `💻 Quer encontrar meus comandos use: ${prefix}commands`, type: "PLAYING" },
            { name: "🐦 Me siga no Twitter: @FoxyDiscordBot", type: "STREAMING", url: "https://www.twitch.tv/wing4merbr" },
            { name: `💖 Fui criada pelo WinG4merBR#5995`, type: "LISTENING" },
            { name: `😍 Me adicione usando: ${prefix}invite`, type: "WATCHING" },
            { name: `✨ Entre no meu servidor de suporte usando ${prefix}help`, type: "STREAMING", url: "https://www.twitch.tv/wing4merbr" },
            { name: `🐛 Se você encontrou um bug use: ${prefix}report para reportar para meus desenvolvedores`, type: "PLAYING" }
        ]

        setInterval(() => {
            let randomStatus = status[Math.floor(Math.random() * status.length)]
           client.user.setPresence({ activity: randomStatus })
        }, 5000)
        Sentry.init({ dsn: process.env.SENTRY_DSN })
    }

